/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../../common";
import type {
  ERCErrors,
  ERCErrorsInterface,
} from "../../../../../contracts/base/NFT/common/ERCErrors";

const _abi = [
  {
    inputs: [
      {
        internalType: "bool",
        name: "active",
        type: "bool",
      },
    ],
    name: "DisabledOption",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "maxValue",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        internalType: "bytes32",
        name: "message",
        type: "bytes32",
      },
    ],
    name: "ExceededMaxValue",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "caller",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "requiredRole",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "message",
        type: "bytes32",
      },
    ],
    name: "InsufficientPermissions",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidAmount",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "message",
        type: "bytes32",
      },
    ],
    name: "NoAdmins",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "message",
        type: "bytes32",
      },
    ],
    name: "NoMinters",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "caller",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "bytes32",
        name: "message",
        type: "bytes32",
      },
    ],
    name: "NotApprovedOrOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "mintingFee",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        internalType: "bytes32",
        name: "message",
        type: "bytes32",
      },
    ],
    name: "PriceBelowMintingFee",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "bytes32",
        name: "message",
        type: "bytes32",
      },
    ],
    name: "TokenDoesNotExists",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "tokenURI",
        type: "string",
      },
      {
        internalType: "bool",
        name: "tokenURIExists",
        type: "bool",
      },
      {
        internalType: "bytes32",
        name: "message",
        type: "bytes32",
      },
    ],
    name: "TokenURIAlreadyExists",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "message",
        type: "bytes32",
      },
    ],
    name: "UnAuthorizedCaller",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "message",
        type: "bytes32",
      },
    ],
    name: "ZeroAddress",
    type: "error",
  },
] as const;

const _bytecode =
  "0x6080604052348015600f57600080fd5b50603f80601d6000396000f3fe6080604052600080fdfea2646970667358221220f9f3e7e31ea246f59ff8a4567d85834a8b7eade0a3e61f8ffe7dc165a0925a8f64736f6c63430008130033";

type ERCErrorsConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ERCErrorsConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ERCErrors__factory extends ContractFactory {
  constructor(...args: ERCErrorsConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ERCErrors> {
    return super.deploy(overrides || {}) as Promise<ERCErrors>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): ERCErrors {
    return super.attach(address) as ERCErrors;
  }
  override connect(signer: Signer): ERCErrors__factory {
    return super.connect(signer) as ERCErrors__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ERCErrorsInterface {
    return new utils.Interface(_abi) as ERCErrorsInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ERCErrors {
    return new Contract(address, _abi, signerOrProvider) as ERCErrors;
  }
}
