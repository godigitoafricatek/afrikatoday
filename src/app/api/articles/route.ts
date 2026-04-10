import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { generateSlug } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const featured = searchParams.get('featured')
    const breaking = searchParams.get('breaking')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '20')
    const page = parseInt(searchParams.get('page') || '1')
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}

    if (category) where.category = { slug: category }
    if (status) where.status = status
    if (featured === 'true') where.isFeatured = true
    if (breaking === 'true') where.isBreaking = true
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        include: {
          category: true,
          author: { select: { id: true, name: true, avatar: true } },
          tags: { include: { tag: true } },
        },
        orderBy: { publishedAt: 'desc' },
        take: limit,
        skip,
      }),
      prisma.article.count({ where }),
    ])

    return NextResponse.json({ articles, total, page, totalPages: Math.ceil(total / limit) })
  } catch (error) {
    console.error('Get articles error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, excerpt, content, thumbnail, categoryId, tagIds, isFeatured, isBreaking, status } = body

    if (!title || !excerpt || !content || !categoryId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const slug = generateSlug(title)

    const article = await prisma.article.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        thumbnail,
        categoryId,
        authorId: session.id,
        isFeatured: isFeatured || false,
        isBreaking: isBreaking || false,
        status: status || 'draft',
        publishedAt: status === 'published' ? new Date() : null,
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

    return NextResponse.json(article, { status: 201 })
  } catch (error) {
    console.error('Create article error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
