export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'
export const WS_URL = BACKEND_URL.replace(/^http/, 'ws') + '/ws'

export const CHAIN_ID = 8453 // Base mainnet
export const CHAIN_ID_HEX = '0x2105'

export const BASE_CHAIN = {
  chainId: CHAIN_ID_HEX,
  chainName: 'Base',
  rpcUrls: ['https://mainnet.base.org'],
  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  blockExplorerUrls: ['https://basescan.org'],
}
