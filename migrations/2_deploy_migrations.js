const Immunization = artifacts.require("Immunization");

module.exports = function(deployer) {
  deployer.deploy(Immunization);
};