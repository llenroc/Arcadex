const utils = require('./utilities.js');

const RandMock = artifacts.require('./RandMock.sol');

contract('RandMock', function(accounts) {
  var rand;
  var probs = [5, 4, 3, 1, 7];

  it("Deploy contracts", async function() {
    rand = await RandMock.new(probs);
  });
  it("Test random", async function() {
    let sum = probs.reduce((a, b)=>(a+b), 0);
    let promises = [];
    let count = 100;
    for (let i = 0; i < count; i++) {
      promises.push(rand.test());
    }
    let result = await Promise.all(promises);
    result = result.map((a)=>(a.logs[0].args[0].toNumber()));
    let stat = [0, 0, 0, 0, 0];
    for (let i = 0; i < result.length; i++) {
      let r = result[i];
      stat[r] = stat[r] + 1;
    }
    stat = stat.map((a)=>(a/count));
    let probFloat = probs.map((a)=>(a/sum));
    console.log("expected =", probFloat)
    console.log("actual =", stat)
    for (let i = 0; i < probFloat.length; i++) {
      let dev = 2 * probFloat[i] * (1 - probFloat[i]);
      dev = dev / Math.sqrt(count);
      assert.ok((3 * dev) > Math.abs(probFloat[i] - stat[i]));
    }
  });    
});
