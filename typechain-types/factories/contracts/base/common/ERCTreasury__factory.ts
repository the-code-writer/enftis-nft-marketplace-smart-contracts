/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Signer,
  utils,
  Contract,
  ContractFactory,
  PayableOverrides,
} from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../common";
import type {
  ERCTreasury,
  ERCTreasuryInterface,
} from "../../../../contracts/base/common/ERCTreasury";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_payee",
        type: "address",
      },
    ],
    stateMutability: "payable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [],
    name: "isReleased",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "payee",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "releaseFunds",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "totalFunds",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60806040526040516103f03803806103f0833981016040819052610022916100a3565b61002b33610053565b34600155600280546001600160a81b0319166001600160a01b039092169190911790556100d3565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6000602082840312156100b557600080fd5b81516001600160a01b03811681146100cc57600080fd5b9392505050565b61030e806100e26000396000f3fe608060405234801561001057600080fd5b506004361061006d5760003560e01c806369d8957514610072578063715018a61461007c5780638da5cb5b14610084578063968ed600146100a9578063ae90b213146100c0578063f2fde38b146100d3578063fa2a8997146100e6575b600080fd5b61007a61010a565b005b61007a61015b565b61008c61016f565b6040516001600160a01b0390911681526020015b60405180910390f35b6100b260015481565b6040519081526020016100a0565b60025461008c906001600160a01b031681565b61007a6100e13660046102a8565b61017e565b6002546100fa90600160a01b900460ff1681565b60405190151581526020016100a0565b6002805460ff60a01b198116600160a01b179091556001546040516001600160a01b039092169181156108fc0291906000818181858888f19350505050158015610158573d6000803e3d6000fd5b50565b6101636101f9565b61016d6000610258565b565b6000546001600160a01b031690565b6101866101f9565b6001600160a01b0381166101f05760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b60648201526084015b60405180910390fd5b61015881610258565b3361020261016f565b6001600160a01b03161461016d5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064016101e7565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6000602082840312156102ba57600080fd5b81356001600160a01b03811681146102d157600080fd5b939250505056fea2646970667358221220694cf5ab89d48763184d0d1244300eb7f816081595f23e20827e9badd69c1eea64736f6c63430008130033";

type ERCTreasuryConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ERCTreasuryConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ERCTreasury__factory extends ContractFactory {
  constructor(...args: ERCTreasuryConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _payee: PromiseOrValue<string>,
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): Promise<ERCTreasury> {
    return super.deploy(_payee, overrides || {}) as Promise<ERCTreasury>;
  }
  override getDeployTransaction(
    _payee: PromiseOrValue<string>,
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_payee, overrides || {});
  }
  override attach(address: string): ERCTreasury {
    return super.attach(address) as ERCTreasury;
  }
  override connect(signer: Signer): ERCTreasury__factory {
    return super.connect(signer) as ERCTreasury__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ERCTreasuryInterface {
    return new utils.Interface(_abi) as ERCTreasuryInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ERCTreasury {
    return new Contract(address, _abi, signerOrProvider) as ERCTreasury;
  }
}