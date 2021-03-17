/* Imports: External */
import { ethers, Contract, ContractInterface } from 'ethers'
import { fromHexString, toHexString } from '@eth-optimism/core-utils'

/* Imports: Internal */
import { engine } from './hook'
import { MockFunction } from './types'
import { makeRandomAddress } from './utils'
import { MockContract, Smockit } from './types'

const fnsmockify = (smockedFunction: any): void => {
  smockedFunction.callArgsList = []

  smockedFunction.reset = () => {
    ;(smockedFunction as any).resolve = 'return'
    ;(smockedFunction as any).returnValue = undefined
    ;(smockedFunction as any).gasUsed = 0
  }

  smockedFunction.will = {
    use: {
      gas: (amount: number) => {
        ;(smockedFunction as any).gasUsed = amount
      },
    },
    get return() {
      const fn: any = () => {
        ;(smockedFunction as any).resolve = 'return'
        ;(smockedFunction as any).returnValue = undefined
      }

      fn.with = (returnValue?: any): void => {
        ;(smockedFunction as any).resolve = 'return'
        ;(smockedFunction as any).returnValue = returnValue
      }

      return fn
    },
    get revert() {
      const fn: any = () => {
        ;(smockedFunction as any).resolve = 'revert'
        ;(smockedFunction as any).returnValue = undefined
      }

      fn.with = (returnValue?: any): void => {
        ;(smockedFunction as any).resolve = 'revert'
        ;(smockedFunction as any).returnValue = returnValue
      }

      return fn
    },
  }

  smockedFunction.reset()
}

export const smockify = (contract: MockContract): void => {
  contract.smocked = {
    fallback: {} as any,
  }

  fnsmockify(contract.smocked.fallback)

  for (const functionName of Object.keys(contract.functions)) {
    contract.smocked[functionName] = {} as MockFunction
    const smockedFunction = contract.smocked[functionName]
    fnsmockify(smockedFunction)
  }

  ;(contract as any)._smockit = async function (
    data: Buffer
  ): Promise<{
    resolve: 'return' | 'revert'
    functionName: string
    rawReturnValue: any
    returnValue: Buffer
    gasUsed: number
  }> {
    let fn: any
    try {
      const sighash = toHexString(data.slice(0, 4))
      fn = this.interface.getFunction(sighash)
    } catch (err) {
      fn = null
    }

    let params: any
    let mockFn: any
    if (fn !== null) {
      params = this.interface.decodeFunctionData(fn, toHexString(data))
      mockFn = this.smocked[fn.name]
    } else {
      params = toHexString(data)
      mockFn = this.smocked.fallback
    }

    const rawReturnValue =
      mockFn.returnValue instanceof Function
        ? await mockFn.returnValue(...params)
        : mockFn.returnValue

    let encodedReturnValue: string = '0x'
    if (rawReturnValue !== undefined) {
      if (mockFn.resolve === 'revert') {
        if (typeof rawReturnValue !== 'string') {
          throw new Error(
            `Smock: Tried to revert with a non-string (or non-bytes) type: ${typeof rawReturnValue}`
          )
        }

        if (rawReturnValue.startsWith('0x')) {
          encodedReturnValue = rawReturnValue
        } else {
          const errorface = new ethers.utils.Interface([
            {
              inputs: [
                {
                  name: '_reason',
                  type: 'string',
                },
              ],
              name: 'Error',
              outputs: [],
              stateMutability: 'nonpayable',
              type: 'function',
            },
          ])

          encodedReturnValue = errorface.encodeFunctionData('Error', [
            rawReturnValue,
          ])
        }
      } else {
        if (fn === null) {
          encodedReturnValue = rawReturnValue
        } else {
          try {
            encodedReturnValue = this.interface.encodeFunctionResult(fn, [
              rawReturnValue,
            ])
          } catch (err) {
            if (err.code === 'INVALID_ARGUMENT') {
              try {
                encodedReturnValue = this.interface.encodeFunctionResult(
                  fn,
                  rawReturnValue
                )
              } catch {
                if (typeof rawReturnValue !== 'string') {
                  throw new Error(
                    `Could not properly encode mock return value for ${fn.name}`
                  )
                }

                encodedReturnValue = rawReturnValue
              }
            } else {
              throw err
            }
          }
        }
      }
    } else {
      if (fn === null) {
        encodedReturnValue = '0x'
      } else {
        encodedReturnValue = '0x' + '00'.repeat(2048)
      }
    }

    return {
      resolve: mockFn.resolve,
      functionName: fn ? fn.name : null,
      rawReturnValue,
      returnValue: fromHexString(encodedReturnValue),
      gasUsed: mockFn.gasUsed,
    }
  }
}

export const smockit: Smockit = async (spec, options = {}) => {
  const hre = require('hardhat')

  if (typeof spec === 'string') {
    try {
      spec = await (hre as any).ethers.getContractFactory(spec)
    } catch (err) {
      if (!err.toString().includes('HH903')) {
        throw err
      }

      try {
        spec = new ethers.utils.Interface(JSON.parse(spec as string))
      } catch (err) {
        throw err
      }
    }
  } else {
    try {
      spec = new ethers.utils.Interface((spec as any).abi)
    } catch (err) {}
  }

  const iface: ContractInterface = (spec as any).interface || spec
  const contract = new Contract(
    options.address || makeRandomAddress(),
    iface,
    options.provider || (spec as any).provider || (hre as any).ethers.provider
  ) as MockContract

  smockify(contract)

  engine.attachSmockContract(contract)

  return contract
}
