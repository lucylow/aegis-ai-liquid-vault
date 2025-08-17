# AEGIS AI Liquid Vault

AEGIS is an omnichain lending protocol built on ZetaChain that enables cross-chain lending and borrowing using a single universal contract. The protocol leverages ZetaChain's cross-chain messaging (CCM) to manage collateral and loans across multiple blockchains without deploying separate contracts on each chain.

## 🚀 Key Features

### 🔗 **Omnichain Interoperability**
- Single contract manages lending across all supported chains
- Native support for Bitcoin and EVM chains
- Cross-chain collateral and loan management

### 🤖 **AI-Powered Risk Management**
- Real-time risk assessment via AI oracle
- Dynamic interest rates based on asset volatility
- Automated liquidation triggers

### 🎯 **Universal Asset Support**
- Fungible tokens (ERC-20) across all chains
- Non-fungible tokens (ERC-721) with cross-chain bridging
- Native BTC support without wrapping

### 🛡️ **Security Features**
- Reentrancy protection
- Pausable functionality
- Owner-controlled emergency functions
- Comprehensive access controls

## 🏗️ Project Structure

```
aegis-ai-liquid-vault/
├── contracts/                 # Smart contracts
│   ├── interfaces/           # Contract interfaces
│   │   ├── IAIOracle.sol    # AI Oracle interface
│   │   ├── IUniversalToken.sol # Universal token interface
│   │   └── IUniversalNFT.sol   # Universal NFT interface
│   ├── protocol/             # Core protocol contracts
│   │   ├── AegisUniversalLending.sol # Main protocol contract
│   │   ├── MockAIOracle.sol  # Mock AI Oracle for testing
│   │   └── MockUniversalToken.sol # Mock universal tokens
│   ├── scripts/              # Deployment and utility scripts
│   │   ├── deploy.ts         # Main deployment script
│   │   └── demo.ts           # Demo script
│   ├── test/                 # Test files
│   │   └── AegisProtocol.test.ts # Comprehensive tests
│   ├── hardhat.config.ts     # Hardhat configuration
│   ├── package.json          # Smart contract dependencies
│   ├── config.example.ts     # Configuration example
│   └── README.md             # Smart contract documentation
├── src/                      # Frontend application
├── public/                   # Static assets
└── README.md                 # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm, yarn, or pnpm
- Hardhat (for smart contracts)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/aegis-ai-liquid-vault.git
cd aegis-ai-liquid-vault
```

### 2. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install smart contract dependencies
cd contracts
npm install
```

### 3. Configure Environment
```bash
# Copy configuration example
cp config.example.ts config.ts

# Edit config.ts with your values
# - Private key for deployment
# - ZetaChain API key
# - RPC URLs
```

### 4. Compile Smart Contracts
```bash
cd contracts
npm run compile
```

### 5. Run Tests
```bash
npm run test
```

### 6. Deploy Contracts
```bash
# Local development
npm run deploy:localnet

# Testnet
npm run deploy:testnet

# Mainnet
npm run deploy:mainnet
```

### 7. Run Demo
```bash
npm run demo
```

### 8. Start Frontend
```bash
cd ..
npm run dev
```

## 🔧 Smart Contract Architecture

### Core Contracts

#### `AegisUniversalLending.sol`
The main protocol contract that handles:
- Collateral locking and management
- Loan issuance and tracking
- Cross-chain operations
- Risk management integration
- NFT bridging

#### `MockAIOracle.sol`
Mock implementation of the AI oracle for testing:
- Risk profile management
- Price feeds
- Liquidation triggers

#### `MockUniversalToken.sol`
Mock implementation of universal tokens for testing:
- Cross-chain balance tracking
- Mint/burn operations
- Chain-specific supply management

### Key Functions

- **Collateral Management**: Lock fungible and NFT assets
- **Lending Operations**: Borrow against locked collateral
- **Risk Management**: AI-powered risk assessment and liquidations
- **Cross-Chain Operations**: Seamless asset movement across chains

## 🌐 Supported Chains

| Chain | Chain ID | Description |
|-------|----------|-------------|
| Ethereum | 1 | Mainnet |
| Polygon | 137 | Polygon PoS |
| BSC | 56 | Binance Smart Chain |
| Arbitrum | 42161 | Arbitrum One |
| Optimism | 10 | Optimism |
| ZetaChain Testnet | 7001 | Testnet |
| ZetaChain Mainnet | 7000 | Mainnet |
| Localnet | 1337 | Local development |

## 📊 Protocol Parameters

| Parameter | Value | Description |
|-----------|-------|-------------|
| `BASIS_POINTS` | 10,000 | Basis points for percentage calculations |
| `MIN_LIQUIDATION_THRESHOLD` | 8,000 | Minimum liquidation threshold (80%) |
| `MAX_LIQUIDATION_THRESHOLD` | 9,500 | Maximum liquidation threshold (95%) |
| `LIQUIDATION_PENALTY` | 500 | Liquidation penalty (5%) |
| `MAX_INTEREST_RATE` | 2,000 | Maximum annual interest rate (20%) |

## 🧪 Testing

The test suite covers:
- Contract deployment and initialization
- Collateral management operations
- Lending and borrowing functionality
- Risk management and liquidations
- Cross-chain operations
- Emergency functions
- Access control validation

Run tests with:
```bash
cd contracts
npm run test
```

## 🚀 Deployment

### Environment Variables
Create a `.env` file in the contracts directory:
```env
PRIVATE_KEY=your_private_key_here
ZETA_API_KEY=your_zeta_api_key_here
```

### Network Configuration
The deployment script automatically detects the network and uses appropriate configurations for:
- ZetaChain testnet/mainnet
- Local development networks
- EVM-compatible chains

## 💻 CLI Usage

The project includes a CLI for interacting with the protocol:

```bash
cd contracts

# Lock collateral
npm run cli lock-collateral -a 0x... -am 10 -c 1

# Borrow against collateral
npm run cli borrow -c 1 -t 137 -a 0x... -am 5000

# View positions
npm run cli positions

# Set risk profile
npm run cli risk-profile -a 0x... -c 1 -s -l 7500 -t 8500 -v 60

# View protocol info
npm run cli info
```

## 🔒 Security Features

### Access Control
- Owner-only functions for critical operations
- AI Oracle-only liquidation execution
- CLI-only functions for administrative operations

### Reentrancy Protection
- All external calls are protected
- State changes before external calls
- Comprehensive modifier usage

### Emergency Functions
- Pausable functionality
- Emergency withdrawals
- Owner-controlled operations

## 📈 Risk Management

### AI Oracle Integration
- Real-time risk assessment
- Dynamic interest rate calculation
- Automated liquidation triggers
- Volatility-based pricing

### Collateral Management
- Multi-asset support
- Chain-agnostic operations
- Real-time value tracking
- Automated health monitoring

## 🌟 Use Cases

### 1. Cross-Chain Lending
- Lock ETH on Ethereum, borrow USDC on Polygon
- Lock BTC on Bitcoin, borrow stablecoins on any EVM chain
- Seamless asset movement across chains

### 2. NFT-Backed Loans
- Lock valuable NFTs as collateral
- Borrow against NFT collections
- Cross-chain NFT bridging

### 3. Risk-Adjusted Borrowing
- AI-powered risk assessment
- Dynamic interest rates
- Automated liquidation protection

### 4. Institutional DeFi
- Large-scale cross-chain operations
- Professional risk management
- Regulatory compliance features

## 🛠️ Development

### Adding New Features
1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Add comprehensive tests
5. Submit a pull request

### Code Style
- Follow Solidity style guide
- Use NatSpec documentation
- Comprehensive error handling
- Gas optimization

### Testing Strategy
- Unit tests for all functions
- Integration tests for cross-chain operations
- Fuzzing for edge cases
- Gas usage optimization

## 📚 Documentation

- [Smart Contract Documentation](./contracts/README.md)
- [API Reference](./docs/api.md)
- [Deployment Guide](./docs/deployment.md)
- [Security Audit](./docs/security.md)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### Development Setup
1. Install dependencies
2. Set up environment variables
3. Run tests
4. Make your changes
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.aegis.finance](https://docs.aegis.finance)
- **Discord**: [discord.gg/aegis](https://discord.gg/aegis)
- **Twitter**: [@AegisFinance](https://twitter.com/AegisFinance)
- **Email**: support@aegis.finance

## 🗺️ Roadmap

### Phase 1: Foundation ✅
- [x] Core protocol contracts
- [x] Mock implementations
- [x] Basic testing framework
- [x] Deployment scripts

### Phase 2: Enhancement 🚧
- [ ] Real AI Oracle integration
- [ ] Advanced risk models
- [ ] Multi-asset collateral pools
- [ ] Automated market making

### Phase 3: Expansion 📋
- [ ] Governance token implementation
- [ ] Advanced liquidation strategies
- [ ] Cross-chain yield farming
- [ ] Mobile SDK development

### Phase 4: Enterprise 📋
- [ ] Institutional features
- [ ] Regulatory compliance
- [ ] Advanced analytics
- [ ] Multi-language support

## 🙏 Acknowledgments

- ZetaChain team for the amazing cross-chain infrastructure
- OpenZeppelin for secure contract libraries
- Hardhat team for the development framework
- All contributors and community members

---

**Built with ❤️ by the AEGIS team**

*Empowering the future of cross-chain DeFi*

