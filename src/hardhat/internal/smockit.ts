import { Contract, ContractFactory, ContractInterface } from 'ethers'
import { Provider } from '@ethersproject/providers'
import * as uuid from 'uuid'
import { ethers } from 'hardhat'

import { engine } from './hook'
import { SmockContract, Smockit } from '../../types/smock.types'
import { fromHexString, makeRandomAddress, toHexString } from '../../utils'

export type TSmockSpec = Contract | ContractFactory | ContractInterface

export interface TSmockOptions {
  address?: string
  provider?: Provider
}

export interface TSmockHost extends Contract, SmockContract {

}

export const smockit: Smockit<TSmockSpec, TSmockOptions, TSmockHost> = async (
  spec: TSmockSpec,
  options: TSmockOptions = {},
): Promise<TSmockHost> => {
  if (typeof spec === 'string') {
    spec = await ethers.getContractFactory(spec)
  }

  const iface: ContractInterface = (spec as any).interface || spec
  const contract = new Contract(
    options.address || makeRandomAddress(),
    iface,
    options.provider || (spec as any).provider || ethers.provider
  ) as TSmockHost

  contract.smocked = {
    id: uuid.v4(),
    address: contract.address,
    fallback: {} as any,
    functions: {},
  }

  for (const functionName of Object.keys(contract.functions)) {
    contract.smocked.functions[functionName] = {
      reset: () => {

      },
      will: {
        get return() {
          const fn: any = () => {
            this.resolve = 'return'
            this.returnValue = undefined
          }

          fn.with = (returnValue?: any): void => {
            this.resolve = 'return'
            this.returnValue = returnValue
          }

          return fn
        },
        get revert() {
          const fn: any = () => {
            this.resolve = 'revert'
            this.returnValue = undefined
          }

          fn.with = (revertValue?: any): void => {
            this.resolve = 'revert'
            this.returnValue = revertValue
          }

          return fn
        },
      },
    }
  }

  (contract as any)._smockit = function (
    data: Buffer
  ): {
    resolve: 'return' | 'revert'
    returnValue: Buffer
  } {
    const calldata = toHexString(data)
    const sighash = toHexString(data.slice(0, 4))

    const fn = this.interface.getFunction(sighash)
    const params = this.interface.decodeFunctionData(fn, calldata)

    const mockFn = this.smocked[fn.name]
    const rawReturnValue =
      mockFn.will.returnValue instanceof Function
        ? mockFn.will.returnValue(...params)
        : mockFn.will.returnValue

    let encodedReturnValue: string = '0x'
    if (rawReturnValue !== undefined) {
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

    return {
      resolve: mockFn.will.resolve,
      returnValue: fromHexString(encodedReturnValue),
    }
  }

  engine.attachSmockContract(contract)

  return contract
}
