/* Imports: External */
import BN from 'bn.js'
import { toHexString } from '@eth-optimism/core-utils'

/* Imports: Internal */
import { ModifiableContract, MockContract } from './types'

export class VM4xEngine {
  private evm: any
  private smocks: {
    [id: string]: MockContract | ModifiableContract
  } = {}

  public attachEVM(evm: any): void {
    if (this.evm) {
      return
    }

    this.evm = evm
    const hook = this._hookExecuteCall.bind(this)
    const ogvm = evm.default
    evm.default = (function () {
      return function (...args: any) {
        console.log('???')
        const subvm = new ogvm(...args)
        const ogExecuteCall = subvm._executeCall.bind(subvm)
        subvm._executeCall = async (message: any): Promise<any> => {
          return hook(ogExecuteCall, message)
        }

        return subvm
      }
    })()
  }

  public detatchEVM(): void {
    this.evm = undefined
  }

  public attachSmockContract(mock: MockContract | ModifiableContract): void {
    this.smocks[mock.smocked.id] = mock
  }

  public detatchSmockContract(
    mock: MockContract | ModifiableContract | string
  ): void {
    if (typeof mock === 'string') {
      delete this.smocks[mock]
    } else {
      delete this.smocks[mock.smocked.id]
    }
  }

  public attachMagicSmockContract(mock: ModifiableContract, id: string): void {}

  public detatchMagicSmockContract(mock: ModifiableContract | string): void {}

  private _getSmockByAddress(
    address: string
  ): MockContract | ModifiableContract | undefined {
    for (const smock of Object.values(this.smocks)) {
      if (smock.address.toLowerCase() === address.toLowerCase()) {
        return smock
      }
    }
  }

  private async _hookExecuteCall(
    ogExecuteCall: any,
    message: any
  ): Promise<any> {
    try {
      const address = toHexString(message.to)
      const smock = this._getSmockByAddress(address)

      if (smock) {
        const {
          resolve,
          functionName,
          rawReturnValue,
          returnValue,
          gasUsed,
        } = await (smock as any)._smockit(message.data)

        smock.smocked[functionName].callArgsList.push(rawReturnValue)

        return {
          gasUsed: new BN(gasUsed),
          execResult: {
            gasUsed: new BN(gasUsed),
            returnValue: returnValue,
            exceptionError:
              resolve === 'revert' ? new VmError(`revert`) : undefined,
          },
        }
      }
    } catch (err) {
      throw new Error(
        `Smock: Something went wrong while trying to mock a return value. Here's the error:\n${err}`
      )
    }

    return ogExecuteCall(message)
  }
}

class VmError {
  public error: any
  public errorType: any

  constructor(error: any) {
    this.error = error
    this.errorType = 'VmError'
  }
}
