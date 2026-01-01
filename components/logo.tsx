import Image from "next/image"

export function Logo() {
  return (
    <div className="flex items-center gap-3">
      {/* SVG logo */}
      <div className="flex items-center">
        <Image
          src="/images/d4ily-logo.png"
          alt="D4ily - Gündem Dedektifi"
          width={163}
          height={75}
          className="h-10 lg:h-12 w-auto"
          priority
        />
      </div>
      {/* Four concepts below on mobile/tablet, inline on larger screens */}
      <div className="hidden xl:flex items-center gap-1 text-[10px] text-muted-foreground font-medium">
        <span>Gündem</span>
        <span>•</span>
        <span>Analiz</span>
        <span>•</span>
        <span>Trend</span>
        <span>•</span>
        <span>Özet</span>
      </div>
    </div>
  )
}
