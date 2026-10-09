import hre from "hardhat";
const { ethers, network } = hre;

async function main() {
  console.log("==========================================");
  console.log("Starting BotFeedback Deployment Script...");
  console.log("==========================================");

  const [deployer] = await ethers.getSigners();

  if (!deployer) {
    console.error("Error: No deployer account configured.");
    console.error("Please set PRIVATE_KEY in your .env file.");
    process.exit(1);
  }

  const networkName = network.name;
  const networkConfig = await ethers.provider.getNetwork();
  const chainId = networkConfig.chainId.toString();
  const deployerAddress = await deployer.getAddress();
  const balance = await ethers.provider.getBalance(deployerAddress);

  console.log(`Network Name:     ${networkName}`);
  console.log(`Chain ID:         ${chainId}`);
  console.log(`Deployer Address: ${deployerAddress}`);
  console.log(`Deployer Balance: ${ethers.formatEther(balance)} BOT`);

  if (balance === 0n) {
    console.warn("\nWARNING: Deployer account has 0 BOT balance.");
    console.warn("Please ensure your account has testnet BOT from the faucet before deploying to Botchain Testnet.");
  }

  console.log("\nDeploying BotFeedback contract...");
  const BotFeedbackFactory = await ethers.getContractFactory("BotFeedback");
  const botFeedback = await BotFeedbackFactory.deploy();

  await botFeedback.waitForDeployment();

  const contractAddress = await botFeedback.getAddress();
  const explorerUrl = `https://scan.bohr.life/address/${contractAddress}`;

  console.log("\n==========================================");
  console.log("Deployment Successful!");
  console.log("==========================================");
  console.log(`Contract Address: ${contractAddress}`);
  console.log(`Explorer Link:    ${explorerUrl}`);
  console.log("==========================================");
  console.log(`Next step: Add this address to your .env file:`);
  console.log(`NEXT_PUBLIC_BOT_FEEDBACK_ADDRESS=${contractAddress}`);
  console.log("==========================================");
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
