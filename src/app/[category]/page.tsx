import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ArticleCard from '@/components/ArticleCard'
import Link from 'next/link'

interface CategoryPageProps {
  params: Promise<{ category: string }>
  searchParams: Promise<{ page?: string }>
}

const ARTICLES_PER_PAGE = 12

export async function generateMetadata({ params }: CategoryPageProps) {
  const { category } = await params
  const cat = await prisma.category.findUnique({ where: { slug: category } })
  if (!cat) return {}
  return {
    title: `${cat.name} News - AfrikaToday`,
    description: cat.description || `Latest ${cat.name} news from across Africa`,
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { category } = await params
  const { page: pageStr } = await searchParams
  const page = parseInt(pageStr || '1')
  const skip = (page - 1) * ARTICLES_PER_PAGE

  const cat = await prisma.category.findUnique({ where: { slug: category } })
  if (!cat) notFound()

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where: { status: 'published', categoryId: cat.id },
      include: { category: true, author: { select: { name: true } } },
      orderBy: { publishedAt: 'desc' },
      take: ARTICLES_PER_PAGE,
      skip,
    }),
    prisma.article.count({
      where: { status: 'published', categoryId: cat.id },
    }),
  ])

  const totalPages = Math.ceil(total / ARTICLES_PER_PAGE)

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Category Header */}
        <div className="py-12 relative overflow-hidden" style={{ backgroundColor: cat.color }}>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-4 text-[200px] font-black text-white leading-none" style={{ fontFamily: 'Playfair Display, serif' }}>
              {cat.name[0]}
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 relative">
            <div className="flex items-center gap-2 text-white/70 text-sm mb-2">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <span className="text-white">{cat.name}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
              {cat.name}
            </h1>
            {cat.description && (
              <p className="mt-2 text-white/80 text-lg max-w-xl">{cat.description}</p>
            )}
            <p className="mt-1 text-white/60 text-sm">{total} articles</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-10">
          {articles.length > 0 ? (
            <>
              {/* Featured first article */}
              {page === 1 && articles[0] && (
                <div className="mb-10">
                  <ArticleCard article={articles[0]} size="large" />
                </div>
              )}

              {/* Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {(page === 1 ? articles.slice(1) : articles).map((article) => (
                  <ArticleCard key={article.id} article={article} size="medium" />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  {page > 1 && (
                    <Link
                      href={`/${category}?page=${page - 1}`}
                      className="px-4 py-2 border border-[#E5E5E5] rounded-lg text-sm font-medium hover:border-[#E63946] hover:text-[#E63946] transition-colors"
                    >
                      Previous
                    </Link>
                  )}
                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map((p) => (
                    <Link
                      key={p}
                      href={`/${category}?page=${p}`}
                      className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                        p === page
                          ? 'text-white'
                          : 'border border-[#E5E5E5] hover:border-[#E63946] hover:text-[#E63946]'
                      }`}
                      style={p === page ? { backgroundColor: cat.color } : {}}
                    >
                      {p}
                    </Link>
                  ))}
                  {page < totalPages && (
                    <Link
                      href={`/${category}?page=${page + 1}`}
                      className="px-4 py-2 border border-[#E5E5E5] rounded-lg text-sm font-medium hover:border-[#E63946] hover:text-[#E63946] transition-colors"
                    >
                      Next
                    </Link>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${cat.color}20` }}>
                <span className="text-2xl font-black" style={{ color: cat.color }}>{cat.name[0]}</span>
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>No articles yet</h3>
              <p className="text-gray-500">Check back soon for {cat.name.toLowerCase()} news.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
