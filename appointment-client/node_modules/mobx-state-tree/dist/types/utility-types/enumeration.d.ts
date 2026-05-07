import { ISimpleType } from "../../internal";
/** @hidden */
export type UnionStringArray<T extends readonly string[]> = T[number];
export declare function enumeration<T extends string>(options: readonly T[]): ISimpleType<UnionStringArray<T[]>>;
export declare function enumeration<T extends string>(name: string, options: readonly T[]): ISimpleType<UnionStringArray<T[]>>;
