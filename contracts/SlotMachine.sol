pragma solidity ^0.5.2;

import "./RewardToken.sol";
import "./Machine.sol";
import "./RandGenerator.sol";

contract SlotMachine is Machine, RandomGenerator {
  event GetPrice(address indexed winner, uint256 priceId);

  // Play parameters.
  address public priceToken;
  uint256[] public priceAmounts;
  uint256[] public priceProbs;

  // 2 stage play status.
  mapping(address=>uint256) public accountStatus;

  // Event paging.
  uint256 constant pricePageSize = 20;
  mapping(address=>Machine.EvPaging) public pricePaging;

  constructor(string memory name)
    Machine(0, name)
    public
  {
  }

  function initialize(
    uint256[] memory amounts,
    uint256[] memory probs,
    address _priceToken) public onlyOwner
  {
    require(amounts.length == probs.length, "Invalid prize probabilities.");
    super.initialize();

    priceToken = _priceToken;
    if (!RewardToken(priceToken).isMinter(address(this))) {
      revert("not a minter of the reward token");
    }
    _initRandom(probs);
    priceAmounts = amounts;
    priceProbs = probs;
  }

  function _emitGetPrice(address winner, uint256 priceId) internal {
    // Use address 0 to be global paging.
    _updateEvPaging(pricePaging[address(0)], pricePageSize);
    _updateEvPaging(pricePaging[winner], pricePageSize);
    emit GetPrice(winner, priceId);
  }

  function _transferPrice(uint256 priceId) internal {
    uint256 amount = priceAmounts[priceId];
    RewardToken token = RewardToken(priceToken);
    if (amount > 0) {
      token.mint(msg.sender, amount);
    }
    _emitGetPrice(msg.sender, priceId);
  }

  function valid() public view returns(bool) {
    return initialized;
  }

  function insertCoin() public needInit onlyHuman {
    require(accountStatus[msg.sender] == 0, "previous reward not drawn");
    _play();
    _prepareRandom(msg.sender);
    accountStatus[msg.sender] = 1;
  }

  function drawReward() public needInit {
    require(accountStatus[msg.sender] == 1, "not yet played");
    _transferPrice(_random(msg.sender));
    accountStatus[msg.sender] = 0;
  }

  function getPrices() public view needInit returns(
    uint256[] memory amount,
    uint256[] memory prob) {
    return (priceAmounts, priceProbs);
  }
}
