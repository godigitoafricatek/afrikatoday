import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Try to find by ID first, then by slug
    const article = await prisma.article.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      include: {
        category: true,
        author: { select: { id: true, name: true, bio: true, avatar: true } },
        tags: { include: { tag: true } },
      },
    })

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    // Increment views
    await prisma.article.update({
      where: { id: article.id },
      data: { views: { increment: 1 } },
    })

    return NextResponse.json(article)
  } catch (error) {
    console.error('Get article error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { title, excerpt, content, thumbnail, categoryId, tagIds, isFeatured, isBreaking, status } = body

    const existing = await prisma.article.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    // Delete existing tags
    await prisma.articleTag.deleteMany({ where: { articleId: id } })

    const wasPublished = existing.status !== 'published' && status === 'published'

    const article = await prisma.article.update({
      where: { id },
      data: {
        title,
        excerpt,
        content,
        thumbnail,
        categoryId,
        isFeatured,
        isBreaking,
        status,
        publishedAt: wasPublished ? new Date() : existing.publishedAt,
        tags: tagIds?.length
          ? {
              create: tagIds.map((tagId: string) => ({ tagId })),
            }
          : undefined,
      },
      include: {
        category: true,
        author: { select: { id: true, name: true } },
        tags: { include: { tag: true } },
      },
    })

    return NextResponse.json(article)
  } catch (error) {
    console.error('Update article error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    await prisma.article.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete article error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
