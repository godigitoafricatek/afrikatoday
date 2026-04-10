'use client'

import Link from 'next/link'

interface TickerArticle {
  slug: string
  title: string
}

interface BreakingTickerProps {
  articles: TickerArticle[]
}

export default function BreakingTicker({ articles }: BreakingTickerProps) {
  if (!articles || articles.length === 0) return null

  const repeated = [...articles, ...articles, ...articles]

  return (
    <div className="bg-[#E63946] text-white py-2 overflow-hidden">
      <div className="flex items-center">
        <div className="flex-shrink-0 bg-[#0A0A0A] text-white px-4 py-1 text-xs font-bold uppercase tracking-widest z-10">
          BREAKING
        </div>
        <div className="overflow-hidden flex-1 relative ml-3">
          <div className="flex whitespace-nowrap ticker-animation">
            {repeated.map((article, i) => (
              <span key={i} className="inline-flex items-center">
                <Link
                  href={`/article/${article.slug}`}
                  className="text-sm font-medium hover:underline mx-6"
                >
                  {article.title}
                </Link>
                <span className="text-white/40 mx-2">•</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
