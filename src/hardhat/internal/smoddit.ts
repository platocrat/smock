/* Imports: External */
import hre from 'hardhat'
import { Provider } from '@ethersproject/providers'
import { ethers, Contract, ContractInterface } from 'ethers'

/* Imports: Internal */
import { engine } from './hook'
import { ModifiableContract, Smoddit } from '../../types/smock.types'
import { smockify } from './smockit'
import { makeRandomAddress } from '../../utils'

export type TSmodSpec = string | Object

export interface TSmodOptions {
  address?: string
  provider?: Provider
}

export interface TSmodHost extends Contract, ModifiableContract {}

export const smoddify = (contract: TSmodHost): void => {
  smockify(contract)
  ;(contract.smocked as any).internal = {
    functions: {},
    variables: {},
  }
}

export const smoddit: Smoddit<
  TSmodSpec,
  TSmodOptions,
  TSmodHost
> = async (
  spec,
  options = {}
) => {
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
  ) as TSmodHost

  smoddify(contract)

  engine.attachSmockContract(contract)

  return contract
}
