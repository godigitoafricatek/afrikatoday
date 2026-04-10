'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Search, Menu, X, ChevronDown } from 'lucide-react'

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

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  return (
    <>
      {/* Top bar */}
      <div className="bg-[#0A0A0A] text-white py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <span className="text-gray-400">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
          <span className="text-[#E63946] font-semibold tracking-wider uppercase">AfrikaToday</span>
        </div>
      </div>

      {/* Main navbar */}
      <nav className={`sticky top-0 z-50 bg-white border-b border-[#E5E5E5] ${scrolled ? 'shadow-sm' : ''}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#E63946] rounded-sm flex items-center justify-center">
                  <span className="text-white font-black text-lg" style={{ fontFamily: 'Playfair Display, serif' }}>A</span>
                </div>
                <span className="text-xl font-black text-[#0A0A0A] tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                  AfrikaToday
                </span>
              </div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/${cat.slug}`}
                  className="px-3 py-1.5 text-sm font-semibold text-gray-700 hover:text-[#E63946] rounded-md hover:bg-gray-50 transition-colors"
                  style={{ '--hover-color': cat.color } as React.CSSProperties}
                >
                  {cat.name}
                </Link>
              ))}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-gray-600 hover:text-[#E63946] rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Search size={18} />
              </button>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 text-gray-600 hover:text-[#E63946] rounded-lg hover:bg-gray-50 transition-colors"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Search bar */}
          {searchOpen && (
            <div className="pb-3">
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles..."
                  className="flex-1 px-4 py-2.5 text-sm border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-[#E63946]"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#E63946] text-white text-sm font-semibold rounded-lg hover:bg-[#d62d3a] transition-colors"
                >
                  Search
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-[#E5E5E5] bg-white">
            <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/${cat.slug}`}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                  <span className="text-sm font-semibold text-gray-800">{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
