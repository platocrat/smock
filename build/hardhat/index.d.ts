import { Smock } from '../types/smock.types';
import { TSmockSpec, TSmockOptions, TSmockHost } from './internal/smockit';
import { TSmagicSpec, TSmagicOptions, TSmagicHost } from './internal/smagicit';
declare const smock: Smock<TSmockSpec, TSmockOptions, TSmockHost, TSmagicSpec, TSmagicOptions, TSmagicHost>;
export { smock };
