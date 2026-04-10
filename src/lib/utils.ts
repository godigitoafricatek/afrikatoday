export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function generateSlug(title: string): string {
  const base = slugify(title)
  const timestamp = Date.now().toString(36)
  return `${base}-${timestamp}`
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatRelativeTime(date: Date | string): string {
  const now = new Date()
  const past = new Date(date)
  const diffMs = now.getTime() - past.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return formatDate(date)
}

export const CATEGORY_COLORS: Record<string, string> = {
  politics: '#E63946',
  entertainment: '#F4A261',
  culture: '#2A9D8F',
  music: '#9B5DE5',
  arts: '#F72585',
  sports: '#4CC9F0',
  tech: '#06D6A0',
  business: '#FFB703',
}

export function getCategoryColor(slug: string): string {
  return CATEGORY_COLORS[slug.toLowerCase()] || '#E63946'
}
