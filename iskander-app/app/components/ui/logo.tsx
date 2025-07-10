
interface LogoProps {
  className?: string
  showText?: boolean
}

export function Logo({ className = "h-8 w-auto", showText = false }: LogoProps) {
  return (
    <div className="flex items-center gap-2">
      <img src="/iskander-logo.png" alt="Iskander" width={32} height={32} className={className} />
      {showText && (
        <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
          Iskander
        </span>
      )}
    </div>
  )
}