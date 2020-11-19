import { Contract } from 'ethers'

import { engine } from './hook'
import { MagicSmockContract, Smagicit } from '../../types/smock.types'

export type TSmagicSpec = string | Object

export interface TSmagicOptions {
  address?: string
}

export interface TSmagicHost extends Contract, MagicSmockContract {}

export const smagicit: Smagicit<
  TSmagicSpec,
  TSmagicOptions,
  TSmagicHost
> = async (
  spec: TSmagicSpec,
  options: TSmagicOptions = {}
): Promise<TSmagicHost> => {
  return {} as any
}
