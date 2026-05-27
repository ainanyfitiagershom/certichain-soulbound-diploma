import abi from './DiplomaSoulbound.abi.json'

export const CONTRACT_ADDRESS = '0x4e6A699603829A64bccabd6Be9e5E5BF61D26fc8'
export const SEPOLIA_CHAIN_ID = 11155111n
export const SEPOLIA_CHAIN_ID_HEX = '0xaa36a7'
export const ETHERSCAN_BASE = 'https://sepolia.etherscan.io'

// Public Sepolia RPC — used for read-only calls (verify diploma, read owner)
// so the DApp works even without a wallet connection or when user is on
// the wrong network.
export const SEPOLIA_PUBLIC_RPC = 'https://ethereum-sepolia-rpc.publicnode.com'

export const DIPLOMA_ABI = abi
