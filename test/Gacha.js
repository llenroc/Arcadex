const utils = require('./utilities.js');

const Gacha = artifacts.require('./Gacha.sol');
const DekuFamily = artifacts.require('./DekuFamily.sol');

contract('Gacha', function(accounts) {
  var owner = accounts[0];
  var player = accounts[1];
  var machine;
  var deku;

  it("Deploy contracts", async function() {
    machine = await Gacha.new("Gacha", {from: owner});
    console.log("Machine address:", machine.address)
    
    deku = await DekuFamily.new("DekuTest", "DKT", "");
    console.log("Token address:", deku.address);
    await deku.addMinter(machine.address);

    await machine.initialize(
      [1], [deku.address],
      {from: owner}
    );
  });

  it("Machine play", async function() {
    tokenCount = await deku.balanceOf(player);
    await machine.insertCoin({from: player});
    await machine.drawReward({from: player});
    assert.isTrue(tokenCount < await deku.balanceOf(player));
  });
});
