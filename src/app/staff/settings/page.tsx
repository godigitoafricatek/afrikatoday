'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Save, Loader2 } from 'lucide-react'

interface Settings {
  site_name: string
  site_tagline: string
  site_description: string
  twitter_url: string
  facebook_url: string
  instagram_url: string
  youtube_url: string
  contact_email: string
}

const DEFAULT_SETTINGS: Settings = {
  site_name: 'AfrikaToday',
  site_tagline: 'Your Voice. Your Continent.',
  site_description: '',
  twitter_url: '',
  facebook_url: '',
  instagram_url: '',
  youtube_url: '',
  contact_email: '',
}

export default function StaffSettingsPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    axios.get('/api/settings')
      .then((res) => setSettings({ ...DEFAULT_SETTINGS, ...res.data }))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSuccess(false)
    try {
      await axios.put('/api/settings', settings)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch {
      setError('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-[#E63946]" />
      </div>
    )
  }

  const Field = ({ label, field, type = 'text', placeholder = '' }: {
    label: string; field: keyof Settings; type?: string; placeholder?: string
  }) => (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">{label}</label>
      {type === 'textarea' ? (
        <textarea
          value={settings[field]}
          onChange={(e) => setSettings({ ...settings, [field]: e.target.value })}
          placeholder={placeholder}
          rows={3}
          className="w-full px-4 py-2.5 border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-[#E63946] resize-none"
        />
      ) : (
        <input
          type={type}
          value={settings[field]}
          onChange={(e) => setSettings({ ...settings, [field]: e.target.value })}
          placeholder={placeholder}
          className="w-full px-4 py-2.5 border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-[#E63946]"
        />
      )}
    </div>
  )

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#0A0A0A]" style={{ fontFamily: 'Playfair Display, serif' }}>Settings</h1>
          <p className="text-gray-500 text-sm">Manage your site configuration</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#E63946] text-white text-sm font-bold rounded-xl hover:bg-[#d62d3a] disabled:opacity-60 transition-colors"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {error && <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>}
      {success && <div className="mb-5 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">Settings saved successfully!</div>}

      <div className="space-y-6">
        {/* Site Info */}
        <div className="bg-white rounded-xl border border-[#E5E5E5] p-5">
          <h2 className="font-bold text-sm mb-4 text-gray-700 uppercase tracking-wider">Site Information</h2>
          <div className="space-y-4">
            <Field label="Site Name" field="site_name" placeholder="AfrikaToday" />
            <Field label="Tagline" field="site_tagline" placeholder="Your Voice. Your Continent." />
            <Field label="Description" field="site_description" type="textarea" placeholder="Brief description of the site..." />
            <Field label="Contact Email" field="contact_email" type="email" placeholder="news@afrikatoday.com" />
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white rounded-xl border border-[#E5E5E5] p-5">
          <h2 className="font-bold text-sm mb-4 text-gray-700 uppercase tracking-wider">Social Media Links</h2>
          <div className="space-y-4">
            <Field label="Twitter / X" field="twitter_url" placeholder="https://twitter.com/afrikatoday" />
            <Field label="Facebook" field="facebook_url" placeholder="https://facebook.com/afrikatoday" />
            <Field label="Instagram" field="instagram_url" placeholder="https://instagram.com/afrikatoday" />
            <Field label="YouTube" field="youtube_url" placeholder="https://youtube.com/afrikatoday" />
          </div>
        </div>
      </div>
    </div>
  )
}
