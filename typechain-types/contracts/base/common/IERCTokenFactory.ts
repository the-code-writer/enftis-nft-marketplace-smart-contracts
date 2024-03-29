/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedListener,
  TypedContractMethod,
} from "../../../common";

export interface IERCTokenFactoryInterface extends Interface {
  getFunction(nameOrSignature: "create721Token"): FunctionFragment;

  encodeFunctionData(
    functionFragment: "create721Token",
    values: [
      AddressLike,
      AddressLike,
      AddressLike,
      BytesLike,
      string,
      string,
      string,
      string,
      string
    ]
  ): string;

  decodeFunctionResult(
    functionFragment: "create721Token",
    data: BytesLike
  ): Result;
}

export interface IERCTokenFactory extends BaseContract {
  connect(runner?: ContractRunner | null): IERCTokenFactory;
  waitForDeployment(): Promise<this>;

  interface: IERCTokenFactoryInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  create721Token: TypedContractMethod<
    [
      _owner: AddressLike,
      _loggerAddress: AddressLike,
      _marketplaceAddress: AddressLike,
      _data: BytesLike,
      _name: string,
      _symbol: string,
      _description: string,
      _bannerMedia: string,
      _displayPicture: string
    ],
    [string],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "create721Token"
  ): TypedContractMethod<
    [
      _owner: AddressLike,
      _loggerAddress: AddressLike,
      _marketplaceAddress: AddressLike,
      _data: BytesLike,
      _name: string,
      _symbol: string,
      _description: string,
      _bannerMedia: string,
      _displayPicture: string
    ],
    [string],
    "nonpayable"
  >;

  filters: {};
}
