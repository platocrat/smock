import hre from 'hardhat'
import { Provider } from '@ethersproject/providers'
import { ethers, Contract, ContractInterface } from 'ethers'

import { engine } from './hook'
import { MagicSmockContract, Smagicit } from '../../types/smock.types'
import { smockify } from './smockit'
import { makeRandomAddress } from '../../utils'

export type TSmagicSpec = string | Object

export interface TSmagicOptions {
  address?: string
  provider?: Provider
}

export interface TSmagicHost extends Contract, MagicSmockContract {}

export const smagicify = (contract: TSmagicHost): void => {
  smockify(contract)
  ;(contract.smocked as any).internal = {
    functions: {},
    variables: {},
  }
}

export const smagicit: Smagicit<
  TSmagicSpec,
  TSmagicOptions,
  TSmagicHost
> = async (
  spec: TSmagicSpec,
  options: TSmagicOptions = {}
): Promise<TSmagicHost> => {
  throw new Error(`Smagic isn't available yet. Sorry!`)

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
  ) as TSmagicHost

  smagicify(contract)

  engine.attachSmockContract(contract)

  return contract
}
