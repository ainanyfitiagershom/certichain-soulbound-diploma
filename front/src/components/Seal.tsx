type Props = {
  size?: number
  className?: string
}

export function Seal({ size = 48, className = '' }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="CertiChain seal"
    >
      <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="1" />
      <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.5" />
      <circle cx="50" cy="50" r="28" stroke="currentColor" strokeWidth="0.5" />
      <g stroke="currentColor" strokeWidth="0.5">
        <line x1="50" y1="6" x2="50" y2="14" />
        <line x1="50" y1="86" x2="50" y2="94" />
        <line x1="6" y1="50" x2="14" y2="50" />
        <line x1="86" y1="50" x2="94" y2="50" />
      </g>
      <text
        x="50"
        y="60"
        textAnchor="middle"
        fontFamily="'EB Garamond', 'Source Serif Pro', Georgia, serif"
        fontSize="32"
        fill="currentColor"
        fontWeight="400"
        fontStyle="italic"
      >
        C
      </text>
    </svg>
  )
}
