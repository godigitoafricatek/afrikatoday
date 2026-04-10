'use client'

import Link from 'next/link'

interface CategoryBadgeProps {
  name: string
  slug: string
  color?: string
  size?: 'sm' | 'md' | 'lg'
  link?: boolean
}

export default function CategoryBadge({ name, slug, color = '#E63946', size = 'sm', link = true }: CategoryBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  }

  const badge = (
    <span
      className={`inline-block font-semibold uppercase tracking-wider rounded-sm ${sizeClasses[size]}`}
      style={{ backgroundColor: color, color: '#fff' }}
    >
      {name}
    </span>
  )

  if (link) {
    return <Link href={`/${slug}`}>{badge}</Link>
  }

  return badge
}
