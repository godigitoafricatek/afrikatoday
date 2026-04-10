#!/bin/bash
set -e

echo "=== AfrikaToday Setup ==="

# 1. Install dependencies
echo "Installing dependencies..."
npm install

# 2. Initialize Prisma
echo "Generating Prisma client..."
npx prisma generate

# 3. Create database and run migrations
echo "Setting up database..."
npx prisma db push

# 4. Seed database
echo "Seeding database..."
npx prisma db seed

echo ""
echo "=== Setup Complete! ==="
echo ""
echo "Start development server: npm run dev"
echo "Open: http://localhost:3000"
echo "Staff portal: http://localhost:3000/staff/login"
echo "Login: admin@afrikatoday.com / AfrikaToday@2025"
