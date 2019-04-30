pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

import "./Donatable.sol";

contract Machine is Ownable, Donatable {
  // Machine parameters.
  bool initialized;
  uint256 mType;
  string description;

  event Play(address indexed sender);

  struct EvPaging {
    uint256 count;
    uint256 start;
    uint256 filling;
  }

  modifier needInit() {
    require(initialized == true, "Machine isn't initialized.");
    _;
  }

  modifier onlyHuman() {
    require(tx.origin == msg.sender);
    _;
  }

  constructor(uint256 t, string memory desc) public
  {
    initialized = false;
    mType = t;
    description = desc;
  }

  function initialize() public onlyOwner {
    require(initialized == false, "Machine has been initialized.");
    initialized = true;
  }

  function _play() internal {
    emit Play(msg.sender);
  }

  // Interfaces.
  function getType() public view returns(uint256) {
    return mType;
  }

  function getDescription() public view returns(string memory) {
    return description;
  }

  // Owner interfaces.
  function setDescription(string memory desc) public onlyOwner {
    description = desc;
  }

  function withdraw(uint256 amount) public onlyOwner {
    _withdrawDonate(msg.sender, amount);
  }

  // Common utilities.
  function _updateEvPaging(EvPaging storage page, uint256 pageSize) internal {
    page.count++;
    if (page.count >= pageSize) {
      page.count = 0;
      page.start = page.filling;
      page.filling = block.number;
    }
  }
}
