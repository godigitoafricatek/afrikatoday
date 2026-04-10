'use client'

import { Link as LinkIcon } from 'lucide-react'

export default function CopyLinkButton({ url }: { url: string }) {
  return (
    <button
      onClick={() => navigator.clipboard?.writeText(url)}
      className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-800 hover:text-white transition-colors"
      title="Copy link"
    >
      <LinkIcon size={13} />
    </button>
  )
}
