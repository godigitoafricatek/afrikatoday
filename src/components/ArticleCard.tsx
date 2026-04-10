import Link from 'next/link'
import Image from 'next/image'
import CategoryBadge from './CategoryBadge'
import { formatRelativeTime } from '@/lib/utils'

interface Article {
  id: string
  title: string
  slug: string
  excerpt: string
  thumbnail: string | null
  publishedAt: Date | string | null
  createdAt: Date | string
  views: number
  category: {
    name: string
    slug: string
    color: string
  }
  author: {
    name: string
  }
}

interface ArticleCardProps {
  article: Article
  size?: 'large' | 'medium' | 'small' | 'horizontal'
}

export default function ArticleCard({ article, size = 'medium' }: ArticleCardProps) {
  const date = article.publishedAt || article.createdAt

  if (size === 'large') {
    return (
      <Link href={`/article/${article.slug}`} className="group block relative overflow-hidden rounded-xl">
        <div className="relative aspect-[16/9] bg-gray-200">
          {article.thumbnail ? (
            <Image
              src={article.thumbnail}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-600 flex items-center justify-center">
              <span className="text-white/40 text-6xl font-bold">{article.title[0]}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <CategoryBadge name={article.category.name} slug={article.category.slug} color={article.category.color} size="sm" link={false} />
          <h2 className="mt-3 text-2xl md:text-3xl font-bold text-white leading-tight line-clamp-3 group-hover:text-[#E63946] transition-colors">
            {article.title}
          </h2>
          <div className="mt-3 flex items-center gap-3 text-white/70 text-sm">
            <span>By {article.author.name}</span>
            <span>•</span>
            <span>{formatRelativeTime(date)}</span>
          </div>
        </div>
      </Link>
    )
  }

  if (size === 'horizontal') {
    return (
      <Link href={`/article/${article.slug}`} className="group flex gap-4">
        <div className="relative flex-shrink-0 w-24 h-20 rounded-lg overflow-hidden bg-gray-200">
          {article.thumbnail ? (
            <Image src={article.thumbnail} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-500 flex items-center justify-center">
              <span className="text-white/40 text-xl font-bold">{article.title[0]}</span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <CategoryBadge name={article.category.name} slug={article.category.slug} color={article.category.color} size="sm" link={false} />
          <h3 className="mt-1 text-sm font-bold text-[#0A0A0A] leading-tight line-clamp-2 group-hover:text-[#E63946] transition-colors">
            {article.title}
          </h3>
          <p className="mt-1 text-xs text-gray-500">{formatRelativeTime(date)}</p>
        </div>
      </Link>
    )
  }

  if (size === 'small') {
    return (
      <Link href={`/article/${article.slug}`} className="group block">
        <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-gray-200 mb-3">
          {article.thumbnail ? (
            <Image src={article.thumbnail} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-500 flex items-center justify-center">
              <span className="text-white/40 text-2xl font-bold">{article.title[0]}</span>
            </div>
          )}
        </div>
        <CategoryBadge name={article.category.name} slug={article.category.slug} color={article.category.color} size="sm" link={false} />
        <h3 className="mt-2 text-sm font-bold text-[#0A0A0A] leading-tight line-clamp-2 group-hover:text-[#E63946] transition-colors">
          {article.title}
        </h3>
        <p className="mt-1 text-xs text-gray-500">{formatRelativeTime(date)}</p>
      </Link>
    )
  }

  // medium (default)
  return (
    <Link href={`/article/${article.slug}`} className="group block bg-white rounded-xl overflow-hidden border border-[#E5E5E5] hover:border-[#E63946]/30">
      <div className="relative aspect-[16/9] bg-gray-200">
        {article.thumbnail ? (
          <Image src={article.thumbnail} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-500 flex items-center justify-center">
            <span className="text-white/40 text-3xl font-bold">{article.title[0]}</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <CategoryBadge name={article.category.name} slug={article.category.slug} color={article.category.color} size="sm" link={false} />
        <h3 className="mt-2 text-base font-bold text-[#0A0A0A] leading-tight line-clamp-2 group-hover:text-[#E63946] transition-colors">
          {article.title}
        </h3>
        <p className="mt-2 text-sm text-gray-500 line-clamp-2">{article.excerpt}</p>
        <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
          <span>{article.author.name}</span>
          <span>•</span>
          <span>{formatRelativeTime(date)}</span>
        </div>
      </div>
    </Link>
  )
}
