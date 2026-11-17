/**
 * Q Tea Cafe starter menu.   npm run db:seed:menu
 * Safe to re-run (upserts by slug). Prices are placeholders — adjust them in the admin dashboard.
 */
import 'dotenv/config';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();
const D = (n: number) => new Prisma.Decimal(n);

type Item = { name: string; price: number; desc: string; veg?: boolean; featured?: boolean; pick?: boolean; sizes?: boolean };
const MENU: Record<string, Item[]> = {
  'Chai & Hot Tea': [
    { name: 'Masala Chai', price: 3.5, desc: 'Classic milk tea simmered with ginger, cardamom and warming spices.', veg: true, featured: true, pick: true, sizes: true },
    { name: 'Kadak Cutting Chai', price: 2.5, desc: 'Strong, small and sweet — street-style chai.', veg: true },
    { name: 'Ginger Lemon Honey Tea', price: 4, desc: 'Soothing hot tea with fresh ginger, lemon and honey.', veg: true },
    { name: 'Kashmiri Kahwa', price: 4.5, desc: 'Green tea with saffron, almonds and cinnamon.', veg: true },
    { name: 'Irani Chai', price: 4, desc: 'Rich, creamy Hyderabadi-style chai.', veg: true, featured: true },
    { name: 'Jasmine Green Tea', price: 3.5, desc: 'Delicate green tea scented with jasmine blossom.', veg: true },
  ],
  'Iced Tea & Coolers': [
    { name: 'Classic Iced Lemon Tea', price: 4, desc: 'Black tea, fresh lemon, served over ice.', veg: true, featured: true },
    { name: 'Peach Iced Tea', price: 4.5, desc: 'Chilled black tea with peach syrup.', veg: true },
    { name: 'Mint Mojito Cooler', price: 5, desc: 'Fresh mint, lime and soda — alcohol free.', veg: true },
    { name: 'Matcha Latte (Iced)', price: 5.5, desc: 'Ceremonial-style matcha with cold milk.', veg: true, pick: true },
  ],
  'Coffee': [
    { name: 'Filter Coffee', price: 3.5, desc: 'South Indian decoction coffee with frothy milk.', veg: true },
    { name: 'Cappuccino', price: 4.5, desc: 'Espresso, steamed milk and silky foam.', veg: true },
    { name: 'Cold Coffee', price: 5, desc: 'Blended coffee with ice cream and chocolate drizzle.', veg: true },
  ],
  'Snacks': [
    { name: 'Samosa (2 pcs)', price: 4, desc: 'Crisp pastry stuffed with spiced potato and peas.', veg: true, featured: true },
    { name: 'Bun Maska', price: 3.5, desc: 'Soft bun with generous butter — perfect with chai.', veg: true },
    { name: 'Veg Sandwich', price: 5.5, desc: 'Grilled sandwich with vegetables, chutney and cheese.', veg: true },
    { name: 'Chicken Sandwich', price: 6.5, desc: 'Grilled sandwich with spiced chicken and mayo.' },
    { name: 'Masala Maggi', price: 5, desc: 'Noodles tossed with vegetables and masala.', veg: true },
    { name: 'French Fries', price: 4.5, desc: 'Golden fries with peri-peri seasoning.', veg: true },
  ],
  'Bakes & Desserts': [
    { name: 'Osmania Biscuits (6 pcs)', price: 4, desc: 'Buttery sweet-and-salty Hyderabadi biscuits.', veg: true },
    { name: 'Chocolate Brownie', price: 5, desc: 'Fudgy brownie, served warm.', veg: true },
    { name: 'Gulab Jamun (2 pcs)', price: 4.5, desc: 'Soft milk dumplings in rose syrup.', veg: true },
  ],
};

const slug = (s: string) => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const menu = (await prisma.menu.findFirst()) ?? (await prisma.menu.create({ data: { name: 'Main Menu' } }));
let order = 0;
for (const [cat, items] of Object.entries(MENU)) {
  const cs = slug(cat);
  const c = await prisma.category.upsert({ where: { slug: cs }, create: { menuId: menu.id, name: cat, slug: cs, sortOrder: order++ }, update: {} });
  for (const [i, it] of items.entries()) {
    const ps = slug(it.name);
    if (await prisma.product.findUnique({ where: { slug: ps } })) continue;
    await prisma.product.create({
      data: {
        categoryId: c.id, name: it.name, slug: ps, description: it.desc, price: D(it.price), isVegetarian: !!it.veg, isFeatured: !!it.featured, isChefPick: !!it.pick, sortOrder: i,
        variants: it.sizes ? { create: [['Regular', 0], ['Large', 1]].map(([n, d], k) => ({ name: n as string, priceDelta: D(d as number), sortOrder: k })) } : undefined,
      },
    });
  }
}
console.log(`Q Tea Cafe menu loaded: ${Object.keys(MENU).length} categories, ${Object.values(MENU).flat().length} items.`);
await prisma.$disconnect();
