/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../../common";
import type {
  Snippets,
  SnippetsInterface,
} from "../../../contracts/libs/Snippets";

const _abi = [
  {
    inputs: [],
    name: "ADDRESS",
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
    name: "ADMIN_ROLE",
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
    name: "BASE_EXTENSION",
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
    name: "CREATED_AFTER",
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
    name: "CREATED_AT",
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
    name: "CREATED_BEFORE",
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
    name: "CREATOR",
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
    name: "ERC1155INTERFACE",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "ERC20INTERFACE",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "ERC2981INTERFACE",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "ERC721INTERFACE",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "IPFS_PREFIX",
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
    name: "MINTER",
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
    name: "MINTER_ROLE",
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
    name: "OWNER",
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
    name: "PAUSER_ROLE",
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
    name: "SELLER",
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
    name: "SNAPSHOT_ROLE",
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
    name: "STRING",
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
    name: "TIMESTAMP",
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
    name: "TOKEN_ID",
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
    name: "TOKEN_URI",
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
    name: "UINT256",
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
    name: "UPDATED_AFTER",
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
    name: "UPDATED_AT",
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
    name: "UPDATED_BEFORE",
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
        name: "_bytes32",
        type: "bytes32",
      },
    ],
    name: "bytes32String",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "a",
        type: "string",
      },
      {
        internalType: "string",
        name: "b",
        type: "string",
      },
    ],
    name: "compareStrings",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "seed",
        type: "uint256",
      },
    ],
    name: "generateRandomHash",
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
        internalType: "uint256",
        name: "seed",
        type: "uint256",
      },
    ],
    name: "generateRandomNumber",
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
        internalType: "string",
        name: "baseURI",
        type: "string",
      },
    ],
    name: "getBaseURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "baseURI",
        type: "string",
      },
      {
        internalType: "string",
        name: "tokenURI",
        type: "string",
      },
    ],
    name: "getTokenURIFromID",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "baseURI",
        type: "string",
      },
      {
        internalType: "string",
        name: "_tokenURI",
        type: "string",
      },
    ],
    name: "getTokenURIFromURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "msgSender",
    outputs: [
      {
        internalType: "address payable",
        name: "sender",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_itemKey",
        type: "bytes32",
      },
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
      {
        components: [
          {
            internalType: "address",
            name: "minterAddress",
            type: "address",
          },
          {
            internalType: "address[2]",
            name: "creatorAddress",
            type: "address[2]",
          },
          {
            internalType: "address",
            name: "ownerAddress",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "createdAt",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "updatedAt",
            type: "uint256",
          },
        ],
        internalType: "struct Structs.NFTItem",
        name: "_nftItem",
        type: "tuple",
      },
      {
        internalType: "string",
        name: "_tokenURIString",
        type: "string",
      },
    ],
    name: "searchHasMatch",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_itemKey",
        type: "bytes32",
      },
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
      {
        components: [
          {
            internalType: "bytes4",
            name: "tokenInterfaceId",
            type: "bytes4",
          },
          {
            internalType: "bool",
            name: "sold",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "isListed",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "isAuction",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "supportsRoyalties",
            type: "bool",
          },
          {
            internalType: "address",
            name: "tokenContractAddress",
            type: "address",
          },
          {
            internalType: "address payable[3]",
            name: "creatorSellerOwner",
            type: "address[3]",
          },
          {
            internalType: "uint256",
            name: "price",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "createdAt",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "updatedAt",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "tokenIndexedID",
            type: "uint256",
          },
        ],
        internalType: "struct Structs.NFTMarketItem",
        name: "_nftItem",
        type: "tuple",
      },
    ],
    name: "searchNFTMarketItemHasMatch",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_self",
        type: "string",
      },
      {
        internalType: "string",
        name: "_needle",
        type: "string",
      },
    ],
    name: "searchString",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "source",
        type: "string",
      },
    ],
    name: "stringBytes32",
    outputs: [
      {
        internalType: "bytes32",
        name: "result",
        type: "bytes32",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "what",
        type: "string",
      },
      {
        internalType: "string",
        name: "where",
        type: "string",
      },
    ],
    name: "stringContains",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
] as const;

const _bytecode =
  "0x6123bc61003a600b82828239805160001a60731461002d57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600436106102b75760003560e01c80638e7dc34311610185578063cbb79748116100e2578063e4fbb60911610096578063ed63455c1161007b578063ed63455c14610766578063fdad77a114610779578063fe6d8124146103c457600080fd5b8063e4fbb60914610718578063e63ab1e91461073f57600080fd5b8063d5391393116100c7578063d5391393146106aa578063d737d0c7146106d1578063df3fdf00146106f157600080fd5b8063cbb797481461068e578063d48118841461069c57600080fd5b8063b51ce63d11610139578063bca93eba1161011e578063bca93eba14610641578063bd5063ac14610668578063bed34bba1461067b57600080fd5b8063b51ce63d146105f3578063b56a2dc61461061a57600080fd5b806393af7a841161016a57806393af7a8414610592578063a35d677e146105a5578063a9c40e69146105cc57600080fd5b80638e7dc343146105485780638fa581a31461056f57600080fd5b8063592c80ee1161023357806375b238fc116101e75780637afca97e116101cc5780637afca97e146104e757806389a890021461050e5780638c878dbb1461053557600080fd5b806375b238fc1461049957806378ce9035146104c057600080fd5b80637028e2cd116102185780637028e2cd14610438578063748493941461045f578063749e480d1461047257600080fd5b8063592c80ee146103fe5780635e3ba2001461041157600080fd5b80631879c7501161028a578063260a529a1161026f578063260a529a146103b1578063296555cf146103c45780634303707e146103eb57600080fd5b80631879c7501461038357806322904b4a1461039157600080fd5b806305c2c45a146102bc57806307cb1a6e146102f65780630c83bee014610335578063117803e31461035c575b600080fd5b6102e37f22468b554f8de3f8c7c3e441faddd40dbca3acf65d471cbab7ab89c8cff4287d81565b6040519081526020015b60405180910390f35b6103046380ac58cd60e01b81565b6040517fffffffff0000000000000000000000000000000000000000000000000000000090911681526020016102ed565b6102e37f66f0790b1cbe0dcac007f07341b00cafe2bda254914729058b5209e04b702afe81565b6102e37f6270edb7c868f86fda4adedba75108201087268ea345934db8bad688e1feb91b81565b61030463152a902d60e11b81565b6103a461039f366004611be2565b61078c565b6040516102ed9190611c67565b6103a46103bf366004611c7a565b6107c7565b6102e37ff0887ba65ee2024ea881d91b74c2450ef19e1557f03bed3ea9f16b037cbe2dc981565b6102e36103f9366004611ce7565b610836565b6102e361040c366004611be2565b61085a565b6102e37fb2e6499345d96e037716d80a8f051a58027e1cff758fee9d8c0e5962739093fd81565b6102e37f5fdbd35e8da83ee755d5e62a539e5ed7f47126abede0b8b10f9ea43dc6eed07f81565b6103a461046d366004611ce7565b610879565b6102e37f1b7b16d47b420cd544637a4b677908a3cb78ab80e6ec01961b34e3f9341a431c81565b6102e37fa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c2177581565b6102e37fbc9ecbac2549f1ca8c3c6bab68fc976b8b7a87f2885e7d9b9841d24b9eb7e04781565b6102e37f0e2d7b14c4519d5ad3f8769d43604f04814bf1a8cec789bdd604eaebe6d918ba81565b6102e37f29a7b54c9b9e97f4b05fe2a20397ff46497367dee25875b7a64afd9a6d3f073b81565b6102e3610543366004611ce7565b6109bd565b6102e37fac4317ad065204c7e47ff7f32fffc3164ed4ea8ff94c4aeb3a03805e8ebc66cf81565b61058261057d366004611d00565b6109f7565b60405190151581526020016102ed565b6103a46105a0366004611d00565b610a8b565b6102e37ff647d384bb32a7fe4b8df7c717daa563ccfcd146bfe3d12d8d0293af1980bfc881565b6102e37fc43c74b0d34a6fbfabf4592afcf3487b8712b1e333c74b94d27064b3bc208e2481565b6102e37f44b6a97d834a9bfb7662b75c503f57331f40641fb9ee522bec507f7ba6a4655c81565b6102e37fa4254a4224c9957c03dbd475df3c1fcd3ae3e540c5b0b78617306d3566e57a4b81565b6102e37fe27592a68a79c541972a95a186227e8435146610cb2d3eb8f8589c9a507d61b281565b610582610676366004611e40565b610ab7565b610582610689366004611d00565b610fd3565b610304636cdb3d1360e11b81565b6103046336372b0760e01b81565b6102e37f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a681565b6106d961102c565b6040516001600160a01b0390911681526020016102ed565b6102e37f94311adc0a0cd4e10be11b23bd4316b8cffa4adf693e8f96f5c075aa439a797281565b6102e37f3c2519c4487d47714872f92cf90a50c25f5deaec2789dc2a497b1272df611db681565b6102e37f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a81565b610582610774366004611d00565b611088565b610582610787366004611f5d565b611151565b606081516000036107c3576107c07f66f0790b1cbe0dcac007f07341b00cafe2bda254914729058b5209e04b702afe610879565b91505b5090565b8051606090156107d857508061082f565b826107e28561179a565b61080b7f94311adc0a0cd4e10be11b23bd4316b8cffa4adf693e8f96f5c075aa439a7972610879565b60405160200161081d9392919061208a565b60405160208183030381529060405290505b9392505050565b6000806108446001436120e3565b9050804061085284826120f6565b949350505050565b8051600090829082036108705750600092915050565b50506020015190565b606060005b60208160ff161080156108b25750828160ff16602081106108a1576108a1612118565b1a60f81b6001600160f81b03191615155b156108c7576108c08161212e565b905061087e565b60008160ff1667ffffffffffffffff8111156108e5576108e5611aad565b6040519080825280601f01601f19166020018201604052801561090f576020820181803683370190505b509050600091505b60208260ff1610801561094b5750838260ff166020811061093a5761093a612118565b1a60f81b6001600160f81b03191615155b1561082f57838260ff166020811061096557610965612118565b1a60f81b818360ff168151811061097e5761097e612118565b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a9053506109b68261212e565b9150610917565b60006109c882610836565b6040516020016109da91815260200190565b604051602081830303815290604052805190602001209050919050565b600080610a2b8460408051808201825260008082526020918201528151808301909252825182529182019181019190915290565b90506000610a608460408051808201825260008082526020918201528151808301909252825182529182019181019190915290565b60208084015184518351928401519394509092610a7e92849161183a565b1415925050505b92915050565b60608282604051602001610aa092919061214d565b604051602081830303815290604052905092915050565b600080610ae96040518060400160405280600e81526020016d050529a2a0a921a424a72397171760911b81525061194b565b6101408301511561085257826101400151600003610b0857905061082f565b60a08301516001600160a01b0316610b2157905061082f565b60c0830151604001516001600160a01b0316610b3e57905061082f565b7fe27592a68a79c541972a95a186227e8435146610cb2d3eb8f8589c9a507d61b28503610baf57600084806020019051810190610b7b919061217c565b60c08501519091506001600160a01b0382169060015b60200201516001600160a01b031603610ba957600191505b50610852565b7f3c2519c4487d47714872f92cf90a50c25f5deaec2789dc2a497b1272df611db68503610c0657600084806020019051810190610bec919061217c565b60c08501519091506001600160a01b038216906000610b91565b7f6270edb7c868f86fda4adedba75108201087268ea345934db8bad688e1feb91b8503610c4357600084806020019051810190610bec919061217c565b7f44b6a97d834a9bfb7662b75c503f57331f40641fb9ee522bec507f7ba6a4655c8503610cd757600084806020019051810190610c80919061217c565b60c0850151602001519091506001600160a01b03808316911603610ca357600191505b60c0840151516001600160a01b03828116911603610cc057600191505b60c08401516001600160a01b038216906002610b91565b7f29a7b54c9b9e97f4b05fe2a20397ff46497367dee25875b7a64afd9a6d3f073b8503610d2c57600084806020019051810190610d149190612199565b90508084610140015103610ba9576001915050610852565b7ff0887ba65ee2024ea881d91b74c2450ef19e1557f03bed3ea9f16b037cbe2dc98503610d6957600084806020019051810190610d149190612199565b7ff647d384bb32a7fe4b8df7c717daa563ccfcd146bfe3d12d8d0293af1980bfc88503610dbf57600084806020019051810190610da69190612199565b9050808461010001511015610ba9576001915050610852565b7fa4254a4224c9957c03dbd475df3c1fcd3ae3e540c5b0b78617306d3566e57a4b8503610e1457600084806020019051810190610dfc9190612199565b90508084610100015103610ba9576001915050610852565b7fac4317ad065204c7e47ff7f32fffc3164ed4ea8ff94c4aeb3a03805e8ebc66cf8503610e6a57600084806020019051810190610e519190612199565b9050808461010001511115610ba9576001915050610852565b7fb2e6499345d96e037716d80a8f051a58027e1cff758fee9d8c0e5962739093fd8503610ec057600084806020019051810190610ea79190612199565b9050808461012001511015610ba9576001915050610852565b7fc43c74b0d34a6fbfabf4592afcf3487b8712b1e333c74b94d27064b3bc208e248503610f1557600084806020019051810190610efd9190612199565b90508084610120015103610ba9576001915050610852565b7f22468b554f8de3f8c7c3e441faddd40dbca3acf65d471cbab7ab89c8cff4287d8503610f6b57600084806020019051810190610f529190612199565b9050808461012001511115610ba9576001915050610852565b7f1b7b16d47b420cd544637a4b677908a3cb78ab80e6ec01961b34e3f9341a431c850361085257600084806020019051810190610fa89190612199565b90508084610100015103610fbb57600191505b8084610120015103610ba95750600195945050505050565b600081604051602001610fe691906121b2565b604051602081830303815290604052805190602001208360405160200161100d91906121b2565b6040516020818303038152906040528051906020012014905092915050565b600030330361108257600080368080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152505050503601516001600160a01b031691506110859050565b50335b90565b8151815160009184918491111561109e57600080fd5b6000805b835183516110b091906120e3565b811161114757600160005b8551811015611125578581815181106110d6576110d6612118565b01602001516001600160f81b031916856110f083866121ce565b8151811061110057611100612118565b01602001516001600160f81b0319161461111d5760009150611125565b6001016110bb565b508015611136576001925050611147565b50611140816121e1565b90506110a2565b5095945050505050565b6000806111836040518060400160405280600e81526020016d050529a2a0a921a424a72397171760911b81525061194b565b6060840151156117915783606001516000036111a0579050610852565b6020840151516001600160a01b03166111ba579050610852565b60408401516001600160a01b03166111d3579050610852565b7ff0887ba65ee2024ea881d91b74c2450ef19e1557f03bed3ea9f16b037cbe2dc9860361123a57600085806020019051810190611210919061217c565b9050806001600160a01b031685600001516001600160a01b03160361123457600191505b50611791565b7f3c2519c4487d47714872f92cf90a50c25f5deaec2789dc2a497b1272df611db686036112bb57600085806020019051810190611277919061217c565b6020860151519091506001600160a01b0380831691160361129757600191505b60208581015101516001600160a01b03828116911603611234576001915050611791565b7f6270edb7c868f86fda4adedba75108201087268ea345934db8bad688e1feb91b8603611321576000858060200190518101906112f8919061217c565b9050806001600160a01b031685604001516001600160a01b031603611234576001915050611791565b7f44b6a97d834a9bfb7662b75c503f57331f40641fb9ee522bec507f7ba6a4655c86036113c65760008580602001905181019061135e919061217c565b9050806001600160a01b031685600001516001600160a01b03160361138257600191505b6020850151516001600160a01b0382811691160361139f57600191505b806001600160a01b031685604001516001600160a01b031603611234576001915050611791565b7f29a7b54c9b9e97f4b05fe2a20397ff46497367dee25875b7a64afd9a6d3f073b860361141a576000858060200190518101906114039190612199565b905080856060015103611234576001915050611791565b7ff0887ba65ee2024ea881d91b74c2450ef19e1557f03bed3ea9f16b037cbe2dc98603611457576000858060200190518101906114039190612199565b7fbc9ecbac2549f1ca8c3c6bab68fc976b8b7a87f2885e7d9b9841d24b9eb7e04786036114af5760008580602001905181019061149491906121fa565b90506114a08482610fd3565b15611234576001915050611791565b7f6270edb7c868f86fda4adedba75108201087268ea345934db8bad688e1feb91b86036114ec5760008580602001905181019061149491906121fa565b7f0e2d7b14c4519d5ad3f8769d43604f04814bf1a8cec789bdd604eaebe6d918ba86036115355760008580602001905181019061152991906121fa565b90506114a084826109f7565b7ff647d384bb32a7fe4b8df7c717daa563ccfcd146bfe3d12d8d0293af1980bfc8860361158a576000858060200190518101906115729190612199565b90508085608001511015611234576001915050611791565b7fa4254a4224c9957c03dbd475df3c1fcd3ae3e540c5b0b78617306d3566e57a4b86036115de576000858060200190518101906115c79190612199565b905080856080015103611234576001915050611791565b7fac4317ad065204c7e47ff7f32fffc3164ed4ea8ff94c4aeb3a03805e8ebc66cf86036116335760008580602001905181019061161b9190612199565b90508085608001511115611234576001915050611791565b7fb2e6499345d96e037716d80a8f051a58027e1cff758fee9d8c0e5962739093fd8603611688576000858060200190518101906116709190612199565b9050808560a001511015611234576001915050611791565b7fc43c74b0d34a6fbfabf4592afcf3487b8712b1e333c74b94d27064b3bc208e2486036116dc576000858060200190518101906116c59190612199565b9050808560a0015103611234576001915050611791565b7f22468b554f8de3f8c7c3e441faddd40dbca3acf65d471cbab7ab89c8cff4287d8603611731576000858060200190518101906117199190612199565b9050808560a001511115611234576001915050611791565b7f1b7b16d47b420cd544637a4b677908a3cb78ab80e6ec01961b34e3f9341a431c86036117915760008580602001905181019061176e9190612199565b90508085608001510361178057600191505b808560a00151036112345760019150505b95945050505050565b606060006117a7836119a6565b600101905060008167ffffffffffffffff8111156117c7576117c7611aad565b6040519080825280601f01601f1916602001820160405280156117f1576020820181803683370190505b5090508181016020015b600019017f3031323334353637383961626364656600000000000000000000000000000000600a86061a8153600a85049450846117fb57509392505050565b60008085841161194157602084116118ed57600084156118855760016118618660206120e3565b61186c906008612268565b611877906002612363565b61188191906120e3565b1990505b835181168561189489896121ce565b61189e91906120e3565b805190935082165b8181146118d8578784116118c05787945050505050610852565b836118ca8161236f565b9450508284511690506118a6565b6118e287856121ce565b945050505050610852565b8383206118fa85886120e3565b61190490876121ce565b91505b85821061193f5784822080820361192c5761192286846121ce565b9350505050610852565b6119376001846120e3565b925050611907565b505b5092949350505050565b6119a38160405160240161195f9190611c67565b60408051601f198184030181529190526020810180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1663104c13eb60e21b179052611a88565b50565b6000807a184f03e93ff9f4daa797ed6e38ed64bf6a1f01000000000000000083106119ef577a184f03e93ff9f4daa797ed6e38ed64bf6a1f010000000000000000830492506040015b6d04ee2d6d415b85acef81000000008310611a1b576d04ee2d6d415b85acef8100000000830492506020015b662386f26fc100008310611a3957662386f26fc10000830492506010015b6305f5e1008310611a51576305f5e100830492506008015b6127108310611a6557612710830492506004015b60648310611a77576064830492506002015b600a8310610a855760010192915050565b6119a38160006a636f6e736f6c652e6c6f679050600080835160208501845afa505050565b634e487b7160e01b600052604160045260246000fd5b604051610180810167ffffffffffffffff81118282101715611ae757611ae7611aad565b60405290565b60405160c0810167ffffffffffffffff81118282101715611ae757611ae7611aad565b6040805190810167ffffffffffffffff81118282101715611ae757611ae7611aad565b604051601f8201601f1916810167ffffffffffffffff81118282101715611b5c57611b5c611aad565b604052919050565b600067ffffffffffffffff821115611b7e57611b7e611aad565b50601f01601f191660200190565b600082601f830112611b9d57600080fd5b8135611bb0611bab82611b64565b611b33565b818152846020838601011115611bc557600080fd5b816020850160208301376000918101602001919091529392505050565b600060208284031215611bf457600080fd5b813567ffffffffffffffff811115611c0b57600080fd5b61085284828501611b8c565b60005b83811015611c32578181015183820152602001611c1a565b50506000910152565b60008151808452611c53816020860160208601611c17565b601f01601f19169290920160200192915050565b60208152600061082f6020830184611c3b565b600080600060608486031215611c8f57600080fd5b83359250602084013567ffffffffffffffff80821115611cae57600080fd5b611cba87838801611b8c565b93506040860135915080821115611cd057600080fd5b50611cdd86828701611b8c565b9150509250925092565b600060208284031215611cf957600080fd5b5035919050565b60008060408385031215611d1357600080fd5b823567ffffffffffffffff80821115611d2b57600080fd5b611d3786838701611b8c565b93506020850135915080821115611d4d57600080fd5b50611d5a85828601611b8c565b9150509250929050565b80357fffffffff0000000000000000000000000000000000000000000000000000000081168114611d9457600080fd5b919050565b80358015158114611d9457600080fd5b6001600160a01b03811681146119a357600080fd5b8035611d9481611da9565b600082601f830112611dda57600080fd5b6040516060810181811067ffffffffffffffff82111715611dfd57611dfd611aad565b604052806060840185811115611e1257600080fd5b845b81811015611e35578035611e2781611da9565b835260209283019201611e14565b509195945050505050565b6000806000838503610200811215611e5757600080fd5b84359350602085013567ffffffffffffffff811115611e7557600080fd5b611e8187828801611b8c565b9350506101c080603f1983011215611e9857600080fd5b611ea0611ac3565b9150611eae60408701611d64565b8252611ebc60608701611d99565b6020830152611ecd60808701611d99565b6040830152611ede60a08701611d99565b6060830152611eef60c08701611d99565b6080830152611f0060e08701611dbe565b60a0830152610100611f1488828901611dc9565b60c08401526101608088013560e0850152610180880135828501526101a0880135610120850152828801356101408501526101e088013581850152505050809150509250925092565b600080600080848603610140811215611f7557600080fd5b8535945060208087013567ffffffffffffffff80821115611f9557600080fd5b611fa18a838b01611b8c565b965060e0603f1985011215611fb557600080fd5b611fbd611aed565b935060408901359150611fcf82611da9565b81845289607f8a0112611fe157600080fd5b611fe9611b10565b91508160a08a018b811115611ffd57600080fd5b60608b015b8181101561202257803561201581611da9565b8552938501938501612002565b5081602087015261203281611dbe565b6040870152505060c0890135606085015260e0890135608085015261010089013560a0850152929450610120880135928084111561206f57600080fd5b50505061207e87828801611b8c565b91505092959194509250565b6000845161209c818460208901611c17565b8451908301906120b0818360208901611c17565b84519101906120c3818360208801611c17565b0195945050505050565b634e487b7160e01b600052601160045260246000fd5b81810381811115610a8557610a856120cd565b60008261211357634e487b7160e01b600052601260045260246000fd5b500690565b634e487b7160e01b600052603260045260246000fd5b600060ff821660ff8103612144576121446120cd565b60010192915050565b6000835161215f818460208801611c17565b835190830190612173818360208801611c17565b01949350505050565b60006020828403121561218e57600080fd5b815161082f81611da9565b6000602082840312156121ab57600080fd5b5051919050565b600082516121c4818460208701611c17565b9190910192915050565b80820180821115610a8557610a856120cd565b6000600182016121f3576121f36120cd565b5060010190565b60006020828403121561220c57600080fd5b815167ffffffffffffffff81111561222357600080fd5b8201601f8101841361223457600080fd5b8051612242611bab82611b64565b81815285602083850101111561225757600080fd5b611791826020830160208601611c17565b8082028115828204841417610a8557610a856120cd565b600181815b808511156122ba5781600019048211156122a0576122a06120cd565b808516156122ad57918102915b93841c9390800290612284565b509250929050565b6000826122d157506001610a85565b816122de57506000610a85565b81600181146122f457600281146122fe5761231a565b6001915050610a85565b60ff84111561230f5761230f6120cd565b50506001821b610a85565b5060208310610133831016604e8410600b841016171561233d575081810a610a85565b612347838361227f565b806000190482111561235b5761235b6120cd565b029392505050565b600061082f83836122c2565b60008161237e5761237e6120cd565b50600019019056fea2646970667358221220571a1a67df1febfd54e8c361e110271d75ed269e0152fa8ba2b6eb2cec0bf29464736f6c63430008160033";

type SnippetsConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: SnippetsConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Snippets__factory extends ContractFactory {
  constructor(...args: SnippetsConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(overrides || {});
  }
  override deploy(overrides?: NonPayableOverrides & { from?: string }) {
    return super.deploy(overrides || {}) as Promise<
      Snippets & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): Snippets__factory {
    return super.connect(runner) as Snippets__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): SnippetsInterface {
    return new Interface(_abi) as SnippetsInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): Snippets {
    return new Contract(address, _abi, runner) as unknown as Snippets;
  }
}