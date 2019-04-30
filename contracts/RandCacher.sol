pragma solidity ^0.5.2;

contract RandCacher {
  mapping(address=>uint256[]) cache;

  function _genRand(address owner, uint256 length) internal {
    uint256[] memory tmp = new uint256[](length);
    for (uint256 i = 0; i < length; i++) {
      tmp[i] = rand;
    }
    cache[owner] = tmp;
  }

  function _popRand(address owner) internal returns(uint256) {
    require(cache[owner].length > 0, "run out of rand cache");
    uint256 tmp = cache[owner][cache[owner].length-1];
    cache[owner].length--;
    return tmp;
  }

  function _flushRand(address owner) internal {
    delete cache[owner];
  }
}
