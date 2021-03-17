/* Imports: External */
import hre from 'hardhat'
import { ethers, Contract, ContractInterface } from 'ethers'

/* Imports: Internal */
import { engine } from './hook'
import { ModifiableContract } from './types'
import { smockify } from './smockit'
import { makeRandomAddress } from './utils'
import { Smoddit } from './types'

export const smoddify = (contract: ModifiableContract): void => {
  contract.smodded = {
    functions: {
      fallback: {} as any,
    },
    variables: {},
  }
}

export const smoddit: Smoddit = async (spec, options = {}) => {
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
  ) as ModifiableContract

  smoddify(contract)

  engine.attachSmockContract(contract)

  return contract
}
