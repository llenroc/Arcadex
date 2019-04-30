pragma solidity ^0.5.2;

import "./RandGenerator.sol";

contract RandMock is RandomGenerator {
  event Random(uint256);
  constructor(uint256[] memory probs) public {
    _initRandom(probs);
  }
  function test() public returns(uint256) {
    _prepareRandom(msg.sender);
    emit Random(_random(msg.sender));
  }
}
