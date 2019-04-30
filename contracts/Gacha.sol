pragma solidity ^0.5.2;

import "./Machine.sol";
import "./DekuFamily.sol";
import "./RandGenerator.sol";

contract Gacha is Machine, RandomGenerator {
  event GetPrice(address indexed winner, address tokenContract, uint256 tokenId);

  // Play parameters.
  uint256[] public probs;
  address[] public prices;

  // 2 stage play status.
  mapping(address=>uint256) public accountStatus;

  // Event paging.
  uint256 constant pricePageSize = 20;
  mapping(address=>Machine.EvPaging) public pricePaging;

  constructor(string memory name)
    Machine(1, name)
    public
  {
  }

  function initialize(
    uint256[] memory _probs,
    address[] memory priceTokens
  )
    public
    onlyOwner
  {
    super.initialize();
    require(priceTokens.length == _probs.length, "price input size unmatched");
    for (uint256 i = 0; i < priceTokens.length; i++) {
      if (!DekuFamily(priceTokens[i]).isMinter(address(this))) {
        revert("not a minter of the reward token");
      }
      if (_probs[i] == 0) {
        revert("invalid probability weight");
      }
    }
    _initRandom(_probs);
    probs = _probs;
    prices = priceTokens;
  }

  function _emitGetPrice(
    address winner,
    address tokenContract,
    uint256 tokenId
  ) internal {
    // Use address 0 to be global paging.
    _updateEvPaging(pricePaging[address(0)], pricePageSize);
    _updateEvPaging(pricePaging[winner], pricePageSize);
    emit GetPrice(winner, tokenContract, tokenId);
  }

  function _transferPrice(uint256 priceId) internal {
    address origin = prices[priceId];

    DekuFamily dekuFamily = DekuFamily(origin);
    uint256 tokenId = dekuFamily.mint(msg.sender);
    _emitGetPrice(msg.sender, origin, tokenId);
  }

  function valid() public view returns(bool) {
    return (initialized && prices.length != 0);
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
    address[] memory token,
    uint256[] memory prob) {
    return (prices, probs);
  }
}
