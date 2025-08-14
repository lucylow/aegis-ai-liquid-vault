**Aegis**

## **AI‑Shielded Liquidity Across All Chains**

---

## **Overview**

Aegis is a next‑generation **cross‑chain lending protocol** built for the **ZetaChain × Google Cloud AI Buildathon**.

Our mission: **Unify liquidity and credit across all major blockchains** — including **Bitcoin, Solana, Base, Avalanche**, and NFT ecosystems — **while empowering users with AI‑driven risk protection**.

By combining **ZetaChain’s Universal Smart Contracts** with **Google Gemini AI**, Aegis enables users to:

* **Lend, borrow, and optimize assets natively across multiple chains**

* **Use BTC, SOL, EVM tokens, NFTs, and more as cross‑chain collateral**

* Borrow $ZETA (via **Avalon** integration) and other assets instantly

* Get **real‑time AI credit scoring** and liquidation risk forecasts

* Execute **any action** (swap, mint stablecoins, buy NFTs, yield farm) directly from BTC or NFT collateral

**Aegis \= Your AI Shield for Cross‑Chain DeFi.**

---

## **Key Differentiators**

* **AI‑Driven Risk Intelligence** — Google Gemini AI powers live credit scoring, interest rate optimization, and predictive liquidation alerts across chains.

* **True Native‑Asset Handling** — BTC, SOL, NFTs, and EVM assets remain on their original chains; no wrapping or custodial bridges.

* **Seamless Cross‑Chain Interoperability** — ZetaChain Universal Smart Contracts \+ Gateway API handle all multi‑chain state sync.

* **NFT & GameFi Collateralization** — NFTs can be locked on one chain and used for loans on another.

* **Avalon ZETA Lending** — Integrated borrowing/lending of ZETA token for additional liquidity pathways.

* **Event‑Driven Automation** — Margin calls, liquidations, and rebalances trigger in real time from ZetaChain events.

---

## **Table of Contents**

1. [Introduction & Motivation](https://www.perplexity.ai/search/i-need-you-to-write-a-detailed-qGpE6HFnToursP0BqMzckw#1-introduction--motivation)

2. [Technical Architecture](https://www.perplexity.ai/search/i-need-you-to-write-a-detailed-qGpE6HFnToursP0BqMzckw#2-technical-architecture)

3. [Cross‑Chain Lending Platform](https://www.perplexity.ai/search/i-need-you-to-write-a-detailed-qGpE6HFnToursP0BqMzckw#3-cross-chain-lending-platform)

4. [AI/ML Enhancements](https://www.perplexity.ai/search/i-need-you-to-write-a-detailed-qGpE6HFnToursP0BqMzckw#4-aiml-enhancements)

5. [Smart Contract Design](https://www.perplexity.ai/search/i-need-you-to-write-a-detailed-qGpE6HFnToursP0BqMzckw#5-smart-contract-design)

6. [Frontend & User Experience](https://www.perplexity.ai/search/i-need-you-to-write-a-detailed-qGpE6HFnToursP0BqMzckw#6-frontend--user-experience)

7. [Integration with ZetaChain, BTC, Avalon, NFTs](https://www.perplexity.ai/search/i-need-you-to-write-a-detailed-qGpE6HFnToursP0BqMzckw#7-integration-with-zetachain-btc-avalon-nfts)

8. [Security & Compliance](https://www.perplexity.ai/search/i-need-you-to-write-a-detailed-qGpE6HFnToursP0BqMzckw#8-security--compliance)

9. [Development Workflow](https://www.perplexity.ai/search/i-need-you-to-write-a-detailed-qGpE6HFnToursP0BqMzckw#9-development-workflow)

10. [Testing & Validation](https://www.perplexity.ai/search/i-need-you-to-write-a-detailed-qGpE6HFnToursP0BqMzckw#10-testing--validation)

11. [Deployment](https://www.perplexity.ai/search/i-need-you-to-write-a-detailed-qGpE6HFnToursP0BqMzckw#11-deployment)

12. [Community & Growth](https://www.perplexity.ai/search/i-need-you-to-write-a-detailed-qGpE6HFnToursP0BqMzckw#12-community--growth)

13. [Future Improvements](https://www.perplexity.ai/search/i-need-you-to-write-a-detailed-qGpE6HFnToursP0BqMzckw#13-future-improvements)

14. [References](https://www.perplexity.ai/search/i-need-you-to-write-a-detailed-qGpE6HFnToursP0BqMzckw#14-references)

---

## **1\. Introduction & Motivation**

In today’s DeFi landscape, **liquidity is fractured** into isolated ecosystems:

* **BTC** is locked within the Bitcoin network,

* **SOL** remains siloed on Solana,

* **NFTs** are bound to their origin chains like Ethereum L1 or Polygon.

Moving or borrowing against these assets **requires manual bridging, wrapping, and complex workflows** — each step adding friction, delay, and security risk. This fragmentation prevents users from fully leveraging their portfolios, and it limits capital efficiency across the DeFi space.

## **Aegis solves this fragmentation problem**

Built for the **ZetaChain × Google Cloud AI Buildathon**, **Aegis** unifies liquidity and credit across all major blockchains by combining:

1. **ZetaChain Universal Smart Contracts** – a single, chain‑agnostic contract layer that can see, verify, and orchestrate actions across Bitcoin, Solana, EVM chains, and beyond, keeping all loan and collateral states in sync.

2. **Native Asset Support** – BTC stays on Bitcoin, SOL remains on Solana, NFTs stay on their original chains. No wrapping. No custodial risk.

3. **Google Gemini AI Integration** – dynamic, cross‑chain risk modeling for smarter credit approvals, real‑time liquidation forecasting, and adaptive interest rate adjustments.

By making multi‑chain lending **feel as easy as single‑chain DeFi**, Aegis delivers interoperability without compromise.

---

## **Core Use Cases Enabled by Aegis:**

* **Cross‑chain margin trading** — deposit BTC, borrow USDC on another chain, trade instantly without bridging.

* **Multi‑chain DAO treasury optimization** — manage BTC, SOL, and stablecoin reserves as one borrowing power pool.

* **NFT loan markets** — use NFTs on Ethereum or Solana as collateral to borrow assets on other chains.

* **BTC‑backed stablecoin minting** — mint stablecoins pegged to BTC while keeping the BTC natively secured on Bitcoin.

* **Borrow $ZETA via Avalon pool** — integrate directly with Avalon to tap ZetaChain’s native liquidity without leaving Aegis.

---

## **2\. Technical Architecture**

Aegis is built as a **modular, event‑driven, and cross‑chain aware system** that combines **multi‑chain smart contract orchestration** with **AI‑driven decision‑making** and a secure, reactive backend. This modular architecture ensures **security**, **speed**, and **compatibility** across multiple blockchains and asset classes — while keeping the complexity hidden from the end user. The ZetaChain USC coordinates all logic, the backend adds AI‑driven intelligence, and the frontend delivers a clean, unified interface. Its components work together to manage real‑time lending operations across **EVM chains, Solana, Bitcoin, NFT chains, and ZetaChain’s Universal Smart Contract layer**.

---

## **Core Components**

## **Backend — Node.js / TypeScript Microservices**

* **Purpose:** Orchestrates business logic that doesn’t require on‑chain execution. Acts as the bridge between the UI, on‑chain contracts, AI engine, and ZetaChain services.

* **Key Responsibilities:**

  * Listen to **ZetaChain Gateway Event Subscriptions** for loan updates, liquidation triggers, and cross‑chain transaction completions.

  * Securely relay user‑initiated actions to the correct smart contract on the correct chain.

  * Aggregate data from **multiple blockchain RPC endpoints**, prices from oracles (Chainlink, Pyth), and historical loan records from the database.

  * Manage AI service calls to **Google Vertex AI** for credit scoring and rate prediction.

  * Provide **REST and WebSocket APIs** for the frontend to fetch live loan health data, aggregated portfolio metrics, and cross-chain history.

---

## **Frontend — Next.js \+ React \+ Chakra UI**

* **Purpose:** A single, unified interface where all multi‑chain positions, loan actions, and cross‑chain workflows are accessible without manual network switching.

* **Key Features:**

  * **Multi‑wallet connect:** MetaMask, Phantom, WalletConnect, BTC wallets.

  * **Action abstraction:** Deposit BTC on Bitcoin → Borrow USDC on Base without the user manually bridging assets.

  * **Real‑time dashboards:** Loan‑to‑Value ratio, liquidation alerts, interest rate trends — powered live via WebSocket streams.

  * **Interactive onboarding & contextual AI help** — embedded AI assistant for DeFi term explanations and personalized loan advice.

  * Fully responsive and **localized** (EN, ES, ZH) with accessibility features (ARIA, high-contrast, keyboard navigation).

---

## **Smart Contracts**

* **EVM Contracts (Solidity)**

  * Deployed on **ZetaChain** (Universal Smart Contract), Base L2, Avalanche C‑Chain, and other EVM-compatible networks.

  * Handle collateral deposits, loan issuance, liquidation logic, and cross‑chain function calls routed via ZetaChain Gateway.

  * Implement security best practices: **ReentrancyGuard**, role-based access, pausable circuit breaker, and upgradeable proxies.

* **Solana Contracts (Rust/Anchor)**

  * Handle native SOL deposits and state updates via ZetaChain Gateway integration.

  * Maintain vaults for Solana-native assets without bridging them to EVM.

* **ZetaChain Universal Smart Contract (USC)**

  * Core coordinator: maintains the **single source of truth** for all loan states and collateral across every supported chain.

  * Relays instructions to connected chain vaults.

  * Listens for deposit or repayment events from BTC/SOL/EVM chains and updates global state accordingly.

---

## **AI Layer — Google Gemini AI on Vertex AI**

* **Purpose:** Provide **real‑time intelligence** for safer, more efficient lending decisions.

* **Functions:**

  * **Cross-chain credit scoring** using user wallet histories, behavioral patterns, and aggregated liquidity profiles.

  * **Liquidation forecasting** by analyzing LTV ratios, volatility indexes, and market trend data.

  * **Dynamic rate optimization** — suggesting borrower/lender interest rates to balance liquidity incentives with protocol safety.

* **Integration:** Backend microservices make secure API calls to Vertex AI with anonymized loan and wallet metadata.

---

## **Database — PostgreSQL**

* **Role:** Off‑chain event storage and analytics engine.

* **Use Cases:**

  * Historical transaction logs for audits and compliance.

  * Storing computed credit scores, loan performance metrics, and market price histories to improve AI predictions.

  * Serving cached data to the frontend for high‑speed page loads.

---

## **Cross‑Chain Communications — ZetaChain Gateway API**

* **Role:** Securely routes function calls and event messages between chains.

* **How It’s Used in Aegis:**

  * Detect native BTC deposits in monitored vault addresses and trigger collateral credit in the USC.

  * Relay a "Borrow" request from ZetaChain USC → Base network → Deploy USDC to borrower’s address.

  * Handle NFT collateral lock events from Ethereum → Reflect in USC → Allow loan issuance on Avalanche.

  * Ensure at‑most‑once execution and tamper‑proof validation of sender chain and payload.

---

## **System Flow**

text  
`[User UI & Wallet]`    
    `↓`  
`[Frontend (Next.js + React)]`    
    `↓  (REST/WebSocket requests)`    
`[Backend API (Node.js/TypeScript)]`    
    `↓  (Contract calls via ZetaChain SDK)`    
`[ZetaChain Universal Smart Contract]`    
    `↓`    
`[Gateway API (secure cross-chain routing)]`    
    `↓`    
`[Chain-specific Vaults (BTC, SOL, EVM)]`    
    `↓`    
`[Google Gemini AI for scoring & predictions]`    
    `↓`    
`[PostgreSQL for analytics & data history]`

---

## **3\. Cross‑Chain Lending Platform**

Aegis delivers a **truly chain‑agnostic lending experience**, allowing users to unlock liquidity **from any supported blockchain** and deploy it **on any other chain** — without wrapping, manual bridging, or complex workflows. All operations are coordinated by the **ZetaChain Universal Smart Contract (USC)**, ensuring consistent loan state, collateral tracking, and risk management across the entire network. Aegis enables a frictionless, secure, and intelligent lending market where any supported asset — BTC, SOL, NFTs, AVAX, BASE, or ZETA — can be collateralized to borrow liquidity on any connected chain. With Avalon‑powered $ZETA pools, AI‑driven approvals, and ZetaChain’s Universal Smart Contract orchestration, cross‑chain lending is as fast and intuitive as single‑chain DeFi.

---

## **Key Features**

## **Multi‑Asset Collateral Support**

* Accepts native assets directly from their origin chains, including:

  * **Bitcoin (BTC)** — secured via ZetaChain’s native BTC module, monitored at the UTXO layer.

  * **Solana (SOL)** — integrated via Solana Gateway API support.

  * **Non‑fungible tokens (NFTs)** — ERC‑721 / ERC‑1155 / Metaplex NFTs from Ethereum, Solana, Polygon, etc.

  * **Avalanche (AVAX)** and **Base L2** assets.

  * **ZetaChain’s native token ($ZETA)** for protocol‑native liquidity interactions.

* Collateral stays on its home chain — ensuring **no wrapping and minimal trust assumptions**.

---

## **Flexible Borrowable Assets**

* Borrowable assets include:

  * **$ZETA** (via Avalon integration)

  * **Major stablecoins** (USDC, USDT, DAI)

  * **Liquid EVM tokens** (WETH, WBTC, AVAX, etc.)

* Assets can be disbursed **on the same chain as the collateral or a different chain entirely**, depending on borrower needs.

---

## **Avalon Protocol Integration**

* Direct access to **Avalon lending/borrowing pools** from the Aegis dashboard.

* Enables **borrowing $ZETA** against multi‑chain collateral in one click.

* Avalon liquidity is routed seamlessly through the **ZetaChain Gateway**, so users remain inside the Aegis interface end‑to‑end.

---

## **Instant Cross‑Chain Loan Execution**

* Users can:

  * Deposit collateral on one chain (e.g., BTC on Bitcoin network)

  * Instantly receive borrowed assets on another chain (e.g., USDC on Base)

* Flow is handled fully on‑chain via ZetaChain USC & Gateway API:

  * Deposit event → triggers AI risk assessment

  * AI calculates safe LTV & approves loan

  * Gateway routes disbursement to borrower’s target chain

  * Loan state updated across all chains in real time

---

## **NFT‑Backed Lending**

* **Lock NFTs** on one chain as collateral:

  * Blue‑chip Ethereum NFTs (e.g., BAYC, Azuki)

  * Solana NFTs (e.g., Degods, SMB)

* Borrow fungible assets on any supported chain without selling the NFT.

* USC enforces **escrow & liquidation** rules:

  * If repayment fails, NFT is released to lender or auctioned according to protocol governance.

  ---

  ## **4\. AI/ML Enhancements**

The **AI/ML layer** in Aegis is powered by **Google Gemini AI models** delivered through **Google Vertex AI**, and orchestrated by the backend microservices.  
 It augments the **ZetaChain Universal Smart Contract’s** lending logic with **real‑time predictive analytics**, optimized loan terms, and risk warnings.  
 All AI/ML functions are **chain‑agnostic** and operate on **live multi‑chain data** aggregated from ZetaChain’s Gateway API.  Aegis’ AI layer is not a gimmick — it is a **live, technical safety net and optimisation engine** tightly integrated with ZetaChain’s real‑time multi‑chain state, capable of adjusting economic parameters, warning of systemic risk, and guiding users through complex DeFi actions as they happen.

---

## **Credit Scoring – Multi‑Chain Wallet History Analysis**

* **Goal:** Quantify borrower creditworthiness using **historical and current activity** across *all* linked blockchain wallets.

* **Data Sources:**

  1. On‑chain transaction history from **BTC, SOL, EVM** accounts (queried via ZetaChain APIs).

  2. Collateral deposit/withdrawal patterns from the Aegis Universal Smart Contract.

  3. Liquidation or overdue repayment events from protocolsubgraphs and event logs.

* **Processing Pipeline:**

  1. **ETL Layer**: Backend microservice fetches linked wallet events from multiple chains through the ZetaChain Gateway and chain‑specific RPCs.

  2. **Feature Engineering**: Compute variables like average holding period, transaction frequency, historic LTV utilisation, volatility exposure.

  3. **Model Inference**: Feed feature vector to a fine‑tuned Gemini model on Vertex AI.

  4. **Score Integration**: USC reads the returned score (via backend relay) and enforces max borrow limits accordingly.

  ---

  ## **Dynamic Interest Rates – Predictive Adjustment for Market Conditions**

* **Goal:** Keep protocol utilisation high while minimising default risk.

* **Data Inputs:**

  * Current pool utilisation across all chains.

  * Chain‑specific borrowing demand trends.

  * Oracle‑fed token price feeds (e.g., Chainlink, Pyth).

* **Method:**

  * Time‑series data streamed to backend from PostgreSQL \+ live Gateway events.

  * Gemini regression/classification model forecasts short‑term utilisation and volatility.

  * Interest rate curve parameters (base rate, slope, kink point) adjusted in USC via admin or DAO calls.

  * Changes propagate instantly across chains via ZetaChain cross‑chain transaction router.

  ---

  ## **Liquidation Forecasting – Proactive Risk Alerts**

* **Goal:** Detect positions at risk of breaching LTV limits before it happens.

* **Mechanism:**

  * Smart contracts emit **LoanHealthUpdated** events with current collateral/debt values.

  * Backend subscriber pushes updates into Gemini‑powered risk model.

  * Model predicts probability of LTV breach in next N blocks/time window.

  * If threshold exceeded, trigger:

    * On‑chain pre‑liquidation warning transaction.

    * Off‑chain push notification (Telegram, Discord, email).

  * Optionally initiate automated partial liquidation if user opts in.

  ---

  ## **In‑App AI Chatbot – User Education, Onboarding, Real‑Time Loan Advice**

* **Integration:**

  * Frontend React component connects to `/api/ai-chat` backend endpoint.

  * Backend calls Gemini generative model with conversation history \+ contextual data from user’s wallet and loan state.

* **Capabilities:**

  * Explain protocol terms (“What is LTV?”, “What does liquidation mean?”).

  * Guide step‑by‑step through actions (“How do I deposit BTC and borrow USDC?”).

  * Personalised recommendations based on **live loan health data**.

  * Multi‑language support leveraging Vertex AI translation.


---

## **5\. Smart Contract Design**

Aegis uses a **modular, upgradeable smart contract architecture** deployed on **ZetaChain’s Universal Smart Contract (USC) layer** to coordinate lending and collateral management seamlessly across all connected blockchains.

Each module is **isolated for security** and interacts through **well‑defined interfaces**, while the USC acts as the single source of truth for multi‑chain loan state.

---

## **Security Patterns Implemented**

1. **Reentrancy Guard**

   * Implements OpenZeppelin’s `ReentrancyGuard` to prevent recursive exploit calls on sensitive functions such as collateral withdrawals and loan liquidations.

   * Applied to all token transfer and state‑changing functions:

      text  
* `function withdrawCollateral(...) external nonReentrant { ... }`  
  *   
2. **Role‑Based Access Control (RBAC)**

   * Administrative and protocol‑level functions are restricted using OpenZeppelin’s `AccessControl`.

   * Roles include:

     * `DEFAULT_ADMIN_ROLE` – DAO or multi‑sig governance.

     * `RISK_MANAGER_ROLE` – AI risk module and backend bots for rate adjustments.

     * `LIQUIDATOR_ROLE` – Authorized liquidation executors (can be automated bots).

3. **Circuit Breaker / Emergency Stop**

   * Global `paused` state to halt deposits, borrowing, or transfers during attack detection or oracle failures.

   * Controlled via RBAC – only `ADMIN_ROLE` can trigger.

      text  
* `modifier whenNotPaused() { require(!paused, "Protocol paused"); _; }`  
  *   
4. **Upgradeable Proxy Pattern**

   * Uses OpenZeppelin’s Transparent Upgradeable Proxy for live contract upgrades with state preservation.

   * DAO or governance multi‑sig controls the upgrade process.

   ---

   ## **Core Modules**

   ## **BTC Vault Module**

* **Purpose:** Accept and track native Bitcoin deposits without wrapping.

* **Integration:** Monitored by ZetaChain’s BTC module, which observes Bitcoin network UTXOs and relays deposit events to the USC.

* **Functions:**

  * `registerBTCDeposit(address user, uint256 satoshis)` — called only by ZetaChain Gateway after BTC is confirmed.

  * Updates collateral mapping in USC.

  * Emits events to trigger downstream borrowing logic on other chains.

  ---

  ## **NFT Collateral Module**

* **Purpose:** Allow ERC‑721 & ERC‑1155 NFTs (Ethereum, Polygon, Solana via wrapped interface) to be used as collateral.

* **Interfaces Implemented:**

  * `IERC721Receiver` for standard NFTs.

  * `IERC1155Receiver` for multi‑token NFT collections.

* **Functions:**

  * `lockNFT(chainId, collection, tokenId, valuation)` — records collateral and locks transfer.

  * `releaseNFT(user)` — unlocks NFT on repayment.

* **Security:**

  * Loan state linked to NFT’s unique `(chainId, collection, tokenId)` triple to prevent duplicate collateralization.

  * Collateral valuation verified by AI‑approved oracle price.

  ---

  ## **Universal Loan Contract (on ZetaChain USC)**

* **Purpose:** Master coordinator for loan issuance, collateral state, repayment, and liquidation events across all chains.

* **Responsibilities:**

  * Maintains **global loan ledger** for all users/positions.

  * Receives deposit events from BTC Vault, NFT module, and chain‑specific ERC‑20 vaults.

  * Executes borrowing logic after AI risk score approval.

  * Initiates cross‑chain transfers via ZetaChain Gateway to disburse funds on target chains.

  * Triggers liquidation flows when global LTV exceeds thresholds.

* **Key Functions:**

   text  
* `function borrow(uint256 amount, address asset, uint256 targetChainId) external;`  
* `function repay(uint256 amount, address asset, uint256 sourceChainId) external;`  
* `function liquidate(address user) external onlyRole(LIQUIDATOR_ROLE);`  
  ---

  ## **Cross‑Chain Orchestration**

* All modules communicate via **ZetaChain’s Gateway API**, ensuring:

  1. Atomic updates across source and destination chains.

  2. Verified sender contracts.

  3. No double‑execution of loan events.

* Example:

  1. User deposits BTC → BTC Vault updated on ZetaChain USC.

  2. USC checks AI risk score → approves.

  3. USC triggers cross‑chain disbursement to Base chain loan vault.

Aegis’s smart contracts are designed for security first — with modular vaults for native BTC and NFTs, a Universal Loan Contract for orchestration, and strong upgrade patterns — enabling trust‑minimized, AI‑powered cross‑chain lending at scale.

---

## **6\. Frontend & User Experience**

The Aegis frontend is designed as a **single, seamless entry point** to interact with the **entire cross‑chain lending platform** — hiding the complexity of multi‑chain asset management behind an intuitive, responsive, and AI‑assisted UI.  
 It’s built on **Next.js \+ React** with **Chakra UI**, and communicates with Aegis backend microservices via **REST APIs** and **WebSockets** for live updates.

---

## **One Wallet Connect**

* **Multi‑chain wallet integration** allows users to connect:

  * **EVM wallets** (MetaMask, Coinbase Wallet, WalletConnect)

  * **Solana wallets** (Phantom)

  * **Native BTC wallets** (via PSBT signing and ZetaChain BTC module)

* Unified connection modal auto‑detects installed wallets and available connectors.

* **Auto‑Network Detection:**

  * When interacting with on‑chain modules, the app checks the user’s current chain and automatically routes or switches to the correct network.

  * For native BTC/SOL assets, no network switching is required — backend via ZetaChain handles signing/verification.

* **Security Note:** All signing happens client‑side; private keys never leave the device.

---

## **Unified Dashboard (Multi‑Chain Portfolio View)**

* **Aggregates all user positions across supported chains**:

  * Collateral balances

  * Active loans

  * LTV ratio per asset and total account

* **Data Sources:**

  * ZetaChain Universal Smart Contract — real‑time loan and collateral state

  * ZetaChain Gateway events — for off‑chain UI updates

* **Refresh Mechanism:**

  * SWR (stale‑while‑revalidate) polling every 5‑10 seconds

  * WebSocket push updates for instant UI refresh when events occur

* **Cross‑Chain Summation:** Values normalized in USD using Chainlink/Pyth oracles.

---

## **Real‑Time Health Metrics \+ Push Alerts**

* **Loan Health Indicators** in the dashboard:

  * Color‑coded LTV (Green \= Healthy, Yellow \= Warning, Red \= Liquidation Risk)

  * Risk heatmap across positions

* **Push Notifications:**

  * Users can opt‑in for Telegram, Discord, or email alerts

  * Notification triggers:

    * Margin call warnings

    * Loan liquidation events

    * Approval confirmations

* Delivered within \<30 seconds of event emission via backend event listeners to ZetaChain Gateway.

---

## **Interactive Onboarding Tutorial**

* **Built with `react-joyride`** for guided UI tours.

* Highlights:

  * Wallet connection and supported assets

  * How to deposit collateral

  * How to borrow across chains

  * Loan health monitoring features

* **Persistence:** Tutorial state stored in localStorage / user profile, so it only appears for new users or upon request.

* **Contextual Help:** Info tooltips provide AI‑generated explanations of DeFi terms via Gemini AI.

---

## **Multi‑Language Support**

* **Internationalization (i18n)** implemented using `next-i18next`.

* Currently supports:

  * **English (EN)**

  * **Spanish (ES)**

  * **Mandarin Chinese (ZH)**

* All static and dynamic UI strings are pulled from JSON translation files.

* Language preference is auto‑detected from browser locale but can be manually switched in settings.

* Gemini AI chatbot also supports multilingual Q\&A in‑app.

Aegis hides the complexity of multi‑chain lending behind a clean, unified, and educational user experience — connecting multiple wallets, showing aggregated risk in real time, and guiding users with AI‑powered onboarding, all available in multiple languages for a global audience.

---

## **7\. Integration with ZetaChain, BTC, Avalon, NFTs**

Aegis is built **natively on ZetaChain’s Universal Smart Contract (USC) framework**, which acts as the **orchestration layer** for all cross‑chain lending operations. The system integrates tightly with native BTC deposits, Avalon’s ZETA liquidity pools, and on‑chain NFT collateral modules without requiring wrapping or manual bridging. Aegis doesn’t just “connect” chains — it natively integrates multiple asset classes (BTC, NFTs, $ZETA) into a single lending experience, with ZetaChain handling low‑level cross‑chain messaging and Avalon supplying protocol‑native liquidity.

---

## **ZetaChain Gateway API – Core Cross‑Chain Router**

* **Function:** Handles **all cross‑chain messaging** between the Aegis USC on ZetaChain and chain‑specific vault or market contracts.

* **Capabilities Used in Aegis:**

  * **Event Listening:**

    * Detects deposit, repayment, liquidation events across BTC, SOL, EVM, and NFT chains.

    * Streams them into the Aegis backend for AI risk analysis and dashboard updates.

  * **Function Relays:**

    * Example: `borrow()` is called on Aegis USC → Gateway API routes asset disbursement to the target chain’s vault contract.

  * **Security:** Verifies sender chain, originating contract, and payload hash to prevent spoofed cross‑chain calls.

---

## **BTC Native Integration (No Wrap)**

* **Purpose:** Allow users to deposit real BTC from the Bitcoin network as collateral without using wrapped tokens or third‑party custodians.

* **Mechanism:**

  1. Each user is assigned a **vault address** (native Bitcoin address) monitored by ZetaChain’s **BTC module** at the UTXO level.

  2. when a deposit is confirmed on Bitcoin:

     * ZetaChain emits a `BTCDeposit` event to the USC.

     * USC updates the user’s collateral balance.

     * Optionally triggers **AI risk scoring** to adjust borrowing limits.

  3. BTC remains **securely on Bitcoin** but is recognized by Aegis for borrowing power.

* **Example Flow:** BTC deposit → USC state update → Borrow stablecoins on Base instantly.

---

## **Avalon Lending Pools for ZETA Loans**

* **Purpose:** Provide users with access to $ZETA liquidity directly within Aegis without leaving the platform.

* **Integration:**

  * Aegis USC connects to Avalon’s lending pool contracts via ZetaChain Gateway.

  * Users can:

    * **Deposit collateral** (BTC, SOL, NFTs, etc.)

    * **Borrow $ZETA** directly from Avalon’s pool, all in one transaction.

  * $ZETA disbursement is executed on the chain of choice for the borrower.

  * Loan state is synced between Aegis and Avalon for unified risk management.

---

## **NFT Collateralization – Cross‑Chain NFT Lending**

* **Purpose:** Allow NFTs from any supported chain to be used as collateral for loans on different chains.

* **Flow:**

  * User locks NFT in an **NFT Collateral Vault** contract on its origin chain:

    * Supported standards: ERC‑721, ERC‑1155, Solana Metaplex.

  * Lock event is relayed to the **Aegis USC** via ZetaChain Gateway.

  * USC marks the NFT as locked and grants borrowing power according to its AI‑verified valuation.

  * Borrower can take out assets on another chain (stablecoins, $ZETA, ETH, etc.).

  * Upon repayment, a release message is sent across chains and NFT is unlocked.

* **Security:**

  * Lien enforcement via escrow contract.

  * Double‑pledging is prevented by tracking `(chainId, collection, tokenId)` tuples in USC’s global ledger.

---

## **Example Cross‑Chain Borrow Scenario**

**Use Case:** Borrow $ZETA using BTC and NFT as combined collateral.

1. User deposits BTC to their vault address on Bitcoin → ZetaChain BTC module detects and updates USC.

2. User locks Ethereum NFT in NFT Collateral Vault → Gateway API relays event to USC.

3. Combined collateral meets AI‑defined LTV limits.

4. USC calls Avalon pool contract to borrow $ZETA.

5. ZetaChain routes $ZETA to user’s wallet on Base network.

6. All loan and collateral states remain in sync across BTC, Ethereum, ZetaChain, and Base.

---

## **8\. Security & Compliance**

Security in Aegis is **multi‑layered**, covering **on‑chain contract safety**, **off‑chain infrastructure protection**, **user asset control**, and **regulatory compliance**.  
 All protections are **proactively tested** and **continuously monitored** to safeguard user funds, maintain platform integrity, and comply with applicable data‑handling laws. Aegis isn’t just “secure by intention” — it’s secure in architecture, tooling, and enforcement. From audited, upgradeable smart contracts, to DDoS‑hardened backend APIs, to GDPR‑compliant data policies and full user permission control, every layer is designed to protect funds, data, and trust.

---

## **Smart Contract Audits**

* **Tools Used:**

  * **Slither** (static analysis) — detects common vulnerabilities (reentrancy, uninitialized storage, unchecked return values).

  * **Securify** — formal verification checks for compliance with security specifications.

* **Audit Process:**

  * All Solidity and Rust contracts pass Slither/Securify scans before deployment.

  * Critical vault and loan logic modules are peer‑reviewed before mainnet push.

  * Post‑deployment monitoring for abnormal events using ZetaChain’s event logs.

* **Scope Includes:**

  * **BTC Vault Module**

  * **NFT Collateral Module**

  * **Universal Loan Contract (USC)**

* **Key Checks:**

  * Overflow/underflow prevention

  * Reentrancy protections (`nonReentrant` modifiers)

  * Role enforcement (RBAC)

  * Pausable (circuit breaker) states

---

## **Off‑Chain Infrastructure Security**

* **HTTP Header Hardening:**

  * Implemented via **Helmet.js** in the Node.js backend to set secure response headers (HSTS, X‑Content‑Type‑Options, X‑Frame‑Options).

* **API Authentication & Authorization:**

  * Endpoints use **JWT (JSON Web Token)** to authenticate backend API calls.

  * Tokens are signed with a private server key and verified per request.

* **Rate Limiting & DDoS Protection:**

  * Implemented via `express-rate-limit` middleware.

  * Burst mitigation via reverse proxy (Cloudflare or Nginx) with IP‑based throttling.

* **Transport Security:**

  * All API and contract calls are served over **TLS 1.2+**.

  * Frontend ↔ Backend ↔ ZetaChain contracts use HTTPS/WebSocket Secure (`wss://`).

---

## **User Asset Control & Wallet Permissions**

* **Token Approval Revocation Tools** built directly into frontend:

  * Users can view all token allowances to the protocol’s contracts.

  * Single‑click revoke function calls `approve(spender, 0)` to prevent lingering exposure.

* **Multi‑Sig Governance for Protocol Upgrades:**

  * Admin keys controlling upgradeable proxies are secured in a 3‑of‑5 multi‑sig wallet.

* **Non‑Custodial Architecture:**

  * Users always sign transactions client‑side.

  * Aegis never has custody of private keys or funds.

---

## **Data Privacy & Compliance**

* **GDPR‑Compliant Data Handling:**

  * Only minimal metadata stored off‑chain (wallet address mappings, notification preferences).

  * Personally Identifiable Information (PII) avoided wherever possible.

  * Data deletion requests honored instantly via backend API.

* **Encryption:**

  * All sensitive stored data is **AES‑256 encrypted** at rest.

  * Secrets & keys stored in **Google Cloud Secret Manager** with IAM‑restricted access.

* **Audit Logging & Traceability:**

  * Access to sensitive operations is logged.

  * On‑chain and off‑chain activities are timestamped for forensic analysis.

---

## **9\. Development Workflow**

Aegis follows a **continuous integration and continuous deployment (CI/CD) pipeline** to ensure every change is **tested, secure, and blockchain‑ready** before it reaches mainnet.  
 The workflow is designed to **minimize bugs, prevent regressions, and ensure consistent builds** across developers, staging, and production. Aegis uses an enterprise‑grade CI/CD workflow with automated ZetaChain testnet deployments on merge, full AI‑powered E2E loan simulations, and strict branch controls — ensuring every update is reliable, tested, and production‑safe before going live.

---

## **Branching Strategy**

* **`dev`** → Active development branch for new features and bug fixes.

  * All PRs must pass **unit & integration tests** before merge.

* **`staging`** → Pre‑production environment.

  * Mirrors the production environment but deployed to **ZetaChain testnet**.

  * Used for cross‑chain simulations using BTC testnet, Solana devnet, Avalanche Fuji, and Base testnet.

* **`main`** → Production-ready code.

  * Only merges from `staging` after successful QA \+ manual review.

  * Deploys to **ZetaChain mainnet** and live frontend on Google Cloud.

  ---

  ## **GitHub Actions – Automated CI/CD Pipeline**

* **Triggers:**

  1. `push` or `pull_request` to `dev` or `staging`

  2. Manual `workflow_dispatch` for hotfixes

* **Pipeline Stages:**

  1. **Lint & Static Analysis**

     * Solidity linting via `solhint`

     * JS/TS linting via `eslint`

     * Security scanning with **Slither** and **Securify**

  2. **Unit Tests**

     * **Solidity** tests via Hardhat/Foundry

     * **Backend** Node.js tests via Jest

     * **Frontend** component tests via React Testing Library

  3. **Integration Tests**

     * Deploy contracts to local Hardhat network

     * Cross‑chain testing scripts using ZetaChain testnet \+ mock BTC/SOL events

  4. **Build & Deploy**

     * Build Next.js frontend

     * Package backend in Docker container

     * Auto‑deploy to:

       * **Staging:** ZetaChain testnet smart contracts \+ staging backend/frontend

       * **Main:** ZetaChain mainnet contracts \+ production backend/frontend on Google Cloud Run

  ---

  ## **Automated ZetaChain Testnet Deploys**

* On merge to **`staging`**:

  * GitHub Actions deploys updated smart contracts to **ZetaChain Athens testnet**.

  * Backend config auto‑updates with new testnet contract addresses and ABI.

  * E2E scripts run:

    * Deposit BTC on testnet vault

    * Borrow from Avalon pool

    * Trigger AI risk scoring

    * Repay / liquidate workflow simulation

  * If all E2E tests pass, release is marked “Ready for Production”.

  ---

  ## **Continuous Monitoring**

* **Post‑Deploy Tests**:

  * Smoke tests ensuring contracts are callable and UI loads correctly across supported wallets.

* **Error Tracking:**

  * Sentry for frontend/backend error logging.

* **Blockchain Event Monitoring:**

  * ZetaChain Gateway event listeners run in staging & prod to validate transaction flows.

  ---

  ## **10\. Testing & Validation**

Aegis uses a **multi‑stage testing strategy** that validates every layer of the protocol — from smart contract logic to full cross-chain, real‑asset simulations — **before any code reaches production**. Aegis testing isn’t just unit checks — it’s real BTC testnet deposits, NFT escrow events, and multi‑chain liquidations executed in live environments to prove both correctness and resilience before production.

Testing is automated where possible via **GitHub Actions** and is also run manually for live cross‑chain scenarios.

---

## **Unit Testing – Contracts & Application Logic**

## **Smart Contract Unit Tests (Hardhat / Foundry)**

* **Frameworks:** Hardhat \+ Chai \+ Ethers.js (for EVM), Anchor (for Solana)

* **Scope:**

  * Core lending logic (borrow, repay, liquidate)

  * Collateral vaults (BTC, NFT ERC‑721/1155, ERC‑20)

  * Access control / pausable / reentrancy guards

  * AI‑driven LTV limits (mocked inference calls)

* **Execution:**

   bash  
* `npx hardhat test`  
*   
* Uses mocked ZetaChain Gateway calls to simulate cross‑chain messages inside a local EVM environment.

  ## **Backend Logic Tests (Jest)**

* Covers Node.js microservices:

  * ZetaChain event parsing

  * Price feed & oracle handlers

  * AI model integration stubs

  * User authentication & rate limiting

* Run with:

   bash  
* `npm run test`  
*   
  ---

  ## **Live Cross‑Chain Testnet Simulations**

**Purpose:** Validate the **end‑to‑end flow** on real blockchain networks before mainnet.

* **Testnet Environments:**

  * **Bitcoin Testnet3** — native BTC vault deposit simulations

  * **Solana Devnet** — SOL deposit → cross‑chain loan workflows

  * **Avalanche Fuji Testnet** — EVM vault and loan repayment flows

  * **Base Goerli Testnet** — borrow/disburse assets cross‑chain

  * **ZetaChain Athens Testnet** — orchestration of all above

**Scenarios Tested:**

1. **BTC Collateral → Borrow on Base**

   * Send BTC to vault → verify USC state update → Gateway delivers loan on Base

2. **NFT Collateral on Ethereum → Borrow on Avalanche**

   * Lock NFT ERC‑721 → USC updates → funds released cross‑chain

3. **Loan Liquidation Events**

   * Trigger price drop → AI marks loan high risk → Gateway executes liquidation msg

4. **Repay on Different Chain**

   * Loan taken on Base repaid from Avalanche → USC reconciles debt globally

   ---

   ## **Load & Fuzz Testing**

   ## **Load Testing**

* **Goal:** Ensure stability under peak usage and high transaction volume.

* **Tooling:**

  * Locust & Artillery for backend API load

  * Hardhat stress testing across multiple simulated addresses

* **Metrics:** TPS, latency, memory usage, gas cost tracking.

  ## **Fuzz Testing**

* **Goal:** Detect edge‑case vulnerabilities & logical failures under unpredictable inputs.

* **Approach:**

  * Foundry fuzzing on Solidity functions (randomized loan amounts, collateral mixes)

  * Differential testing to compare expected vs. actual state after random sequences of deposits, borrows, and repayments.

* **Benefit:** Helps ensure logic safety even in attacker‑crafted transaction patterns.

  ---

  ## **Continuous Integration (CI) Validation**

* All PRs trigger GitHub Actions:

  1. **Lint & security scan** (Solhint, Slither, Securify)

  2. **Unit tests** (Hardhat \+ Jest)

  3. **Integration tests** on local cross‑chain mocks

* Merges to `staging` auto‑deploy to **ZetaChain testnet** and run **live E2E cross‑chain tests**.

* Only passing builds are promoted to `mainnet`.

---

## **11\. Deployment**

Deployment for **Aegis** is designed to be **repeatable, automated, and multi‑environment**, ensuring the same process works for **ZetaChain testnet**, partner chain testnets, and full mainnet rollout. Aegis mainnet deployments are automated, containerized, and secured — with smart contracts on ZetaChain/partner chains, backend AI‑driven services on Cloud Run, and a CDN‑accelerated frontend — ensuring low‑latency access and zero downtime for a global DeFi audience.

 The pipeline pushes updates to **smart contracts**, **frontend**, and **backend** in a coordinated release to avoid version mismatches or downtime.

---

## **Smart Contracts — *ZetaChain Mainnet \+ Connected Chains***

* **Primary Deployment Target:**

  1. **ZetaChain Mainnet Universal Smart Contract (USC)** – the single source of truth for all loan state and collateral records.

* **Connected Chain Deployments:**

  1. Avalanche C‑Chain mainnet

  2. Base L2 mainnet

  3. Ethereum L1 or other EVM-compatible networks (for ERC‑20/NFT vaults)

  4. Solana mainnet (via Anchor programs)

  5. Native Bitcoin collateral vault addresses monitored by ZetaChain BTC Module

* **Deployment Tools:**

  1. **Hardhat** for EVM contracts with multi‑network config

  2. **Anchor CLI** for Solana smart contracts

  3. **ZetaChain CLI/Gateway SDK** for registering cross‑chain message routes

* **Release Process:**

  1. Compile & run static analysis

  2. Deploy to **Athens testnet** for final verification

  3. Promote to **ZetaChain mainnet** \+ connected chain mainnets

  4. Update backend `.env` & ABI artifacts automatically via GitHub Actions

---

## **Frontend — *Google Cloud Run \+ CDN Caching***

* **Framework:** Next.js (SSG \+ SSR) with Chakra UI

* **Build Process:**

  * GitHub Actions builds the Next.js app with environment variables for either staging or production

  * Minified & tree‑shaken output (`.next` directory) is containerized

* **Deployment:**

  * Pushed to **Google Cloud Run** as a stateless container

  * Connected to **Cloud CDN** for low‑latency global delivery

  * Automatic HTTPS on `aegis.finance` with SSL rotation via Google Managed Certificates

* **Caching Strategy:**

  * **Static content** (images, styles, docs) fully cached at edge

  * **Dynamic API calls** to backend bypass cache for real‑time data

---

## **Backend — *Containerized Node.js Microservices***

* **Structure:**

  * Loan orchestration service (handles borrow, repay, liquidation logic)

  * Event listener service (subscribes to ZetaChain Gateway events)

  * AI scoring service (communicates with Google Vertex AI / Gemini models)

* **Containerization:**

  * Each backend service packaged into a **Docker image**

  * Environment configuration injected via Google Cloud Secret Manager

* **Deployment:**

  * **Google Cloud Run** for stateless services

  * **Google Cloud Pub/Sub** for async event queueing and cross‑service messaging

  * Horizontally scaled to handle spikes during major DeFi events (liquidations, airdrops)

* **Networking & Security:**

  * All API endpoints served over HTTPS

  * JWT authentication for private endpoints

  * IP allowlists for critical admin API calls

---

## **Deployment Workflow Summary**

1. Merge approved PR into `main`

2. GitHub Actions triggers:

   * Build & deploy smart contracts to ZetaChain mainnet and connected chains

   * Build & deploy backend microservices to Cloud Run

   * Build & deploy frontend to Cloud Run \+ CDN

3. Post‑deploy smoke tests run automatically:

   * Wallet connection check

   * Loan simulation with BTC → Base USDC borrow

   * NFT collateral lock/unlock flow

4. Status posted to team Slack/Discord

---

## **12\. Community & Growth**

Aegis is built to thrive through **open collaboration, transparent communication, and continuous ecosystem expansion**. Aegis’ growth plan is structured and data‑driven — with strong user channels, deep dev tooling, and partnership outreach ensuring that the protocol not only launches successfully but also grows sustainably within the ZetaChain ecosystem.

 We focus equally on **user adoption** and **developer enablement**, ensuring both traders and builders can engage with the platform easily.

---

## **Communication Channels**

* **Discord** – Core hub for governance discussions, user support, and developer Q\&A.

  * Channels for: Announcements, Dev Updates, Testnet Feedback, Bug Reports, DAO proposals.

  * Live community calls hosted weekly.

* **Telegram** – Quick updates, community engagement, and AMAs.

* **Twitter (X)** – News, partnerships, feature rollouts, and ecosystem highlights.

* **GitHub Discussions** – Technical proposals, feature requests, and RFCs for protocol upgrades.

* **Newsletter** – Monthly updates with performance metrics, roadmap status, and tutorials.

---

## **Developer Resources**

* **Complete Developer Documentation** (`/docs` directory):

  * Smart contract API reference (ZetaChain USC, BTC vault, NFT module)

  * Gateway API integration guide

  * AI/ML API endpoints (credit scoring, liquidation forecasting)

  * Example code snippets in Solidity, Rust, and TypeScript

* **Aegis SDK** – Available in `/sdk`:

  * JavaScript/TypeScript client for interacting with contracts and the backend API

  * Utility methods for cross‑chain loan simulations

  * Hooks for frontend integration in React/Next.js apps

* **Quickstart Templates** – Boilerplates for:

  * EVM dApp integration

  * Solana program integration

  * BTC deposit tracking via ZetaChain module

* **Open API Access**:

  * REST & WebSocket endpoints for real‑time loan metrics, price data, and Gateway events.

---

## **Community Growth Strategy**

* **Early Adopter Program** – Incentives for testers who provide actionable feedback.

* **Bounties & Hackathons** – Open challenges for:

  * Building new lending strategies

  * Creating NFT‑based borrowing games

  * Expanding integrations with other ZetaChain apps

* **Protocol Partnerships** – Active collaborations with DeFi protocols, NFT marketplaces, and DAO treasuries for shared liquidity pools.

* **Educational Campaigns**:

  * Cross‑chain lending masterclasses

  * AI in DeFi webinars

  * Multi‑chain wallet security workshops

---

## **Metrics & Feedback Loops**

* **Tracking KPIs**:

  * Number of unique wallets across all chains

  * Total cross‑chain TVL (BTC, SOL, NFTs, EVM tokens)

  * $ZETA borrowed via Avalon integration

  * User retention rate by cohort

* **Community Feedback → Development Loop**:

  * Feature requests and bug reports triaged weekly

  * Top community requests fed into public roadmap

  * Regular release notes and dev changelogs shared

---

## **13\. Future Improvements**

Aegis is designed with a **modular, upgrade‑ready architecture**, ensuring new capabilities can be integrated without disrupting existing functionality. Aegis isn’t just built for now — its architecture anticipates DAO‑driven governance, privacy‑preserving lending via ZK proofs, expansion to high‑growth chains like TON and Sui, and advanced NFT‑powered lending products that could define the next wave of DeFi innovation. The following roadmap items represent **high‑impact features** planned for post‑hackathon development.

---

## **DAO Governance**

* **Goal:** Transition Aegis from a team‑controlled protocol to a **community‑governed DAO** for transparency, decentralization, and long‑term alignment.

* **Technical Approach:**

  * Implement on‑chain governance contracts (e.g., OpenZeppelin `Governor` module or Tally-compatible setup).

  * Proposals can include:

    * Parameter adjustments (LTV limits, interest rate curves)

    * New collateral/borrowable asset approval

    * Treasury spend authorizations

  * Voting power assigned based on **governance token holdings** or **liquidity provider stakes**.

  * Integration with **Snapshot** for gasless off‑chain voting connected to on‑chain execution.

* **Benefit:** Ensures protocol upgrades, integrations, and economic policies are decided by the community.

---

## **ZK‑Proof Private Lending**

* **Goal:** Enable borrowers to prove collateral sufficiency **without revealing wallet identity or asset details**, enhancing privacy in DeFi lending.

* **Technical Approach:**

  * Use **zero‑knowledge proof frameworks** (zk‑SNARKs, zk‑STARKs, Halo2) to:

    1. Prove that deposited collateral meets or exceeds LTV requirements.

    2. Prove repayment state without exposing full transaction history.

  * Integrate with **ZetaChain USC** so proofs are verified before loan execution.

  * Potential tooling: Aztec Connect, Noir, or zkSync libraries.

* **Benefit:** Attracts institutions and privacy‑minded users by removing the need to expose full wallet data for lending eligibility.

---

## **More Chain Integrations (TON, Sui, etc.)**

* **Goal:** Expand Aegis beyond current supported networks to **emerging high‑performance ecosystems**.

* **Planned Chains:**

  * **TON** — targeting mobile‑first/Web3 social finance (e.g., Telegram integration).

  * **Sui** — high throughput for gaming/metaverse lending scenarios.

  * **Monad** or other upcoming EVM‑compatible L1s for scaling.

* **Technical Approach:**

  * Extend ZetaChain Gateway API routes to new chain adapters.

  * Deploy network‑compatible vault contracts on new chains for collateral and lending.

  * Add front‑end wallet and RPC support for each chain.

* **Benefit:** Increased TVL from new user bases and access to unique collateral types native to those chains.

---

## **Advanced NFT Financialization**

* **Goal:** Move beyond simple NFT‑as‑collateral to **multi‑modal NFT finance products**.

* **Potential Features:**

  * **Floor Price‑Indexed Lending Pools** — auto‑adjust LTV based on real‑time floor price tracking via NFT oracles.

  * **NFT Fractionalization in Aegis Pools** — enable locked NFTs to be split into fungible tokens for liquidity providers.

  * **Cross‑Chain NFT Leveraging** — borrow against an NFT collateral on one chain to acquire NFTs on another chain.

  * **NFT Rental & Revenue‑Share** — integrate in‑protocol leasing for NFTs that produce yield (e.g., in‑game assets, metaverse land).

* **Technical Approach:**

  * Update NFT Collateral Module with ERC‑4907 (rental), ERC‑3525 (semi‑fungible) support.

  * AI‑driven valuation models for illiquid or rare NFTs.

* **Benefit:** Creates deeper NFT liquidity markets, attracting both collectors and DeFi traders.

---

## **14\. References**

* [ZetaChain Docs](https://www.zetachain.com/docs)

* [Google Vertex AI](https://cloud.google.com/vertex-ai)

* [Avalon Protocol](https://www.perplexity.ai/search/i-need-you-to-write-a-detailed-qGpE6HFnToursP0BqMzckw#)

