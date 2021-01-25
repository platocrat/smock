/// <reference types="node" />
import { BigNumber } from 'ethers';
export declare const add0x: (str: string) => string;
export declare const remove0x: (str: string) => string;
export declare const toHexString: (buf: Buffer) => string;
export declare const fromHexString: (str: string) => Buffer;
export declare const toHexString32: (value: string | number | BigNumber | boolean) => string;
