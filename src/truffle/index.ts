import { Smock } from '../types/smock.types'
import {
  smockit,
  TSmockSpec,
  TSmockOptions,
  TSmockHost,
} from './internal/smockit'
import {
  smagicit,
  TSmagicSpec,
  TSmagicOptions,
  TSmagicHost,
} from './internal/smagicit'

const smock = (smockit as any) as Smock<
  TSmockSpec,
  TSmockOptions,
  TSmockHost,
  TSmagicSpec,
  TSmagicOptions,
  TSmagicHost
>
smock.magic = smagicit

export {
  smock
}
