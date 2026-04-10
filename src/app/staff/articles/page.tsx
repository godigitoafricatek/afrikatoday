'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { PlusCircle, Eye, Edit, Trash2, Search, Filter, Star, Zap } from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils'

interface Article {
  id: string
  title: string
  slug: string
  status: string
  isFeatured: boolean
  isBreaking: boolean
  views: number
  publishedAt: string | null
  createdAt: string
  category: { name: string; slug: string; color: string }
  author: { name: string }
}

export default function StaffArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [total, setTotal] = useState(0)

  const fetchArticles = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (statusFilter) params.set('status', statusFilter)
      params.set('limit', '50')

      const res = await axios.get(`/api/articles?${params}`)
      setArticles(res.data.articles)
      setTotal(res.data.total)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [search, statusFilter])

  useEffect(() => {
    fetchArticles()
  }, [fetchArticles])

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    try {
      await axios.delete(`/api/articles/${id}`)
      fetchArticles()
    } catch {
      alert('Delete failed')
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#0A0A0A]" style={{ fontFamily: 'Playfair Display, serif' }}>Articles</h1>
          <p className="text-gray-500 text-sm">{total} total articles</p>
        </div>
        <Link
          href="/staff/articles/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-[#E63946] text-white text-sm font-bold rounded-xl hover:bg-[#d62d3a] transition-colors"
        >
          <PlusCircle size={15} />
          New Article
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-[#E5E5E5] p-4 mb-5 flex flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] px-3 border border-[#E5E5E5] rounded-lg">
          <Search size={14} className="text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles..."
            className="flex-1 py-2 text-sm focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-[#E5E5E5] rounded-lg text-sm focus:outline-none focus:border-[#E63946]"
          >
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#E5E5E5] overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-2 border-[#E63946] border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : articles.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-gray-400 mb-3">No articles found.</p>
            <Link href="/staff/articles/new" className="text-[#E63946] text-sm font-semibold hover:underline">
              Create your first article
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-[#E5E5E5]">
            {articles.map((article) => (
              <div key={article.id} className="flex items-center gap-4 px-6 py-4 hover:bg-[#F8F8F8] transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-[#0A0A0A] line-clamp-1">{article.title}</p>
                    {article.isFeatured && <Star size={12} className="text-[#FFB703] flex-shrink-0" fill="currentColor" />}
                    {article.isBreaking && <Zap size={12} className="text-[#E63946] flex-shrink-0" fill="currentColor" />}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-1.5 py-0.5 rounded text-white font-semibold" style={{ backgroundColor: article.category.color }}>
                      {article.category.name}
                    </span>
                    <span className="text-xs text-gray-400">{article.author.name}</span>
                    <span className="text-xs text-gray-400">{formatRelativeTime(article.publishedAt || article.createdAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                    article.status === 'published'
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                  }`}>
                    {article.status}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Eye size={11} />
                    {article.views.toLocaleString()}
                  </div>
                  <Link
                    href={`/article/${article.slug}`}
                    target="_blank"
                    className="p-1.5 text-gray-400 hover:text-[#E63946] transition-colors"
                    title="View article"
                  >
                    <Eye size={14} />
                  </Link>
                  <Link
                    href={`/staff/articles/${article.id}/edit`}
                    className="p-1.5 text-gray-400 hover:text-[#E63946] transition-colors"
                    title="Edit"
                  >
                    <Edit size={14} />
                  </Link>
                  <button
                    onClick={() => handleDelete(article.id, article.title)}
                    className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
