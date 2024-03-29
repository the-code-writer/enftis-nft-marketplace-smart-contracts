/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../../common";

export interface IAccessControlDefaultAdminRulesInterface
  extends utils.Interface {
  functions: {
    "acceptDefaultAdminTransfer()": FunctionFragment;
    "beginDefaultAdminTransfer(address)": FunctionFragment;
    "cancelDefaultAdminTransfer()": FunctionFragment;
    "changeDefaultAdminDelay(uint48)": FunctionFragment;
    "defaultAdmin()": FunctionFragment;
    "defaultAdminDelay()": FunctionFragment;
    "defaultAdminDelayIncreaseWait()": FunctionFragment;
    "getRoleAdmin(bytes32)": FunctionFragment;
    "grantRole(bytes32,address)": FunctionFragment;
    "hasRole(bytes32,address)": FunctionFragment;
    "pendingDefaultAdmin()": FunctionFragment;
    "pendingDefaultAdminDelay()": FunctionFragment;
    "renounceRole(bytes32,address)": FunctionFragment;
    "revokeRole(bytes32,address)": FunctionFragment;
    "rollbackDefaultAdminDelay()": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "acceptDefaultAdminTransfer"
      | "beginDefaultAdminTransfer"
      | "cancelDefaultAdminTransfer"
      | "changeDefaultAdminDelay"
      | "defaultAdmin"
      | "defaultAdminDelay"
      | "defaultAdminDelayIncreaseWait"
      | "getRoleAdmin"
      | "grantRole"
      | "hasRole"
      | "pendingDefaultAdmin"
      | "pendingDefaultAdminDelay"
      | "renounceRole"
      | "revokeRole"
      | "rollbackDefaultAdminDelay"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "acceptDefaultAdminTransfer",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "beginDefaultAdminTransfer",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "cancelDefaultAdminTransfer",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "changeDefaultAdminDelay",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "defaultAdmin",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "defaultAdminDelay",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "defaultAdminDelayIncreaseWait",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getRoleAdmin",
    values: [PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(
    functionFragment: "grantRole",
    values: [PromiseOrValue<BytesLike>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "hasRole",
    values: [PromiseOrValue<BytesLike>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "pendingDefaultAdmin",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "pendingDefaultAdminDelay",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "renounceRole",
    values: [PromiseOrValue<BytesLike>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "revokeRole",
    values: [PromiseOrValue<BytesLike>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "rollbackDefaultAdminDelay",
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: "acceptDefaultAdminTransfer",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "beginDefaultAdminTransfer",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "cancelDefaultAdminTransfer",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "changeDefaultAdminDelay",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "defaultAdmin",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "defaultAdminDelay",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "defaultAdminDelayIncreaseWait",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getRoleAdmin",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "grantRole", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "hasRole", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "pendingDefaultAdmin",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "pendingDefaultAdminDelay",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceRole",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "revokeRole", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "rollbackDefaultAdminDelay",
    data: BytesLike
  ): Result;

  events: {
    "DefaultAdminDelayChangeCanceled()": EventFragment;
    "DefaultAdminDelayChangeScheduled(uint48,uint48)": EventFragment;
    "DefaultAdminTransferCanceled()": EventFragment;
    "DefaultAdminTransferScheduled(address,uint48)": EventFragment;
    "RoleAdminChanged(bytes32,bytes32,bytes32)": EventFragment;
    "RoleGranted(bytes32,address,address)": EventFragment;
    "RoleRevoked(bytes32,address,address)": EventFragment;
  };

  getEvent(
    nameOrSignatureOrTopic: "DefaultAdminDelayChangeCanceled"
  ): EventFragment;
  getEvent(
    nameOrSignatureOrTopic: "DefaultAdminDelayChangeScheduled"
  ): EventFragment;
  getEvent(
    nameOrSignatureOrTopic: "DefaultAdminTransferCanceled"
  ): EventFragment;
  getEvent(
    nameOrSignatureOrTopic: "DefaultAdminTransferScheduled"
  ): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RoleAdminChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RoleGranted"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RoleRevoked"): EventFragment;
}

export interface DefaultAdminDelayChangeCanceledEventObject {}
export type DefaultAdminDelayChangeCanceledEvent = TypedEvent<
  [],
  DefaultAdminDelayChangeCanceledEventObject
>;

export type DefaultAdminDelayChangeCanceledEventFilter =
  TypedEventFilter<DefaultAdminDelayChangeCanceledEvent>;

export interface DefaultAdminDelayChangeScheduledEventObject {
  newDelay: number;
  effectSchedule: number;
}
export type DefaultAdminDelayChangeScheduledEvent = TypedEvent<
  [number, number],
  DefaultAdminDelayChangeScheduledEventObject
>;

export type DefaultAdminDelayChangeScheduledEventFilter =
  TypedEventFilter<DefaultAdminDelayChangeScheduledEvent>;

export interface DefaultAdminTransferCanceledEventObject {}
export type DefaultAdminTransferCanceledEvent = TypedEvent<
  [],
  DefaultAdminTransferCanceledEventObject
>;

export type DefaultAdminTransferCanceledEventFilter =
  TypedEventFilter<DefaultAdminTransferCanceledEvent>;

export interface DefaultAdminTransferScheduledEventObject {
  newAdmin: string;
  acceptSchedule: number;
}
export type DefaultAdminTransferScheduledEvent = TypedEvent<
  [string, number],
  DefaultAdminTransferScheduledEventObject
>;

export type DefaultAdminTransferScheduledEventFilter =
  TypedEventFilter<DefaultAdminTransferScheduledEvent>;

export interface RoleAdminChangedEventObject {
  role: string;
  previousAdminRole: string;
  newAdminRole: string;
}
export type RoleAdminChangedEvent = TypedEvent<
  [string, string, string],
  RoleAdminChangedEventObject
>;

export type RoleAdminChangedEventFilter =
  TypedEventFilter<RoleAdminChangedEvent>;

export interface RoleGrantedEventObject {
  role: string;
  account: string;
  sender: string;
}
export type RoleGrantedEvent = TypedEvent<
  [string, string, string],
  RoleGrantedEventObject
>;

export type RoleGrantedEventFilter = TypedEventFilter<RoleGrantedEvent>;

export interface RoleRevokedEventObject {
  role: string;
  account: string;
  sender: string;
}
export type RoleRevokedEvent = TypedEvent<
  [string, string, string],
  RoleRevokedEventObject
>;

export type RoleRevokedEventFilter = TypedEventFilter<RoleRevokedEvent>;

export interface IAccessControlDefaultAdminRules extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IAccessControlDefaultAdminRulesInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    acceptDefaultAdminTransfer(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    beginDefaultAdminTransfer(
      newAdmin: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    cancelDefaultAdminTransfer(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    changeDefaultAdminDelay(
      newDelay: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    defaultAdmin(overrides?: CallOverrides): Promise<[string]>;

    defaultAdminDelay(overrides?: CallOverrides): Promise<[number]>;

    defaultAdminDelayIncreaseWait(overrides?: CallOverrides): Promise<[number]>;

    getRoleAdmin(
      role: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    grantRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    hasRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    pendingDefaultAdmin(
      overrides?: CallOverrides
    ): Promise<[string, number] & { newAdmin: string; acceptSchedule: number }>;

    pendingDefaultAdminDelay(
      overrides?: CallOverrides
    ): Promise<[number, number] & { newDelay: number; effectSchedule: number }>;

    renounceRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    revokeRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    rollbackDefaultAdminDelay(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  acceptDefaultAdminTransfer(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  beginDefaultAdminTransfer(
    newAdmin: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  cancelDefaultAdminTransfer(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  changeDefaultAdminDelay(
    newDelay: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  defaultAdmin(overrides?: CallOverrides): Promise<string>;

  defaultAdminDelay(overrides?: CallOverrides): Promise<number>;

  defaultAdminDelayIncreaseWait(overrides?: CallOverrides): Promise<number>;

  getRoleAdmin(
    role: PromiseOrValue<BytesLike>,
    overrides?: CallOverrides
  ): Promise<string>;

  grantRole(
    role: PromiseOrValue<BytesLike>,
    account: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  hasRole(
    role: PromiseOrValue<BytesLike>,
    account: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  pendingDefaultAdmin(
    overrides?: CallOverrides
  ): Promise<[string, number] & { newAdmin: string; acceptSchedule: number }>;

  pendingDefaultAdminDelay(
    overrides?: CallOverrides
  ): Promise<[number, number] & { newDelay: number; effectSchedule: number }>;

  renounceRole(
    role: PromiseOrValue<BytesLike>,
    account: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  revokeRole(
    role: PromiseOrValue<BytesLike>,
    account: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  rollbackDefaultAdminDelay(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    acceptDefaultAdminTransfer(overrides?: CallOverrides): Promise<void>;

    beginDefaultAdminTransfer(
      newAdmin: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    cancelDefaultAdminTransfer(overrides?: CallOverrides): Promise<void>;

    changeDefaultAdminDelay(
      newDelay: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    defaultAdmin(overrides?: CallOverrides): Promise<string>;

    defaultAdminDelay(overrides?: CallOverrides): Promise<number>;

    defaultAdminDelayIncreaseWait(overrides?: CallOverrides): Promise<number>;

    getRoleAdmin(
      role: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<string>;

    grantRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    hasRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    pendingDefaultAdmin(
      overrides?: CallOverrides
    ): Promise<[string, number] & { newAdmin: string; acceptSchedule: number }>;

    pendingDefaultAdminDelay(
      overrides?: CallOverrides
    ): Promise<[number, number] & { newDelay: number; effectSchedule: number }>;

    renounceRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    revokeRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    rollbackDefaultAdminDelay(overrides?: CallOverrides): Promise<void>;
  };

  filters: {
    "DefaultAdminDelayChangeCanceled()"(): DefaultAdminDelayChangeCanceledEventFilter;
    DefaultAdminDelayChangeCanceled(): DefaultAdminDelayChangeCanceledEventFilter;

    "DefaultAdminDelayChangeScheduled(uint48,uint48)"(
      newDelay?: null,
      effectSchedule?: null
    ): DefaultAdminDelayChangeScheduledEventFilter;
    DefaultAdminDelayChangeScheduled(
      newDelay?: null,
      effectSchedule?: null
    ): DefaultAdminDelayChangeScheduledEventFilter;

    "DefaultAdminTransferCanceled()"(): DefaultAdminTransferCanceledEventFilter;
    DefaultAdminTransferCanceled(): DefaultAdminTransferCanceledEventFilter;

    "DefaultAdminTransferScheduled(address,uint48)"(
      newAdmin?: PromiseOrValue<string> | null,
      acceptSchedule?: null
    ): DefaultAdminTransferScheduledEventFilter;
    DefaultAdminTransferScheduled(
      newAdmin?: PromiseOrValue<string> | null,
      acceptSchedule?: null
    ): DefaultAdminTransferScheduledEventFilter;

    "RoleAdminChanged(bytes32,bytes32,bytes32)"(
      role?: PromiseOrValue<BytesLike> | null,
      previousAdminRole?: PromiseOrValue<BytesLike> | null,
      newAdminRole?: PromiseOrValue<BytesLike> | null
    ): RoleAdminChangedEventFilter;
    RoleAdminChanged(
      role?: PromiseOrValue<BytesLike> | null,
      previousAdminRole?: PromiseOrValue<BytesLike> | null,
      newAdminRole?: PromiseOrValue<BytesLike> | null
    ): RoleAdminChangedEventFilter;

    "RoleGranted(bytes32,address,address)"(
      role?: PromiseOrValue<BytesLike> | null,
      account?: PromiseOrValue<string> | null,
      sender?: PromiseOrValue<string> | null
    ): RoleGrantedEventFilter;
    RoleGranted(
      role?: PromiseOrValue<BytesLike> | null,
      account?: PromiseOrValue<string> | null,
      sender?: PromiseOrValue<string> | null
    ): RoleGrantedEventFilter;

    "RoleRevoked(bytes32,address,address)"(
      role?: PromiseOrValue<BytesLike> | null,
      account?: PromiseOrValue<string> | null,
      sender?: PromiseOrValue<string> | null
    ): RoleRevokedEventFilter;
    RoleRevoked(
      role?: PromiseOrValue<BytesLike> | null,
      account?: PromiseOrValue<string> | null,
      sender?: PromiseOrValue<string> | null
    ): RoleRevokedEventFilter;
  };

  estimateGas: {
    acceptDefaultAdminTransfer(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    beginDefaultAdminTransfer(
      newAdmin: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    cancelDefaultAdminTransfer(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    changeDefaultAdminDelay(
      newDelay: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    defaultAdmin(overrides?: CallOverrides): Promise<BigNumber>;

    defaultAdminDelay(overrides?: CallOverrides): Promise<BigNumber>;

    defaultAdminDelayIncreaseWait(
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getRoleAdmin(
      role: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    grantRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    hasRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    pendingDefaultAdmin(overrides?: CallOverrides): Promise<BigNumber>;

    pendingDefaultAdminDelay(overrides?: CallOverrides): Promise<BigNumber>;

    renounceRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    revokeRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    rollbackDefaultAdminDelay(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    acceptDefaultAdminTransfer(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    beginDefaultAdminTransfer(
      newAdmin: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    cancelDefaultAdminTransfer(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    changeDefaultAdminDelay(
      newDelay: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    defaultAdmin(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    defaultAdminDelay(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    defaultAdminDelayIncreaseWait(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getRoleAdmin(
      role: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    grantRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    hasRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    pendingDefaultAdmin(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    pendingDefaultAdminDelay(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    renounceRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    revokeRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    rollbackDefaultAdminDelay(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
