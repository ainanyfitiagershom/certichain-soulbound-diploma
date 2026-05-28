import { useState, type FormEvent } from 'react'
import { Contract, isAddress } from 'ethers'
import type { JsonRpcSigner } from 'ethers'
import { CONTRACT_ADDRESS, DIPLOMA_ABI, ETHERSCAN_BASE } from '../contract/config'

type Props = {
  signer: JsonRpcSigner
  onTransferred?: () => void
}

export function TransferOwnershipForm({ signer, onTransferred }: Props) {
  const [newOwner, setNewOwner] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<{ newOwner: string; txHash: string } | null>(
    null,
  )

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!isAddress(newOwner)) {
      setError('Adresse invalide.')
      return
    }

    if (newOwner.toLowerCase() !== confirm.toLowerCase()) {
      setError('Les deux adresses ne correspondent pas — vérifiez votre saisie.')
      return
    }

    setLoading(true)
    try {
      const contract = new Contract(CONTRACT_ADDRESS, DIPLOMA_ABI, signer)
      const tx = await contract.transferOwnership(newOwner)
      await tx.wait()
      setSuccess({ newOwner, txHash: tx.hash })
      setNewOwner('')
      setConfirm('')
      onTransferred?.()
    } catch (err: unknown) {
      const e = err as { shortMessage?: string; message?: string; reason?: string }
      setError(e.reason || e.shortMessage || e.message || 'Erreur inconnue.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="p-3 border border-[var(--rule)] bg-[var(--accent-soft)] text-xs text-[var(--accent)]">
        ⚠ Action irréversible. Une fois transférée, seule la nouvelle adresse
        pourra émettre, révoquer ou re-transférer.
      </div>

      <label className="block">
        <span className="wordmark text-[10px] text-[var(--ink-mute)] block mb-1.5">
          Nouvelle adresse du propriétaire
        </span>
        <input
          type="text"
          value={newOwner}
          onChange={(e) => setNewOwner(e.target.value)}
          placeholder="0x…"
          disabled={loading}
          className="w-full px-3 py-2 bg-[var(--bg-elev)] border border-[var(--rule)] rounded-sm text-[var(--ink)] placeholder:text-[var(--ink-mute)] focus:outline-none focus:border-[var(--accent)] font-mono text-sm"
        />
      </label>

      <label className="block">
        <span className="wordmark text-[10px] text-[var(--ink-mute)] block mb-1.5">
          Confirmer l'adresse (anti-erreur)
        </span>
        <input
          type="text"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="0x…"
          disabled={loading}
          className="w-full px-3 py-2 bg-[var(--bg-elev)] border border-[var(--rule)] rounded-sm text-[var(--ink)] placeholder:text-[var(--ink-mute)] focus:outline-none focus:border-[var(--accent)] font-mono text-sm"
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 bg-[var(--danger)] hover:bg-[var(--ink)] disabled:bg-[var(--ink-mute)] disabled:cursor-not-allowed text-[var(--bg)] font-medium rounded-sm transition-colors"
      >
        {loading ? 'Transfert en cours…' : 'Transférer le propriétaire'}
      </button>

      {error && (
        <div className="p-3 bg-[var(--accent-soft)] border border-[var(--rule)] text-sm text-[var(--accent)]">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 border border-[var(--rule)] bg-[var(--bg-elev)] text-sm space-y-2">
          <div className="text-[var(--ink)]">
            Propriétaire transféré à{' '}
            <span className="font-mono">{success.newOwner.slice(0, 10)}…</span>.
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
