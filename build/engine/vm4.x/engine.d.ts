import { MagicSmockContract, SmockContract } from '../../types/smock.types';
export declare class VM4xEngine {
    private evm;
    private smocks;
    attachEVM(evm: any): void;
    detatchEVM(): void;
    attachSmockContract(mock: SmockContract): void;
    detatchSmockContract(mock: SmockContract | string): void;
    attachMagicSmockContract(mock: MagicSmockContract, id: string): void;
    detatchMagicSmockContract(mock: MagicSmockContract | string): void;
    private _getSmockByAddress;
    private _hookExecuteCall;
}
