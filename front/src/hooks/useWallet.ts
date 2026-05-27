import { useCallback, useEffect, useState } from 'react'
import { BrowserProvider, Contract, type JsonRpcSigner } from 'ethers'
import {
  CONTRACT_ADDRESS,
  DIPLOMA_ABI,
  SEPOLIA_CHAIN_ID,
  SEPOLIA_CHAIN_ID_HEX,
} from '../contract/config'
import { readProvider } from '../contract/readProvider'

export type WalletState = {
  address: string | null
  chainId: bigint | null
  provider: BrowserProvider | null
  signer: JsonRpcSigner | null
  contractOwner: string | null
  isAdmin: boolean
  isCorrectNetwork: boolean
  hasMetaMask: boolean
}

export type WalletActions = {
  connect: () => Promise<void>
  switchToSepolia: () => Promise<void>
  refreshOwner: () => Promise<void>
}

export function useWallet(): WalletState & WalletActions {
  const [address, setAddress] = useState<string | null>(null)
  const [chainId, setChainId] = useState<bigint | null>(null)
  const [provider, setProvider] = useState<BrowserProvider | null>(null)
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null)
  const [contractOwner, setContractOwner] = useState<string | null>(null)

  const hasMetaMask = typeof window !== 'undefined' && !!window.ethereum
  const isCorrectNetwork = chainId !== null && chainId === SEPOLIA_CHAIN_ID
  const isAdmin =
    !!address &&
    !!contractOwner &&
    address.toLowerCase() === contractOwner.toLowerCase()

  const initFromProvider = useCallback(async (browserProvider: BrowserProvider) => {
    const network = await browserProvider.getNetwork()
    setChainId(network.chainId)
    const accounts = await browserProvider.listAccounts()
    if (accounts.length > 0) {
      const s = await browserProvider.getSigner()
      setSigner(s)
      setAddress(await s.getAddress())
    } else {
      setSigner(null)
      setAddress(null)
    }
  }, [])

  const refreshOwner = useCallback(async () => {
    try {
      // Always read owner from Sepolia public RPC, not from the wallet provider
      // (the wallet may be on the wrong network).
      const contract = new Contract(CONTRACT_ADDRESS, DIPLOMA_ABI, readProvider)
      const owner: string = await contract.owner()
      setContractOwner(owner)
    } catch (err) {
      console.error('Cannot read contract owner:', err)
      setContractOwner(null)
    }
  }, [])

  const connect = useCallback(async () => {
    if (!window.ethereum) throw new Error('MetaMask non détecté')
    const browserProvider = new BrowserProvider(window.ethereum)
    await browserProvider.send('eth_requestAccounts', [])
    setProvider(browserProvider)
    await initFromProvider(browserProvider)
  }, [initFromProvider])

  const switchToSepolia = useCallback(async () => {
    if (!window.ethereum) throw new Error('MetaMask non détecté')
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: SEPOLIA_CHAIN_ID_HEX }],
      })
    } catch (err: unknown) {
      const e = err as { code?: number }
      if (e.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: SEPOLIA_CHAIN_ID_HEX,
              chainName: 'Sepolia',
              nativeCurrency: { name: 'SepoliaETH', symbol: 'ETH', decimals: 18 },
              rpcUrls: ['https://sepolia.infura.io/v3/'],
              blockExplorerUrls: ['https://sepolia.etherscan.io'],
            },
          ],
        })
      } else {
        throw err
      }
    }
  }, [])

  // Auto-detect existing connection on load
  useEffect(() => {
    if (!window.ethereum) return
    const browserProvider = new BrowserProvider(window.ethereum)
    setProvider(browserProvider)
    initFromProvider(browserProvider).catch(console.error)
  }, [initFromProvider])

  // Load owner once on mount (independent of wallet)
  useEffect(() => {
    refreshOwner()
  }, [refreshOwner])

  // Listen for account / chain changes
  useEffect(() => {
    if (!window.ethereum?.on) return
    const handleAccountsChanged = () => {
      if (provider) initFromProvider(provider).catch(console.error)
    }
    const handleChainChanged = () => {
      window.location.reload()
    }
    window.ethereum.on('accountsChanged', handleAccountsChanged)
    window.ethereum.on('chainChanged', handleChainChanged)
    return () => {
      window.ethereum?.removeListener?.('accountsChanged', handleAccountsChanged)
      window.ethereum?.removeListener?.('chainChanged', handleChainChanged)
    }
  }, [provider, initFromProvider])

  return {
    address,
    chainId,
    provider,
    signer,
    contractOwner,
    isAdmin,
    isCorrectNetwork,
    hasMetaMask,
    connect,
    switchToSepolia,
    refreshOwner,
  }
}
