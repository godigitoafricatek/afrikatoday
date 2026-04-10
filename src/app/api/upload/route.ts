import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { getSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only images allowed.' }, { status: 400 })
    }

    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large. Max 5MB.' }, { status: 400 })
    }

    const blobToken = process.env.BLOB_READ_WRITE_TOKEN

    // If Vercel Blob is configured, use it
    if (blobToken && blobToken !== 'vercel_blob_rw_placeholder') {
      const filename = `afrikatoday/${Date.now()}-${file.name.replace(/\s+/g, '-')}`
      const blob = await put(filename, file, { access: 'public' })
      return NextResponse.json({ url: blob.url })
    }

    // Fallback: no blob configured - user should paste image URL directly
    return NextResponse.json({
      url: '',
      warning: 'Image upload not configured. Set BLOB_READ_WRITE_TOKEN in .env.local to enable uploads. You can paste an image URL directly instead.',
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
