const utils = require('./utilities.js');

const DekuFamily = artifacts.require('./DekuFamily.sol');

function composeURI(baseURL, gene) {
  let hex = gene.toString(16).toUpperCase();
  let prefix = "";
  // Prepend 0 for 256 bits hex gene code.
  for (let i = 0; i < (64 - hex.length); i++) {
    prefix = prefix + "0";
  }
  hex = prefix + hex;
  return baseURL + "?gene=" + hex;
}

contract('DekuFamily', function(accounts) {
  const baseURL = "http://baseURL/";
  const tokenOwner = accounts[0];
  const tokenCount = 20;
  var deku;
  var tokenIdCache = [];
  var geneCache = [];

  it("Deploy contracts", async function() {
    deku = await DekuFamily.new("DekuTest", "DKT", baseURL);
    console.log("Token address:", deku.address);
  });

  it("Mint token", async function() {
    let promises = []
    for (let i = 0; i < tokenCount; i++) {
      promises.push(deku.mint(tokenOwner));
    }
    await Promise.all(promises);
    assert.equal((await deku.balanceOf(accounts[0])).toNumber(), tokenCount);
  });

  it("Cache token information", async function() {
    for (let i = 0; i < tokenCount; i++) {
      let tokenId = await deku.tokenOfOwnerByIndex(accounts[0], i);
      let gene = await deku.geneMap(tokenId);
      tokenIdCache.push(tokenId);
      geneCache.push(gene);
    }
  });

  it("Check token uri", async function() {
    for (let i = 0; i < tokenCount; i++) {
      let uri = await deku.tokenURI(tokenIdCache[i]);
      let gene = geneCache[i];
      assert.equal(uri, composeURI(baseURL, gene));
    }
  });

  it("Check batch info", async function() {
    const start = 5;
    const end = 10;
    assert(end <= tokenCount);
    let ret = await deku.tokenInfoOfOwnerByRange(tokenOwner, 5, 10);
    assert.equal(ret.length, end - start);
    for (let i = 0; i < (end - start); i++) {
      assert.equal(ret[i].toNumber(),
        tokenIdCache[i + start].toNumber());
    }
  });

  it("Check batch info out of bound", async function() {
    utils.assertFail(async function() {
      await deku.tokenInfoOfOwnerByRange(tokenOwner,
        tokenCount + 10, tokenCount + 5);
    });
    utils.assertFail(async function() {
      await deku.tokenInfoOfOwnerByRange(tokenOwner,
        1, 0);
    });
    utils.assertFail(async function() {
      await deku.tokenInfoOfOwnerByRange(tokenOwner,
        tokenCount + 5, tokenCount + 10);
    });
    let start = 10;
    assert(start < tokenCount);
    let ret = await deku.tokenInfoOfOwnerByRange(tokenOwner, start, tokenCount + 10);
    assert.equal(ret.length, tokenCount - start);
    for (let i = 0; i < ret.length; i++) {
      assert.equal(ret[i].toNumber(),
        tokenIdCache[i + start].toNumber());
    }
  });
});
