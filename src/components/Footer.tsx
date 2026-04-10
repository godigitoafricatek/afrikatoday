import Link from 'next/link'
import { Globe, MessageCircle, Share2, Play, Mail } from 'lucide-react'

const categories = [
  { name: 'Politics', slug: 'politics' },
  { name: 'Entertainment', slug: 'entertainment' },
  { name: 'Culture', slug: 'culture' },
  { name: 'Music', slug: 'music' },
  { name: 'Arts', slug: 'arts' },
  { name: 'Sports', slug: 'sports' },
  { name: 'Tech', slug: 'tech' },
  { name: 'Business', slug: 'business' },
]

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] text-white mt-16">
      {/* Newsletter Banner */}
      <div className="bg-[#E63946] py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            Stay Informed. Stay African.
          </h3>
          <p className="text-white/80 mb-6">Get the latest news delivered to your inbox every morning.</p>
          <form
            action="/api/subscribe"
            method="POST"
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              required
              className="flex-1 px-4 py-3 rounded-lg text-[#0A0A0A] text-sm focus:outline-none"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-[#0A0A0A] text-white text-sm font-bold rounded-lg hover:bg-gray-900 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#E63946] rounded-sm flex items-center justify-center">
                <span className="text-white font-black text-lg" style={{ fontFamily: 'Playfair Display, serif' }}>A</span>
              </div>
              <span className="text-xl font-black tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                AfrikaToday
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Your premier source for African news, culture, music, arts, sports, tech and business. Bold. Authentic. African.
            </p>
            <div className="flex gap-3 mt-6">
              <a href="https://twitter.com/afrikatoday" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 border border-white/20 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors">
                <MessageCircle size={15} />
              </a>
              <a href="https://facebook.com/afrikatoday" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 border border-white/20 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors">
                <Globe size={15} />
              </a>
              <a href="https://instagram.com/afrikatoday" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 border border-white/20 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors">
                <Share2 size={15} />
              </a>
              <a href="https://youtube.com/afrikatoday" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 border border-white/20 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors">
                <Play size={15} />
              </a>
              <a href="mailto:news@afrikatoday.com"
                className="w-9 h-9 border border-white/20 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors">
                <Mail size={15} />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Categories</h4>
            <ul className="space-y-2">
              {categories.slice(0, 4).map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/${cat.slug}`} className="text-gray-300 text-sm hover:text-[#E63946] transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">More</h4>
            <ul className="space-y-2">
              {categories.slice(4).map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/${cat.slug}`} className="text-gray-300 text-sm hover:text-[#E63946] transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/staff/login" className="text-gray-300 text-sm hover:text-[#E63946] transition-colors">
                  Staff Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs">
            &copy; {new Date().getFullYear()} AfrikaToday. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs">
            Your Voice. Your Continent.
          </p>
        </div>
      </div>
    </footer>
  )
}
