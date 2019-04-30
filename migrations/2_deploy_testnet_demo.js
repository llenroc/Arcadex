const fs = require('fs');
const path = require('path');
const shelljs = require('shelljs');
const truffle = require('../truffle');
const siteURL = require('../site');

const SafeMath = artifacts.require('SafeMath.sol');

const RewardToken = artifacts.require('./RewardToken.sol');
const SlotMachine = artifacts.require('./SlotMachine.sol');
const Gacha = artifacts.require('./Gacha.sol');
const DekuFamily = artifacts.require('./DekuFamily.sol');

// Global config to save.
let config = {};
let CONFIG_PATH = path.resolve(truffle.config_build_directory, 'config.json')

async function runContract(fn, ...args) {
  let ge = await fn.estimateGas(...args);
  return fn(...args, {gas: ge});
}

// Parameter objects.
function SlotPrice(prob, price) {
  this.prob = prob;
  this.price = price;
}

function SlotParm(name, prices, tokenName, tokenSymbol) {
  this.name = name;
  this.prices = prices;
  this.tokenName = tokenName;
  this.tokenSymbol = tokenSymbol;
}

function GachaPrice(probWeight, name, symbol, uri) {
  this.prob = probWeight;
  this.name = name;
  this.symbol = symbol;
  if (uri) {
    this.uri = uri;
  } else {
    this.uri = `${siteURL}/${name}.json`
  }
}

function GachaParm(name, tokens) {
  this.name = name;
  this.tokens = tokens;
}

// Deployments.
async function DeploySlotMachine(parm) {
  let reward;
  // Check if reward token is already created.
  if (config[parm.tokenName]) {
    reward = await RewardToken.at(config[parm.tokenName]);
  } else {
    console.log("Deloying reward token");
    reward = await runContract(RewardToken.new, parm.tokenName, parm.tokenSymbol, 0);
    console.log("reward", parm.tokenName,"deployed, address =", reward.address);
    config[parm.tokenName] = reward.address;
  }

  console.log("Deploying SlotMachine...");
  let slot = await runContract(SlotMachine.new, parm.name);
  console.log("SlotMachine deployed, address =", slot.address);
  config[parm.name] = slot.address;

  // Initialize slot machine.
  await runContract(reward.addMinter, slot.address);
  await slot.initialize(
    parm.prices.map(a=>a.price),
    parm.prices.map(a=>a.prob),
    reward.address
  );
  console.log("SlotMachine", slot.address, "initialized.");
  return slot;
}

async function DeployGacha(parm) {
  console.log("Deploying Gacha...");
  let gacha = await runContract(Gacha.new, parm.name);
  config[parm.name] = gacha.address;
  console.log("Deploying Gacha price tokens...");
  let tokens = await Promise.all(parm.tokens.map(function(token) {
    return runContract(DekuFamily.new, token.name, token.symbol, token.uri);
  }));
  console.log("Gacha price tokens created.");
  for (let i = 0; i < tokens.length; i++) {
    config[parm.tokens[i].name] = tokens[i].address;
  }
  await Promise.all(tokens.map(function(c) {
    return runContract(c.addMinter, gacha.address);
  }));
  console.log("Gacha price tokens settled.");

  await runContract(
    gacha.initialize,
    parm.tokens.map(t=>t.prob),
    tokens.map(t=>t.address)
  );
  console.log("Gacha", gacha.address, "initialized.");
  return gacha;
}

const SlotParms = [
  new SlotParm("SlotMachine",
    [
      new SlotPrice(50, 5),
      new SlotPrice(25, 10),
      new SlotPrice(10, 20),
      new SlotPrice(5, 50),
      new SlotPrice(1, 100),
      new SlotPrice(100 - (1+5+10+25+50), 0)
    ],
    'Arcadex',
    'ACDX')
];

const GachaParms = [
  new GachaParm("DekuFamily",
    [
      // N (total 50%)
      new GachaPrice(167, "DekuSan", "DSan", ""),
      new GachaPrice(167, "DekuDog", "DDog", ""),
      new GachaPrice(166, "DekuCat", "DCat", ""),
      // R (total 30%)
      new GachaPrice(100, "DekuBunny", "DBny", ""),
      new GachaPrice(100, "DekuPig", "DPig", ""),
      new GachaPrice(100, "DekuKoala", "DKoa", ""),
      // SR (total 15%)
      new GachaPrice(50, "DekuLion", "DLio", ""),
      new GachaPrice(50, "DekuTiger", "DTgr", ""),
      new GachaPrice(50, "DekuDeer", "DDer", ""),
      // SSR (total 5%)
      new GachaPrice(25, "DekuTWBear", "DBea", ""),
      new GachaPrice(25, "DekuSeal", "DSea", ""),
    ]),
  new GachaParm("DekuCareer",
    [
      // N (total 50%)
      new GachaPrice(167, "Miner", "DMin", ""),
      new GachaPrice(167, "Lover", "DLov", ""),
      new GachaPrice(166, "Lazybone", "DLB", ""),
      // R (total 30%)
      new GachaPrice(100, "Santa", "DSta", ""),
      new GachaPrice(100, "Dancer", "DDan", ""),
      new GachaPrice(100, "Surfer", "DSur", ""),
      // SR (total 15%)
      new GachaPrice(75, "Geek", "DGee", ""),
      new GachaPrice(75, "Angel", "DAng", ""),
      // SSR (total 5%)
      new GachaPrice(50, "Homeless", "DHL", ""),
    ])
];

module.exports = async function(deployer, network) {

  let slots = await Promise.all(SlotParms.map(DeploySlotMachine));
  await Promise.all(GachaParms.map(DeployGacha));

  shelljs.mkdir('-p', path.dirname(CONFIG_PATH));
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
  return Promise.resolve();
}
