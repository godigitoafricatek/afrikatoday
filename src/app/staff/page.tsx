import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import Link from 'next/link'
import { FileText, Eye, Tag, Users, PlusCircle, TrendingUp } from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils'

export default async function StaffDashboardPage() {
  const session = await getSession()

  const [totalArticles, publishedArticles, draftArticles, totalViews, totalCategories, totalSubscribers, recentArticles] = await Promise.all([
    prisma.article.count(),
    prisma.article.count({ where: { status: 'published' } }),
    prisma.article.count({ where: { status: 'draft' } }),
    prisma.article.aggregate({ _sum: { views: true } }),
    prisma.category.count(),
    prisma.subscriber.count(),
    prisma.article.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { category: true, author: { select: { name: true } } },
    }),
  ])

  const stats = [
    { label: 'Total Articles', value: totalArticles, icon: FileText, color: '#E63946', sub: `${publishedArticles} published, ${draftArticles} drafts` },
    { label: 'Total Views', value: (totalViews._sum.views || 0).toLocaleString(), icon: Eye, color: '#4CC9F0', sub: 'Across all articles' },
    { label: 'Categories', value: totalCategories, icon: Tag, color: '#06D6A0', sub: 'Active categories' },
    { label: 'Subscribers', value: totalSubscribers, icon: Users, color: '#9B5DE5', sub: 'Newsletter subscribers' },
  ]

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-[#0A0A0A]" style={{ fontFamily: 'Playfair Display, serif' }}>
            Dashboard
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Welcome back, {session?.name || 'Editor'}
          </p>
        </div>
        <Link
          href="/staff/articles/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-[#E63946] text-white text-sm font-bold rounded-xl hover:bg-[#d62d3a] transition-colors"
        >
          <PlusCircle size={16} />
          New Article
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-white rounded-xl p-5 border border-[#E5E5E5]">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${stat.color}15` }}>
                  <Icon size={18} style={{ color: stat.color }} />
                </div>
              </div>
              <p className="text-2xl font-black text-[#0A0A0A]">{stat.value}</p>
              <p className="text-sm font-semibold text-gray-700 mt-0.5">{stat.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{stat.sub}</p>
            </div>
          )
        })}
      </div>

      {/* Recent Articles */}
      <div className="bg-white rounded-xl border border-[#E5E5E5] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E5E5]">
          <h2 className="font-bold text-[#0A0A0A]">Recent Articles</h2>
          <Link href="/staff/articles" className="text-xs font-semibold text-[#E63946] hover:underline">
            View all
          </Link>
        </div>
        <div className="divide-y divide-[#E5E5E5]">
          {recentArticles.length > 0 ? recentArticles.map((article) => (
            <div key={article.id} className="flex items-center gap-4 px-6 py-4 hover:bg-[#F8F8F8] transition-colors">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#0A0A0A] line-clamp-1">{article.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs px-1.5 py-0.5 rounded text-white font-semibold" style={{ backgroundColor: article.category.color }}>
                    {article.category.name}
                  </span>
                  <span className="text-xs text-gray-400">{article.author.name}</span>
                  <span className="text-xs text-gray-400">{formatRelativeTime(article.createdAt)}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                  article.status === 'published'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                }`}>
                  {article.status}
                </span>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Eye size={11} />
                  {article.views}
                </div>
                <Link
                  href={`/staff/articles/${article.id}/edit`}
                  className="text-xs text-[#E63946] font-semibold hover:underline"
                >
                  Edit
                </Link>
              </div>
            </div>
          )) : (
            <div className="px-6 py-12 text-center">
              <FileText size={32} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No articles yet.</p>
              <Link href="/staff/articles/new" className="mt-3 inline-block text-[#E63946] text-sm font-semibold hover:underline">
                Create your first article
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
