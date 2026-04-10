import { prisma } from '@/lib/prisma'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BreakingTicker from '@/components/BreakingTicker'
import ArticleCard from '@/components/ArticleCard'
import CategoryBadge from '@/components/CategoryBadge'
import Link from 'next/link'
import { formatRelativeTime } from '@/lib/utils'
import { Eye, TrendingUp } from 'lucide-react'

async function getHomepageData() {
  try {
    const [breakingArticles, featuredArticle, topStories, entertainment, culture, music, arts, sports, tech, business, trending] = await Promise.all([
      prisma.article.findMany({
        where: { status: 'published', isBreaking: true },
        select: { slug: true, title: true },
        orderBy: { publishedAt: 'desc' },
        take: 6,
      }),
      prisma.article.findFirst({
        where: { status: 'published', isFeatured: true },
        include: { category: true, author: { select: { name: true } } },
        orderBy: { publishedAt: 'desc' },
      }),
      prisma.article.findMany({
        where: { status: 'published' },
        include: { category: true, author: { select: { name: true } } },
        orderBy: { publishedAt: 'desc' },
        take: 6,
        skip: 1,
      }),
      prisma.article.findMany({
        where: { status: 'published', category: { slug: 'entertainment' } },
        include: { category: true, author: { select: { name: true } } },
        orderBy: { publishedAt: 'desc' },
        take: 4,
      }),
      prisma.article.findMany({
        where: { status: 'published', category: { slug: 'culture' } },
        include: { category: true, author: { select: { name: true } } },
        orderBy: { publishedAt: 'desc' },
        take: 3,
      }),
      prisma.article.findMany({
        where: { status: 'published', category: { slug: 'music' } },
        include: { category: true, author: { select: { name: true } } },
        orderBy: { publishedAt: 'desc' },
        take: 3,
      }),
      prisma.article.findMany({
        where: { status: 'published', category: { slug: 'arts' } },
        include: { category: true, author: { select: { name: true } } },
        orderBy: { publishedAt: 'desc' },
        take: 4,
      }),
      prisma.article.findMany({
        where: { status: 'published', category: { slug: 'sports' } },
        include: { category: true, author: { select: { name: true } } },
        orderBy: { publishedAt: 'desc' },
        take: 3,
      }),
      prisma.article.findMany({
        where: { status: 'published', category: { slug: 'tech' } },
        include: { category: true, author: { select: { name: true } } },
        orderBy: { publishedAt: 'desc' },
        take: 3,
      }),
      prisma.article.findMany({
        where: { status: 'published', category: { slug: 'business' } },
        include: { category: true, author: { select: { name: true } } },
        orderBy: { publishedAt: 'desc' },
        take: 3,
      }),
      prisma.article.findMany({
        where: { status: 'published' },
        select: {
          id: true, title: true, slug: true, views: true, publishedAt: true, createdAt: true,
          category: { select: { name: true, slug: true, color: true } }
        },
        orderBy: { views: 'desc' },
        take: 6,
      }),
    ])

    return { breakingArticles, featuredArticle, topStories, entertainment, culture, music, arts, sports, tech, business, trending }
  } catch {
    return {
      breakingArticles: [], featuredArticle: null, topStories: [], entertainment: [],
      culture: [], music: [], arts: [], sports: [], tech: [], business: [], trending: []
    }
  }
}

const categories = [
  { name: 'Politics', slug: 'politics', color: '#E63946' },
  { name: 'Entertainment', slug: 'entertainment', color: '#F4A261' },
  { name: 'Culture', slug: 'culture', color: '#2A9D8F' },
  { name: 'Music', slug: 'music', color: '#9B5DE5' },
  { name: 'Arts', slug: 'arts', color: '#F72585' },
  { name: 'Sports', slug: 'sports', color: '#4CC9F0' },
  { name: 'Tech', slug: 'tech', color: '#06D6A0' },
  { name: 'Business', slug: 'business', color: '#FFB703' },
]

export default async function HomePage() {
  const { breakingArticles, featuredArticle, topStories, entertainment, culture, music, arts, sports, tech, business, trending } = await getHomepageData()
  const hasContent = topStories.length > 0 || entertainment.length > 0

  return (
    <>
      <BreakingTicker articles={breakingArticles} />
      <Navbar />
      <main className="flex-1">
        {/* Category color bar */}
        <div className="flex overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className="flex-shrink-0 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:opacity-80 transition-opacity"
              style={{ backgroundColor: cat.color }}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Hero + Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            {/* Hero */}
            <div className="lg:col-span-2">
              {featuredArticle ? (
                <ArticleCard article={featuredArticle} size="large" />
              ) : (
                <div className="aspect-[16/9] rounded-xl bg-gradient-to-br from-[#E63946] to-[#a01f2a] flex items-center justify-center">
                  <div className="text-center text-white p-8">
                    <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                      Welcome to AfrikaToday
                    </h2>
                    <p className="text-white/80">Your Voice. Your Continent.</p>
                    <Link href="/staff/login" className="mt-4 inline-block px-6 py-2 bg-white text-[#E63946] font-bold rounded-lg text-sm">
                      Start Publishing
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Trending Sidebar */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={16} className="text-[#E63946]" />
                <h2 className="text-sm font-bold uppercase tracking-widest text-[#0A0A0A]">Trending Now</h2>
              </div>
              <div className="space-y-4">
                {trending.length > 0 ? trending.map((article, i) => (
                  <Link key={article.id} href={`/article/${article.slug}`} className="group flex gap-3 items-start">
                    <span className="text-2xl font-black text-gray-200 w-8 flex-shrink-0 leading-none mt-0.5">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="flex-1 min-w-0">
                      <CategoryBadge name={article.category.name} slug={article.category.slug} color={article.category.color} size="sm" link={false} />
                      <p className="mt-1 text-sm font-bold text-[#0A0A0A] leading-tight line-clamp-2 group-hover:text-[#E63946] transition-colors">
                        {article.title}
                      </p>
                      <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                        <Eye size={11} />
                        <span>{article.views.toLocaleString()} views</span>
                      </div>
                    </div>
                  </Link>
                )) : (
                  <p className="text-sm text-gray-400 italic">Articles will appear here as they get views.</p>
                )}
              </div>
            </div>
          </div>

          {/* Top Stories */}
          {topStories.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-xl font-black text-[#0A0A0A] whitespace-nowrap" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Top Stories
                </h2>
                <div className="h-px flex-1 bg-[#E5E5E5]" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {topStories.map((article) => (
                  <ArticleCard key={article.id} article={article} size="medium" />
                ))}
              </div>
            </section>
          )}

          {/* Entertainment Section */}
          {entertainment.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-7 rounded-full bg-[#F4A261]" />
                <h2 className="text-xl font-black text-[#0A0A0A]" style={{ fontFamily: 'Playfair Display, serif' }}>Entertainment</h2>
                <div className="h-px flex-1 bg-[#E5E5E5]" />
                <Link href="/entertainment" className="text-xs font-semibold text-[#F4A261] uppercase tracking-wider hover:underline whitespace-nowrap">See All</Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {entertainment.map((article, i) => (
                  <ArticleCard key={article.id} article={article} size={i === 0 ? 'medium' : 'small'} />
                ))}
              </div>
            </section>
          )}

          {/* Culture + Music */}
          {(culture.length > 0 || music.length > 0) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {culture.length > 0 && (
                <section>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-1 h-7 rounded-full bg-[#2A9D8F]" />
                    <h2 className="text-xl font-black text-[#0A0A0A]" style={{ fontFamily: 'Playfair Display, serif' }}>Culture</h2>
                    <div className="h-px flex-1 bg-[#E5E5E5]" />
                    <Link href="/culture" className="text-xs font-semibold text-[#2A9D8F] uppercase tracking-wider hover:underline">See All</Link>
                  </div>
                  <div className="space-y-4">
                    {culture.map((article) => (
                      <ArticleCard key={article.id} article={article} size="horizontal" />
                    ))}
                  </div>
                </section>
              )}
              {music.length > 0 && (
                <section>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-1 h-7 rounded-full bg-[#9B5DE5]" />
                    <h2 className="text-xl font-black text-[#0A0A0A]" style={{ fontFamily: 'Playfair Display, serif' }}>Music</h2>
                    <div className="h-px flex-1 bg-[#E5E5E5]" />
                    <Link href="/music" className="text-xs font-semibold text-[#9B5DE5] uppercase tracking-wider hover:underline">See All</Link>
                  </div>
                  <div className="space-y-4">
                    {music.map((article) => (
                      <ArticleCard key={article.id} article={article} size="horizontal" />
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}

          {/* Arts Section */}
          {arts.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-7 rounded-full bg-[#F72585]" />
                <h2 className="text-xl font-black text-[#0A0A0A]" style={{ fontFamily: 'Playfair Display, serif' }}>Arts</h2>
                <div className="h-px flex-1 bg-[#E5E5E5]" />
                <Link href="/arts" className="text-xs font-semibold text-[#F72585] uppercase tracking-wider hover:underline">See All</Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {arts.map((article) => (
                  <ArticleCard key={article.id} article={article} size="small" />
                ))}
              </div>
            </section>
          )}

          {/* Sports + Tech + Business */}
          {(sports.length > 0 || tech.length > 0 || business.length > 0) && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              {sports.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-1 h-6 rounded-full bg-[#4CC9F0]" />
                    <h2 className="text-lg font-black text-[#0A0A0A]" style={{ fontFamily: 'Playfair Display, serif' }}>Sports</h2>
                    <div className="h-px flex-1 bg-[#E5E5E5]" />
                    <Link href="/sports" className="text-xs font-semibold text-[#4CC9F0] uppercase tracking-wider hover:underline">All</Link>
                  </div>
                  <div className="space-y-3">
                    {sports.map((article) => (
                      <ArticleCard key={article.id} article={article} size="horizontal" />
                    ))}
                  </div>
                </section>
              )}
              {tech.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-1 h-6 rounded-full bg-[#06D6A0]" />
                    <h2 className="text-lg font-black text-[#0A0A0A]" style={{ fontFamily: 'Playfair Display, serif' }}>Tech</h2>
                    <div className="h-px flex-1 bg-[#E5E5E5]" />
                    <Link href="/tech" className="text-xs font-semibold text-[#06D6A0] uppercase tracking-wider hover:underline">All</Link>
                  </div>
                  <div className="space-y-3">
                    {tech.map((article) => (
                      <ArticleCard key={article.id} article={article} size="horizontal" />
                    ))}
                  </div>
                </section>
              )}
              {business.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-1 h-6 rounded-full bg-[#FFB703]" />
                    <h2 className="text-lg font-black text-[#0A0A0A]" style={{ fontFamily: 'Playfair Display, serif' }}>Business</h2>
                    <div className="h-px flex-1 bg-[#E5E5E5]" />
                    <Link href="/business" className="text-xs font-semibold text-[#FFB703] uppercase tracking-wider hover:underline">All</Link>
                  </div>
                  <div className="space-y-3">
                    {business.map((article) => (
                      <ArticleCard key={article.id} article={article} size="horizontal" />
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}

          {/* Empty state */}
          {!hasContent && (
            <div className="text-center py-24">
              <div className="w-16 h-16 bg-[#E63946]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-black text-[#E63946]" style={{ fontFamily: 'Playfair Display, serif' }}>A</span>
              </div>
              <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>No articles yet</h3>
              <p className="text-gray-500 mb-6">The newsroom is getting ready. Check back soon or start publishing.</p>
              <Link href="/staff/login" className="inline-block px-6 py-3 bg-[#E63946] text-white font-bold rounded-xl text-sm hover:bg-[#d62d3a] transition-colors">
                Go to Staff Portal
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
