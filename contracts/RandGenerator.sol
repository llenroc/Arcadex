pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";

import "./RandCacher.sol";

contract RandomGenerator is RandCacher {
  uint256[] probs;
  uint[] aliasIndex;
  uint[] small;
  uint[] large;
  uint256 totalWeight;
  uint value;

  using SafeMath for uint256;

  function _initRandom(uint256[] memory _weights) internal {
    uint i;
    uint length = _weights.length;
    totalWeight = 0;
    for (i = 0; i < length; i++) {
      totalWeight = totalWeight.add(_weights[i]);
    }
    uint256[] memory processWeights = new uint256[](length);
    for (i = 0; i < length; i++) {
      processWeights[i] = _weights[i].mul(length);
    }
    small.length = 0;
    large.length = 0;
    for (i = 0; i < length; i++) {
      if (processWeights[i] < totalWeight) {
        small.push(i);
      } else {
        large.push(i);
      }
    }
    uint less;
    uint more;
    probs.length = length;
    aliasIndex.length = length;
    while (small.length > 0 && large.length > 0) {
      less = small[small.length-1];
      more = large[large.length-1];
      delete small[small.length-1];
      delete large[large.length-1];
      small.length--;
      large.length--;
      probs[less] = processWeights[less];
      aliasIndex[less] = more;
      uint256 remain = totalWeight.sub(processWeights[less]);
      processWeights[more] = processWeights[more].sub(remain);
      if (processWeights[more] < totalWeight) {
        small.push(more);
      } else {
        large.push(more);
      }
    }
    for (i = 0; i < small.length; i++) {
      probs[small[i]] = totalWeight;
    }
    for (i = 0; i < large.length; i++) {
      probs[large[i]] = totalWeight;
    }
  }

  function _prepareRandom(address owner) internal {
    _genRand(owner, 2);
  }

  function _random(address owner) internal returns(uint256) {
    require(probs.length > 0);
    uint256 idx = _popRand(owner) % probs.length;
    if (_popRand(owner) % totalWeight < probs[idx]) {
      return idx;
    }
    return aliasIndex[idx];
  }
}
