// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@zetachain/protocol-contracts/contracts/ZetaInteractor.sol";
import "@zetachain/protocol-contracts/contracts/interfaces/ZetaInterfaces.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "../interfaces/IAIOracle.sol";
import "../interfaces/IUniversalToken.sol";
import "../interfaces/IUniversalNFT.sol";

/**
 * @title AegisUniversalLending
 * @dev AEGIS Universal Lending Protocol on ZetaChain
 * 
 * Key Features:
 * 1. Accepts collateral from any chain (including native BTC)
 * 2. Issues loans on any chain
 * 3. Uses AI oracle for risk management and liquidations
 * 4. Cross-chain messaging via ZetaChain CCM
 * 5. Universal Token and NFT support
 */
contract AegisUniversalLending is ZetaInteractor, ZetaReceiver, Ownable, ReentrancyGuard, Pausable {
    using UniversalToken for address;
    
    // ==================== STRUCTS ====================
    
    struct CollateralPosition {
        address owner;
        uint256 chainId;
        address asset;
        uint256 amount;
        uint256 tokenId; // For NFTs
        bool isNFT;
        uint256 lockedTimestamp;
        uint256 lastPriceUpdate;
        uint256 currentValue; // In USD with 8 decimals
    }
    
    struct LoanPosition {
        address owner;
        uint256 collateralId;
        uint256 debtChainId;
        address debtAsset;
        uint256 debtAmount;
        uint256 interestRate; // Annual rate in basis points
        uint256 issuedTimestamp;
        uint256 lastInterestAccrual;
        bool liquidated;
        uint256 healthFactor;
    }
    
    struct UniversalNFT {
        address contractAddress;
        uint256 tokenId;
        uint256 originalChainId;
        bool isLocked;
    }
    
    struct RiskProfile {
        uint256 maxLTV; // Maximum Loan-to-Value ratio in basis points
        uint256 liquidationThreshold; // Liquidation threshold in basis points
        uint256 volatilityScore; // 0-100, higher = more volatile
        uint256 lastUpdate;
    }
    
    // ==================== STATE VARIABLES ====================
    
    mapping(uint256 => CollateralPosition) public collaterals;
    mapping(uint256 => LoanPosition) public loans;
    mapping(uint256 => UniversalNFT) public universalNFTs;
    mapping(address => mapping(uint256 => bool)) public approvedTokens;
    mapping(address => mapping(uint256 => RiskProfile)) public tokenRiskProfiles;
    mapping(address => uint256[]) public userCollaterals;
    mapping(address => uint256[]) public userLoans;
    
    uint256 public collateralCounter;
    uint256 public loanCounter;
    uint256 public nftCounter;
    
    address public aiOracle;
    address public localnetConnector;
    
    // Protocol parameters
    uint256 public constant BASIS_POINTS = 10000;
    uint256 public constant MIN_LIQUIDATION_THRESHOLD = 8000; // 80%
    uint256 public constant MAX_LIQUIDATION_THRESHOLD = 9500; // 95%
    uint256 public constant LIQUIDATION_PENALTY = 500; // 5%
    uint256 public constant MAX_INTEREST_RATE = 2000; // 20%
    
    // Events
    event CollateralLocked(
        uint256 indexed collateralId,
        address indexed owner,
        uint256 chainId,
        address asset,
        uint256 amount,
        bool isNFT
    );
    
    event LoanIssued(
        uint256 indexed loanId,
        address indexed owner,
        uint256 collateralId,
        uint256 debtChainId,
        address debtAsset,
        uint256 debtAmount,
        uint256 interestRate
    );
    
    event CollateralLiquidated(
        uint256 indexed loanId,
        uint256 indexed collateralId,
        address liquidator,
        uint256 penalty
    );
    
    event RiskProfileUpdated(
        address indexed asset,
        uint256 indexed chainId,
        uint256 maxLTV,
        uint256 liquidationThreshold
    );
    
    // ==================== MODIFIERS ====================
    
    modifier onlyAIOracle() {
        require(msg.sender == aiOracle, "Only AI Oracle");
        _;
    }
    
    modifier onlyCLI() {
        require(msg.sender == owner() || msg.sender == address(this), "CLI only");
        _;
    }
    
    modifier onlyLocalnet() {
        require(msg.sender == localnetConnector, "Localnet only");
        _;
    }
    
    // ==================== CONSTRUCTOR ====================
    
    constructor(
        address connector,
        address _aiOracle,
        address _localnetConnector
    ) ZetaInteractor(connector) {
        aiOracle = _aiOracle;
        localnetConnector = _localnetConnector;
    }
    
    // ==================== LOCALNET FUNCTIONS ====================
    
    function setupLocalnet(address _localnetConnector) external onlyOwner {
        localnetConnector = _localnetConnector;
    }
    
    function simulateLocalnetDeposit(
        address user,
        address asset,
        uint256 amount,
        uint256 chainId
    ) external onlyLocalnet {
        _lockCollateral(user, asset, amount, 0, chainId, false);
    }
    
    // ==================== TOOLKIT FUNCTIONS ====================
    
    function approveToken(address token, uint256 chainId) external onlyOwner {
        approvedTokens[token][chainId] = true;
        emit RiskProfileUpdated(token, chainId, 0, 0);
    }
    
    function setAIOracle(address _aiOracle) external onlyOwner {
        aiOracle = _aiOracle;
    }
    
    function updateRiskProfile(
        address asset,
        uint256 chainId,
        uint256 maxLTV,
        uint256 liquidationThreshold,
        uint256 volatilityScore
    ) external onlyAIOracle {
        require(maxLTV <= BASIS_POINTS, "Invalid maxLTV");
        require(
            liquidationThreshold >= MIN_LIQUIDATION_THRESHOLD &&
            liquidationThreshold <= MAX_LIQUIDATION_THRESHOLD,
            "Invalid liquidation threshold"
        );
        require(volatilityScore <= 100, "Invalid volatility score");
        
        tokenRiskProfiles[asset][chainId] = RiskProfile({
            maxLTV: maxLTV,
            liquidationThreshold: liquidationThreshold,
            volatilityScore: volatilityScore,
            lastUpdate: block.timestamp
        });
        
        emit RiskProfileUpdated(asset, chainId, maxLTV, liquidationThreshold);
    }
    
    // ==================== UNIVERSALKIT INTEGRATION ====================
    
    function getUserPosition(address user) external view returns (
        uint256 collateralCount,
        uint256 activeLoans,
        uint256 totalCollateralValue,
        uint256 totalDebtValue
    ) {
        uint256[] memory userCollateralIds = userCollaterals[user];
        uint256[] memory userLoanIds = userLoans[user];
        
        uint256 collateralValue = 0;
        uint256 debtValue = 0;
        
        for (uint256 i = 0; i < userCollateralIds.length; i++) {
            CollateralPosition storage col = collaterals[userCollateralIds[i]];
            if (col.owner == user) {
                collateralValue += col.currentValue;
            }
        }
        
        for (uint256 i = 0; i < userLoanIds.length; i++) {
            LoanPosition storage loan = loans[userLoanIds[i]];
            if (loan.owner == user && !loan.liquidated) {
                debtValue += loan.debtAmount;
            }
        }
        
        return (
            userCollateralIds.length,
            userLoanIds.length,
            collateralValue,
            debtValue
        );
    }
    
    // ==================== CORE PROTOCOL FUNCTIONS ====================
    
    function lockCollateral(
        address asset,
        uint256 amount,
        uint256 chainId
    ) external payable nonReentrant whenNotPaused {
        require(approvedTokens[asset][chainId], "Token not approved");
        require(amount > 0, "Amount must be greater than 0");
        
        _lockCollateral(msg.sender, asset, amount, 0, chainId, false);
    }
    
    function lockNFT(
        address contractAddress,
        uint256 tokenId,
        uint256 chainId
    ) external nonReentrant whenNotPaused {
        IERC721 nft = IERC721(contractAddress);
        require(nft.ownerOf(tokenId) == msg.sender, "Not owner");
        require(nft.isApprovedForAll(msg.sender, address(this)), "Not approved");
        
        nft.transferFrom(msg.sender, address(this), tokenId);
        
        _lockCollateral(msg.sender, contractAddress, 1, tokenId, chainId, true);
    }
    
    function _lockCollateral(
        address user,
        address asset,
        uint256 amount,
        uint256 tokenId,
        uint256 chainId,
        bool isNFT
    ) internal {
        uint256 collateralId = ++collateralCounter;
        
        collaterals[collateralId] = CollateralPosition({
            owner: user,
            chainId: chainId,
            asset: asset,
            amount: amount,
            tokenId: tokenId,
            isNFT: isNFT,
            lockedTimestamp: block.timestamp,
            lastPriceUpdate: block.timestamp,
            currentValue: 0 // Will be updated by AI oracle
        });
        
        userCollaterals[user].push(collateralId);
        
        if (isNFT) {
            universalNFTs[++nftCounter] = UniversalNFT({
                contractAddress: asset,
                tokenId: tokenId,
                originalChainId: chainId,
                isLocked: true
            });
        }
        
        emit CollateralLocked(collateralId, user, chainId, asset, amount, isNFT);
    }
    
    function borrowAgainstCollateral(
        uint256 collateralId,
        uint256 targetChainId,
        address debtAsset,
        uint256 debtAmount
    ) external nonReentrant whenNotPaused {
        _borrowAgainstCollateral(collateralId, targetChainId, debtAsset, debtAmount);
    }
    
    function _borrowAgainstCollateral(
        uint256 collateralId,
        uint256 targetChainId,
        address debtAsset,
        uint256 debtAmount
    ) internal {
        CollateralPosition storage col = collaterals[collateralId];
        require(col.owner == msg.sender, "Not collateral owner");
        require(!col.isNFT || universalNFTs[collateralId].isLocked, "NFT not locked");
        
        // Get risk profile from AI oracle
        RiskProfile storage riskProfile = tokenRiskProfiles[col.asset][col.chainId];
        require(riskProfile.maxLTV > 0, "Risk profile not set");
        
        // Calculate max borrow based on LTV
        uint256 maxBorrow = (col.currentValue * riskProfile.maxLTV) / BASIS_POINTS;
        require(debtAmount <= maxBorrow, "Exceeds borrowing limit");
        
        // Create loan record
        uint256 loanId = ++loanCounter;
        loans[loanId] = LoanPosition({
            owner: msg.sender,
            collateralId: collateralId,
            debtChainId: targetChainId,
            debtAsset: debtAsset,
            debtAmount: debtAmount,
            interestRate: _calculateInterestRate(riskProfile.volatilityScore),
            issuedTimestamp: block.timestamp,
            lastInterestAccrual: block.timestamp,
            liquidated: false,
            healthFactor: _calculateHealthFactor(col.currentValue, debtAmount, riskProfile.liquidationThreshold)
        });
        
        userLoans[msg.sender].push(loanId);
        
        // Cross-chain minting using Universal Token standard
        IUniversalToken(debtAsset).mintUniversal(targetChainId, msg.sender, debtAmount);
        
        emit LoanIssued(loanId, msg.sender, collateralId, targetChainId, debtAsset, debtAmount, loans[loanId].interestRate);
    }
    
    function _calculateInterestRate(uint256 volatilityScore) internal pure returns (uint256) {
        // Base rate: 5% + volatility adjustment
        uint256 baseRate = 500; // 5%
        uint256 volatilityAdjustment = (volatilityScore * 150) / 100; // Max 15% additional
        return baseRate + volatilityAdjustment;
    }
    
    function _calculateHealthFactor(
        uint256 collateralValue,
        uint256 debtValue,
        uint256 liquidationThreshold
    ) internal pure returns (uint256) {
        if (debtValue == 0) return type(uint256).max;
        return (collateralValue * liquidationThreshold) / (debtValue * BASIS_POINTS);
    }
    
    // ==================== LIQUIDATION FUNCTIONS ====================
    
    function executeLiquidation(uint256 loanId) external onlyAIOracle nonReentrant {
        LoanPosition storage loan = loans[loanId];
        require(!loan.liquidated, "Already liquidated");
        
        CollateralPosition storage col = collaterals[loan.collateralId];
        
        // Calculate liquidation penalty
        uint256 penalty = (loan.debtAmount * LIQUIDATION_PENALTY) / BASIS_POINTS;
        
        // Cross-chain liquidation
        if (col.isNFT) {
            _liquidateNFT(col.asset, col.tokenId, col.chainId);
        } else {
            _liquidateFungible(col.asset, col.amount, col.chainId);
        }
        
        // Repay debt
        IUniversalToken(loan.debtAsset).burnUniversal(loan.debtChainId, msg.sender, loan.debtAmount);
        
        loan.liquidated = true;
        
        emit CollateralLiquidated(loanId, loan.collateralId, msg.sender, penalty);
    }
    
    function _liquidateFungible(
        address asset,
        uint256 amount,
        uint256 chainId
    ) internal {
        IUniversalToken(asset).transferUniversal(chainId, address(this), amount);
    }
    
    function _liquidateNFT(
        address contractAddress,
        uint256 tokenId,
        uint256 chainId
    ) internal {
        // Universal NFT transfer via ZetaChain CCM
        bytes memory payload = abi.encodeWithSignature(
            "transferNFT(address,address,uint256)",
            address(this),
            msg.sender,
            tokenId
        );
        
        zetaConnector.send(
            ZetaInterfaces.SendInput({
                destinationChainId: chainId,
                destinationAddress: contractAddress,
                gasLimit: 500000,
                message: payload,
                zetaValueAndGas: msg.value,
                zetaParams: abi.encode("NFT_TRANSFER")
            })
        );
    }
    
    // ==================== CROSS-CHAIN FUNCTIONS ====================
    
    function onZetaMessage(ZetaInterfaces.ZetaMessage calldata zetaMessage)
        external
        override
        onlyZeta
    {
        // Handle incoming cross-chain messages
        bytes4 selector;
        bytes memory data;
        (selector, data) = abi.decode(zetaMessage.message, (bytes4, bytes));
        
        if (selector == this.completeNFTRedemption.selector) {
            (address recipient, uint256 nftId) = abi.decode(data, (address, uint256));
            _completeNFTRedemption(recipient, nftId);
        } else if (selector == this.updateCollateralValue.selector) {
            (uint256 collateralId, uint256 newValue) = abi.decode(data, (uint256, uint256));
            _updateCollateralValue(collateralId, newValue);
        }
    }
    
    function _completeNFTRedemption(address recipient, uint256 nftId) internal {
        UniversalNFT storage nft = universalNFTs[nftId];
        require(nft.contractAddress != address(0), "NFT not found");
        
        IERC721(nft.contractAddress).transferFrom(address(this), recipient, nft.tokenId);
        nft.isLocked = false;
    }
    
    function _updateCollateralValue(uint256 collateralId, uint256 newValue) internal {
        CollateralPosition storage col = collaterals[collateralId];
        require(col.owner != address(0), "Collateral not found");
        
        col.currentValue = newValue;
        col.lastPriceUpdate = block.timestamp;
        
        // Update health factors for associated loans
        _updateLoanHealthFactors(collateralId);
    }
    
    function _updateLoanHealthFactors(uint256 collateralId) internal {
        // Find all loans associated with this collateral
        for (uint256 i = 1; i <= loanCounter; i++) {
            LoanPosition storage loan = loans[i];
            if (loan.collateralId == collateralId && !loan.liquidated) {
                CollateralPosition storage col = collaterals[collateralId];
                RiskProfile storage riskProfile = tokenRiskProfiles[col.asset][col.chainId];
                
                loan.healthFactor = _calculateHealthFactor(
                    col.currentValue,
                    loan.debtAmount,
                    riskProfile.liquidationThreshold
                );
                
                // Check if liquidation is needed
                if (loan.healthFactor < BASIS_POINTS) {
                    IAIOracle(aiOracle).requestLiquidation(address(this), i, 10);
                }
            }
        }
    }
    
    // ==================== CLI FUNCTIONS ====================
    
    function cliLockCollateral(
        address asset,
        uint256 amount,
        uint256 tokenId,
        uint256 chainId,
        bool isNFT
    ) external onlyCLI {
        _lockCollateral(msg.sender, asset, amount, tokenId, chainId, isNFT);
    }
    
    function cliBorrow(
        uint256 collateralId,
        uint256 targetChainId,
        address debtAsset,
        uint256 debtAmount
    ) external onlyCLI {
        _borrowAgainstCollateral(collateralId, targetChainId, debtAsset, debtAmount);
    }
    
    // ==================== UTILITY FUNCTIONS ====================
    
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    function getCollateral(uint256 collateralId) external view returns (CollateralPosition memory) {
        return collaterals[collateralId];
    }
    
    function getLoan(uint256 loanId) external view returns (LoanPosition memory) {
        return loans[loanId];
    }
    
    function getUniversalNFT(uint256 nftId) external view returns (UniversalNFT memory) {
        return universalNFTs[nftId];
    }
    
    function getTokenRiskProfile(address asset, uint256 chainId) external view returns (RiskProfile memory) {
        return tokenRiskProfiles[asset][chainId];
    }
    
    // ==================== EMERGENCY FUNCTIONS ====================
    
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        IERC20(token).transfer(owner(), amount);
    }
    
    function emergencyWithdrawNFT(address nftContract, uint256 tokenId) external onlyOwner {
        IERC721(nftContract).transferFrom(address(this), owner(), tokenId);
    }
} 