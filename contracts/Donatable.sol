pragma solidity ^0.5.2;

contract Donatable {
  event Donation(address from, uint amount, bytes msg);

  constructor() public {}

  function() external payable {
    if (msg.value == 0) {
      return;
    }
    if (msg.data.length <= 4) {
      emit Donation(msg.sender, msg.value, "");
      return;
    }
    uint i = 0;
    uint size = msg.data.length - 4;
    bytes memory _msg = new bytes(size);
    for (i = 0; i < size; i++) {
      _msg[i] = msg.data[i+4];
    }
    emit Donation(msg.sender, msg.value, _msg);
  }

  // Make this internal so that children can handle privilege.
  function _withdrawDonate(address payable to, uint256 amount) internal {
    to.transfer(amount);
  }
}
