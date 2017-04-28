var NeukeyNotary = artifacts.require("./NeukeyNotary.sol");

module.exports = function(deployer) {
  deployer.deploy(NeukeyNotary);
};
