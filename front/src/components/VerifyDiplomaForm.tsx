import { useState, type FormEvent } from 'react'
import { Contract } from 'ethers'
import { CONTRACT_ADDRESS, DIPLOMA_ABI, ETHERSCAN_BASE } from '../contract/config'
import { readProvider } from '../contract/readProvider'
import { formatTimestamp, shortAddress } from '../lib/format'
import { Seal } from './Seal'

type DiplomaData = {
  tokenId: string
  studentName: string
  diplomaName: string
  year: string
  mention: string
  issuedAt: bigint
  revoked: boolean
  owner: string
}

export function VerifyDiplomaForm() {
  const [tokenId, setTokenId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [diploma, setDiploma] = useState<DiplomaData | null>(null)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setDiploma(null)

    const id = tokenId.trim()
    if (!/^\d+$/.test(id)) {
      setError('Le token ID doit être un entier positif.')
      return
    }

    setLoading(true)
    try {
      const contract = new Contract(CONTRACT_ADDRESS, DIPLOMA_ABI, readProvider)
      const result = await contract.getDiploma(BigInt(id))
      setDiploma({
        tokenId: id,
        studentName: result[0],
        diplomaName: result[1],
        year: result[2],
        mention: result[3],
        issuedAt: result[4],
        revoked: result[5],
        owner: result[6],
      })
    } catch (err: unknown) {
      const e = err as { shortMessage?: string; message?: string; reason?: string }
      const msg = e.reason || e.shortMessage || e.message || 'Erreur inconnue'
      if (msg.includes('Diploma does not exist') || msg.includes('could not decode')) {
        setError(`Aucun diplôme trouvé pour le token ID ${id}.`)
      } else {
        setError(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} className="flex gap-2">
        <input
          type="text"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
          placeholder="Token ID (ex. 1)"
          className="flex-1 px-3 py-2 bg-[var(--bg-elev)] border border-[var(--rule)] rounded-sm text-[var(--ink)] placeholder:text-[var(--ink-mute)] focus:outline-none focus:border-[var(--accent)]"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 bg-[var(--ink)] hover:bg-[var(--accent)] disabled:bg-[var(--ink-mute)] disabled:cursor-not-allowed text-[var(--bg)] text-sm font-medium rounded-sm transition-colors"
        >
          {loading ? 'Vérification…' : 'Vérifier'}
        </button>
      </form>

      {error && (
        <div className="p-3 bg-[var(--accent-soft)] border border-[var(--rule)] text-sm text-[var(--accent)]">
          {error}
        </div>
      )}

      {diploma && <Certificate diploma={diploma} />}
    </div>
  )
}

function Certificate({ diploma }: { diploma: DiplomaData }) {
  return (
    <article
      className="relative bg-[var(--bg-elev)] border border-[var(--rule)] px-8 py-10 sm:px-12 sm:py-14"
      style={{
        boxShadow:
          'inset 0 0 0 1px var(--bg-elev), inset 0 0 0 2px var(--rule-soft)',
      }}
    >
      <div className="absolute top-4 right-5 wordmark text-[10px] text-[var(--ink-mute)]">
        N° {diploma.tokenId}
      </div>

      <div className="flex flex-col items-center text-center">
        <div className="text-[var(--accent)] mb-4">
          <Seal size={64} />
        </div>

        <div className="wordmark text-[10px] text-[var(--ink-mute)] mb-1">
          Certificat
        </div>
        <p className="serif italic text-[var(--ink-soft)] text-sm mb-6">
          Le présent document atteste que
        </p>

        <h3 className="serif text-3xl sm:text-4xl text-[var(--ink)] mb-1">
          {diploma.studentName}
        </h3>

        <p className="serif italic text-[var(--ink-soft)] text-sm mt-5 mb-2">
          a obtenu le diplôme de
        </p>

        <p className="serif text-xl sm:text-2xl text-[var(--ink)]">
          {diploma.diplomaName}
        </p>

        {diploma.mention && (
          <p className="serif italic text-[var(--ink-soft)] mt-2">
            avec la mention {diploma.mention}
          </p>
        )}

        <div className="mt-6 flex items-center gap-3 text-xs text-[var(--ink-mute)] wordmark">
          <span>Promotion {diploma.year}</span>
          <span>·</span>
          <span>{formatTimestamp(diploma.issuedAt)}</span>
        </div>

        {diploma.revoked && (
          <div className="mt-6 wordmark text-[11px] px-3 py-1 bg-[var(--accent)] text-[var(--bg)]">
            Diplôme révoqué
          </div>
        )}
        {!diploma.revoked && (
          <div className="mt-6 wordmark text-[11px] text-[var(--success)]">
            ◆ Diplôme valide
          </div>
        )}
      </div>

      <div className="mt-10 pt-5 border-t border-[var(--rule-soft)] flex justify-between items-center text-[11px] text-[var(--ink-mute)]">
        <div>
          <div className="wordmark mb-0.5">Détenteur</div>
          <a
            href={`${ETHERSCAN_BASE}/address/${diploma.owner}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[var(--ink-soft)] hover:text-[var(--accent)]"
            title={diploma.owner}
          >
            {shortAddress(diploma.owner)}
          </a>
        </div>
        <div className="text-right">
          <div className="wordmark mb-0.5">Sceau on-chain</div>
          <a
            href={`${ETHERSCAN_BASE}/address/${CONTRACT_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[var(--ink-soft)] hover:text-[var(--accent)]"
          >
            {shortAddress(CONTRACT_ADDRESS)}
          </a>
        </div>
      </div>
    </article>
  )
}
