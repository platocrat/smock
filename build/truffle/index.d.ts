import { Smock } from '../types/smock.types';
import { TSmockOptions, TSmockHost } from './internal/smockit';
import { TSmagicOptions, TSmagicHost } from './internal/smagicit';
declare const smock: Smock<any, TSmockOptions, TSmockHost, import("../hardhat/internal/smagicit").TSmagicSpec, TSmagicOptions, TSmagicHost>;
export { smock };
