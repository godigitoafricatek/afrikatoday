import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL || 'postgresql://gatare@localhost:5432/afrikatoday' })
const adapter = new PrismaPg(pool)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prisma = new PrismaClient({ adapter } as any)

const imageMap: Record<string, string> = {
  'au-summit-2025-key-resolutions': 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1200&h=675&fit=crop',
  'nigeria-elections-opposition-gains': 'https://images.unsplash.com/photo-1494172961521-33799ddd43a5?w=1200&h=675&fit=crop',
  'nollywood-blockbuster-breaks-records': 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&h=675&fit=crop',
  'burna-boy-50-city-world-tour': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=675&fit=crop',
  'kenya-tech-hub-500m-fund': 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=675&fit=crop',
  'afcon-2025-senegal-morocco-final': 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&h=675&fit=crop',
  'african-art-record-christies-auction': 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=1200&h=675&fit=crop',
  'ethiopia-coffee-export-record': 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1200&h=675&fit=crop',
  'maasai-beadwork-unesco-heritage': 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1200&h=675&fit=crop',
  'rwanda-drone-delivery-medical': 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=1200&h=675&fit=crop',
  'south-africa-afro-fashion-week': 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&h=675&fit=crop',
  'malian-musician-global-collaboration': 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=1200&h=675&fit=crop',
  'pan-african-stock-exchange-network': 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=675&fit=crop',
  'african-womens-basketball-olympic': 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1200&h=675&fit=crop',
  'timbuktu-manuscripts-digitized': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&h=675&fit=crop',
  'nigerian-sculptor-tate-modern': 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=1200&h=675&fit=crop',
}

async function main() {
  for (const [slug, thumbnail] of Object.entries(imageMap)) {
    await prisma.article.update({
      where: { slug },
      data: { thumbnail },
    })
    console.log(`Updated: ${slug}`)
  }
  console.log('\nAll article images updated!')
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
