ENFTIS Marketplace
==================

ENFTIS Marketplace is a platform that allows users to buy, sell, and create non-fungible tokens (NFTs), which are unique and indivisible digital assets that represent ownership of something, such as art, music, or collectibles. NFTs are powered by smart contracts, which are self-executing agreements that run on the Ethereum blockchain and enforce the rules and logic for the NFT transactions.

The NFT Marketplace that you have developed uses Solidity, a high-level programming language that is designed for writing smart contracts on Ethereum. You have also used the OpenZeppelin Contracts library, which provides a set of secure and well-tested implementations of the most common ERC standards for NFTs, such as ERC721 and ERC1155.

ERC721 is the de-facto standard for NFTs, which allows each token to have its own unique ID and metadata. ERC721 tokens are suitable for representing scarce and distinct assets, such as digital art or game items. ERC1155 is a newer and more flexible standard that allows a single smart contract to manage multiple types of tokens, both fungible and non-fungible. ERC1155 tokens can have different supply and transfer rules, and can also share common data to reduce storage costs.

Unique Features:
----------------

By extending the native OpenZeppelin tokens, you have added some unique features to your NFT Marketplace, such as:

*   High security: You have inherited the security and quality guarantees of the OpenZeppelin Contracts, which have been audited and tested by the community. You have also followed the best practices and recommendations for writing secure and reliable smart contracts in Solidity.
*   Low gas fees: You have optimized the gas consumption of your smart contracts by using efficient data structures, minimizing storage operations, and implementing the ERC165 interface for dynamic interface detection. You have also used the EIP-2309 standard for batch minting of NFTs, which reduces the number of transactions and events required to create multiple tokens at once.
*   High customizability: You have enabled the customization of your NFTs by allowing users to define their own token name, symbol, base URI, and metadata. You have also implemented the ERC2981 standard for NFT royalties, which allows the original creators of the NFTs to receive a percentage of the sales revenue every time their tokens are sold or transferred.
*   Advanced auction system: You have implemented a sealed-bid auction system for your NFT Marketplace, which allows users to bid for NFTs without revealing their identity or bid price until the auction ends. You have also used the Chainlink oracle service to provide a reliable and decentralized source of randomness for selecting the winner of the auction. You have also used the Bulletproofs zero-knowledge proof protocol to verify the validity and quality of the NFTs without disclosing any confidential information.
*   Onchain search capabilities: You have implemented a search function for your NFT Marketplace, which allows users to find and filter NFTs based on various criteria, such as price, category, or popularity. You have also used the Pedersen commitment algorithm to hide the actual values of the search parameters, while still allowing the smart contract to compare and sort them. This way, you have preserved the privacy and security of the users and the NFTs.

Innovation on the ERC721 and ERC1155
------------------------------------

ERC721 and ERC1155 are two popular standards for creating and managing non-fungible tokens (NFTs) on the Ethereum blockchain. NFTs are unique and indivisible digital assets that represent ownership of something, such as art, music, or collectibles. ERC721 and ERC1155 have some common features, such as the ability to store metadata, transfer tokens, and query balances, but they also have some differences, such as the level of fungibility, efficiency, and flexibility.

Many innovations can be extended on the ERC721 and ERC1155 standards, using the latest technology trends. Some of these innovations are:

*   On-chain metadata: This is a technique that allows storing the data and images of the NFTs directly on the blockchain, instead of relying on external sources, such as IPFS or AWS. This ensures the immutability, availability, and performance of the NFTs, as well as reduces the storage costs and complexity. On-chain metadata can also enable dynamic and interactive NFTs, such as generative art, games, or music, that can change based on various factors, such as time, randomness, or user input.
*   Programmable royalties: This is a feature that allows the original creators of the NFTs to receive a percentage of the sales revenue every time their tokens are sold or transferred. This creates a sustainable and fair income stream for the creators, as well as incentivizes the quality and innovation of the NFTs. Programmable royalties can also be customized and enforced on-chain, using smart contracts and zero-knowledge proofs, to ensure the compliance and transparency of the payments.
*   Custom on-chain avatar, banner, description, and security features: This is a way of personalizing and securing the NFT collections, by allowing the users to define their own token name, symbol, base URI, and metadata. The users can also create and manage their own wallets, which store their NFTs and cryptocurrencies, such as Ethereum or Bitcoin. The users can also use various security features, such as encryption, authentication, backup, and recovery, to protect their assets and identity. Onchain data is stored on L2 chains for cheap gas fees. Data being able to be retrieved using APIS.
*   Cross-chain interoperability: This is a capability that allows the NFTs to be transferred and used across different blockchains, such as Ethereum, Solana, Polygon, or Bitcoin. This enables the users to access a wider range of NFT markets, platforms, and services, as well as to benefit from the features and advantages of each blockchain, such as scalability, security, and innovation. Cross-chain interoperability can also facilitate the creation and exchange of hybrid NFTs, which combine the attributes and functions of different types of tokens, such as fungible, non-fungible, and semi-fungible.

These are some of the examples of how the ERC721 and ERC1155 standards can be extended and improved, using the latest technology trends. There are many more possibilities and opportunities for innovation and experimentation in the NFT ecosystem, as the technology and the market evolve.

---

# Advanced Sample Hardhat Project

This project demonstrates an advanced Hardhat use case, integrating other tools commonly used alongside Hardhat in the ecosystem.

The project comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts. It also comes with a variety of other tools, preconfigured to work with the project code.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
npx hardhat help
REPORT_GAS=true npx hardhat test
npx hardhat coverage
npx hardhat run scripts/deploy.js
node scripts/deploy.js
npx eslint '**/*.js'
npx eslint '**/*.js' --fix
npx prettier '**/*.{json,sol,md}' --check
npx prettier '**/*.{json,sol,md}' --write
npx solhint 'contracts/**/*.sol'
npx solhint 'contracts/**/*.sol' --fix
```

# Etherscan verification

To try out Etherscan verification, you first need to deploy a contract to an Ethereum network that's supported by Etherscan, such as Ropsten.

In this project, copy the .env.example file to a file named .env, and then edit it to fill in the details. Enter your Etherscan API key, your Ropsten node URL (eg from Alchemy), and the private key of the account which will send the deployment transaction. With a valid .env file in place, first deploy your contract:

```shell
hardhat run --network ropsten scripts/deploy.js
```

Then, copy the deployment address and paste it in to replace `DEPLOYED_CONTRACT_ADDRESS` in this command:

```shell
npx hardhat verify --network ropsten DEPLOYED_CONTRACT_ADDRESS "Hello, Hardhat!"
```
