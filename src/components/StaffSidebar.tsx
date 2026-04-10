'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Tag,
  Settings,
  LogOut,
  Newspaper,
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', href: '/staff', icon: LayoutDashboard },
  { label: 'Articles', href: '/staff/articles', icon: FileText },
  { label: 'New Article', href: '/staff/articles/new', icon: PlusCircle },
  { label: 'Categories', href: '/staff/categories', icon: Tag },
  { label: 'Settings', href: '/staff/settings', icon: Settings },
]

export default function StaffSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/staff/login')
  }

  return (
    <aside className="w-56 flex-shrink-0 bg-[#0A0A0A] min-h-screen flex flex-col">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#E63946] rounded-sm flex items-center justify-center">
            <span className="text-white font-black text-base" style={{ fontFamily: 'Playfair Display, serif' }}>A</span>
          </div>
          <span className="text-white text-sm font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>AfrikaToday</span>
        </Link>
        <p className="text-gray-500 text-xs mt-1">Staff Portal</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/staff' && pathname.startsWith(item.href))
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[#E63946] text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={16} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-6 border-t border-white/10 pt-4">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors mb-1"
          target="_blank"
        >
          <Newspaper size={16} />
          View Site
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-[#E63946] hover:bg-white/5 transition-colors"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  )
}
