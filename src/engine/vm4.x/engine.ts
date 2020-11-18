import BN = require('bn.js')
import { MagicSmockContract, SmockContract } from '../../types/smock.types'

export class VM4xEngine {
  private evm: any
  private ogExecuteCall: any
  private smocks: {
    [id: string]: SmockContract | MagicSmockContract
  } = {}

  public attachEVM(
    evm: any
  ): void {
    if (this.evm) {
      return
    }

    this.evm = evm
    this.ogExecuteCall = this.evm._executeCall.bind(this.evm)
    this.evm._executeCall = this._hookExecuteCall.bind(this)
  }

  public detatchEVM(): void {
    this.evm._executeCall = this.ogExecuteCall
    this.evm = undefined
  }

  public attachSmockContract(
    mock: SmockContract,
  ): void {
    this.smocks[mock.smocked.id] = mock
  }

  public detatchSmockContract(
    mock: SmockContract | string,
  ): void {
    if (typeof mock === 'string') {
      delete this.smocks[mock]
    } else {
      delete this.smocks[mock.smocked.id]
    }
  }

  public attachMagicSmockContract(
    mock: MagicSmockContract,
    id: string,
  ): void {

  }

  public detatchMagicSmockContract(
    mock: MagicSmockContract | string,
  ): void {

  }

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
    message: any
  ): Promise<any> {
    const address = '0x' + message.to.toString('hex')
    const smock = this._getSmockByAddress(address)
    if (smock) {
      const { resolve, returnValue } = (smock as any)._smockit(message.data)
      return {
        gasUsed: new BN(0),
        execResult: {
          gasUsed: new BN(0),
          returnValue: returnValue,
          exceptionError: undefined,
        }
      }
    } else {
      return this.ogExecuteCall(message)
    }
  }
}
