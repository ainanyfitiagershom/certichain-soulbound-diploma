import { JsonRpcProvider } from 'ethers'
import { SEPOLIA_PUBLIC_RPC } from './config'

// Read-only provider pointing at Sepolia public RPC.
// Used for getDiploma() and owner() — works without any wallet.
export const readProvider = new JsonRpcProvider(SEPOLIA_PUBLIC_RPC)
