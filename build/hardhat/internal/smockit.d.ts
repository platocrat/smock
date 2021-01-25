import { Contract, ContractFactory, ContractInterface } from 'ethers';
import { Provider } from '@ethersproject/providers';
import { SmockContract, Smockit } from '../../types/smock.types';
export declare type TSmockSpec = Contract | ContractFactory | ContractInterface;
export interface TSmockOptions {
    address?: string;
    provider?: Provider;
}
export interface TSmockHost extends Contract, SmockContract {
}
export declare const smockify: (contract: TSmockHost) => void;
export declare const smockit: Smockit<TSmockSpec, TSmockOptions, TSmockHost>;
