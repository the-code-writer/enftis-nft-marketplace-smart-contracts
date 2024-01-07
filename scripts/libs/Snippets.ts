import { ethers } from "hardhat";
const path = require("path");

const Snippets = {
  ERC20INTERFACE:"0x36372b07",
  ERC721INTERFACE:"0x80ac58cd",
  ERC1155INTERFACE:"0xd9b67a26",
  ERC2981INTERFACE:"0x2a55205a",
  DEFAULT_ROLE:
    "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6",
  ADMIN_ROLE:
    "0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775",
  MINTER_ROLE:
    "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6",
  INSUFFICIENT_PERMISSIONS:
    "0xdb8ecf91f7fb45f19c7705fc675a1a92284efc9e6304c32b842093cc66a9dc09",
  NOT_APPROVED_OWNER:
    "0x7aea2a5a54ade2c7d5177326e7a3070116c6f0c0e0e2c8e4979c1a8643ecb26c",
  NO_ADMINS_SPECIFIED:
    "0x94a878f488b402745116100074a492c72c3221a277262ef976a0007ead250981",
  NO_MINTERS_SPECIFIED:
    "0xbf8cb79a39bb793e84d2e97ae1406af328da3f623c7688fc6a7ab735c1b165de",
  MAX_SUPPLY_REACHED:
    "0xf7cdaa469931e3108134377723e8da207dac8d0bb6a5e4bf593d544bbef723a2",
  INDEX_OUT_OF_BOUNDS:
    "0x7ba4dc8f715496ea115fdbd0a2da65e0665096c909392fefbfb708035bd62915",
  AMOUNT_BELOW_MINTING_FEE:
    "0xc4cb8fb7b1a67482de901cc9aac777eef40e2b59fe11c7aa102d3bf285ff4340",
  TOKEN_DOES_NOT_EXISTS:
    "0xfa21d81135d602cbdd6d6eba32f113725ff3cf3482deca5b7e42e431627ab4bc",
  TOKEN_URI_EXISTS:
    "0x7224d0b24cbe51460a003681be787a3532eb2369489536477f0d269f69978a94",
  ZERO_ADDRESS_PROVIDED:
    "0x71869b3729b99fadce3ee30cb1aa2a0d639e6a2d24158c1ae1ae0059e81b72af",
  INVALID_CALLER:
    "0x4f1f4510b69fad6299ff39d382e74059b0940bed8ddd501bdf0a8ef73b144adc",
  INVALID_AMOUNT:
    "0xeb6dbbf3194e9f4dd39c8dabe51ddb59ca6ad00c50b1bc74675ce4b263687722",
  ROYALTIES_DISABLED:
    "0xf9ed19e2bd8e74aca1a3f3ee0c07c1469744d94aee20b4891331b7d4dd77f22c",
  NOT_APPROVED_OR_OWNER: "NOT_APPROVED_OR_OWNER",
  OWNER: "0x6270edb7c868f86fda4adedba75108201087268ea345934db8bad688e1feb91b",
  MINTER: "0xf0887ba65ee2024ea881d91b74c2450ef19e1557f03bed3ea9f16b037cbe2dc9",
  CREATOR: "0x3c2519c4487d47714872f92cf90a50c25f5deaec2789dc2a497b1272df611db6",
  CREATED: "0x09ddea8cc7bb8763f501e1101b83d1f724d14016aa7cdef5f09ab85743ee0fad",
  CREATED_AT:
    "0xa4254a4224c9957c03dbd475df3c1fcd3ae3e540c5b0b78617306d3566e57a4b",
  CREATED_BEFORE:
    "0xf647d384bb32a7fe4b8df7c717daa563ccfcd146bfe3d12d8d0293af1980bfc8",
  CREATED_AFTER:
    "0xac4317ad065204c7e47ff7f32fffc3164ed4ea8ff94c4aeb3a03805e8ebc66cf",
  UPDATED: "0x785d4e53f6caa98bae956367b0c04e9178ed4fe6b5e55204288a54d81e04b3fb",
  UPDATED_AT:
    "0xc43c74b0d34a6fbfabf4592afcf3487b8712b1e333c74b94d27064b3bc208e24",
  UPDATED_BEFORE:
    "0xb2e6499345d96e037716d80a8f051a58027e1cff758fee9d8c0e5962739093fd",
  UPDATED_AFTER:
    "0x22468b554f8de3f8c7c3e441faddd40dbca3acf65d471cbab7ab89c8cff4287d",
  TIMESTAMP:
    "0x1b7b16d47b420cd544637a4b677908a3cb78ab80e6ec01961b34e3f9341a431c",
  UINT256: "0xf0887ba65ee2024ea881d91b74c2450ef19e1557f03bed3ea9f16b037cbe2dc9",
  STRING: "0x0e2d7b14c4519d5ad3f8769d43604f04814bf1a8cec789bdd604eaebe6d918ba",
  ADDRESS: "0x44b6a97d834a9bfb7662b75c503f57331f40641fb9ee522bec507f7ba6a4655c",
  TOKEN_URI:
    "0xbc9ecbac2549f1ca8c3c6bab68fc976b8b7a87f2885e7d9b9841d24b9eb7e047",
  TOKEN_ID:
    "0x29a7b54c9b9e97f4b05fe2a20397ff46497367dee25875b7a64afd9a6d3f073b",
  ZERO_ADDRESS: ethers.ZeroAddress,
  HASH_ZERO: ethers.ZeroHash,
  ethersToWei: (value: any) => {
    return ethers.parseEther(value.toString());
  },
  weiToEthers: (value: any) => {
    return ethers.formatEther(value);
  },

  fromBytes32ToString: (_bytes32: any) => {
    return ethers.decodeBytes32String(_bytes32);
  },
  fromStringToBytes32: (_string: any) => {
    return ethers.encodeBytes32String(_string);
  },
  getProposalState: (_proposalState: number) => {
    let _state: string;

    //Pending, Active, Canceled, Defeated, Succeeded, Queued, Expired, Executed

    switch (_proposalState) {
      case 0: {
        _state = "PENDING";
        break;
      }

      case 1: {
        _state = "ACTIVE";
        break;
      }

      case 2: {
        _state = "CANCELLED";
        break;
      }

      case 3: {
        _state = "DEFEATED";
        break;
      }

      case 4: {
        _state = "SUCCEEDED";
        break;
      }

      case 5: {
        _state = "QUEUED";
        break;
      }

      case 6: {
        _state = "EXPIRED";
        break;
      }

      case 7: {
        _state = "EXECUTED";
        break;
      }

      default: {
        _state = "UNKNOWN";
        break;
      }
    }

    return _state;
  },
  parseNFTItem: (_nftTurple: any) => {
    return _nftTurple.nftItem;
  },
  parseMarketItem: (_itemTurple: any) => {
    return _itemTurple;
  },
  saveFrontendFiles: (token: any, tokenName: string) => {
    const fs = require("fs");
    const contractsDir = path.join(
      __dirname,
      "../../..",
      "frontend",
      "src",
      "contracts"
    );

    console.log("Copying from Contracts Dir:", contractsDir);

    if (!fs.existsSync(contractsDir)) {
      fs.mkdirSync(contractsDir);
    }

    const contractAddressConfig: any = new Object();

    contractAddressConfig[tokenName] = token.address;

    fs.writeFileSync(
      path.join(contractsDir, `${tokenName}ContractAddress.json`),
      JSON.stringify(contractAddressConfig, undefined, 2)
    );

    const TokenArtifact = artifacts.readArtifactSync(tokenName);

    fs.writeFileSync(
      path.join(contractsDir, `${tokenName}.json`),
      JSON.stringify(TokenArtifact, null, 2)
    );
  },
  sleep: (seconds: number) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(seconds), seconds * 1000);
    });
  },
  createArray: (offset: number, length: number) => {
    return Array.from({ length: length }, (_, i) => i + offset);
  }
};

module.exports = Snippets;
