import { ethers } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";

async function main() {
  const hre: HardhatRuntimeEnvironment = await import("hardhat");
  const [deployer] = await ethers.getSigners();
  
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());
  
  // ==================== DEPLOYMENT CONFIGURATION ====================
  
  // Chain IDs for different networks
  const CHAIN_IDS = {
    ETHEREUM: 1,
    POLYGON: 137,
    BSC: 56,
    ARBITRUM: 42161,
    OPTIMISM: 10,
    ZETA_TESTNET: 7001,
    ZETA_MAINNET: 7000,
    LOCALNET: 1337
  };
  
  // Mock connector addresses (replace with real ones in production)
  const MOCK_CONNECTORS = {
    [CHAIN_IDS.ZETA_TESTNET]: "0x0000000000000000000000000000000000000000",
    [CHAIN_IDS.ZETA_MAINNET]: "0x0000000000000000000000000000000000000000",
    [CHAIN_IDS.LOCALNET]: "0x0000000000000000000000000000000000000000"
  };
  
  // ==================== DEPLOY MOCK CONTRACTS ====================
  
  console.log("\n=== Deploying Mock Contracts ===");
  
  // Deploy Mock AI Oracle
  const MockAIOracle = await ethers.getContractFactory("MockAIOracle");
  const mockAIOracle = await MockAIOracle.deploy();
  await mockAIOracle.waitForDeployment();
  const mockAIOracleAddress = await mockAIOracle.getAddress();
  console.log("Mock AI Oracle deployed to:", mockAIOracleAddress);
  
  // Deploy Mock Universal Token (USDC)
  const MockUniversalToken = await ethers.getContractFactory("MockUniversalToken");
  const mockUSDC = await MockUniversalToken.deploy(
    "USD Coin",
    "USDC",
    ethers.parseUnits("1000000", 6) // 1M USDC
  );
  await mockUSDC.waitForDeployment();
  const mockUSDCAddress = await mockUSDC.getAddress();
  console.log("Mock USDC deployed to:", mockUSDCAddress);
  
  // Deploy Mock Universal Token (ETH)
  const mockETH = await MockUniversalToken.deploy(
    "Ethereum",
    "ETH",
    ethers.parseUnits("1000", 18) // 1000 ETH
  );
  await mockETH.waitForDeployment();
  const mockETHAddress = await mockETH.getAddress();
  console.log("Mock ETH deployed to:", mockETHAddress);
  
  // ==================== DEPLOY AEGIS PROTOCOL ====================
  
  console.log("\n=== Deploying AEGIS Protocol ===");
  
  // Get the appropriate connector address based on network
  const network = hre.network.name;
  let connectorAddress: string;
  
  if (network === "zeta_testnet") {
    connectorAddress = MOCK_CONNECTORS[CHAIN_IDS.ZETA_TESTNET];
  } else if (network === "zeta_mainnet") {
    connectorAddress = MOCK_CONNECTORS[CHAIN_IDS.ZETA_MAINNET];
  } else {
    connectorAddress = MOCK_CONNECTORS[CHAIN_IDS.LOCALNET];
  }
  
  const AegisUniversalLending = await ethers.getContractFactory("AegisUniversalLending");
  const aegisProtocol = await AegisUniversalLending.deploy(
    connectorAddress,
    mockAIOracleAddress,
    connectorAddress // localnet connector same as main connector for now
  );
  await aegisProtocol.waitForDeployment();
  const aegisProtocolAddress = await aegisProtocol.getAddress();
  console.log("AEGIS Protocol deployed to:", aegisProtocolAddress);
  
  // ==================== CONFIGURE PROTOCOL ====================
  
  console.log("\n=== Configuring Protocol ===");
  
  // Approve tokens for different chains
  const chains = [CHAIN_IDS.ETHEREUM, CHAIN_IDS.POLYGON, CHAIN_IDS.BSC, CHAIN_IDS.ARBITRUM, CHAIN_IDS.OPTIMISM];
  
  for (const chainId of chains) {
    await aegisProtocol.approveToken(mockUSDCAddress, chainId);
    await aegisProtocol.approveToken(mockETHAddress, chainId);
    console.log(`Approved tokens for chain ${chainId}`);
  }
  
  // Set up mock risk profiles via AI Oracle
  for (const chainId of chains) {
    // USDC: Low volatility, high LTV
    await mockAIOracle.setMockRiskProfile(
      mockUSDCAddress,
      chainId,
      8500, // 85% max LTV
      9000, // 90% liquidation threshold
      20    // Low volatility
    );
    
    // ETH: Medium volatility, medium LTV
    await mockAIOracle.setMockRiskProfile(
      mockETHAddress,
      chainId,
      7500, // 75% max LTV
      8500, // 85% liquidation threshold
      60    // Medium volatility
    );
    
    console.log(`Set risk profiles for chain ${chainId}`);
  }
  
  // Set mock prices
  for (const chainId of chains) {
    await mockAIOracle.setMockPrice(mockUSDCAddress, chainId, 100000000); // $1.00
    await mockAIOracle.setMockPrice(mockETHAddress, chainId, 2000000000); // $2000
    console.log(`Set prices for chain ${chainId}`);
  }
  
  // ==================== LOCALNET SIMULATION ====================
  
  if (network === "localnet" || network === "hardhat") {
    console.log("\n=== Localnet Simulation ===");
    
    // Simulate deposits from different chains
    const user1 = ethers.Wallet.createRandom();
    const user2 = ethers.Wallet.createRandom();
    
    // Simulate BTC deposit (chain 18332 - Bitcoin testnet)
    await aegisProtocol.simulateLocalnetDeposit(
      user1.address,
      mockETHAddress, // Using ETH as BTC proxy
      ethers.parseUnits("1", 18), // 1 BTC
      18332
    );
    console.log(`Simulated BTC deposit for user ${user1.address}`);
    
    // Simulate ETH deposit (chain 1 - Ethereum)
    await aegisProtocol.simulateLocalnetDeposit(
      user2.address,
      mockETHAddress,
      ethers.parseUnits("10", 18), // 10 ETH
      1
    );
    console.log(`Simulated ETH deposit for user ${user2.address}`);
    
    // Simulate USDC deposit (chain 137 - Polygon)
    await aegisProtocol.simulateLocalnetDeposit(
      user1.address,
      mockUSDCAddress,
      ethers.parseUnits("10000", 6), // 10,000 USDC
      137
    );
    console.log(`Simulated USDC deposit for user ${user1.address}`);
  }
  
  // ==================== CLI COMMANDS SIMULATION ====================
  
  console.log("\n=== CLI Commands Simulation ===");
  
  // Lock collateral via CLI
  await aegisProtocol.cliLockCollateral(
    mockETHAddress,
    ethers.parseUnits("5", 18), // 5 ETH
    0, // No token ID for fungible
    1, // Ethereum chain
    false // Not NFT
  );
  console.log("CLI: Locked 5 ETH collateral");
  
  // Borrow against collateral via CLI
  await aegisProtocol.cliBorrow(
    1, // collateralId
    137, // Polygon chain
    mockUSDCAddress, // USDC debt
    ethers.parseUnits("5000", 6) // 5,000 USDC
  );
  console.log("CLI: Borrowed 5,000 USDC against ETH collateral");
  
  // ==================== UNIVERSAL NFT DEMO ====================
  
  console.log("\n=== Universal NFT Demo ===");
  
  // Create a mock NFT contract address
  const mockNFTAddress = "0x1234567890123456789012345678901234567890";
  
  // Lock NFT collateral
  await aegisProtocol.cliLockCollateral(
    mockNFTAddress,
    1, // 1 NFT
    123, // Token ID 123
    1, // Ethereum chain
    true // Is NFT
  );
  console.log("CLI: Locked NFT collateral (Token ID: 123)");
  
  // ==================== VERIFICATION ====================
  
  console.log("\n=== Verification ===");
  
  // Check protocol state
  const collateralCount = await aegisProtocol.collateralCounter();
  const loanCount = await aegisProtocol.loanCounter();
  const nftCount = await aegisProtocol.nftCounter();
  
  console.log(`Total Collaterals: ${collateralCount}`);
  console.log(`Total Loans: ${loanCount}`);
  console.log(`Total NFTs: ${nftCount}`);
  
  // Check user positions
  const deployerPosition = await aegisProtocol.getUserPosition(deployer.address);
  console.log(`Deployer Position:`, {
    collateralCount: deployerPosition.collateralCount.toString(),
    activeLoans: deployerPosition.activeLoans.toString(),
    totalCollateralValue: deployerPosition.totalCollateralValue.toString(),
    totalDebtValue: deployerPosition.totalDebtValue.toString()
  });
  
  // ==================== DEPLOYMENT SUMMARY ====================
  
  console.log("\n=== Deployment Summary ===");
  console.log("Network:", network);
  console.log("Deployer:", deployer.address);
  console.log("Mock AI Oracle:", mockAIOracleAddress);
  console.log("Mock USDC:", mockUSDCAddress);
  console.log("Mock ETH:", mockETHAddress);
  console.log("AEGIS Protocol:", aegisProtocolAddress);
  
  // Save deployment addresses to file
  const deploymentInfo = {
    network,
    deployer: deployer.address,
    contracts: {
      mockAIOracle: mockAIOracleAddress,
      mockUSDC: mockUSDCAddress,
      mockETH: mockETHAddress,
      aegisProtocol: aegisProtocolAddress
    },
    chainIds: CHAIN_IDS,
    timestamp: new Date().toISOString()
  };
  
  const fs = require('fs');
  fs.writeFileSync(
    `deployment-${network}.json`,
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log(`\nDeployment info saved to: deployment-${network}.json`);
  console.log("\n🎉 AEGIS Protocol deployment completed successfully!");
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
}); 