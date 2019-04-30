const utils = require('./utilities.js');

const Gacha = artifacts.require('./Gacha.sol');
const DekuFamily = artifacts.require('./DekuFamily.sol');

contract('GachaComplex', function(accounts) {
  var owner = accounts[0];
  var player = accounts[1];
  var machine;
  var dekus = [];
  var dekuAddrs;
  var dekuProbs;

  it("Deploy contracts", async function() {
    machine = await Gacha.new("Gacha", {from: owner});
    console.log("Machine address:", machine.address)

    for (let i = 0; i < 10; i++) {
      dekus.push(await DekuFamily.new("DekuTest"+i, "DKT"+i, ""));
    }
    await Promise.all(dekus.map(d=>d.addMinter(machine.address)));

    dekuAddrs = dekus.map(d=>d.address);
    dekuProbs = dekus.map((d, idx)=>(idx+1));

    await machine.initialize(
      dekuProbs,
      dekuAddrs,
      {from: owner}
    );
  });

  it("Get Price Info", async function() {
    let result = await machine.getPrices();
    assert.deepEqual(result.token, dekuAddrs);
    assert.deepEqual(result.prob.map(n=>n.toNumber()), dekuProbs);
  });

  it("Machine play", async function() {
    let blockNumber = await web3.eth.getBlockNumber();
    let gasUsed = 0;
    for(let i = 0; i < 50; i++) {
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
