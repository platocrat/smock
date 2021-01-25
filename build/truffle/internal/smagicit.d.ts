import { Provider } from '@ethersproject/providers';
import { Contract } from 'ethers';
import { MagicSmockContract, Smagicit } from '../../types/smock.types';
export declare type TSmagicSpec = string | Object;
export interface TSmagicOptions {
    address?: string;
    provider?: Provider;
}
export interface TSmagicHost extends Contract, MagicSmockContract {
}
export declare const smagicify: (contract: TSmagicHost) => void;
export declare const smagicit: Smagicit<TSmagicSpec, TSmagicOptions, TSmagicHost>;
