import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

const pool = new Pool({ connectionString: process.env.DATABASE_URL || 'postgresql://gatare@localhost:5432/afrikatoday' })
const adapter = new PrismaPg(pool)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prisma = new PrismaClient({ adapter } as any)

async function main() {
  // Seed categories
  const categories = [
    { name: 'Politics', slug: 'politics', color: '#E63946', description: 'Political news across Africa' },
    { name: 'Entertainment', slug: 'entertainment', color: '#F4A261', description: 'Entertainment, film, and celebrity news' },
    { name: 'Culture', slug: 'culture', color: '#2A9D8F', description: 'African culture and heritage' },
    { name: 'Music', slug: 'music', color: '#9B5DE5', description: 'African music and artists' },
    { name: 'Arts', slug: 'arts', color: '#F72585', description: 'Visual arts and creativity' },
    { name: 'Sports', slug: 'sports', color: '#4CC9F0', description: 'Sports news from across the continent' },
    { name: 'Tech', slug: 'tech', color: '#06D6A0', description: 'Technology and innovation in Africa' },
    { name: 'Business', slug: 'business', color: '#FFB703', description: 'Business and economy news' },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }
  console.log('Categories seeded ✓')

  // Seed admin author
  const hashedPassword = await bcrypt.hash('AfrikaToday@2025', 12)
  await prisma.author.upsert({
    where: { email: 'admin@afrikatoday.com' },
    update: {},
    create: {
      name: 'AfrikaToday Admin',
      email: 'admin@afrikatoday.com',
      password: hashedPassword,
      role: 'admin',
      bio: 'AfrikaToday editorial team',
    },
  })
  console.log('Admin author seeded ✓')

  // Seed settings
  const settings = [
    { key: 'site_name', value: 'AfrikaToday' },
    { key: 'site_tagline', value: 'Your Voice. Your Continent.' },
    { key: 'site_description', value: 'AfrikaToday is your premier source for African news, culture, music, sports, and more.' },
    { key: 'twitter_url', value: 'https://twitter.com/afrikatoday' },
    { key: 'facebook_url', value: 'https://facebook.com/afrikatoday' },
    { key: 'instagram_url', value: 'https://instagram.com/afrikatoday' },
    { key: 'youtube_url', value: 'https://youtube.com/afrikatoday' },
    { key: 'contact_email', value: 'news@afrikatoday.com' },
  ]

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    })
  }
  console.log('Settings seeded ✓')

  // Get admin and categories for articles
  const admin = await prisma.author.findUnique({ where: { email: 'admin@afrikatoday.com' } })
  const allCategories = await prisma.category.findMany()
  const catMap = Object.fromEntries(allCategories.map(c => [c.slug, c.id]))

  if (admin) {
    // Seed tags
    const tagNames = ['Africa', 'Breaking', 'Analysis', 'Exclusive', 'Interview', 'Opinion', 'Feature', 'Documentary', 'Awards', 'Festival', 'Startup', 'Investment', 'Football', 'AFCON', 'Afrobeats', 'Nollywood', 'Fashion', 'Innovation']
    const tagMap: Record<string, string> = {}
    for (const name of tagNames) {
      const slug = name.toLowerCase().replace(/\s+/g, '-')
      const tag = await prisma.tag.upsert({
        where: { slug },
        update: {},
        create: { name, slug },
      })
      tagMap[slug] = tag.id
    }
    console.log('Tags seeded ✓')

    // Seed sample articles
    const articles = [
      {
        title: 'African Union Summit 2025: Key Resolutions That Will Shape the Continent',
        slug: 'au-summit-2025-key-resolutions',
        thumbnail: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1200&h=675&fit=crop',
        excerpt: 'Leaders from 55 member states convened in Addis Ababa to discuss trade, security, and climate change in landmark summit.',
        content: `<h2>A Historic Gathering</h2><p>The 38th Ordinary Session of the African Union Assembly brought together heads of state and government from across the continent for what many are calling the most consequential summit in recent memory.</p><p>Key resolutions included accelerating the African Continental Free Trade Area (AfCFTA) implementation, establishing a unified continental response to climate change, and strengthening peacekeeping operations in the Sahel region.</p><h3>Trade Integration</h3><p>The summit saw the signing of new protocols that aim to reduce tariffs on intra-African trade by an additional 30% over the next three years. This builds on the momentum of the AfCFTA, which has already facilitated over $1.2 trillion in continental trade.</p><h3>Climate Action</h3><p>A new African Climate Fund was announced, with initial commitments of $5 billion from member states and international partners. The fund will support renewable energy projects, agricultural adaptation, and coastal protection across vulnerable nations.</p><blockquote>This summit represents a turning point for African self-determination. We are no longer waiting for the world to act — we are leading.</blockquote><p>Security cooperation was another major theme, with new frameworks for joint military operations and intelligence sharing to combat terrorism and insurgency across the continent.</p>`,
        categorySlug: 'politics',
        isFeatured: true,
        isBreaking: true,
        views: 4520,
        tags: ['africa', 'analysis', 'exclusive'],
      },
      {
        title: 'Nigeria Elections: Opposition Party Gains Ground in Historic State-Level Victories',
        slug: 'nigeria-elections-opposition-gains',
        thumbnail: 'https://images.unsplash.com/photo-1494172961521-33799ddd43a5?w=1200&h=675&fit=crop',
        excerpt: 'In a shift that could reshape Nigerian politics, opposition candidates secured decisive wins in several key states.',
        content: `<h2>A New Political Landscape</h2><p>Nigerian voters delivered a powerful message at the polls this week, with opposition parties winning gubernatorial races in states long considered ruling party strongholds.</p><p>The results mark one of the most significant political shifts in Nigeria's democratic history, with analysts pointing to youth voter turnout as the decisive factor.</p><h3>Youth Vote Makes the Difference</h3><p>Voter registration among 18-35 year olds surged by 40% compared to the last election cycle, driven largely by social media mobilization and new digital voter education platforms.</p><p>Exit polls indicate that economic concerns — particularly unemployment and inflation — were the primary motivators for voters choosing change.</p>`,
        categorySlug: 'politics',
        isFeatured: false,
        isBreaking: true,
        views: 3200,
        tags: ['africa', 'breaking'],
      },
      {
        title: 'Nollywood Blockbuster Breaks Box Office Records Across Three Continents',
        slug: 'nollywood-blockbuster-breaks-records',
        thumbnail: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&h=675&fit=crop',
        excerpt: 'The epic historical drama has become the highest-grossing African film of all time, earning over $85 million worldwide.',
        content: `<h2>A New Era for African Cinema</h2><p>The Nigerian film industry has reached a historic milestone as the epic historical drama "Kingdom of Benin" shattered box office records, becoming the first African-produced film to cross the $85 million mark globally.</p><p>The film, which tells the story of the ancient Benin Kingdom, has been praised for its stunning visual effects, compelling storytelling, and authentic cultural representation.</p><h3>Global Distribution Deal</h3><p>Following its theatrical success, a major streaming platform has acquired global distribution rights in a deal reportedly worth $30 million — the largest ever for an African film.</p><blockquote>African stories have universal appeal. This film proves that our narratives can compete on the world stage when given the resources and platform they deserve.</blockquote><p>The success has sparked a wave of investment in African film production, with several studios announcing plans for major historical epics set across the continent.</p>`,
        categorySlug: 'entertainment',
        isFeatured: true,
        isBreaking: false,
        views: 8900,
        tags: ['nollywood', 'exclusive', 'feature'],
      },
      {
        title: 'Burna Boy Announces Massive 50-City World Tour Starting in Lagos',
        slug: 'burna-boy-50-city-world-tour',
        thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=675&fit=crop',
        excerpt: 'The Grammy-winning artist will kick off the tour at the Tafawa Balewa Square in Lagos before heading to Europe and the Americas.',
        content: `<h2>The Biggest African Music Tour Ever</h2><p>Nigerian music sensation Burna Boy has announced what promises to be the largest world tour ever undertaken by an African artist, spanning 50 cities across five continents.</p><p>The "African Giant World Tour" will begin with a historic homecoming show at Lagos's Tafawa Balewa Square, with a capacity crowd of 60,000 expected.</p><h3>Tour Highlights</h3><p>The tour will include landmark venues such as Madison Square Garden in New York, The O2 in London, and AccorArena in Paris. Several African cities are also on the itinerary, including Accra, Nairobi, Johannesburg, and Dar es Salaam.</p><p>Tickets went on sale and several dates sold out within hours, demonstrating the global appetite for Afrobeats on the live stage.</p>`,
        categorySlug: 'music',
        isFeatured: false,
        isBreaking: false,
        views: 6700,
        tags: ['afrobeats', 'exclusive'],
      },
      {
        title: 'Kenya Tech Hub Secures $500M Fund to Back African Startups',
        slug: 'kenya-tech-hub-500m-fund',
        thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=675&fit=crop',
        excerpt: 'Nairobi\'s growing tech ecosystem receives a massive boost with a new venture fund targeting early-stage African startups.',
        content: `<h2>Silicon Savannah Gets a Major Boost</h2><p>A consortium of international and African investors has launched a $500 million venture fund based in Nairobi, targeting early-stage tech startups across the continent.</p><p>The fund, named "AfriTech Ventures," will focus on fintech, healthtech, agritech, and edtech — sectors where African innovation has shown the most promise.</p><h3>Investment Strategy</h3><p>The fund plans to invest in over 200 startups across 15 African countries over the next five years, with ticket sizes ranging from $500,000 to $10 million.</p><blockquote>Africa has the youngest population in the world and the fastest-growing mobile internet adoption. The next generation of global tech companies will come from this continent.</blockquote><p>Several high-profile African tech founders have signed on as advisors, including executives from major African unicorns in the fintech and logistics spaces.</p>`,
        categorySlug: 'tech',
        isFeatured: false,
        isBreaking: false,
        views: 5100,
        tags: ['startup', 'investment', 'innovation'],
      },
      {
        title: 'AFCON 2025: Senegal and Morocco Set for Epic Final Showdown',
        slug: 'afcon-2025-senegal-morocco-final',
        thumbnail: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&h=675&fit=crop',
        excerpt: 'Two of Africa\'s footballing powerhouses will clash in what promises to be a thrilling final at the Africa Cup of Nations.',
        content: `<h2>The Stage Is Set</h2><p>After weeks of electrifying football, the 2025 Africa Cup of Nations has come down to a dream final between defending champions Senegal and 2022 World Cup semifinalists Morocco.</p><p>Both teams have been dominant throughout the tournament, with Senegal's attacking flair complemented by their solid defense, while Morocco has dazzled with their tactical discipline and clinical finishing.</p><h3>Key Matchups</h3><p>The final will feature some of the biggest names in world football, with several players plying their trade at Europe's top clubs. The midfield battle is expected to be the key area of contest.</p><p>Over 80,000 fans are expected to fill the stadium, with millions more watching across the continent and around the world. The match represents the culmination of African football's growing global prestige.</p>`,
        categorySlug: 'sports',
        isFeatured: false,
        isBreaking: true,
        views: 12300,
        tags: ['football', 'afcon', 'africa'],
      },
      {
        title: 'Contemporary African Art Fetches Record $12M at Christie\'s Auction',
        slug: 'african-art-record-christies-auction',
        thumbnail: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=1200&h=675&fit=crop',
        excerpt: 'A painting by a Ghanaian artist has become the most expensive work by a living African artist ever sold at auction.',
        content: `<h2>A Landmark Moment for African Art</h2><p>The global art world witnessed a historic moment as a monumental painting by Ghanaian artist Amoako Boafo sold for $12.1 million at Christie's in New York, shattering the previous record for a living African artist.</p><p>The work, a large-scale portrait celebrating Black identity and beauty, drew intense bidding from collectors on three continents.</p><h3>Rising Demand</h3><p>The record sale is part of a broader trend of surging interest in contemporary African art. Auction houses report that sales of African art have increased by over 300% in the past five years.</p><p>New galleries and art spaces are opening across Lagos, Accra, Nairobi, and Cape Town, creating a thriving ecosystem for both established and emerging artists.</p>`,
        categorySlug: 'arts',
        isFeatured: false,
        isBreaking: false,
        views: 3400,
        tags: ['feature', 'awards'],
      },
      {
        title: 'Ethiopia\'s Coffee Export Revenue Hits All-Time High of $2 Billion',
        slug: 'ethiopia-coffee-export-record',
        thumbnail: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1200&h=675&fit=crop',
        excerpt: 'The birthplace of coffee celebrates a milestone year as specialty coffee demand drives unprecedented export growth.',
        content: `<h2>A Golden Year for Ethiopian Coffee</h2><p>Ethiopia's coffee sector has achieved a historic milestone, with export revenues crossing the $2 billion mark for the first time. The achievement is driven by growing global demand for specialty and single-origin coffees.</p><p>Ethiopian coffees from regions like Yirgacheffe, Sidamo, and Guji have become some of the most sought-after in the world, commanding premium prices at international markets.</p><h3>Impact on Farmers</h3><p>The boom has had tangible benefits for the country's estimated 5 million smallholder coffee farmers. Government-led programs have helped farmers adopt better processing techniques and gain direct access to international buyers through digital platforms.</p><p>Industry experts predict that Ethiopia could double its coffee export revenue within the next decade as it continues to invest in quality, sustainability, and brand building.</p>`,
        categorySlug: 'business',
        isFeatured: false,
        isBreaking: false,
        views: 2800,
        tags: ['africa', 'feature'],
      },
      {
        title: 'Traditional Maasai Beadwork Gets UNESCO Intangible Heritage Status',
        slug: 'maasai-beadwork-unesco-heritage',
        thumbnail: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1200&h=675&fit=crop',
        excerpt: 'The intricate beadwork tradition of the Maasai people has been formally recognized as an Intangible Cultural Heritage of Humanity.',
        content: `<h2>Global Recognition for Ancient Craft</h2><p>UNESCO has officially inscribed Maasai beadwork on its Representative List of the Intangible Cultural Heritage of Humanity, recognizing the centuries-old artistic tradition practiced across Kenya and Tanzania.</p><p>The intricate beadwork, which uses vibrant colors and geometric patterns to convey social status, age, and identity, has been passed down through generations of Maasai women.</p><h3>Preservation and Innovation</h3><p>The UNESCO recognition comes at a critical time, as efforts intensify to preserve the tradition while adapting it for contemporary markets. Several social enterprises led by Maasai women have successfully brought their designs to global fashion markets.</p><p>Cultural experts hope the designation will boost tourism, support artisan livelihoods, and encourage younger generations to continue practicing this remarkable art form.</p>`,
        categorySlug: 'culture',
        isFeatured: false,
        isBreaking: false,
        views: 4100,
        tags: ['africa', 'feature', 'festival'],
      },
      {
        title: 'Rwanda Launches Africa\'s First Drone Delivery Network for Medical Supplies',
        slug: 'rwanda-drone-delivery-medical',
        thumbnail: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=1200&h=675&fit=crop',
        excerpt: 'The innovative program will use autonomous drones to deliver blood, vaccines, and essential medicines to remote health facilities.',
        content: `<h2>Innovation in Healthcare Delivery</h2><p>Rwanda has unveiled an expanded drone delivery network that will serve over 500 health facilities across the country, making it the largest medical drone delivery system in Africa.</p><p>The program, developed in partnership with a leading robotics company, uses autonomous drones to deliver blood products, vaccines, and essential medicines to remote clinics that are often hours away from the nearest hospital by road.</p><h3>Saving Lives</h3><p>Since its initial pilot program, the drone delivery system has completed over 100,000 deliveries and is credited with significantly reducing maternal mortality in served areas by ensuring timely access to blood transfusions.</p><p>Several other African nations are now exploring similar programs, with Ghana, Nigeria, and Mozambique in advanced planning stages.</p>`,
        categorySlug: 'tech',
        isFeatured: false,
        isBreaking: false,
        views: 7200,
        tags: ['innovation', 'africa', 'feature'],
      },
      {
        title: 'South Africa Hosts Biggest Afro-Fashion Week with 200 Designers',
        slug: 'south-africa-afro-fashion-week',
        thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&h=675&fit=crop',
        excerpt: 'Cape Town becomes the epicenter of African fashion as designers from across the continent showcase their latest collections.',
        content: `<h2>Fashion Forward Africa</h2><p>Cape Town played host to the largest edition of Afro-Fashion Week yet, featuring 200 designers from 35 African countries in a week-long celebration of the continent's booming fashion industry.</p><p>The event showcased everything from haute couture to streetwear, with a strong emphasis on sustainable fashion and the use of traditional African textiles and techniques.</p><h3>Economic Impact</h3><p>Africa's fashion industry is estimated to be worth $31 billion and growing rapidly. Events like Afro-Fashion Week are helping African designers gain international recognition and commercial opportunities.</p><p>Several major international retailers announced partnerships with African designers at the event, signaling a shift in the global fashion landscape.</p>`,
        categorySlug: 'entertainment',
        isFeatured: false,
        isBreaking: false,
        views: 3900,
        tags: ['fashion', 'feature', 'festival'],
      },
      {
        title: 'Legendary Malian Musician Releases Collaborative Album with Global Stars',
        slug: 'malian-musician-global-collaboration',
        thumbnail: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=1200&h=675&fit=crop',
        excerpt: 'The iconic West African kora player teams up with international artists for a groundbreaking cross-cultural album.',
        content: `<h2>Bridging Musical Worlds</h2><p>One of Mali's most celebrated musicians has released a highly anticipated collaborative album that brings together traditional West African musical traditions with contemporary global sounds.</p><p>The album features collaborations with Grammy-winning artists from the United States, Europe, and South America, creating a unique fusion that celebrates the universal language of music.</p><h3>Critical Acclaim</h3><p>Music critics have hailed the album as a masterpiece of cross-cultural collaboration, praising its ability to honor traditional Malian musical heritage while pushing creative boundaries.</p><p>The album has topped world music charts in multiple countries and has been tipped for multiple award nominations.</p>`,
        categorySlug: 'music',
        isFeatured: false,
        isBreaking: false,
        views: 2900,
        tags: ['afrobeats', 'feature'],
      },
      {
        title: 'Pan-African Stock Exchange Network Goes Live, Connecting 7 Markets',
        slug: 'pan-african-stock-exchange-network',
        thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=675&fit=crop',
        excerpt: 'A new digital platform allows investors to trade across seven African stock exchanges seamlessly for the first time.',
        content: `<h2>Financial Integration Milestone</h2><p>The long-awaited Pan-African Stock Exchange Network (PASEN) has officially gone live, connecting seven major African stock exchanges through a single digital trading platform.</p><p>The network links exchanges in Nigeria, Kenya, South Africa, Egypt, Morocco, Ghana, and Mauritius, allowing investors to trade securities across borders with unprecedented ease.</p><h3>Market Impact</h3><p>Analysts predict the network could increase foreign investment in African markets by up to 40% over the next three years, as it removes many of the barriers that have historically made cross-border African investment challenging.</p><p>The combined market capitalization of the connected exchanges exceeds $1.5 trillion, making PASEN one of the larger emerging market networks globally.</p>`,
        categorySlug: 'business',
        isFeatured: false,
        isBreaking: false,
        views: 4600,
        tags: ['investment', 'africa', 'innovation'],
      },
      {
        title: 'African Women\'s Basketball Team Makes Historic Olympic Qualification',
        slug: 'african-womens-basketball-olympic',
        thumbnail: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1200&h=675&fit=crop',
        excerpt: 'For the first time, an African women\'s basketball team has secured automatic qualification for the Olympics.',
        content: `<h2>Making History on the Court</h2><p>In a watershed moment for African women's sports, the Nigerian women's basketball team — D'Tigress — has secured automatic qualification for the Olympics, becoming the first African women's basketball team to achieve this feat.</p><p>The team's dominant performance in the qualifying tournament saw them win all five games, including a historic victory over a top-10 ranked European team.</p><h3>Growing the Game</h3><p>The qualification has sparked a surge of interest in women's basketball across Africa, with youth registration at basketball academies reportedly doubling in several countries.</p><p>Sponsors and broadcasters are taking notice, with several major deals announced in the wake of the qualification, promising greater visibility and investment in women's sports across the continent.</p>`,
        categorySlug: 'sports',
        isFeatured: false,
        isBreaking: false,
        views: 5800,
        tags: ['africa', 'feature'],
      },
      {
        title: 'Ancient Timbuktu Manuscripts Digitized in Landmark Preservation Project',
        slug: 'timbuktu-manuscripts-digitized',
        thumbnail: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&h=675&fit=crop',
        excerpt: 'Over 300,000 centuries-old manuscripts from Timbuktu are being digitally preserved for future generations.',
        content: `<h2>Preserving Africa's Written Heritage</h2><p>A landmark digital preservation project has completed the scanning and cataloguing of over 300,000 ancient manuscripts from Timbuktu, Mali — one of the most significant collections of pre-colonial African written works in existence.</p><p>The manuscripts, dating from the 13th to 17th centuries, cover topics ranging from astronomy and mathematics to law, medicine, and philosophy, challenging long-held misconceptions about African intellectual history.</p><h3>Global Access</h3><p>The digitized collection will be made available through an open-access online platform, allowing researchers and the public worldwide to explore this extraordinary heritage.</p><p>The project has been supported by universities, cultural organizations, and technology companies committed to preserving Africa's intellectual legacy.</p>`,
        categorySlug: 'culture',
        isFeatured: false,
        isBreaking: false,
        views: 3600,
        tags: ['africa', 'documentary', 'feature'],
      },
      {
        title: 'Nigerian Sculptor\'s Installation Takes Over London\'s Tate Modern',
        slug: 'nigerian-sculptor-tate-modern',
        thumbnail: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=1200&h=675&fit=crop',
        excerpt: 'A monumental steel sculpture by a Lagos-based artist fills the Turbine Hall in one of the most ambitious installations ever.',
        content: `<h2>African Art on the World Stage</h2><p>The Tate Modern's iconic Turbine Hall has been transformed by a massive steel sculpture created by a Nigerian artist, in one of the most ambitious installations the gallery has ever hosted.</p><p>The work, spanning 30 meters in length, is constructed entirely from recycled metal collected from markets and workshops across Lagos. It explores themes of urbanization, resilience, and transformation.</p><h3>Critical Response</h3><p>Art critics have unanimously praised the installation, with many calling it the most powerful Turbine Hall commission in years. The work has drawn record visitor numbers since its unveiling.</p><p>The commission cements the growing recognition of contemporary African art in the global art world and has inspired conversations about sustainability and creative reuse.</p>`,
        categorySlug: 'arts',
        isFeatured: false,
        isBreaking: false,
        views: 2500,
        tags: ['feature', 'awards'],
      },
    ]

    for (const article of articles) {
      const existing = await prisma.article.findUnique({ where: { slug: article.slug } })
      if (!existing) {
        const created = await prisma.article.create({
          data: {
            title: article.title,
            slug: article.slug,
            excerpt: article.excerpt,
            content: article.content,
            thumbnail: article.thumbnail,
            status: 'published',
            isFeatured: article.isFeatured,
            isBreaking: article.isBreaking,
            views: article.views,
            publishedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
            categoryId: catMap[article.categorySlug],
            authorId: admin.id,
          },
        })
        // Add tags
        for (const tagSlug of article.tags) {
          if (tagMap[tagSlug]) {
            await prisma.articleTag.create({
              data: { articleId: created.id, tagId: tagMap[tagSlug] },
            })
          }
        }
      }
    }
    console.log('Sample articles seeded ✓')
  }

  console.log('\nDatabase seeded successfully!')
  console.log('\nStaff login credentials:')
  console.log('  Email:    admin@afrikatoday.com')
  console.log('  Password: AfrikaToday@2025')
  console.log('\nStaff portal: http://localhost:3000/staff/login')
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
