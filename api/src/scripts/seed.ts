import path from 'path'
import fs from 'fs'
import connectDB from '../config/db'
import Product from '../models/Product'
import Category from '../models/Category'

async function seed() {
  await connectDB()

  // Load web data files (read raw JS and eval minimal arrays)
  const webDir = path.resolve(__dirname, '../../../web/src/data')
  const productsPath = path.join(webDir, 'products.js')

  const productsRaw = fs.readFileSync(productsPath, 'utf8')

  // Very naive extraction to JSON-like: export const products = [ ... ];
  const productsMatch = productsRaw.match(/export const products =\s*(\[[\s\S]*?\])\s*;/)
  if (!productsMatch) throw new Error('Cannot parse products.js')

  const productsArray = eval(productsMatch[1]) as any[]
  // Derive categories from products
  const categoryMap = new Map<string, { title: string; description?: string; color?: string; resource?: string }>()
  for (const p of productsArray) {
    const title = String(p.category)
    if (!categoryMap.has(title)) {
      categoryMap.set(title, {
        title,
        description: `Explore top ${title} products`,
        color: undefined,
        resource: undefined,
      })
    }
  }

  // Transform and upsert
  for (const c of Array.from(categoryMap.values())) {
    await Category.findOneAndUpdate(
      { title: c.title },
      { title: c.title, description: c.description, color: c.color, resource: c.resource },
      { upsert: true }
    )
  }

  for (const p of productsArray) {
    const id = `PROD-${String(p.id).padStart(4, '0')}`
    await Product.findOneAndUpdate(
      { id },
      {
        id,
        name: p.name,
        category: p.category,
        price: p.price,
        offerPrice: p.offerPrice,
        images: p.images || (p.image ? [p.image] : []),
        image: p.image || (p.images && p.images[0]) || undefined,
        rating: p.rating || 0,
        stock: 100,
        sold: 0,
        isNewProduct: true,
      },
      { upsert: true }
    )
  }

  console.log('Seeding completed')
  process.exit(0)
}

seed().catch((e) => {
  console.error(e)
  process.exit(1)
})


