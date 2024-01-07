// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
pragma experimental ABIEncoderV2;

/*

============
Snippets.sol
============

name        :   Enftis NFT Factory Token
symbol      :   ENFTIS
tokenTypes  :   ERC721, ERC165, ERC2968
maxSupply   :   uint256.max()
solhcVersion:   0.8.20
version     :   1.0.0
released    :   25 March 2023
developers  :   @enftix
license     :   MIT License
networks    :   ethereum, polygon, binance

*/

import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/interfaces/IERC721.sol";
import "@openzeppelin/contracts/interfaces/IERC1155.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "hardhat/console.sol";

import "./Structs.sol";
import "./Errors.sol";
import "./Enums.sol";

library Snippets {

    using Math for uint256;

    using Strings for *;

    using Structs for *;
    using Errors for *;
    using Enums for *;

    using console for *;

    /********************************** Constants *********************************/

    bytes4 public constant ERC20INTERFACE = bytes4(type(IERC20).interfaceId);
    bytes4 public constant ERC721INTERFACE = bytes4(type(IERC721).interfaceId);
    bytes4 public constant ERC1155INTERFACE = bytes4(type(IERC1155).interfaceId);
    bytes4 public constant ERC2981INTERFACE = bytes4(type(IERC2981).interfaceId);

    /// Admin Role that can manage contract options
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    /// Minter Role that can start sales and mint nfts
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    bytes32 public constant SNAPSHOT_ROLE = keccak256("SNAPSHOT_ROLE");

    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    /// Owner data key
    bytes32 public constant OWNER = keccak256("OWNER");
    /// Minter data key
    bytes32 public constant MINTER = keccak256("MINTER");
    /// Seller data key
    bytes32 public constant SELLER = keccak256("SELLER");
    /// Creator data key
    bytes32 public constant CREATOR = keccak256("CREATOR");
    /// Owner data key
    bytes32 public constant CREATED_AT = keccak256("CREATED_AT");
    /// Owner data key
    bytes32 public constant CREATED_BEFORE = keccak256("CREATED_BEFORE");
    /// Owner data key
    bytes32 public constant CREATED_AFTER = keccak256("CREATED_AFTER");
    /// Owner data key
    bytes32 public constant UPDATED_AT = keccak256("UPDATED_AT");
    /// Owner data key
    bytes32 public constant UPDATED_BEFORE = keccak256("UPDATED_BEFORE");
    /// Owner data key
    bytes32 public constant UPDATED_AFTER = keccak256("UPDATED_AFTER");
    /// Owner data key
    bytes32 public constant TIMESTAMP = keccak256("TIMESTAMP");
    /// Owner data key
    bytes32 public constant UINT256 = keccak256("MINTER");
    /// Owner data key
    bytes32 public constant STRING = keccak256("STRING");
    /// Owner data key
    bytes32 public constant ADDRESS = keccak256("ADDRESS");
    /// Owner data key
    bytes32 public constant TOKEN_URI = keccak256("TOKEN_URI");
    /// Owner data key
    bytes32 public constant TOKEN_ID = keccak256("TOKEN_ID");

    bytes32 public constant IPFS_PREFIX = keccak256("ipfs://");

    bytes32 public constant BASE_EXTENSION = keccak256(".json");

    function getBaseURI(string memory baseURI) public pure returns (string memory) {
        
        // If there is no baseURI URI, default to "ipfs://" or return the token URI.
        if (bytes(baseURI).length == 0) {
            baseURI = bytes32String(IPFS_PREFIX);
        }

        return baseURI;

    }

    function getTokenURIFromURI(
        string memory baseURI,
        string memory _tokenURI
    ) public pure returns (
        string memory
    ) {
        return string(
                abi.encodePacked(
                    baseURI,
                    _tokenURI
                )
            );
    }

    function getTokenURIFromID(
        uint256 tokenId,
        string memory baseURI,
        string memory tokenURI
    ) public pure returns (
        string memory
    ) {

        if(bytes(tokenURI).length > 0){

            return tokenURI;

        }else{

            return string(
                abi.encodePacked(baseURI,Strings.toString(tokenId),bytes32String(BASE_EXTENSION))
            );

        }

    }

    /**
     * @dev This seems to be the best way to compare strings in Solidity
     */
    function compareStrings(
        string memory a,
        string memory b
    ) public pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) ==
            keccak256(abi.encodePacked((b))));
    }

    function stringLength(
        string memory str
    ) internal pure returns (uint length) {

        uint i = 0;
        bytes memory string_rep = bytes(str);

        while (i < string_rep.length) {
            if (string_rep[i] >> 7 == 0) ++i;
            else if (string_rep[i] >> 5 == bytes1(uint8(0x6))) i += 2;
            else if (string_rep[i] >> 4 == bytes1(uint8(0xE))) i += 3;
            else if (string_rep[i] >> 3 == bytes1(uint8(0x1E)))
                i += 4;
                //For safety
            else ++i;

            ++length;
        }
    }

    function stringContains (string memory what, string memory where) public pure returns (bool) {

        bytes memory whatBytes = bytes (what);
        bytes memory whereBytes = bytes (where);
        require(whereBytes.length >= whatBytes.length);
        bool found = false;
        for (uint i = 0; i <= whereBytes.length - whatBytes.length; ++i) {
            bool flag = true;
            for (uint j = 0; j < whatBytes.length; ++j)
                if (whereBytes [i + j] != whatBytes [j]) {
                    flag = false;
                    break;
                }
            if (flag) {
                found = true;
                break;
            }
        }
        return found;
    }

    struct slice {
        uint _len;
        uint _ptr;
    }

    /*
     * @dev Returns a slice containing the entire string.
     * @param self The string to make a slice from.
     * @return A newly allocated slice containing the entire string.
     */
    function toSlice(string memory self) internal pure returns (slice memory) {
        uint ptr;
        assembly {
            ptr := add(self, 0x20)
        }
        return slice(bytes(self).length, ptr);
    }

    // Returns the memory address of the first byte after the last occurrence of
    // `needle` in `self`, or the address of `self` if not found.
    function rfindPtr(uint selflen, uint selfptr, uint needlelen, uint needleptr) private pure returns (uint) {
        uint ptr;

        if (needlelen <= selflen) {
            if (needlelen <= 32) {
                bytes32 mask;
                if (needlelen > 0) {
                    mask = bytes32(~(2 ** (8 * (32 - needlelen)) - 1));
                }

                bytes32 needledata;
                assembly { needledata := and(mload(needleptr), mask) }

                ptr = selfptr + selflen - needlelen;
                bytes32 ptrdata;
                assembly { ptrdata := and(mload(ptr), mask) }

                while (ptrdata != needledata) {
                    if (ptr <= selfptr)
                        return selfptr;
                    ptr--;
                    assembly { ptrdata := and(mload(ptr), mask) }
                }
                return ptr + needlelen;
            } else {
                // For long needles, use hashing
                bytes32 hash;
                assembly { hash := keccak256(needleptr, needlelen) }
                ptr = selfptr + (selflen - needlelen);
                while (ptr >= selfptr) {
                    bytes32 testHash;
                    assembly { testHash := keccak256(ptr, needlelen) }
                    if (hash == testHash)
                        return ptr + needlelen;
                    ptr -= 1;
                }
            }
        }
        return selfptr;
    }

    /*
     * @dev Returns True if `self` contains `needle`.
     * @param self The slice to search.
     * @param needle The text to search for in `self`.
     * @return True if `needle` is found in `self`, false otherwise.
     */
    function searchString(string memory _self, string memory _needle) public pure returns (bool) {

        slice memory self = toSlice(_self);

        slice memory needle = toSlice(_needle);

        return rfindPtr(self._len, self._ptr, needle._len, needle._ptr) != self._ptr;
    }

    /**
     * @dev Search NFTs using a set of key value pair
     * @param _itemKey The NFT key to validate the query against.
     * @param _data The data holds the encoded params to use in the query
     * @param _nftItem The id of the token to perform a query on
     * @return _match An array of NFTItems returned from the search query.
     *
     */
    function searchHasMatch(
        bytes32 _itemKey,
        bytes memory _data,
        Structs.NFTItem memory _nftItem,
        string memory _tokenURIString
    ) public pure returns (bool) {

        bool _match;

        console.log("\n\nSEARCHING...");

        if (_nftItem.tokenId != 0) {

            // If the token id is zero, thats an invalid token, continue ...
            if (_nftItem.tokenId == 0) {
                return _match;
            }

            // If the creator address is a zero address, thats an invalid token, continue ...
            if (_nftItem.creatorAddress[0] == address(0)) {
                return _match;
            }

            // If the owner address is a zero address, thats an invalid token, continue ...
            if (_nftItem.ownerAddress == address(0)) {
                return _match;
            }

            // If the key is minter, get the token minter address
            if (_itemKey == Snippets.MINTER) {
                address _account = abi.decode(_data, (address));

                if (_nftItem.minterAddress == _account) {
                    _match = true;
                }
            }
            // If the key is creator, get the token creator address
            else if (_itemKey == Snippets.CREATOR) {
                address _account = abi.decode(_data, (address));

                if (_nftItem.creatorAddress[0] == _account) {
                    _match = true;
                }
                
                if (_nftItem.creatorAddress[1] == _account) {
                    _match = true;
                }
                
            }
            // If the key is owner, get the token owner address
            else if (_itemKey == Snippets.OWNER) {
                address _account = abi.decode(_data, (address));

                if (_nftItem.ownerAddress == _account) {
                    _match = true;
                }
            }
            // If the key is address, search any address property
            else if (_itemKey == Snippets.ADDRESS) {
                // Decode an address from the abi encded data
                address _account = abi.decode(_data, (address));

                // Check if the address is the same as the minter
                if (_nftItem.minterAddress == _account) {
                    _match = true;
                }

                // Check if the address is the same as the creator
                if (_nftItem.creatorAddress[0] == _account) {
                    _match = true;
                }

                // Check if the address is the same as the owner
                if (_nftItem.ownerAddress == _account) {
                    _match = true;
                }
            }
            // If the key is token_id, search the tokenId property
            else if (_itemKey == Snippets.TOKEN_ID) {
                uint256 _id = abi.decode(_data, (uint256));

                if (_nftItem.tokenId == _id) {
                    _match = true;
                }
            }
            // If the key is uint256, search the tokenId property
            else if (_itemKey == Snippets.UINT256) {
                uint256 _uint256 = abi.decode(_data, (uint256));

                if (_nftItem.tokenId == _uint256) {
                    _match = true;
                }
            }
            // If the key is token_uri, search the tokenURI property
            else if (_itemKey == Snippets.TOKEN_URI) {
                string memory _tokenURIStr = abi.decode(_data, (string));

                if (compareStrings(_tokenURIString, _tokenURIStr)) {
                    _match = true;
                }
            }
            // If the key is bytes, search the tokenURI property
            else if (_itemKey == Snippets.OWNER) {
                string memory _bytes = abi.decode(_data, (string));

                if (compareStrings(_tokenURIString, _bytes)) {
                    _match = true;
                }
            }
            // If the key is string, search the tokenURI property
            else if (_itemKey == Snippets.STRING) {
                string memory _string = abi.decode(_data, (string));

                if( searchString(_tokenURIString, _string) ){
                    _match = true;
                }
            }
            // If the key is created_before, search using the timestamp
            else if (_itemKey == Snippets.CREATED_BEFORE) {
                uint256 _timestamp = abi.decode(_data, (uint256));
                
                if (_nftItem.createdAt < _timestamp) {
                    _match = true;
                }
            }
            // If the key is created_at, search using the timestamp
            else if (_itemKey == Snippets.CREATED_AT) {
                uint256 _timestamp = abi.decode(_data, (uint256));

                if (_nftItem.createdAt == _timestamp) {
                    _match = true;
                }
            }
            // If the key is created_after, search using the timestamp
            else if (_itemKey == Snippets.CREATED_AFTER) {
                uint256 _timestamp = abi.decode(_data, (uint256));

                if (_nftItem.createdAt > _timestamp) {
                    _match = true;
                }
            }
            // If the key is updated_before, search using the timestamp
            else if (_itemKey == Snippets.UPDATED_BEFORE) {
                uint256 _timestamp = abi.decode(_data, (uint256));

                if (_nftItem.updatedAt < _timestamp) {
                    _match = true;
                }
            }
            // If the key is updated_at, search using the timestamp
            else if (_itemKey == Snippets.UPDATED_AT) {
                uint256 _timestamp = abi.decode(_data, (uint256));

                if (_nftItem.updatedAt == _timestamp) {
                    _match = true;
                }
            }
            // If the key is updated_after, search using the timestamp
            else if (_itemKey == Snippets.UPDATED_AFTER) {
                uint256 _timestamp = abi.decode(_data, (uint256));

                if (_nftItem.updatedAt > _timestamp) {
                    _match = true;
                }
            }
            // If the key is timestamp, search using the timestamp
            else if (_itemKey == Snippets.TIMESTAMP) {
                uint256 _timestamp = abi.decode(_data, (uint256));

                if (_nftItem.createdAt == _timestamp) {
                    _match = true;
                }

                if (_nftItem.updatedAt == _timestamp) {
                    _match = true;
                }
            }
            // Can't do anything beyond this point
            else {
                // Do nothing
            }
        }

        return _match;

    }

    /**
     * @dev Search NFTs using a set of key value pair
     * @param _itemKey The NFT key to validate the query against.
     * @param _data The data holds the encoded params to use in the query
     * @param _nftItem The id of the token to perform a query on
     * @return _match An array of NFTItems returned from the search query.
     *
     */
    function searchNFTMarketItemHasMatch(
        bytes32 _itemKey,
        bytes memory _data,
        Structs.NFTMarketItem memory _nftItem
    ) public pure returns (bool) {

        bool _match;

        console.log("\n\nSEARCHING...");

        if (_nftItem.tokenId != 0) {

            // If the token id is zero, thats an invalid token, continue ...
            if (_nftItem.tokenId == 0) {
                return _match;
            }
  
            // If the creator address is a zero address, thats an invalid token, continue ...
            if (_nftItem.tokenContractAddress == address(0)) {
                return _match;
            }

            // If the owner address is a zero address, thats an invalid token, continue ...
            if (_nftItem.creatorSellerOwner[2] == address(0)) {
                return _match;
            }

            // If the key is minter, get the token minter address
            if (_itemKey == Snippets.SELLER) {
                address _account = abi.decode(_data, (address));

                if (_nftItem.creatorSellerOwner[1] == _account) {
                    _match = true;
                }
            }
            // If the key is creator, get the token creator address
            else if (_itemKey == Snippets.CREATOR) {
                address _account = abi.decode(_data, (address));

                if (_nftItem.creatorSellerOwner[0] == _account) {
                    _match = true;
                }
                
            }
            // If the key is owner, get the token owner address
            else if (_itemKey == Snippets.OWNER) {
                address _account = abi.decode(_data, (address));

                if (_nftItem.creatorSellerOwner[0] == _account) {
                    _match = true;
                }
            }
            // If the key is address, search any address property
            else if (_itemKey == Snippets.ADDRESS) {
                // Decode an address from the abi encded data
                address _account = abi.decode(_data, (address));

                // Check if the address is the same as the minter
                if (_nftItem.creatorSellerOwner[1] == _account) {
                    _match = true;
                }

                // Check if the address is the same as the creator
                if (_nftItem.creatorSellerOwner[0] == _account) {
                    _match = true;
                }

                // Check if the address is the same as the owner
                if (_nftItem.creatorSellerOwner[2] == _account) {
                    _match = true;
                }
            }
            // If the key is token_id, search the tokenId property
            else if (_itemKey == Snippets.TOKEN_ID) {
                uint256 _id = abi.decode(_data, (uint256));

                if (_nftItem.tokenId == _id) {
                    _match = true;
                }
            }
            // If the key is uint256, search the tokenId property
            else if (_itemKey == Snippets.UINT256) {
                uint256 _uint256 = abi.decode(_data, (uint256));

                if (_nftItem.tokenId == _uint256) {
                    _match = true;
                }
            }
            // If the key is created_before, search using the timestamp
            else if (_itemKey == Snippets.CREATED_BEFORE) {
                uint256 _timestamp = abi.decode(_data, (uint256));
                
                if (_nftItem.createdAt < _timestamp) {
                    _match = true;
                }
            }
            // If the key is created_at, search using the timestamp
            else if (_itemKey == Snippets.CREATED_AT) {
                uint256 _timestamp = abi.decode(_data, (uint256));

                if (_nftItem.createdAt == _timestamp) {
                    _match = true;
                }
            }
            // If the key is created_after, search using the timestamp
            else if (_itemKey == Snippets.CREATED_AFTER) {
                uint256 _timestamp = abi.decode(_data, (uint256));

                if (_nftItem.createdAt > _timestamp) {
                    _match = true;
                }
            }
            // If the key is updated_before, search using the timestamp
            else if (_itemKey == Snippets.UPDATED_BEFORE) {
                uint256 _timestamp = abi.decode(_data, (uint256));

                if (_nftItem.updatedAt < _timestamp) {
                    _match = true;
                }
            }
            // If the key is updated_at, search using the timestamp
            else if (_itemKey == Snippets.UPDATED_AT) {
                uint256 _timestamp = abi.decode(_data, (uint256));

                if (_nftItem.updatedAt == _timestamp) {
                    _match = true;
                }
            }
            // If the key is updated_after, search using the timestamp
            else if (_itemKey == Snippets.UPDATED_AFTER) {
                uint256 _timestamp = abi.decode(_data, (uint256));

                if (_nftItem.updatedAt > _timestamp) {
                    _match = true;
                }
            }
            // If the key is timestamp, search using the timestamp
            else if (_itemKey == Snippets.TIMESTAMP) {
                uint256 _timestamp = abi.decode(_data, (uint256));

                if (_nftItem.createdAt == _timestamp) {
                    _match = true;
                }

                if (_nftItem.updatedAt == _timestamp) {
                    _match = true;
                }
            }
            // Can't do anything beyond this point
            else {
                // Do nothing
            }

        }

        return _match;

    }

    function bytes32String(bytes32 _bytes32) public pure returns (string memory) {
        uint8 i;
        while(i < 32 && _bytes32[i] != 0) {
            ++i;
        }
        bytes memory bytesArray = new bytes(i);
        for (i = 0; i < 32 && _bytes32[i] != 0; ++i) {
            bytesArray[i] = _bytes32[i];
        }
        return string(bytesArray);
    }

    function stringBytes32(string memory source) public pure returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }

        assembly {
            result := mload(add(source, 32))
        }
    }

    function msgSender()
        public
        view
        returns (address payable sender)
    {
        if (msg.sender == address(this)) {
            bytes memory array = msg.data;
            uint256 index = msg.data.length;
            assembly {
                // Load the 32 bytes word from memory with the address on the lower 20 bytes, and mask those.
                sender := and(
                    mload(add(array, index)),
                    0xffffffffffffffffffffffffffffffffffffffff
                )
            }
            delete array;
            delete index;
        } else {
            sender = payable(msg.sender);
        }
        return sender;
    }

    function generateRandomNumber(uint256 seed) public view returns (uint256) {
        uint256 blockNumber = block.number - 1; // Use the previous block's hash
        bytes32 blockHash = blockhash(blockNumber);
        return uint256(blockHash) % seed;
    }

    function generateRandomHash(uint256 seed) public view returns (bytes32) {
        return keccak256(abi.encodePacked(generateRandomNumber(seed)));
    }

    /**
     * @dev Returns the addition of two unsigned integers, with an overflow flag.
     */
    function mathAdd(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 answer;
        (bool success1, uint256 add1) = Math.tryAdd(a, b);
        if(success1){
            answer = add1;
        }
        return answer;
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, with an overflow flag.
     */
    function mathSub(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 answer;
        (bool success1, uint256 add1) = Math.trySub(a, b);
        if(success1){
            answer = add1;
        }
        return answer;
    }

    /**
     * @dev Returns the multiplication of two unsigned integers, with an overflow flag.
     */
    function mathMul(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 answer;
        (bool success1, uint256 add1) = Math.tryMul(a, b);
        if(success1){
            answer = add1;
        }
        return answer;
    }

    /**
     * @dev Returns the division of two unsigned integers, with an overflow flag.
     */
    function mathDiv(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 answer;
        (bool success1, uint256 add1) = Math.tryDiv(a, b);
        if(success1){
            answer = add1;
        }
        return answer;
    }

    /**
     * @dev Returns the addition of three unsigned integers, with an overflow flag.
     */
    function mathAddAdd(uint256 a, uint256 b, uint256 c) internal pure returns (uint256) {
        uint256 answer;
        (bool success1, uint256 add1) = Math.tryAdd(a, b);
        if(success1){
            (bool success2, uint256 add2) = Math.tryAdd(add1, c);
            if(success2){
                answer = add2;
            }
        }
        return answer;
    }

    /**
     * @dev Returns the addition and subtraction of three unsigned integers, with an overflow flag.
     */
    function mathAddSub(uint256 a, uint256 b, uint256 c) internal pure returns (uint256) {
        uint256 answer;
        (bool success1, uint256 add1) = Math.tryAdd(a, b);
        if(success1){
            (bool success2, uint256 sub) = Math.trySub(add1, c);
            if(success2){
                answer = sub;
            }
        }
        return answer;
    }

    /**
     * @dev Returns the addition and multiplication of three unsigned integers, with an overflow flag.
     */
    function mathAddMul(uint256 a, uint256 b, uint256 c) internal pure returns (uint256) {
        uint256 answer;
        (bool success1, uint256 add1) = Math.tryAdd(a, b);
        if(success1){
            (bool success2, uint256 mul) = Math.tryMul(add1, c);
            if(success2){
                answer = mul;
            }
        }
        return answer;
    }

    /**
     * @dev Returns the addition and division of three unsigned integers, with an overflow flag.
     */
    function mathAddDiv(uint256 a, uint256 b, uint256 c) internal pure returns (uint256) {
        uint256 answer;
        (bool success1, uint256 add1) = Math.tryAdd(a, b);
        if(success1){
            (bool success2, uint256 div) = Math.tryDiv(add1, c);
            if(success2){
                answer = div;
            }
        }
        return answer;
    }

    /**
     * @dev Returns the subtraction and addition of three unsigned integers, with an overflow flag.
     */
    function mathSubAdd(uint256 a, uint256 b, uint256 c) internal pure returns (uint256) {
        uint256 answer;
        (bool success1, uint256 sub) = Math.trySub(a, b);
        if(success1){
            (bool success2, uint256 add) = Math.tryAdd(sub, c);
            if(success2){
                answer = add;
            }
        }
        return answer;
    }

    /**
     * @dev Returns the subtraction of three unsigned integers, with an overflow flag.
     */
    function mathSubSub(uint256 a, uint256 b, uint256 c) internal pure returns (uint256) {
        uint256 answer;
        (bool success1, uint256 sub1) = Math.trySub(a, b);
        if(success1){
            (bool success2, uint256 sub2) = Math.trySub(sub1, c);
            if(success2){
                answer = sub2;
            }
        }
        return answer;
    }

    /**
     * @dev Returns the subtraction and multiplication of two unsigned integers, with an overflow flag.
     */
    function mathSubMul(uint256 a, uint256 b, uint256 c) internal pure returns (uint256) {
        uint256 answer;
        (bool success1, uint256 sub) = Math.trySub(a, b);
        if(success1){
            (bool success2, uint256 mul) = Math.tryMul(sub, c);
            if(success2){
                answer = mul;
            }
        }
        return answer;
    }

    /**
     * @dev Returns the subtraction and division of three unsigned integers, with an overflow flag.
     */
    function mathSubDiv(uint256 a, uint256 b, uint256 c) internal pure returns (uint256) {
        uint256 answer;
        (bool success1, uint256 sub) = Math.trySub(a, b);
        if(success1){
            (bool success2, uint256 div) = Math.tryDiv(sub, c);
            if(success2){
                answer = div;
            }
        }
        return answer;
    }

    /**
     * @dev Returns the multiplication and addition of three unsigned integers, with an overflow flag.
     */
    function mathMulAdd(uint256 a, uint256 b, uint256 c) internal pure returns (uint256) {
        uint256 answer;
        (bool success1, uint256 mul) = Math.tryMul(a, b);
        if(success1){
            (bool success2, uint256 add) = Math.tryAdd(mul, c);
            if(success2){
                answer = add;
            }
        }
        return answer;
    }

    /**
     * @dev Returns the multiplication and subtraction of three unsigned integers, with an overflow flag.
     */
    function mathMulSub(uint256 a, uint256 b, uint256 c) internal pure returns (uint256) {
        uint256 answer;
        (bool success1, uint256 mul) = Math.tryMul(a, b);
        if(success1){
            (bool success2, uint256 sub) = Math.trySub(mul, c);
            if(success2){
                answer = sub;
            }
        }
        return answer;
    }

    /**
     * @dev Returns the multiplication of three unsigned integers, with an overflow flag.
     */
    function mathMulMul(uint256 a, uint256 b, uint256 c) internal pure returns (uint256) {
        uint256 answer;
        (bool success1, uint256 mul1) = Math.tryMul(a, b);
        if(success1){
            (bool success2, uint256 mul2) = Math.tryMul(mul1, c);
            if(success2){
                answer = mul2;
            }
        }
        return answer;
    }

    /**
     * @dev Returns the multiplication and division of three unsigned integers, with an overflow flag.
     */
    function mathMulDiv(uint256 a, uint256 b, uint256 c) internal pure returns (uint256) {
        uint256 answer;
        (bool success1, uint256 mul) = Math.tryMul(a, b);
        if(success1){
            (bool success2, uint256 div) = Math.tryDiv(mul, c);
            if(success2){
                answer = div;
            }
        }
        return answer;
    }

    /**
     * @dev Returns the division and addition of three unsigned integers, with an overflow flag.
     */
    function mathDivAdd(uint256 a, uint256 b, uint256 c) internal pure returns (uint256) {
        uint256 answer;
        (bool success1, uint256 div) = Math.tryDiv(a, b);
        if(success1){
            (bool success2, uint256 add) = Math.tryAdd(div, c);
            if(success2){
                answer = add;
            }
        }
        return answer;
    }

    /**
     * @dev Returns the division and subtraction of three unsigned integers, with an overflow flag.
     */
    function mathDivSub(uint256 a, uint256 b, uint256 c) internal pure returns (uint256) {
        uint256 answer;
        (bool success1, uint256 div) = Math.tryDiv(a, b);
        if(success1){
            (bool success2, uint256 sub) = Math.trySub(div, c);
            if(success2){
                answer = sub;
            }
        }
        return answer;
    }

    /**
     * @dev Returns the division and multiplication of three unsigned integers, with an overflow flag.
     */
    function mathDivMul(uint256 a, uint256 b, uint256 c) internal pure returns (uint256) {
        uint256 answer;
        (bool success1, uint256 div) = Math.tryDiv(a, b);
        if(success1){
            (bool success2, uint256 mul) = Math.tryMul(div, c);
            if(success2){
                answer = mul;
            }
        }
        return answer;
    }

    /**
     * @dev Returns the division of three unsigned integers, with an overflow flag.
     */
    function mathDivDiv(uint256 a, uint256 b, uint256 c) internal pure returns (uint256) {
        uint256 answer;
        (bool success1, uint256 div1) = Math.tryDiv(a, b);
        if(success1){
            (bool success2, uint256 div2) = Math.tryDiv(div1, c);
            if(success2){
                answer = div2;
            }
        }
        return answer;
    }

}
