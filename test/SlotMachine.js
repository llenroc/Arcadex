const utils = require('./utilities.js');

const RewardToken = artifacts.require('./RewardToken.sol');
const SlotMachine = artifacts.require('./SlotMachine.sol');

contract('SlotMachine', function(accounts) {
  var owner = accounts[0];
  var player = accounts[1];
  var token, machine;
  var prices = [0, 1, 2];
  var probs = [3, 1, 2];

  it("Deploy contracts", async function() {
    console.log(owner, player);
    token = await RewardToken.new('Arcadex', 'AAA', 0);
    console.log("Token address:", token.address)
    machine = await SlotMachine.new("SlotMachine", {from: owner});
    console.log("Machine address:", machine.address)
    await token.addMinter(machine.address);
    machine.initialize(prices, probs, token.address)
  });

  it("Donation test", async function() {
    await machine.send(web3.utils.toWei('1', 'ether'));
    assert.notEqual(owner, player);
    utils.assertFail(async function() {
      await machine.withdraw(1, {from: player});
    });
    await machine.withdraw(1, {from: owner});
  });

  it("Get price info", async function() {
    let result = await machine.getPrices();
    assert.deepEqual(result.amount.map(n=>n.toNumber()), prices);
    assert.deepEqual(result.prob.map(n=>n.toNumber()), probs);
  });

  it("Machine play", async function() {
    let blockNumber = await web3.eth.getBlockNumber();
    let gasUsed = 0;
    for (let i = 0; i < 50; i++) {
      let ret = await machine.insertCoin({from: player});
      if (gasUsed == 0) {
        gasUsed = ret.receipt.gasUsed;
      }
      assert.equal(ret.receipt.gasUsed, gasUsed);
      await machine.drawReward({from: player});
    }
    let pagingInfo = await machine.pricePaging(player);
    // Should have moved to new page offset.
    assert(blockNumber < pagingInfo.start);
  });

  it("Machine play illegal", async function() {
    await machine.insertCoin();
    utils.assertFail(async function() {
      await machine.insertCoin();
    });
    await machine.drawReward();
    utils.assertFail(async function() {
      await machine.drawReward();
    });
    await machine.insertCoin();
    await machine.drawReward();
  });
});
