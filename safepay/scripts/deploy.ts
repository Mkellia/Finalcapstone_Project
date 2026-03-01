import fs from "fs";
import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('Deploying with:', deployer.address);
  console.log('Balance:', ethers.formatEther(await deployer.provider.getBalance(deployer.address)), 'ETH');

  const Factory  = await ethers.getContractFactory('SafePayEscrow');
  const contract = await Factory.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log('✅ SafePayEscrow deployed to:', address);

  // Save ABI + address for frontend
  const artifact = JSON.parse(
    fs.readFileSync(`artifacts/contracts/SafePayEscrow.sol/SafePayEscrow.json`, 'utf8')
  );

  fs.writeFileSync('src/lib/contract.json', JSON.stringify({
    address,
    abi: artifact.abi,
  }, null, 2));

  console.log('✅ ABI saved to src/lib/contract.json');
}

main().catch(console.error);