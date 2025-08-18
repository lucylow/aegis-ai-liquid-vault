# 🛡️ AEGIS AI Agent Frontend

A comprehensive React-based frontend for the AEGIS AI agent that integrates with blockchain security and cross-chain messaging. Built with modern web technologies and designed for real-time threat monitoring and security operations.

## ✨ Features

### 🔒 **Real-Time Security Dashboard**
- Live threat monitoring across multiple blockchain networks
- Interactive threat radar with D3.js visualization
- Real-time security metrics and system health indicators
- Cross-chain security status monitoring

### 🤖 **AI-Powered Threat Analysis**
- Gemini AI integration for intelligent threat detection
- Pattern recognition and risk assessment
- Automated threat classification and scoring
- AI-generated security recommendations

### ⛓️ **Cross-Chain Security Operations**
- Multi-blockchain threat monitoring (Ethereum, Bitcoin, Solana, Polygon, Avalanche)
- Cross-chain asset freezing and security controls
- Unified security dashboard for all connected chains
- Real-time cross-chain threat alerts

### 📊 **Advanced Analytics & Reporting**
- Interactive data visualizations
- Threat trend analysis and forecasting
- Customizable security reports
- Performance metrics and uptime monitoring

### 🔐 **Security & Authentication**
- Role-based access control
- Two-factor authentication support
- Biometric authentication options
- Comprehensive audit logging

## 🚀 Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Charts & Visualization**: D3.js for interactive threat radar
- **State Management**: React Hooks with Context API
- **Routing**: React Router v6
- **Build Tool**: Vite with optimized bundling
- **Blockchain Integration**: Ethers.js for EVM chains
- **AI Integration**: Gemini API for threat analysis
- **Cross-Chain**: ZetaChain integration for omnichain operations

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Dashboard/       # Dashboard-specific components
│   ├── Transactions/    # Transaction monitoring components
│   ├── Alerts/         # Security alert components
│   └── ui/             # Base UI components
├── pages/               # Main application pages
│   ├── Dashboard.tsx   # Main security dashboard
│   ├── Transactions.tsx # Transaction monitoring
│   ├── ThreatAnalysis.tsx # Detailed threat analysis
│   └── Settings.tsx    # User preferences and security
├── services/            # API and external service integrations
│   └── api.ts          # Main API service layer
├── types/               # TypeScript type definitions
├── hooks/               # Custom React hooks
└── utils/               # Utility functions and helpers
```

## 🛠️ Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/aegis-ai-agent.git
   cd aegis-ai-agent
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your environment variables:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key
   VITE_ZETACHAIN_RPC_URL=your_zetachain_rpc_url
   VITE_ETHERSCAN_API_KEY=your_etherscan_api_key
   VITE_ALCHEMY_API_KEY=your_alchemy_api_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
```

### Code Quality

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **Tailwind CSS**: Utility-first CSS framework

### Component Development

Components follow a consistent structure:
- TypeScript interfaces for props
- Tailwind CSS for styling
- Responsive design patterns
- Accessibility considerations

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3B82F6) - Main brand color
- **Success**: Green (#22C55E) - Positive actions
- **Warning**: Yellow (#F59E0B) - Caution states
- **Danger**: Red (#EF4444) - Critical alerts
- **Neutral**: Gray scale for UI elements

### Typography
- **Primary Font**: Inter - Modern, readable sans-serif
- **Monospace**: JetBrains Mono - For code and addresses

### Components
- **Cards**: Consistent shadow and border radius
- **Buttons**: Multiple variants with hover states
- **Forms**: Accessible input components
- **Tables**: Responsive data display

## 🔌 API Integration

### External Services

1. **Gemini AI API**
   - Threat pattern analysis
   - Risk assessment
   - Security recommendations

2. **ZetaChain**
   - Cross-chain messaging
   - Universal contract interactions
   - Multi-chain asset management

3. **Blockchain RPCs**
   - Ethereum (Alchemy/Infura)
   - Bitcoin (BlockCypher)
   - Solana (QuickNode)
   - Polygon (Alchemy)

### API Structure

```typescript
// Example API service
export const fetchSecurityOverview = async (): Promise<SecurityOverview> => {
  // Implementation
};

export const subscribeToThreats = (callback: (threat: Threat) => void) => {
  // Real-time subscription
};
```

## 🚀 Deployment

### Production Build

```bash
npm run build
```

### Environment Variables

Ensure all required environment variables are set in production:
- API keys for external services
- RPC endpoints for blockchain networks
- Security configuration

### Deployment Platforms

- **Vercel**: Recommended for React applications
- **Netlify**: Alternative with good CI/CD
- **AWS S3 + CloudFront**: For enterprise deployments
- **Docker**: Containerized deployment

## 🔒 Security Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control
- Session management
- Secure token storage

### Data Protection
- HTTPS enforcement
- XSS protection
- CSRF tokens
- Input validation and sanitization

### Blockchain Security
- Multi-signature support
- Transaction signing verification
- Address validation
- Smart contract security checks

## 📱 Responsive Design

### Breakpoints
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

### Mobile-First Approach
- Touch-friendly interfaces
- Optimized navigation
- Responsive data tables
- Adaptive layouts

## 🧪 Testing

### Testing Strategy
- **Unit Tests**: Component testing with Jest
- **Integration Tests**: API integration testing
- **E2E Tests**: User flow testing with Playwright
- **Visual Regression**: UI consistency testing

### Running Tests

```bash
npm run test           # Run unit tests
npm run test:e2e      # Run end-to-end tests
npm run test:coverage # Generate coverage report
```

## 📊 Performance

### Optimization Features
- **Code Splitting**: Route-based code splitting
- **Lazy Loading**: Component lazy loading
- **Image Optimization**: WebP format support
- **Bundle Analysis**: Webpack bundle analyzer

### Monitoring
- **Core Web Vitals**: Performance metrics
- **Error Tracking**: Sentry integration
- **Analytics**: User behavior tracking
- **Uptime Monitoring**: Service health checks

## 🤝 Contributing

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Standards

- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Write meaningful commit messages
- Include JSDoc comments for complex functions

### Pull Request Guidelines

- Clear description of changes
- Screenshots for UI changes
- Test coverage for new features
- Update documentation if needed

## 📚 Documentation

### Additional Resources

- [API Documentation](./docs/api.md)
- [Component Library](./docs/components.md)
- [Deployment Guide](./docs/deployment.md)
- [Security Guidelines](./docs/security.md)

### Architecture Diagrams

- System architecture overview
- Data flow diagrams
- Component hierarchy
- API integration patterns

## 🆘 Support

### Getting Help

- **Documentation**: Check the docs folder
- **Issues**: GitHub Issues for bug reports
- **Discussions**: GitHub Discussions for questions
- **Discord**: Community support channel

### Community

- **Discord Server**: Join our community
- **GitHub Discussions**: Ask questions
- **Contributing Guide**: Help improve the project

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **ZetaChain Team**: For cross-chain infrastructure
- **Google Gemini**: For AI capabilities
- **Open Source Community**: For amazing tools and libraries
- **Security Researchers**: For threat intelligence

---

**Built with ❤️ by the AEGIS Team**

*Protecting the future of decentralized finance through intelligent security*

