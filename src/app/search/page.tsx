import { prisma } from '@/lib/prisma'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ArticleCard from '@/components/ArticleCard'
import Link from 'next/link'
import { Search } from 'lucide-react'

interface SearchPageProps {
  searchParams: Promise<{ q?: string; page?: string }>
}

const RESULTS_PER_PAGE = 12

export async function generateMetadata({ searchParams }: SearchPageProps) {
  const { q } = await searchParams
  return { title: q ? `Search: "${q}" - AfrikaToday` : 'Search - AfrikaToday' }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, page: pageStr } = await searchParams
  const query = q?.trim() || ''
  const page = parseInt(pageStr || '1')
  const skip = (page - 1) * RESULTS_PER_PAGE

  let articles: Awaited<ReturnType<typeof prisma.article.findMany<{ include: { category: true; author: { select: { name: true } } } }>>> = []
  let total = 0

  if (query) {
    ;[articles, total] = await Promise.all([
      prisma.article.findMany({
        where: {
          status: 'published',
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { excerpt: { contains: query, mode: 'insensitive' } },
            { content: { contains: query, mode: 'insensitive' } },
          ],
        },
        include: { category: true, author: { select: { name: true } } },
        orderBy: { publishedAt: 'desc' },
        take: RESULTS_PER_PAGE,
        skip,
      }),
      prisma.article.count({
        where: {
          status: 'published',
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { excerpt: { contains: query, mode: 'insensitive' } },
            { content: { contains: query, mode: 'insensitive' } },
          ],
        },
      }),
    ])
  }

  const totalPages = Math.ceil(total / RESULTS_PER_PAGE)

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="bg-[#0A0A0A] py-12">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-3xl font-black text-white mb-5" style={{ fontFamily: 'Playfair Display, serif' }}>
              Search
            </h1>
            <form action="/search" className="flex gap-3 max-w-2xl">
              <div className="flex-1 flex items-center gap-2 px-4 bg-white/10 border border-white/20 rounded-xl">
                <Search size={16} className="text-white/50" />
                <input
                  type="text"
                  name="q"
                  defaultValue={query}
                  placeholder="Search articles..."
                  className="flex-1 py-3 bg-transparent text-white placeholder-white/40 text-sm focus:outline-none"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-[#E63946] text-white font-bold rounded-xl text-sm hover:bg-[#d62d3a] transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-10">
          {query ? (
            <>
              <p className="text-sm text-gray-500 mb-8">
                {total > 0
                  ? `Found ${total} result${total !== 1 ? 's' : ''} for "${query}"`
                  : `No results found for "${query}"`}
              </p>

              {articles.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.map((article) => (
                      <ArticleCard key={article.id} article={article} size="medium" />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-12">
                      {page > 1 && (
                        <Link href={`/search?q=${encodeURIComponent(query)}&page=${page - 1}`}
                          className="px-4 py-2 border border-[#E5E5E5] rounded-lg text-sm font-medium hover:border-[#E63946] hover:text-[#E63946] transition-colors">
                          Previous
                        </Link>
                      )}
                      {page < totalPages && (
                        <Link href={`/search?q=${encodeURIComponent(query)}&page=${page + 1}`}
                          className="px-4 py-2 border border-[#E5E5E5] rounded-lg text-sm font-medium hover:border-[#E63946] hover:text-[#E63946] transition-colors">
                          Next
                        </Link>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-16">
                  <Search size={40} className="text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>No results found</h3>
                  <p className="text-gray-500 mb-6">Try different keywords or browse our categories.</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {['Politics', 'Entertainment', 'Culture', 'Music', 'Sports', 'Tech'].map((cat) => (
                      <Link key={cat} href={`/${cat.toLowerCase()}`}
                        className="px-4 py-2 border border-[#E5E5E5] rounded-lg text-sm font-medium hover:border-[#E63946] hover:text-[#E63946] transition-colors">
                        {cat}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500 mb-4">Enter a search term to find articles.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
