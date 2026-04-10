'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { Upload, X, Star, Zap, Save, Send, Loader2 } from 'lucide-react'

const RichTextEditor = dynamic(() => import('./RichTextEditor'), { ssr: false })

interface Category {
  id: string
  name: string
  color: string
}

interface Tag {
  id: string
  name: string
}

interface ArticleFormProps {
  articleId?: string
  initialData?: {
    title: string
    excerpt: string
    content: string
    thumbnail: string
    categoryId: string
    tagIds: string[]
    isFeatured: boolean
    isBreaking: boolean
    status: string
  }
}

export default function ArticleForm({ articleId, initialData }: ArticleFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [title, setTitle] = useState(initialData?.title || '')
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '')
  const [content, setContent] = useState(initialData?.content || '')
  const [thumbnail, setThumbnail] = useState(initialData?.thumbnail || '')
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || '')
  const [selectedTags, setSelectedTags] = useState<string[]>(initialData?.tagIds || [])
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured || false)
  const [isBreaking, setIsBreaking] = useState(initialData?.isBreaking || false)

  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [newTag, setNewTag] = useState('')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    axios.get('/api/categories').then((res) => setCategories(res.data))
  }, [])

  const handleImageUpload = async (file: File) => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await axios.post('/api/upload', formData)
      setThumbnail(res.data.url)
    } catch {
      setError('Image upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file?.type.startsWith('image/')) handleImageUpload(file)
  }

  const addTag = () => {
    const tag = newTag.trim().toLowerCase()
    if (tag && !tags.find((t) => t.name === tag)) {
      const newTagObj = { id: `new-${Date.now()}`, name: tag }
      setTags([...tags, newTagObj])
      setSelectedTags([...selectedTags, newTagObj.id])
      setNewTag('')
    }
  }

  const toggleTag = (id: string) => {
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    )
  }

  const handleSave = async (status: 'draft' | 'published') => {
    if (!title.trim()) { setError('Title is required'); return }
    if (!excerpt.trim()) { setError('Excerpt is required'); return }
    if (!content.trim() || content === '<p></p>') { setError('Content is required'); return }
    if (!categoryId) { setError('Category is required'); return }

    setSaving(true)
    setError('')

    try {
      // Create tags first if they're new
      const resolvedTagIds = await Promise.all(
        selectedTags.map(async (tagId) => {
          if (tagId.startsWith('new-')) {
            const tag = tags.find((t) => t.id === tagId)
            if (!tag) return null
            const slug = tag.name.toLowerCase().replace(/\s+/g, '-')
            try {
              const res = await axios.post('/api/tags', { name: tag.name, slug })
              return res.data.id
            } catch {
              return null
            }
          }
          return tagId
        })
      )

      const payload = {
        title,
        excerpt,
        content,
        thumbnail,
        categoryId,
        tagIds: resolvedTagIds.filter(Boolean),
        isFeatured,
        isBreaking,
        status,
      }

      if (articleId) {
        await axios.put(`/api/articles/${articleId}`, payload)
      } else {
        await axios.post('/api/articles', payload)
      }

      router.push('/staff/articles')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
      setError(msg || 'Save failed. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-[#0A0A0A]" style={{ fontFamily: 'Playfair Display, serif' }}>
          {articleId ? 'Edit Article' : 'New Article'}
        </h1>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleSave('draft')}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 border border-[#E5E5E5] text-gray-700 text-sm font-semibold rounded-xl hover:border-gray-400 disabled:opacity-60 transition-colors"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Save Draft
          </button>
          <button
            type="button"
            onClick={() => handleSave('published')}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-[#E63946] text-white text-sm font-bold rounded-xl hover:bg-[#d62d3a] disabled:opacity-60 transition-colors"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            Publish
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Article headline..."
              className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-base font-semibold focus:outline-none focus:border-[#E63946] transition-colors"
              style={{ fontFamily: 'Playfair Display, serif' }}
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Excerpt *</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Brief summary of the article..."
              rows={3}
              className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-[#E63946] resize-none transition-colors"
            />
          </div>

          {/* Rich Text Editor */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Content *</label>
            <RichTextEditor content={content} onChange={setContent} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Thumbnail */}
          <div className="bg-white rounded-xl border border-[#E5E5E5] p-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Thumbnail</label>
            {thumbnail ? (
              <div className="relative">
                <div className="relative aspect-video rounded-lg overflow-hidden">
                  <Image src={thumbnail} alt="Thumbnail" fill className="object-cover" />
                </div>
                <button
                  type="button"
                  onClick={() => setThumbnail('')}
                  className="absolute top-1 right-1 w-6 h-6 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-black transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              <div
                className="border-2 border-dashed border-[#E5E5E5] rounded-xl p-6 text-center cursor-pointer hover:border-[#E63946] transition-colors"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
              >
                {uploading ? (
                  <Loader2 size={24} className="animate-spin text-[#E63946] mx-auto mb-2" />
                ) : (
                  <Upload size={24} className="text-gray-400 mx-auto mb-2" />
                )}
                <p className="text-sm text-gray-500">{uploading ? 'Uploading...' : 'Drop image or click to upload'}</p>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP up to 5MB</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
            />
            {!thumbnail && (
              <div className="mt-2">
                <input
                  type="url"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  placeholder="Or paste image URL..."
                  className="w-full px-3 py-2 text-xs border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-[#E63946]"
                />
              </div>
            )}
          </div>

          {/* Category */}
          <div className="bg-white rounded-xl border border-[#E5E5E5] p-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Category *</label>
            <div className="space-y-1.5">
              {categories.map((cat) => (
                <label key={cat.id} className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="radio"
                    name="category"
                    value={cat.id}
                    checked={categoryId === cat.id}
                    onChange={() => setCategoryId(cat.id)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                    categoryId === cat.id ? 'border-[#E63946]' : 'border-gray-300 group-hover:border-gray-400'
                  }`}>
                    {categoryId === cat.id && (
                      <div className="w-2 h-2 rounded-full bg-[#E63946]" />
                    )}
                  </div>
                  <span className="text-sm">{cat.name}</span>
                  <span className="w-2 h-2 rounded-full ml-auto" style={{ backgroundColor: cat.color }} />
                </label>
              ))}
            </div>
          </div>

          {/* Flags */}
          <div className="bg-white rounded-xl border border-[#E5E5E5] p-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Article Flags</label>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  className={`w-9 h-5 rounded-full transition-colors relative ${isFeatured ? 'bg-[#FFB703]' : 'bg-gray-200'}`}
                  onClick={() => setIsFeatured(!isFeatured)}
                >
                  <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-transform ${isFeatured ? 'translate-x-4' : 'translate-x-0.5'}`} />
                </div>
                <div className="flex items-center gap-1.5">
                  <Star size={13} className="text-[#FFB703]" />
                  <span className="text-sm font-medium">Featured</span>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  className={`w-9 h-5 rounded-full transition-colors relative ${isBreaking ? 'bg-[#E63946]' : 'bg-gray-200'}`}
                  onClick={() => setIsBreaking(!isBreaking)}
                >
                  <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-transform ${isBreaking ? 'translate-x-4' : 'translate-x-0.5'}`} />
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap size={13} className="text-[#E63946]" />
                  <span className="text-sm font-medium">Breaking News</span>
                </div>
              </label>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-xl border border-[#E5E5E5] p-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Tags</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Add tag..."
                className="flex-1 px-3 py-1.5 text-xs border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-[#E63946]"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-3 py-1.5 bg-[#E63946] text-white text-xs font-bold rounded-lg hover:bg-[#d62d3a] transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={`px-2.5 py-1 text-xs rounded-full font-medium transition-colors ${
                    selectedTags.includes(tag.id)
                      ? 'bg-[#E63946] text-white'
                      : 'bg-[#F8F8F8] text-gray-600 border border-[#E5E5E5] hover:border-[#E63946]'
                  }`}
                >
                  #{tag.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
