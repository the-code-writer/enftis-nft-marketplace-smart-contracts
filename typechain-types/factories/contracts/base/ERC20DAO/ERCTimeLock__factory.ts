/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type {
  Signer,
  BigNumberish,
  AddressLike,
  ContractDeployTransaction,
  ContractRunner,
} from "ethers";
import type { NonPayableOverrides } from "../../../../common";
import type {
  ERCTimeLock,
  ERCTimeLockInterface,
} from "../../../../contracts/base/ERC20DAO/ERCTimeLock";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "minDelay",
        type: "uint256",
      },
      {
        internalType: "address[]",
        name: "proposers",
        type: "address[]",
      },
      {
        internalType: "address[]",
        name: "executors",
        type: "address[]",
      },
      {
        internalType: "address",
        name: "admin",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "AccessControlBadConfirmation",
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
        name: "neededRole",
        type: "bytes32",
      },
    ],
    name: "AccessControlUnauthorizedAccount",
    type: "error",
  },
  {
    inputs: [],
    name: "FailedInnerCall",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "delay",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "minDelay",
        type: "uint256",
      },
    ],
    name: "TimelockInsufficientDelay",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "targets",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "payloads",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "values",
        type: "uint256",
      },
    ],
    name: "TimelockInvalidOperationLength",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "caller",
        type: "address",
      },
    ],
    name: "TimelockUnauthorizedCaller",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "predecessorId",
        type: "bytes32",
      },
    ],
    name: "TimelockUnexecutedPredecessor",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "operationId",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "expectedStates",
        type: "bytes32",
      },
    ],
    name: "TimelockUnexpectedOperationState",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "id",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "target",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "CallExecuted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "id",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "salt",
        type: "bytes32",
      },
    ],
    name: "CallSalt",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "id",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "target",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "predecessor",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "delay",
        type: "uint256",
      },
    ],
    name: "CallScheduled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "id",
        type: "bytes32",
      },
    ],
    name: "Cancelled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "oldDuration",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newDuration",
        type: "uint256",
      },
    ],
    name: "MinDelayChange",
    type: "event",
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
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "previousAdminRole",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "newAdminRole",
        type: "bytes32",
      },
    ],
    name: "RoleAdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleGranted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleRevoked",
    type: "event",
  },
  {
    inputs: [],
    name: "CANCELLER_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "DEFAULT_ADMIN_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "EXECUTOR_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "PROPOSER_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "id",
        type: "bytes32",
      },
    ],
    name: "cancel",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "target",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "payload",
        type: "bytes",
      },
      {
        internalType: "bytes32",
        name: "predecessor",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "salt",
        type: "bytes32",
      },
    ],
    name: "execute",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "targets",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "values",
        type: "uint256[]",
      },
      {
        internalType: "bytes[]",
        name: "payloads",
        type: "bytes[]",
      },
      {
        internalType: "bytes32",
        name: "predecessor",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "salt",
        type: "bytes32",
      },
    ],
    name: "executeBatch",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "getMinDelay",
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
        internalType: "bytes32",
        name: "id",
        type: "bytes32",
      },
    ],
    name: "getOperationState",
    outputs: [
      {
        internalType: "enum TimelockController.OperationState",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
    ],
    name: "getRoleAdmin",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTimeLockAdminRole",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "id",
        type: "bytes32",
      },
    ],
    name: "getTimestamp",
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
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "grantRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "hasRole",
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
    inputs: [
      {
        internalType: "address",
        name: "target",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
      {
        internalType: "bytes32",
        name: "predecessor",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "salt",
        type: "bytes32",
      },
    ],
    name: "hashOperation",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "targets",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "values",
        type: "uint256[]",
      },
      {
        internalType: "bytes[]",
        name: "payloads",
        type: "bytes[]",
      },
      {
        internalType: "bytes32",
        name: "predecessor",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "salt",
        type: "bytes32",
      },
    ],
    name: "hashOperationBatch",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "id",
        type: "bytes32",
      },
    ],
    name: "isOperation",
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
    inputs: [
      {
        internalType: "bytes32",
        name: "id",
        type: "bytes32",
      },
    ],
    name: "isOperationDone",
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
    inputs: [
      {
        internalType: "bytes32",
        name: "id",
        type: "bytes32",
      },
    ],
    name: "isOperationPending",
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
    inputs: [
      {
        internalType: "bytes32",
        name: "id",
        type: "bytes32",
      },
    ],
    name: "isOperationReady",
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
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "onERC1155BatchReceived",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "onERC1155Received",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "onERC721Received",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "nonpayable",
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
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "callerConfirmation",
        type: "address",
      },
    ],
    name: "renounceRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "revokeRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "target",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
      {
        internalType: "bytes32",
        name: "predecessor",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "salt",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "delay",
        type: "uint256",
      },
    ],
    name: "schedule",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "targets",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "values",
        type: "uint256[]",
      },
      {
        internalType: "bytes[]",
        name: "payloads",
        type: "bytes[]",
      },
      {
        internalType: "bytes32",
        name: "predecessor",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "salt",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "delay",
        type: "uint256",
      },
    ],
    name: "scheduleBatch",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
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
  {
    inputs: [
      {
        internalType: "uint256",
        name: "newDelay",
        type: "uint256",
      },
    ],
    name: "updateDelay",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
] as const;

const _bytecode =
  "0x60806040523480156200001157600080fd5b50604051620021b1380380620021b18339810160408190526200003491620003d7565b338484848462000046600030620001f6565b506001600160a01b03811615620000665762000064600082620001f6565b505b60005b83518110156200011057620000c17fb09aa5aeb3702cfd50b6b62bc4532604938f21248a27a1d5ca736082b6819cc1858381518110620000ad57620000ad6200045e565b6020026020010151620001f660201b60201c565b50620000fc7ffd643c72710c63c0180259aba6b2d05451e3591a24e58b62239378085726f783858381518110620000ad57620000ad6200045e565b50620001088162000474565b905062000069565b5060005b82518110156200016c57620001587fd8aa0f3194971a2a116679f7c2090f6939c8d4e01a2a8d7e41d55e5351469e63848381518110620000ad57620000ad6200045e565b50620001648162000474565b905062000114565b5060028490556040805160008152602081018690527f11c24f4ead16507c69ac467fbd5e4eed5fb5c699626d2cc6d66421df253886d5910160405180910390a15050506001600160a01b0382169050620001e057604051631e4fbdf760e01b81526000600482015260240160405180910390fd5b620001eb81620002a5565b50505050506200049c565b6000828152602081815260408083206001600160a01b038516845290915281205460ff166200029b576000838152602081815260408083206001600160a01b03861684529091529020805460ff19166001179055620002523390565b6001600160a01b0316826001600160a01b0316847f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45060016200029f565b5060005b92915050565b600380546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b634e487b7160e01b600052604160045260246000fd5b80516001600160a01b03811681146200032557600080fd5b919050565b600082601f8301126200033c57600080fd5b815160206001600160401b03808311156200035b576200035b620002f7565b8260051b604051601f19603f83011681018181108482111715620003835762000383620002f7565b604052938452858101830193838101925087851115620003a257600080fd5b83870191505b84821015620003cc57620003bc826200030d565b83529183019190830190620003a8565b979650505050505050565b60008060008060808587031215620003ee57600080fd5b845160208601519094506001600160401b03808211156200040e57600080fd5b6200041c888389016200032a565b945060408701519150808211156200043357600080fd5b5062000442878288016200032a565b92505062000453606086016200030d565b905092959194509250565b634e487b7160e01b600052603260045260246000fd5b6000600182016200049557634e487b7160e01b600052601160045260246000fd5b5060010190565b611d0580620004ac6000396000f3fe6080604052600436106101e75760003560e01c80638065657f11610102578063bc197c8111610095578063e38335e511610064578063e38335e51461062b578063f23a6e611461063e578063f27a0c921461066a578063f2fde38b1461067f57600080fd5b8063bc197c8114610592578063c4d252f5146105be578063d45c4435146105de578063d547741f1461060b57600080fd5b806391d14854116100d157806391d14854146104e5578063a217fddf14610529578063b08e51c01461053e578063b1c5f4271461057257600080fd5b80638065657f146104495780638da5cb5b146104695780638f2a0bb0146104915780638f61f4f5146104b157600080fd5b80632f2ff15d1161017a578063584b153e11610149578063584b153e146103c757806364d62353146103e7578063715018a6146104075780637958004c1461041c57600080fd5b80632f2ff15d1461035357806331d507501461037357806336568abe1461039357806344f9be46146103b357600080fd5b806313bc9f20116101b657806313bc9f201461029f578063150b7a02146102bf578063248a9ca3146103035780632ab0f5291461033357600080fd5b806301d5062a146101f357806301ffc9a71461021557806307bd02651461024a578063134008d31461028c57600080fd5b366101ee57005b600080fd5b3480156101ff57600080fd5b5061021361020e366004611443565b61069f565b005b34801561022157600080fd5b506102356102303660046114b8565b610775565b60405190151581526020015b60405180910390f35b34801561025657600080fd5b5061027e7fd8aa0f3194971a2a116679f7c2090f6939c8d4e01a2a8d7e41d55e5351469e6381565b604051908152602001610241565b61021361029a3660046114e2565b610786565b3480156102ab57600080fd5b506102356102ba36600461154e565b61087e565b3480156102cb57600080fd5b506102ea6102da36600461161e565b630a85bd0160e11b949350505050565b6040516001600160e01b03199091168152602001610241565b34801561030f57600080fd5b5061027e61031e36600461154e565b60009081526020819052604090206001015490565b34801561033f57600080fd5b5061023561034e36600461154e565b6108a4565b34801561035f57600080fd5b5061021361036e366004611686565b6108ad565b34801561037f57600080fd5b5061023561038e36600461154e565b6108d8565b34801561039f57600080fd5b506102136103ae366004611686565b6108fd565b3480156103bf57600080fd5b50600061027e565b3480156103d357600080fd5b506102356103e236600461154e565b610935565b3480156103f357600080fd5b5061021361040236600461154e565b61097b565b34801561041357600080fd5b506102136109ee565b34801561042857600080fd5b5061043c61043736600461154e565b610a02565b60405161024191906116c8565b34801561045557600080fd5b5061027e6104643660046114e2565b610a4d565b34801561047557600080fd5b506003546040516001600160a01b039091168152602001610241565b34801561049d57600080fd5b506102136104ac366004611735565b610a8c565b3480156104bd57600080fd5b5061027e7fb09aa5aeb3702cfd50b6b62bc4532604938f21248a27a1d5ca736082b6819cc181565b3480156104f157600080fd5b50610235610500366004611686565b6000918252602082815260408084206001600160a01b0393909316845291905290205460ff1690565b34801561053557600080fd5b5061027e600081565b34801561054a57600080fd5b5061027e7ffd643c72710c63c0180259aba6b2d05451e3591a24e58b62239378085726f78381565b34801561057e57600080fd5b5061027e61058d3660046117e7565b610c38565b34801561059e57600080fd5b506102ea6105ad366004611910565b63bc197c8160e01b95945050505050565b3480156105ca57600080fd5b506102136105d936600461154e565b610c7d565b3480156105ea57600080fd5b5061027e6105f936600461154e565b60009081526001602052604090205490565b34801561061757600080fd5b50610213610626366004611686565b610d28565b6102136106393660046117e7565b610d4d565b34801561064a57600080fd5b506102ea6106593660046119ba565b63f23a6e6160e01b95945050505050565b34801561067657600080fd5b5060025461027e565b34801561068b57600080fd5b5061021361069a366004611a1f565b610f33565b7fb09aa5aeb3702cfd50b6b62bc4532604938f21248a27a1d5ca736082b6819cc16106c981610f71565b60006106d9898989898989610a4d565b90506106e58184610f7b565b6000817f4cf4410cc57040e44862ef0f45f3dd5a5e02db8eb8add648d4b0e236f1d07dca8b8b8b8b8b8a60405161072196959493929190611a63565b60405180910390a3831561076a57807f20fda5fd27a1ea7bf5b9567f143ac5470bb059374a27e8f67cb44f946f6d03878560405161076191815260200190565b60405180910390a25b505050505050505050565b60006107808261100f565b92915050565b600080527fdae2aa361dfd1ca020a396615627d436107c35eff9fe7738a3512819782d70696020527f5ba6852781629bcdcd4bdaa6de76d786f1c64b16acdac474e55bebc0ea157951547fd8aa0f3194971a2a116679f7c2090f6939c8d4e01a2a8d7e41d55e5351469e639060ff16610803576108038133611034565b6000610813888888888888610a4d565b905061081f818561108b565b61082b888888886110d9565b6000817fc2617efa69bab66782fa219543714338489c4e9e178271560a91b82c3f612b588a8a8a8a6040516108639493929190611aa1565b60405180910390a361087481611151565b5050505050505050565b600060025b61088c83610a02565b600381111561089d5761089d6116b2565b1492915050565b60006003610883565b6000828152602081905260409020600101546108c881610f71565b6108d2838361117d565b50505050565b6000806108e483610a02565b60038111156108f5576108f56116b2565b141592915050565b6001600160a01b03811633146109265760405163334bd91960e11b815260040160405180910390fd5b6109308282611227565b505050565b60008061094183610a02565b90506001816003811115610957576109576116b2565b148061097457506002816003811115610972576109726116b2565b145b9392505050565b333081146109ac5760405163e2850c5960e01b81526001600160a01b03821660048201526024015b60405180910390fd5b60025460408051918252602082018490527f11c24f4ead16507c69ac467fbd5e4eed5fb5c699626d2cc6d66421df253886d5910160405180910390a150600255565b6109f66112aa565b610a0060006112d7565b565b60008181526001602052604081205480600003610a225750600092915050565b60018103610a335750600392915050565b42811115610a445750600192915050565b50600292915050565b6000868686868686604051602001610a6a96959493929190611a63565b6040516020818303038152906040528051906020012090509695505050505050565b7fb09aa5aeb3702cfd50b6b62bc4532604938f21248a27a1d5ca736082b6819cc1610ab681610f71565b8887141580610ac55750888514155b15610b0d576040517fffb03211000000000000000000000000000000000000000000000000000000008152600481018a905260248101869052604481018890526064016109a3565b6000610b1f8b8b8b8b8b8b8b8b610c38565b9050610b2b8184610f7b565b60005b8a811015610be95780827f4cf4410cc57040e44862ef0f45f3dd5a5e02db8eb8add648d4b0e236f1d07dca8e8e85818110610b6b57610b6b611ad4565b9050602002016020810190610b809190611a1f565b8d8d86818110610b9257610b92611ad4565b905060200201358c8c87818110610bab57610bab611ad4565b9050602002810190610bbd9190611aea565b8c8b604051610bd196959493929190611a63565b60405180910390a3610be281611b47565b9050610b2e565b508315610c2b57807f20fda5fd27a1ea7bf5b9567f143ac5470bb059374a27e8f67cb44f946f6d038785604051610c2291815260200190565b60405180910390a25b5050505050505050505050565b60008888888888888888604051602001610c59989796959493929190611bf2565b60405160208183030381529060405280519060200120905098975050505050505050565b7ffd643c72710c63c0180259aba6b2d05451e3591a24e58b62239378085726f783610ca781610f71565b610cb082610935565b610cec5781610cbf6002611341565b610cc96001611341565b604051635ead8eb560e01b815260048101939093521760248201526044016109a3565b6000828152600160205260408082208290555183917fbaa1eb22f2a492ba1a5fea61b8df4d27c6c8b5f3971e63bb58fa14ff72eedb7091a25050565b600082815260208190526040902060010154610d4381610f71565b6108d28383611227565b600080527fdae2aa361dfd1ca020a396615627d436107c35eff9fe7738a3512819782d70696020527f5ba6852781629bcdcd4bdaa6de76d786f1c64b16acdac474e55bebc0ea157951547fd8aa0f3194971a2a116679f7c2090f6939c8d4e01a2a8d7e41d55e5351469e639060ff16610dca57610dca8133611034565b8786141580610dd95750878414155b15610e21576040517fffb032110000000000000000000000000000000000000000000000000000000081526004810189905260248101859052604481018790526064016109a3565b6000610e338a8a8a8a8a8a8a8a610c38565b9050610e3f818561108b565b60005b89811015610f1d5760008b8b83818110610e5e57610e5e611ad4565b9050602002016020810190610e739190611a1f565b905060008a8a84818110610e8957610e89611ad4565b9050602002013590503660008a8a86818110610ea757610ea7611ad4565b9050602002810190610eb99190611aea565b91509150610ec9848484846110d9565b84867fc2617efa69bab66782fa219543714338489c4e9e178271560a91b82c3f612b5886868686604051610f009493929190611aa1565b60405180910390a35050505080610f1690611b47565b9050610e42565b50610f2781611151565b50505050505050505050565b610f3b6112aa565b6001600160a01b038116610f6557604051631e4fbdf760e01b8152600060048201526024016109a3565b610f6e816112d7565b50565b610f6e8133611034565b610f84826108d8565b15610fb65781610f946000611341565b604051635ead8eb560e01b8152600481019290925260248201526044016109a3565b6000610fc160025490565b905080821015610fee57604051635433660960e01b815260048101839052602481018290526044016109a3565b610ff88242611cac565b600093845260016020526040909320929092555050565b60006001600160e01b03198216630271189760e51b1480610780575061078082611364565b6000828152602081815260408083206001600160a01b038516845290915290205460ff166110875760405163e2517d3f60e01b81526001600160a01b0382166004820152602481018390526044016109a3565b5050565b6110948261087e565b6110a35781610f946002611341565b80158015906110b857506110b6816108a4565b155b156110875760405163121534c360e31b8152600481018290526024016109a3565b600080856001600160a01b03168585856040516110f7929190611cbf565b60006040518083038185875af1925050503d8060008114611134576040519150601f19603f3d011682016040523d82523d6000602084013e611139565b606091505b50915091506111488282611399565b50505050505050565b61115a8161087e565b6111695780610f946002611341565b600090815260016020819052604090912055565b6000828152602081815260408083206001600160a01b038516845290915281205460ff1661121f576000838152602081815260408083206001600160a01b03861684529091529020805460ff191660011790556111d73390565b6001600160a01b0316826001600160a01b0316847f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a4506001610780565b506000610780565b6000828152602081815260408083206001600160a01b038516845290915281205460ff161561121f576000838152602081815260408083206001600160a01b0386168085529252808320805460ff1916905551339286917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a4506001610780565b6003546001600160a01b03163314610a005760405163118cdaa760e01b81523360048201526024016109a3565b600380546001600160a01b038381167fffffffffffffffffffffffff0000000000000000000000000000000000000000831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b6000816003811115611355576113556116b2565b600160ff919091161b92915050565b60006001600160e01b03198216637965db0b60e01b148061078057506301ffc9a760e01b6001600160e01b0319831614610780565b6060826113ae576113a9826113b5565b610780565b5080610780565b8051156113c55780518082602001fd5b604051630a12f52160e11b815260040160405180910390fd5b80356001600160a01b03811681146113f557600080fd5b919050565b60008083601f84011261140c57600080fd5b50813567ffffffffffffffff81111561142457600080fd5b60208301915083602082850101111561143c57600080fd5b9250929050565b600080600080600080600060c0888a03121561145e57600080fd5b611467886113de565b965060208801359550604088013567ffffffffffffffff81111561148a57600080fd5b6114968a828b016113fa565b989b979a50986060810135976080820135975060a09091013595509350505050565b6000602082840312156114ca57600080fd5b81356001600160e01b03198116811461097457600080fd5b60008060008060008060a087890312156114fb57600080fd5b611504876113de565b955060208701359450604087013567ffffffffffffffff81111561152757600080fd5b61153389828a016113fa565b979a9699509760608101359660809091013595509350505050565b60006020828403121561156057600080fd5b5035919050565b634e487b7160e01b600052604160045260246000fd5b604051601f8201601f1916810167ffffffffffffffff811182821017156115a6576115a6611567565b604052919050565b600082601f8301126115bf57600080fd5b813567ffffffffffffffff8111156115d9576115d9611567565b6115ec601f8201601f191660200161157d565b81815284602083860101111561160157600080fd5b816020850160208301376000918101602001919091529392505050565b6000806000806080858703121561163457600080fd5b61163d856113de565b935061164b602086016113de565b925060408501359150606085013567ffffffffffffffff81111561166e57600080fd5b61167a878288016115ae565b91505092959194509250565b6000806040838503121561169957600080fd5b823591506116a9602084016113de565b90509250929050565b634e487b7160e01b600052602160045260246000fd5b60208101600483106116ea57634e487b7160e01b600052602160045260246000fd5b91905290565b60008083601f84011261170257600080fd5b50813567ffffffffffffffff81111561171a57600080fd5b6020830191508360208260051b850101111561143c57600080fd5b600080600080600080600080600060c08a8c03121561175357600080fd5b893567ffffffffffffffff8082111561176b57600080fd5b6117778d838e016116f0565b909b50995060208c013591508082111561179057600080fd5b61179c8d838e016116f0565b909950975060408c01359150808211156117b557600080fd5b506117c28c828d016116f0565b9a9d999c50979a969997986060880135976080810135975060a0013595509350505050565b60008060008060008060008060a0898b03121561180357600080fd5b883567ffffffffffffffff8082111561181b57600080fd5b6118278c838d016116f0565b909a50985060208b013591508082111561184057600080fd5b61184c8c838d016116f0565b909850965060408b013591508082111561186557600080fd5b506118728b828c016116f0565b999c989b509699959896976060870135966080013595509350505050565b600082601f8301126118a157600080fd5b8135602067ffffffffffffffff8211156118bd576118bd611567565b8160051b6118cc82820161157d565b92835284810182019282810190878511156118e657600080fd5b83870192505b84831015611905578235825291830191908301906118ec565b979650505050505050565b600080600080600060a0868803121561192857600080fd5b611931866113de565b945061193f602087016113de565b9350604086013567ffffffffffffffff8082111561195c57600080fd5b61196889838a01611890565b9450606088013591508082111561197e57600080fd5b61198a89838a01611890565b935060808801359150808211156119a057600080fd5b506119ad888289016115ae565b9150509295509295909350565b600080600080600060a086880312156119d257600080fd5b6119db866113de565b94506119e9602087016113de565b93506040860135925060608601359150608086013567ffffffffffffffff811115611a1357600080fd5b6119ad888289016115ae565b600060208284031215611a3157600080fd5b610974826113de565b81835281816020850137506000828201602090810191909152601f909101601f19169091010190565b6001600160a01b038716815285602082015260a060408201526000611a8c60a083018688611a3a565b60608301949094525060800152949350505050565b6001600160a01b0385168152836020820152606060408201526000611aca606083018486611a3a565b9695505050505050565b634e487b7160e01b600052603260045260246000fd5b6000808335601e19843603018112611b0157600080fd5b83018035915067ffffffffffffffff821115611b1c57600080fd5b60200191503681900382131561143c57600080fd5b634e487b7160e01b600052601160045260246000fd5b600060018201611b5957611b59611b31565b5060010190565b81835260006020808501808196508560051b810191508460005b87811015611be55782840389528135601e19883603018112611b9b57600080fd5b8701858101903567ffffffffffffffff811115611bb757600080fd5b803603821315611bc657600080fd5b611bd1868284611a3a565b9a87019a9550505090840190600101611b7a565b5091979650505050505050565b60a0808252810188905260008960c08301825b8b811015611c33576001600160a01b03611c1e846113de565b16825260209283019290910190600101611c05565b5083810360208501528881527f07ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff891115611c6c57600080fd5b8860051b9150818a60208301370182810360209081016040850152611c949082018789611b60565b60608401959095525050608001529695505050505050565b8082018082111561078057610780611b31565b818382376000910190815291905056fea2646970667358221220508348c9a52b0c1a2cc8ad1fc2a911f216b07edf3a804decfbd5a07f2463952f64736f6c63430008140033";

type ERCTimeLockConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ERCTimeLockConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ERCTimeLock__factory extends ContractFactory {
  constructor(...args: ERCTimeLockConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    minDelay: BigNumberish,
    proposers: AddressLike[],
    executors: AddressLike[],
    admin: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(
      minDelay,
      proposers,
      executors,
      admin,
      overrides || {}
    );
  }
  override deploy(
    minDelay: BigNumberish,
    proposers: AddressLike[],
    executors: AddressLike[],
    admin: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(
      minDelay,
      proposers,
      executors,
      admin,
      overrides || {}
    ) as Promise<
      ERCTimeLock & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): ERCTimeLock__factory {
    return super.connect(runner) as ERCTimeLock__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ERCTimeLockInterface {
    return new Interface(_abi) as ERCTimeLockInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): ERCTimeLock {
    return new Contract(address, _abi, runner) as unknown as ERCTimeLock;
  }
}
