'use client'

import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { Pencil, Trash2, Plus, Check, X } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
  color: string
  description: string | null
  _count: { articles: number }
}

const DEFAULT_COLORS = ['#E63946', '#F4A261', '#2A9D8F', '#9B5DE5', '#F72585', '#4CC9F0', '#06D6A0', '#FFB703']

export default function StaffCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState({ name: '', color: '', description: '' })
  const [newCat, setNewCat] = useState({ name: '', color: '#E63946', description: '' })
  const [showNew, setShowNew] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const fetchCategories = useCallback(async () => {
    try {
      const res = await axios.get('/api/categories')
      setCategories(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchCategories() }, [fetchCategories])

  const handleCreate = async () => {
    if (!newCat.name.trim()) { setError('Name required'); return }
    setSaving(true)
    setError('')
    try {
      await axios.post('/api/categories', newCat)
      setShowNew(false)
      setNewCat({ name: '', color: '#E63946', description: '' })
      fetchCategories()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
      setError(msg || 'Failed to create')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdate = async (id: string) => {
    if (!editData.name.trim()) { setError('Name required'); return }
    setSaving(true)
    setError('')
    try {
      await axios.put(`/api/categories/${id}`, editData)
      setEditingId(null)
      fetchCategories()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
      setError(msg || 'Failed to update')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"? Articles in this category may be affected.`)) return
    try {
      await axios.delete(`/api/categories/${id}`)
      fetchCategories()
    } catch {
      alert('Delete failed')
    }
  }

  const startEdit = (cat: Category) => {
    setEditingId(cat.id)
    setEditData({ name: cat.name, color: cat.color, description: cat.description || '' })
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#0A0A0A]" style={{ fontFamily: 'Playfair Display, serif' }}>Categories</h1>
          <p className="text-gray-500 text-sm">{categories.length} categories</p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#E63946] text-white text-sm font-bold rounded-xl hover:bg-[#d62d3a] transition-colors"
        >
          <Plus size={15} />
          New Category
        </button>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>
      )}

      {/* New category form */}
      {showNew && (
        <div className="bg-white rounded-xl border border-[#E63946]/30 p-5 mb-5">
          <h3 className="font-bold mb-4 text-sm">New Category</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
            <input
              type="text"
              value={newCat.name}
              onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
              placeholder="Category name"
              className="px-3 py-2 border border-[#E5E5E5] rounded-lg text-sm focus:outline-none focus:border-[#E63946]"
            />
            <input
              type="text"
              value={newCat.description}
              onChange={(e) => setNewCat({ ...newCat, description: e.target.value })}
              placeholder="Description (optional)"
              className="px-3 py-2 border border-[#E5E5E5] rounded-lg text-sm focus:outline-none focus:border-[#E63946]"
            />
            <div className="flex gap-1.5 items-center">
              {DEFAULT_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setNewCat({ ...newCat, color: c })}
                  className="w-7 h-7 rounded-full border-2 transition-all"
                  style={{ backgroundColor: c, borderColor: newCat.color === c ? '#0A0A0A' : 'transparent' }}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleCreate} disabled={saving}
              className="px-4 py-2 bg-[#E63946] text-white text-sm font-bold rounded-lg hover:bg-[#d62d3a] disabled:opacity-60 transition-colors">
              {saving ? 'Creating...' : 'Create'}
            </button>
            <button onClick={() => setShowNew(false)}
              className="px-4 py-2 border border-[#E5E5E5] text-gray-600 text-sm font-medium rounded-lg hover:border-gray-400 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-[#E5E5E5] overflow-hidden">
        {loading ? (
          <div className="py-12 text-center">
            <div className="w-6 h-6 border-2 border-[#E63946] border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : (
          <div className="divide-y divide-[#E5E5E5]">
            {categories.map((cat) => (
              <div key={cat.id} className="px-6 py-4">
                {editingId === cat.id ? (
                  <div className="flex flex-wrap gap-3 items-center">
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="flex-1 min-w-[120px] px-3 py-1.5 border border-[#E5E5E5] rounded-lg text-sm focus:outline-none focus:border-[#E63946]"
                    />
                    <input
                      type="text"
                      value={editData.description}
                      onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                      placeholder="Description"
                      className="flex-1 min-w-[160px] px-3 py-1.5 border border-[#E5E5E5] rounded-lg text-sm focus:outline-none focus:border-[#E63946]"
                    />
                    <div className="flex gap-1.5">
                      {DEFAULT_COLORS.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setEditData({ ...editData, color: c })}
                          className="w-6 h-6 rounded-full border-2 transition-all"
                          style={{ backgroundColor: c, borderColor: editData.color === c ? '#0A0A0A' : 'transparent' }}
                        />
                      ))}
                    </div>
                    <button onClick={() => handleUpdate(cat.id)} disabled={saving}
                      className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors">
                      <Check size={16} />
                    </button>
                    <button onClick={() => setEditingId(null)}
                      className="p-1.5 text-gray-400 hover:bg-gray-50 rounded transition-colors">
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg flex-shrink-0" style={{ backgroundColor: `${cat.color}20` }}>
                      <div className="w-full h-full rounded-lg flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#0A0A0A]">{cat.name}</p>
                      {cat.description && <p className="text-xs text-gray-500 mt-0.5">{cat.description}</p>}
                    </div>
                    <span className="text-xs text-gray-400">{cat._count.articles} articles</span>
                    <button onClick={() => startEdit(cat)}
                      className="p-1.5 text-gray-400 hover:text-[#E63946] transition-colors">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => handleDelete(cat.id, cat.name)}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
