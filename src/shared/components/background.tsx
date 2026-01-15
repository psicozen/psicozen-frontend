"use client"

import Image from "next/image"

export function Background() {
  return (
    <div className="fixed inset-0 -z-50 h-full w-full overflow-hidden">
      <Image
        src="/backgrounds/background-dashboard.jpg"
        alt="Ambient Background"
        fill
        className="object-cover"
        priority
        quality={100}
        sizes="100vw"
      />

      {/* Subtle overlay for readability - reduced opacity for better image visibility */}
      <div className="absolute inset-0 bg-background/40" />
    </div>
  )
}
