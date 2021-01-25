import BN = require('bn.js')
import { MagicSmockContract, SmockContract } from '../../types/smock.types'

export class VM4xEngine {
  private evm: any
  private smocks: {
    [id: string]: SmockContract | MagicSmockContract
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

  public attachSmockContract(mock: SmockContract): void {
    this.smocks[mock.smocked.id] = mock
  }

  public detatchSmockContract(mock: SmockContract | string): void {
    if (typeof mock === 'string') {
      delete this.smocks[mock]
    } else {
      delete this.smocks[mock.smocked.id]
    }
  }

  public attachMagicSmockContract(mock: MagicSmockContract, id: string): void {}

  public detatchMagicSmockContract(mock: MagicSmockContract | string): void {}

  private _getSmockByAddress(
    address: string
  ): SmockContract | MagicSmockContract | undefined {
    for (const smock of Object.values(this.smocks)) {
      if (smock.smocked.address.toLowerCase() === address.toLowerCase()) {
        return smock
      }
    }
  }

  private async _hookExecuteCall(
    ogExecuteCall: any,
    message: any
  ): Promise<any> {
    try {
      const address = '0x' + message.to.toString('hex')
      const smock = this._getSmockByAddress(address)

      if (smock) {
        const { resolve, returnValue } = await (smock as any)._smockit(
          message.data
        )

        return {
          gasUsed: new BN(0),
          execResult: {
            gasUsed: new BN(0),
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
