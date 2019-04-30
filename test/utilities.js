// Helper functions

const assertFail = async function (callback) {
  let web3_error_thrown = false;
  try {
    await callback();
  } catch (error) {
    if (error.message.search("invalid opcode")) {
      web3_error_thrown = true;
    }
  }
  assert.ok(web3_error_thrown, "Transaction should fail");
}

const increaseTime = function(addSeconds) {
  web3.currentProvider.send({
      jsonrpc: "2.0",
      method: "evm_increaseTime",
      params: [addSeconds],
      id: 0
  })
}

module.exports = {
  assertFail,
  increaseTime
}
