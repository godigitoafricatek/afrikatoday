import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ArticleForm from '@/components/ArticleForm'

interface EditArticlePageProps {
  params: Promise<{ id: string }>
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params

  const article = await prisma.article.findUnique({
    where: { id },
    include: {
      tags: { include: { tag: true } },
    },
  })

  if (!article) notFound()

  return (
    <ArticleForm
      articleId={article.id}
      initialData={{
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        thumbnail: article.thumbnail || '',
        categoryId: article.categoryId,
        tagIds: article.tags.map((t) => t.tagId),
        isFeatured: article.isFeatured,
        isBreaking: article.isBreaking,
        status: article.status,
      }}
    />
  )
}
