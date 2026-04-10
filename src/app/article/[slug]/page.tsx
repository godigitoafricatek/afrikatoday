import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ArticleCard from '@/components/ArticleCard'
import CategoryBadge from '@/components/CategoryBadge'
import Link from 'next/link'
import Image from 'next/image'
import { formatDate, formatRelativeTime } from '@/lib/utils'
import { Eye, Calendar, User, Share2, ExternalLink, MessageCircle } from 'lucide-react'
import CopyLinkButton from '@/components/CopyLinkButton'

interface ArticlePageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const { slug } = await params
  const article = await prisma.article.findUnique({
    where: { slug },
    include: { category: true, author: { select: { name: true } } },
  })
  if (!article) return {}
  return {
    title: `${article.title} - AfrikaToday`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.thumbnail ? [article.thumbnail] : [],
      type: 'article',
    },
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params

  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
      category: true,
      author: { select: { id: true, name: true, bio: true, avatar: true } },
      tags: { include: { tag: true } },
    },
  })

  if (!article || article.status !== 'published') notFound()

  // Increment views
  await prisma.article.update({
    where: { id: article.id },
    data: { views: { increment: 1 } },
  })

  // Related articles
  const relatedArticles = await prisma.article.findMany({
    where: {
      status: 'published',
      categoryId: article.categoryId,
      id: { not: article.id },
    },
    include: { category: true, author: { select: { name: true } } },
    orderBy: { publishedAt: 'desc' },
    take: 4,
  })

  const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://afrikatoday.com'}/article/${slug}`

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <article className="max-w-7xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-[#E63946] transition-colors">Home</Link>
            <span>/</span>
            <Link href={`/${article.category.slug}`} className="hover:text-[#E63946] transition-colors">
              {article.category.name}
            </Link>
            <span>/</span>
            <span className="text-gray-800 line-clamp-1">{article.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main content */}
            <div className="lg:col-span-2">
              {/* Category + Breaking badge */}
              <div className="flex items-center gap-2 mb-4">
                <CategoryBadge name={article.category.name} slug={article.category.slug} color={article.category.color} size="md" />
                {article.isBreaking && (
                  <span className="text-xs font-bold px-2 py-0.5 bg-[#E63946] text-white rounded-sm uppercase tracking-wider">
                    Breaking
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#0A0A0A] leading-tight mb-5" style={{ fontFamily: 'Playfair Display, serif' }}>
                {article.title}
              </h1>

              {/* Excerpt */}
              <p className="text-xl text-gray-600 leading-relaxed mb-6 border-l-4 border-[#E63946] pl-4">
                {article.excerpt}
              </p>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b border-[#E5E5E5]">
                <div className="flex items-center gap-1.5">
                  <User size={14} />
                  <span className="font-medium text-gray-800">{article.author.name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  <span>{article.publishedAt ? formatDate(article.publishedAt) : formatDate(article.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Eye size={14} />
                  <span>{article.views.toLocaleString()} views</span>
                </div>

                {/* Share buttons */}
                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-xs text-gray-400 flex items-center gap-1"><Share2 size={12} /> Share:</span>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-7 h-7 flex items-center justify-center rounded-full bg-[#1DA1F2]/10 text-[#1DA1F2] hover:bg-[#1DA1F2] hover:text-white transition-colors"
                  >
                    <MessageCircle size={13} />
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-7 h-7 flex items-center justify-center rounded-full bg-[#4267B2]/10 text-[#4267B2] hover:bg-[#4267B2] hover:text-white transition-colors"
                  >
                    <ExternalLink size={13} />
                  </a>
                  <CopyLinkButton url={shareUrl} />
                </div>
              </div>

              {/* Thumbnail */}
              {article.thumbnail && (
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-8">
                  <Image
                    src={article.thumbnail}
                    alt={article.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}

              {/* Content */}
              <div
                className="article-content"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />

              {/* Tags */}
              {article.tags.length > 0 && (
                <div className="mt-8 pt-6 border-t border-[#E5E5E5]">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map(({ tag }) => (
                      <span
                        key={tag.id}
                        className="px-3 py-1 bg-[#F8F8F8] border border-[#E5E5E5] rounded-full text-xs font-medium text-gray-600 hover:border-[#E63946] hover:text-[#E63946] transition-colors"
                      >
                        #{tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Author box */}
              <div className="mt-8 p-5 bg-[#F8F8F8] rounded-xl border border-[#E5E5E5]">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#E63946]/10 flex items-center justify-center flex-shrink-0">
                    {article.author.avatar ? (
                      <Image src={article.author.avatar} alt={article.author.name} width={48} height={48} className="rounded-full object-cover" />
                    ) : (
                      <span className="text-lg font-bold text-[#E63946]">{article.author.name[0]}</span>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-0.5">Written by</p>
                    <p className="font-bold text-[#0A0A0A]">{article.author.name}</p>
                    {article.author.bio && (
                      <p className="text-sm text-gray-500 mt-1">{article.author.bio}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Related sidebar */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-5">More in {article.category.name}</h3>
              <div className="space-y-5">
                {relatedArticles.map((related) => (
                  <ArticleCard key={related.id} article={related} size="horizontal" />
                ))}
                {relatedArticles.length === 0 && (
                  <p className="text-sm text-gray-400 italic">No related articles yet.</p>
                )}
              </div>
            </div>
          </div>
        </article>

        {/* Related articles bottom */}
        {relatedArticles.length > 0 && (
          <div className="border-t border-[#E5E5E5] mt-12">
            <div className="max-w-7xl mx-auto px-4 py-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-7 rounded-full" style={{ backgroundColor: article.category.color }} />
                <h2 className="text-xl font-black text-[#0A0A0A]" style={{ fontFamily: 'Playfair Display, serif' }}>
                  More {article.category.name} Stories
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {relatedArticles.map((related) => (
                  <ArticleCard key={related.id} article={related} size="small" />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
