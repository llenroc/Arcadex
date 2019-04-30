pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol";
import "openzeppelin-solidity/contracts/access/roles/MinterRole.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract DekuFamily is ERC721Full, MinterRole, Ownable {
  // Each DekuFamily represent a kind of collectable member. More of ERC20 idea
  // but we use this to demo ERC721 concept.

  string baseURL;
  mapping(uint256=>uint256) public geneMap;

  constructor(string memory name, string memory symbol, string memory _baseURL)
    ERC721Full(name, symbol)
    public
  {
    baseURL = _baseURL;
  }

  // Owner apis.
  function setBaseURL(string memory _baseURL) public onlyOwner {
    baseURL = _baseURL;
  }

  // Override tokenURI.
  function tokenURI(uint256 tokenId) external view returns (string memory) {
    require(ownerOf(tokenId) != address(0));
    uint256 gene = geneMap[tokenId];
    string memory geneStr = _toHex(gene);
    string memory queryStr = _strcat("?gene=", geneStr);
    return _strcat(baseURL, queryStr);
  }

  function mint(address to) public onlyMinter returns (uint256) {
    uint256 tokenId = totalSupply();
    _mint(to, tokenId);
    geneMap[tokenId] = rand;
    return tokenId;
  }

  // Batch get api, to reduce the number of rpc.
  // return tokens in the range of [start, end).
  function tokenInfoOfOwnerByRange(
    address owner,
    uint256 start,
    uint256 end
  )
    public
    view
    returns (uint256[] memory tokenIds)
  {
    uint256 i = 0;
    uint256 tokenId;
    uint256 total = balanceOf(owner);
    if (end > total) {
      end = total;
    }
    if (start >= end) {
      revert("invalid range");
    }
    tokenIds = new uint256[](end - start);
    for (i = 0; i < (end - start); i++) {
      tokenId = tokenOfOwnerByIndex(owner, i + start);
      tokenIds[i] = tokenId;
    }
    return tokenIds;
  }

  // Utilities.
  function _strcat(string memory a, string memory b)
    internal
    pure returns(string memory)
  {
    uint256 i;
    bytes memory ba = bytes(a);
    bytes memory bb = bytes(b);
    bytes memory r = new bytes(ba.length + bb.length);
    for (i = 0; i < ba.length; i++) {
      r[i] = ba[i];
    }
    for (i = 0; i < bb.length; i++) {
      r[i + ba.length] = bb[i];
    }
    return string(r);
  }

  function _toHex(uint256 num) internal pure returns(string memory) {
    bytes memory b = new bytes(64);
    for (uint256 i = 0; i < b.length; i++) {
      uint256 idx = b.length - 1 - i;
      uint8 h = uint8(num % 16);
      if (h > 9) {
        b[idx] = bytes1(h - 10 + 65); // ascii('A') = 65
      } else {
        b[idx] = bytes1(h + 48); // ascii('0') = 48
      }
      num = num / 16;
    }
    return string(b);
  }
}
