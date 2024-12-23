const hre = require("hardhat");

async function main() {
  console.log("Configured networks:");
  console.log(Object.keys(hre.config.networks));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});