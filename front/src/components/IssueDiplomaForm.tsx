import { useState, type FormEvent } from 'react'
import { Contract, isAddress } from 'ethers'
import type { JsonRpcSigner } from 'ethers'
import { CONTRACT_ADDRESS, DIPLOMA_ABI, ETHERSCAN_BASE } from '../contract/config'

type Props = {
  signer: JsonRpcSigner
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  disabled,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  disabled?: boolean
}) {
  return (
    <label className="block">
      <span className="wordmark text-[10px] text-[var(--ink-mute)] block mb-1.5">
        {label}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-3 py-2 bg-[var(--bg-elev)] border border-[var(--rule)] rounded-sm text-[var(--ink)] placeholder:text-[var(--ink-mute)] focus:outline-none focus:border-[var(--accent)]"
      />
    </label>
  )
}

export function IssueDiplomaForm({ signer }: Props) {
  const [student, setStudent] = useState('')
  const [studentName, setStudentName] = useState('')
  const [diplomaName, setDiplomaName] = useState('')
  const [year, setYear] = useState('')
  const [mention, setMention] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<{ tokenId: string; txHash: string } | null>(
    null,
  )

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!isAddress(student)) {
      setError('Adresse étudiant invalide.')
      return
    }
    if (!studentName.trim() || !diplomaName.trim() || !year.trim()) {
      setError('Les champs étudiant, diplôme et année sont obligatoires.')
      return
    }

    setLoading(true)
    try {
      const contract = new Contract(CONTRACT_ADDRESS, DIPLOMA_ABI, signer)
      const tx = await contract.issueDiploma(
        student,
        studentName,
        diplomaName,
        year,
        mention,
      )
      const receipt = await tx.wait()

      let tokenId = '?'
      for (const log of receipt.logs) {
        try {
          const parsed = contract.interface.parseLog(log)
          if (parsed?.name === 'DiplomaIssued') {
            tokenId = parsed.args[0].toString()
            break
          }
        } catch {
          // not our event
        }
      }

      setSuccess({ tokenId, txHash: tx.hash })
      setStudent('')
      setStudentName('')
      setDiplomaName('')
      setYear('')
      setMention('')
    } catch (err: unknown) {
      const e = err as { shortMessage?: string; message?: string; reason?: string }
      setError(e.reason || e.shortMessage || e.message || 'Erreur inconnue.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Field
        label="Adresse étudiant"
        value={student}
        onChange={setStudent}
        placeholder="0x…"
        disabled={loading}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          label="Nom de l'étudiant"
          value={studentName}
          onChange={setStudentName}
          placeholder="Fitia Gershom"
          disabled={loading}
        />
        <Field
          label="Diplôme"
          value={diplomaName}
          onChange={setDiplomaName}
          placeholder="Master MBDS"
          disabled={loading}
        />
        <Field
          label="Promotion"
          value={year}
          onChange={setYear}
          placeholder="2026"
          disabled={loading}
        />
        <Field
          label="Mention (facultatif)"
          value={mention}
          onChange={setMention}
          placeholder="Très Bien"
          disabled={loading}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 bg-[var(--accent)] hover:bg-[var(--ink)] disabled:bg-[var(--ink-mute)] disabled:cursor-not-allowed text-[var(--bg)] font-medium rounded-sm transition-colors"
      >
        {loading ? 'Émission en cours…' : 'Émettre le diplôme'}
      </button>

      {error && (
        <div className="p-3 bg-[var(--accent-soft)] border border-[var(--rule)] text-sm text-[var(--accent)]">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 border border-[var(--rule)] bg-[var(--bg-elev)] text-sm space-y-2">
          <div className="text-[var(--ink)]">
            Diplôme émis avec succès — token <strong>N° {success.tokenId}</strong>.
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
