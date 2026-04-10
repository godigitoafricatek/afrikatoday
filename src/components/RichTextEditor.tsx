'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import {
  Bold, Italic, List, ListOrdered, Quote, Link as LinkIcon,
  Image as ImageIcon, Heading1, Heading2, Heading3, Undo, Redo, Code
} from 'lucide-react'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: false, allowBase64: true }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-[#E63946] underline' } }),
      Placeholder.configure({ placeholder: 'Start writing your article...' }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none min-h-[400px] px-4 py-3',
      },
    },
  })

  if (!editor) return null

  const addLink = () => {
    const url = window.prompt('Enter URL:')
    if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }
  }

  const addImage = () => {
    const url = window.prompt('Enter image URL:')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  return (
    <div className="border border-[#E5E5E5] rounded-xl overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-[#E5E5E5] bg-[#F8F8F8]">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-1.5 rounded text-sm hover:bg-white transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-white text-[#E63946]' : 'text-gray-600'}`}
          title="Heading 1"
        >
          <Heading1 size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded text-sm hover:bg-white transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-white text-[#E63946]' : 'text-gray-600'}`}
          title="Heading 2"
        >
          <Heading2 size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-1.5 rounded text-sm hover:bg-white transition-colors ${editor.isActive('heading', { level: 3 }) ? 'bg-white text-[#E63946]' : 'text-gray-600'}`}
          title="Heading 3"
        >
          <Heading3 size={16} />
        </button>
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded hover:bg-white transition-colors ${editor.isActive('bold') ? 'bg-white text-[#E63946]' : 'text-gray-600'}`}
          title="Bold"
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded hover:bg-white transition-colors ${editor.isActive('italic') ? 'bg-white text-[#E63946]' : 'text-gray-600'}`}
          title="Italic"
        >
          <Italic size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`p-1.5 rounded hover:bg-white transition-colors ${editor.isActive('code') ? 'bg-white text-[#E63946]' : 'text-gray-600'}`}
          title="Code"
        >
          <Code size={16} />
        </button>
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded hover:bg-white transition-colors ${editor.isActive('bulletList') ? 'bg-white text-[#E63946]' : 'text-gray-600'}`}
          title="Bullet list"
        >
          <List size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded hover:bg-white transition-colors ${editor.isActive('orderedList') ? 'bg-white text-[#E63946]' : 'text-gray-600'}`}
          title="Ordered list"
        >
          <ListOrdered size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded hover:bg-white transition-colors ${editor.isActive('blockquote') ? 'bg-white text-[#E63946]' : 'text-gray-600'}`}
          title="Blockquote"
        >
          <Quote size={16} />
        </button>
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <button
          type="button"
          onClick={addLink}
          className={`p-1.5 rounded hover:bg-white transition-colors ${editor.isActive('link') ? 'bg-white text-[#E63946]' : 'text-gray-600'}`}
          title="Add link"
        >
          <LinkIcon size={16} />
        </button>
        <button
          type="button"
          onClick={addImage}
          className="p-1.5 rounded hover:bg-white transition-colors text-gray-600"
          title="Add image"
        >
          <ImageIcon size={16} />
        </button>
        <div className="flex-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-1.5 rounded hover:bg-white transition-colors text-gray-600 disabled:opacity-30"
          title="Undo"
        >
          <Undo size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-1.5 rounded hover:bg-white transition-colors text-gray-600 disabled:opacity-30"
          title="Redo"
        >
          <Redo size={16} />
        </button>
      </div>

      {/* Editor */}
      <div className="bg-white">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
