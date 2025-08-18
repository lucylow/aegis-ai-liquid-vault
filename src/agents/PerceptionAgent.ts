import { EventEmitter } from "events";
import { ethers } from "ethers";
import { CONFIG } from "../../contracts/config";
import { BlockchainEvent, AegisAIAgent } from "./AegisAIAgent";

/**
 * Perception Agent - Blockchain Event Monitoring
 * 
 * This agent monitors blockchain events across multiple chains:
 * - EVM chains (Ethereum, Polygon, BSC, etc.)
 * - Bitcoin (via ZetaChain connector)
 * - Solana (via ZetaChain connector)
 * - ZetaChain native events
 */
export class PerceptionAgent extends EventEmitter {
  private agent: AegisAIAgent;
  private isRunning: boolean = false;
  private adapters: Map<string, BlockchainAdapter> = new Map();
  private messageBus: MessageBus;

  constructor(agent: AegisAIAgent) {
    super();
    this.agent = agent;
    this.messageBus = new MessageBus();
    this.initializeAdapters();
  }

  /**
   * Initialize blockchain adapters for different chains
   */
  private initializeAdapters(): void {
    // EVM chains
    const evmChains = [
      { name: 'ethereum', chainId: 1, rpc: CONFIG.RPC_URLS.ETHEREUM || 'https://eth-mainnet.alchemyapi.io/v2/demo' },
      { name: 'polygon', chainId: 137, rpc: CONFIG.RPC_URLS.POLYGON_TESTNET },
      { name: 'bsc', chainId: 56, rpc: CONFIG.RPC_URLS.BSC_TESTNET },
      { name: 'arbitrum', chainId: 42161, rpc: 'https://arb1.arbitrum.io/rpc' },
      { name: 'optimism', chainId: 10, rpc: 'https://mainnet.optimism.io' }
    ];

    evmChains.forEach(chain => {
      if (chain.rpc) {
        const adapter = new EVMAdapter(chain.name, chain.chainId, chain.rpc);
        this.adapters.set(chain.name, adapter);
      }
    });

    // ZetaChain
    const zetaAdapter = new ZetaChainAdapter('zetachain', CONFIG.CHAIN_IDS.ZETA_TESTNET, CONFIG.RPC_URLS.ZETA_TESTNET);
    this.adapters.set('zetachain', zetaAdapter);

    // Bitcoin (simulated via ZetaChain)
    const btcAdapter = new BitcoinAdapter('bitcoin', 0, CONFIG.RPC_URLS.ZETA_TESTNET);
    this.adapters.set('bitcoin', btcAdapter);

    // Solana (simulated via ZetaChain)
    const solAdapter = new SolanaAdapter('solana', 101, CONFIG.RPC_URLS.ZETA_TESTNET);
    this.adapters.set('solana', solAdapter);
  }

  /**
   * Start the perception agent
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      return;
    }

    console.log('👁️ Starting Perception Agent...');

    try {
      // Start all blockchain adapters
      for (const [name, adapter] of this.adapters) {
        await adapter.start();
        console.log(`✅ ${name} adapter started`);
      }

      // Start message bus
      await this.messageBus.start();

      this.isRunning = true;
      console.log('✅ Perception Agent started successfully');

    } catch (error) {
      console.error('❌ Failed to start Perception Agent:', error);
      throw error;
    }
  }

  /**
   * Stop the perception agent
   */
  async stop(): Promise<void> {
    if (!this.isRunning) {
      return;
    }

    console.log('🛑 Stopping Perception Agent...');

    try {
      // Stop all adapters
      for (const [name, adapter] of this.adapters) {
        await adapter.stop();
        console.log(`✅ ${name} adapter stopped`);
      }

      // Stop message bus
      await this.messageBus.stop();

      this.isRunning = false;
      console.log('✅ Perception Agent stopped successfully');

    } catch (error) {
      console.error('❌ Error stopping Perception Agent:', error);
      throw error;
    }
  }

  /**
   * Process a blockchain event
   */
  processEvent(event: BlockchainEvent): void {
    try {
      // Normalize the event
      const normalizedEvent = this.normalizeEvent(event);
      
      // Emit event for cognitive agent
      this.emit('event_detected', normalizedEvent);
      
      // Add to agent queue
      this.agent.addEvent(normalizedEvent);
      
      console.log(`📡 Event processed: ${normalizedEvent.type} on chain ${normalizedEvent.chainId}`);
      
    } catch (error) {
      console.error('Error processing event:', error);
      this.emit('event_processing_error', { event, error });
    }
  }

  /**
   * Normalize blockchain event to standard format
   */
  private normalizeEvent(event: any): BlockchainEvent {
    // Handle different event formats from different chains
    if (event.chainType === 'evm') {
      return this.normalizeEVMEvent(event);
    } else if (event.chainType === 'bitcoin') {
      return this.normalizeBitcoinEvent(event);
    } else if (event.chainType === 'solana') {
      return this.normalizeSolanaEvent(event);
    } else {
      return this.normalizeGenericEvent(event);
    }
  }

  /**
   * Normalize EVM event
   */
  private normalizeEVMEvent(event: any): BlockchainEvent {
    return {
      type: 'transaction',
      chainId: event.chainId,
      hash: event.hash,
      from: event.from,
      to: event.to,
      value: event.value,
      data: event.data,
      timestamp: event.timestamp || Date.now(),
      metadata: {
        gasPrice: event.gasPrice,
        nonce: event.nonce,
        blockNumber: event.blockNumber,
        chainType: 'evm'
      }
    };
  }

  /**
   * Normalize Bitcoin event
   */
  private normalizeBitcoinEvent(event: any): BlockchainEvent {
    return {
      type: 'transaction',
      chainId: 0, // Bitcoin
      hash: event.txid,
      from: event.inputs?.[0]?.address,
      to: event.outputs?.[0]?.address,
      value: event.outputs?.[0]?.value,
      data: '',
      timestamp: event.timestamp || Date.now(),
      metadata: {
        blockNumber: event.blockHeight,
        chainType: 'bitcoin',
        inputCount: event.inputs?.length,
        outputCount: event.outputs?.length
      }
    };
  }

  /**
   * Normalize Solana event
   */
  private normalizeSolanaEvent(event: any): BlockchainEvent {
    return {
      type: 'transaction',
      chainId: 101, // Solana
      hash: event.signature,
      from: event.from,
      to: event.to,
      value: event.amount,
      data: event.instructionData,
      timestamp: event.timestamp || Date.now(),
      metadata: {
        blockNumber: event.slot,
        chainType: 'solana',
        programId: event.programId
      }
    };
  }

  /**
   * Normalize generic event
   */
  private normalizeGenericEvent(event: any): BlockchainEvent {
    return {
      type: event.type || 'transaction',
      chainId: event.chainId || 0,
      hash: event.hash || event.txid || event.signature || '',
      from: event.from || event.sender || '',
      to: event.to || event.receiver || '',
      value: event.value || event.amount || '0',
      data: event.data || event.input || '',
      timestamp: event.timestamp || Date.now(),
      metadata: {
        ...event.metadata,
        chainType: event.chainType || 'unknown'
      }
    };
  }

  /**
   * Get adapter status
   */
  getAdapterStatus(): any {
    const status: any = {};
    
    for (const [name, adapter] of this.adapters) {
      status[name] = {
        isRunning: adapter.isRunning,
        lastEvent: adapter.lastEvent,
        eventCount: adapter.eventCount
      };
    }
    
    return status;
  }

  /**
   * Get agent status
   */
  getStatus(): any {
    return {
      isRunning: this.isRunning,
      adaptersCount: this.adapters.size,
      adapterStatus: this.getAdapterStatus()
    };
  }
}

/**
 * Base blockchain adapter interface
 */
abstract class BlockchainAdapter {
  protected name: string;
  protected chainId: number;
  protected isRunning: boolean = false;
  public lastEvent: any = null;
  public eventCount: number = 0;

  constructor(name: string, chainId: number) {
    this.name = name;
    this.chainId = chainId;
  }

  abstract start(): Promise<void>;
  abstract stop(): Promise<void>;
  abstract on(event: string, callback: Function): void;
  abstract emit(event: string, data: any): void;
}

/**
 * EVM Chain Adapter
 */
class EVMAdapter extends BlockchainAdapter {
  private provider: ethers.providers.JsonRpcProvider;
  private eventEmitter: EventEmitter = new EventEmitter();

  constructor(name: string, chainId: number, rpcUrl: string) {
    super(name, chainId);
    this.provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  }

  async start(): Promise<void> {
    if (this.isRunning) return;

    console.log(`🔗 Starting ${this.name} adapter...`);

    try {
      // Monitor pending transactions
      this.provider.on("pending", (txHash: string) => {
        this.handlePendingTransaction(txHash);
      });

      // Monitor new blocks
      this.provider.on("block", (blockNumber: number) => {
        this.handleNewBlock(blockNumber);
      });

      this.isRunning = true;
      console.log(`✅ ${this.name} adapter started`);

    } catch (error) {
      console.error(`❌ Failed to start ${this.name} adapter:`, error);
      throw error;
    }
  }

  async stop(): Promise<void> {
    if (!this.isRunning) return;

    this.provider.removeAllListeners();
    this.isRunning = false;
    console.log(`✅ ${this.name} adapter stopped`);
  }

  on(event: string, callback: Function): void {
    this.eventEmitter.on(event, callback);
  }

  emit(event: string, data: any): void {
    this.eventEmitter.emit(event, data);
  }

  private async handlePendingTransaction(txHash: string): Promise<void> {
    try {
      const tx = await this.provider.getTransaction(txHash);
      if (tx) {
        const event = {
          chainType: 'evm',
          chainId: this.chainId,
          hash: tx.hash,
          from: tx.from,
          to: tx.to,
          value: tx.value.toString(),
          data: tx.data,
          gasPrice: tx.gasPrice?.toString(),
          nonce: tx.nonce,
          timestamp: Date.now()
        };

        this.lastEvent = event;
        this.eventCount++;
        this.emit('transaction', event);
      }
    } catch (error) {
      console.error(`Error handling pending transaction on ${this.name}:`, error);
    }
  }

  private async handleNewBlock(blockNumber: number): Promise<void> {
    try {
      const block = await this.provider.getBlock(blockNumber);
      if (block) {
        const event = {
          chainType: 'evm',
          chainId: this.chainId,
          type: 'block',
          blockNumber: block.number,
          hash: block.hash,
          timestamp: block.timestamp * 1000,
          transactionCount: block.transactions.length
        };

        this.lastEvent = event;
        this.eventCount++;
        this.emit('block', event);
      }
    } catch (error) {
      console.error(`Error handling new block on ${this.name}:`, error);
    }
  }
}

/**
 * ZetaChain Adapter
 */
class ZetaChainAdapter extends BlockchainAdapter {
  private provider: ethers.providers.JsonRpcProvider;
  private eventEmitter: EventEmitter = new EventEmitter();

  constructor(name: string, chainId: number, rpcUrl: string) {
    super(name, chainId);
    this.provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  }

  async start(): Promise<void> {
    if (this.isRunning) return;

    console.log(`🔗 Starting ${this.name} adapter...`);

    try {
      // Monitor ZetaChain specific events
      this.provider.on("pending", (txHash: string) => {
        this.handlePendingTransaction(txHash);
      });

      this.provider.on("block", (blockNumber: number) => {
        this.handleNewBlock(blockNumber);
      });

      this.isRunning = true;
      console.log(`✅ ${this.name} adapter started`);

    } catch (error) {
      console.error(`❌ Failed to start ${this.name} adapter:`, error);
      throw error;
    }
  }

  async stop(): Promise<void> {
    if (!this.isRunning) return;

    this.provider.removeAllListeners();
    this.isRunning = false;
    console.log(`✅ ${this.name} adapter stopped`);
  }

  on(event: string, callback: Function): void {
    this.eventEmitter.on(event, callback);
  }

  emit(event: string, data: any): void {
    this.eventEmitter.emit(event, data);
  }

  private async handlePendingTransaction(txHash: string): Promise<void> {
    try {
      const tx = await this.provider.getTransaction(txHash);
      if (tx) {
        const event = {
          chainType: 'zetachain',
          chainId: this.chainId,
          hash: tx.hash,
          from: tx.from,
          to: tx.to,
          value: tx.value.toString(),
          data: tx.data,
          gasPrice: tx.gasPrice?.toString(),
          nonce: tx.nonce,
          timestamp: Date.now()
        };

        this.lastEvent = event;
        this.eventCount++;
        this.emit('transaction', event);
      }
    } catch (error) {
      console.error(`Error handling pending transaction on ${this.name}:`, error);
    }
  }

  private async handleNewBlock(blockNumber: number): Promise<void> {
    try {
      const block = await this.provider.getBlock(blockNumber);
      if (block) {
        const event = {
          chainType: 'zetachain',
          chainId: this.chainId,
          type: 'block',
          blockNumber: block.number,
          hash: block.hash,
          timestamp: block.timestamp * 1000,
          transactionCount: block.transactions.length
        };

        this.lastEvent = event;
        this.eventCount++;
        this.emit('block', event);
      }
    } catch (error) {
      console.error(`Error handling new block on ${this.name}:`, error);
    }
  }
}

/**
 * Bitcoin Adapter (simulated via ZetaChain)
 */
class BitcoinAdapter extends BlockchainAdapter {
  private eventEmitter: EventEmitter = new EventEmitter();
  private intervalId: NodeJS.Timeout | null = null;

  constructor(name: string, chainId: number, rpcUrl: string) {
    super(name, chainId);
  }

  async start(): Promise<void> {
    if (this.isRunning) return;

    console.log(`🔗 Starting ${this.name} adapter (simulated)...`);

    // Simulate Bitcoin block monitoring
    this.intervalId = setInterval(() => {
      this.simulateBitcoinEvent();
    }, 10000); // Every 10 seconds

    this.isRunning = true;
    console.log(`✅ ${this.name} adapter started`);
  }

  async stop(): Promise<void> {
    if (!this.isRunning) return;

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.isRunning = false;
    console.log(`✅ ${this.name} adapter stopped`);
  }

  on(event: string, callback: Function): void {
    this.eventEmitter.on(event, callback);
  }

  emit(event: string, data: any): void {
    this.eventEmitter.emit(event, data);
  }

  private simulateBitcoinEvent(): void {
    const event = {
      chainType: 'bitcoin',
      chainId: this.chainId,
      txid: `btc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      inputs: [
        { address: `bc1${Math.random().toString(36).substr(2, 26)}`, value: '0.001' }
      ],
      outputs: [
        { address: `bc1${Math.random().toString(36).substr(2, 26)}`, value: '0.0009' }
      ],
      blockHeight: Math.floor(Math.random() * 800000) + 800000,
      timestamp: Date.now()
    };

    this.lastEvent = event;
    this.eventCount++;
    this.emit('transaction', event);
  }
}

/**
 * Solana Adapter (simulated via ZetaChain)
 */
class SolanaAdapter extends BlockchainAdapter {
  private eventEmitter: EventEmitter = new EventEmitter();
  private intervalId: NodeJS.Timeout | null = null;

  constructor(name: string, chainId: number, rpcUrl: string) {
    super(name, chainId);
  }

  async start(): Promise<void> {
    if (this.isRunning) return;

    console.log(`🔗 Starting ${this.name} adapter (simulated)...`);

    // Simulate Solana transaction monitoring
    this.intervalId = setInterval(() => {
      this.simulateSolanaEvent();
    }, 5000); // Every 5 seconds

    this.isRunning = true;
    console.log(`✅ ${this.name} adapter started`);
  }

  async stop(): Promise<void> {
    if (!this.isRunning) return;

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.isRunning = false;
    console.log(`✅ ${this.name} adapter stopped`);
  }

  on(event: string, callback: Function): void {
    this.eventEmitter.on(event, callback);
  }

  emit(event: string, data: any): void {
    this.eventEmitter.emit(event, data);
  }

  private simulateSolanaEvent(): void {
    const event = {
      chainType: 'solana',
      chainId: this.chainId,
      signature: `sol_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      from: `${Math.random().toString(36).substr(2, 32)}`,
      to: `${Math.random().toString(36).substr(2, 32)}`,
      amount: (Math.random() * 100).toString(),
      instructionData: `0x${Math.random().toString(16).substr(2, 64)}`,
      slot: Math.floor(Math.random() * 200000000) + 200000000,
      programId: `${Math.random().toString(36).substr(2, 32)}`,
      timestamp: Date.now()
    };

    this.lastEvent = event;
    this.eventCount++;
    this.emit('transaction', event);
  }
}

/**
 * Message Bus for inter-agent communication
 */
class MessageBus extends EventEmitter {
  private isRunning: boolean = false;

  async start(): Promise<void> {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log('📡 Message Bus started');
  }

  async stop(): Promise<void> {
    if (!this.isRunning) return;
    
    this.isRunning = false;
    console.log('📡 Message Bus stopped');
  }
}
