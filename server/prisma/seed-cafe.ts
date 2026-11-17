/**
 * Q Tea Cafe real profile: address, phone, hours, map, locale.   npm run db:seed:cafe
 * Overwrites those fields on the restaurant row (safe to re-run), and sets the default About section.
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { ABOUT } from './about';

const prisma = new PrismaClient();
const ADDRESS = '279, Yelahanka Satellite Town, Yelahanka New Town,\nBengaluru, Karnataka 560064, India';
const PLACE = 'https://www.google.com/maps/place/Q+Tea+Cafe/data=!4m2!3m1!1s0x3bae19d7f88fe961:0xd07d5077ef2f6f84';
const hours = Object.fromEntries(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map((d) => [d, { open: '10:30', close: '22:30' }]));

const data = {
  address: ADDRESS, phone: '+91 97401 61532', whatsapp: '919740161532', openingHours: hours,
  mapEmbedUrl: 'https://www.google.com/maps?q=Q+Tea+Cafe,+279+Yelahanka+Satellite+Town,+Yelahanka+New+Town,+Bengaluru+560064&output=embed',
  social: { maps: PLACE }, currency: 'INR', locale: 'en-IN', timezone: 'Asia/Kolkata',
  tagline: 'Good Food • Great Tea • Better Together',
};
await prisma.restaurant.upsert({ where: { id: 'qtea' }, create: { id: 'qtea', name: 'Q Tea Cafe', ...data }, update: data });
await prisma.contentBlock.upsert({ where: { key: 'home.about' }, create: { key: 'home.about', title: ABOUT.title, body: ABOUT }, update: {} });
console.log('Q Tea Cafe profile saved (INR, Asia/Kolkata, 10:30–22:30 daily).');
await prisma.$disconnect();
