import { useWallet } from './hooks/useWallet'
import { IssueDiplomaForm } from './components/IssueDiplomaForm'
import { RevokeDiplomaForm } from './components/RevokeDiplomaForm'
import { TransferOwnershipForm } from './components/TransferOwnershipForm'
import { VerifyDiplomaForm } from './components/VerifyDiplomaForm'
import { Seal } from './components/Seal'
import { CONTRACT_ADDRESS, ETHERSCAN_BASE } from './contract/config'
import { shortAddress } from './lib/format'

function Section({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="border-t border-[var(--rule)] pt-10 pb-2">
      {eyebrow && (
        <div className="wordmark text-[10px] text-[var(--ink-mute)] mb-2">
          {eyebrow}
        </div>
      )}
      <h2 className="serif text-2xl text-[var(--ink)] mb-1">{title}</h2>
      {description && (
        <p className="text-sm text-[var(--ink-soft)] mb-6">{description}</p>
      )}
      {children}
    </section>
  )
}

function App() {
  const {
    address,
    signer,
    contractOwner,
    isAdmin,
    isCorrectNetwork,
    hasMetaMask,
    connect,
    switchToSepolia,
    refreshOwner,
  } = useWallet()

  return (
    <div className="min-h-screen flex flex-col">
      <div className="max-w-2xl mx-auto px-6 pt-16 pb-6 w-full text-center">
        <div className="flex justify-center mb-6 text-[var(--accent)]">
          <Seal size={56} />
        </div>
        <h1 className="wordmark text-2xl sm:text-3xl text-[var(--ink)] mb-3">
          CertiChain
        </h1>
        <p className="serif italic text-[var(--ink-soft)] text-lg max-w-md mx-auto">
          Diplômes vérifiables sur la blockchain
        </p>
      </div>

      <main className="max-w-2xl mx-auto px-6 pb-16 w-full flex-1">
        <div className="flex flex-col items-center gap-3 mb-10">
          {!address ? (
            <button
              onClick={() => connect().catch((e) => alert(e.message))}
              disabled={!hasMetaMask}
              className="px-5 py-2 bg-[var(--ink)] hover:bg-[var(--accent)] disabled:bg-[var(--ink-mute)] disabled:cursor-not-allowed text-[var(--bg)] text-sm tracking-wide font-medium rounded-sm transition-colors"
            >
              {hasMetaMask ? 'Connecter MetaMask' : 'MetaMask requis'}
            </button>
          ) : (
            <div className="flex items-center gap-2 text-sm text-[var(--ink-soft)]">
              {isAdmin && (
                <span className="wordmark text-[10px] px-2 py-1 bg-[var(--accent)] text-[var(--bg)] rounded-sm">
                  Administrateur
                </span>
              )}
              <span className="font-mono text-xs" title={address}>
                {shortAddress(address)}
              </span>
            </div>
          )}

          <div className="text-xs text-[var(--ink-mute)] text-center space-x-2">
            <span>
              Contrat{' '}
              <a
                href={`${ETHERSCAN_BASE}/address/${CONTRACT_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[var(--accent)] hover:underline"
              >
                {shortAddress(CONTRACT_ADDRESS)}
              </a>
            </span>
            {contractOwner && (
              <>
                <span>·</span>
                <span>
                  Émetteur{' '}
                  <span className="font-mono text-[var(--ink-soft)]" title={contractOwner}>
                    {shortAddress(contractOwner)}
                  </span>
                </span>
              </>
            )}
          </div>
        </div>

        {!hasMetaMask && (
          <div className="mb-6 p-4 bg-[var(--accent-soft)] border border-[var(--rule)] text-sm text-[var(--accent)]">
            MetaMask n'est pas détecté.{' '}
            <a
              href="https://metamask.io/download/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Installer l'extension
            </a>
          </div>
        )}

        {address && !isCorrectNetwork && (
          <div className="mb-6 p-4 bg-[var(--accent-soft)] border border-[var(--rule)] flex items-center justify-between gap-3 flex-wrap">
            <span className="text-sm text-[var(--accent)]">
              Vous n'êtes pas sur le réseau Sepolia.
            </span>
            <button
              onClick={() => switchToSepolia().catch((e) => alert(e.message))}
              className="px-3 py-1.5 bg-[var(--accent)] hover:bg-[var(--ink)] text-[var(--bg)] text-xs font-medium rounded-sm"
            >
              Basculer sur Sepolia
            </button>
          </div>
        )}

        <Section
          eyebrow="Consultation"
          title="Vérifier un diplôme"
          description="Public — aucune connexion de portefeuille n'est requise."
        >
          <VerifyDiplomaForm />
        </Section>

        {isAdmin && signer && isCorrectNetwork && (
          <>
            <Section
              eyebrow="Administration"
              title="Émettre un diplôme"
              description="Réservé à l'administrateur du contrat."
            >
              <IssueDiplomaForm signer={signer} />
            </Section>

            <Section
              eyebrow="Administration"
              title="Révoquer un diplôme"
              description="Réservé à l'administrateur du contrat."
            >
              <RevokeDiplomaForm signer={signer} />
            </Section>

            <Section
              eyebrow="Administration"
              title="Transférer la propriété du contrat"
              description="Désigne un nouvel administrateur. Vous perdez immédiatement vos droits."
            >
              <TransferOwnershipForm signer={signer} onTransferred={refreshOwner} />
            </Section>
          </>
        )}

        {address && !isAdmin && isCorrectNetwork && (
          <div className="mt-10 p-4 border border-[var(--rule)] text-sm text-[var(--ink-soft)] text-center">
            Portefeuille connecté mais non administrateur. Seul l'émetteur du
            contrat peut délivrer ou révoquer un diplôme.
          </div>
        )}
      </main>

      <footer className="border-t border-[var(--rule)] py-6 text-center text-xs text-[var(--ink-mute)]">
        <div className="wordmark mb-1">CertiChain</div>
        <div>Mini-projet Blockchain · IT University Madagascar</div>
      </footer>
    </div>
  )
}

export default App
