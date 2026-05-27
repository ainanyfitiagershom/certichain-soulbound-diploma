import { useState, type FormEvent } from 'react'
import { Contract } from 'ethers'
import type { JsonRpcSigner } from 'ethers'
import { CONTRACT_ADDRESS, DIPLOMA_ABI, ETHERSCAN_BASE } from '../contract/config'

type Props = {
  signer: JsonRpcSigner
}

export function RevokeDiplomaForm({ signer }: Props) {
  const [tokenId, setTokenId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<{ tokenId: string; txHash: string } | null>(
    null,
  )

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    const id = tokenId.trim()
    if (!/^\d+$/.test(id)) {
      setError('Le token ID doit être un entier positif.')
      return
    }

    setLoading(true)
    try {
      const contract = new Contract(CONTRACT_ADDRESS, DIPLOMA_ABI, signer)
      const tx = await contract.revokeDiploma(BigInt(id))
      await tx.wait()
      setSuccess({ tokenId: id, txHash: tx.hash })
      setTokenId('')
    } catch (err: unknown) {
      const e = err as { shortMessage?: string; message?: string; reason?: string }
      setError(e.reason || e.shortMessage || e.message || 'Erreur inconnue.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block">
        <span className="wordmark text-[10px] text-[var(--ink-mute)] block mb-1.5">
          Token ID à révoquer
        </span>
        <input
          type="text"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
          placeholder="1"
          disabled={loading}
          className="w-full px-3 py-2 bg-[var(--bg-elev)] border border-[var(--rule)] rounded-sm text-[var(--ink)] placeholder:text-[var(--ink-mute)] focus:outline-none focus:border-[var(--accent)]"
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 bg-[var(--danger)] hover:bg-[var(--ink)] disabled:bg-[var(--ink-mute)] disabled:cursor-not-allowed text-[var(--bg)] font-medium rounded-sm transition-colors"
      >
        {loading ? 'Révocation en cours…' : 'Révoquer le diplôme'}
      </button>

      {error && (
        <div className="p-3 bg-[var(--accent-soft)] border border-[var(--rule)] text-sm text-[var(--accent)]">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 border border-[var(--rule)] bg-[var(--bg-elev)] text-sm space-y-2">
          <div className="text-[var(--ink)]">
            Diplôme N° {success.tokenId} révoqué avec succès.
          </div>
          <a
            href={`${ETHERSCAN_BASE}/tx/${success.txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[var(--accent)] hover:underline"
          >
            Voir la transaction sur Etherscan ↗
          </a>
        </div>
      )}
    </form>
  )
}
