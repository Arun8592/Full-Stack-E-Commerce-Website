const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

const users = [
  { name: 'Admin User', email: 'admin@ecommerce.com', password: 'admin123', role: 'admin' },
  { name: 'John Doe', email: 'john@example.com', password: 'password123', role: 'user' },
  { name: 'Jane Smith', email: 'jane@example.com', password: 'password123', role: 'user' },
];

const products = [
  {
    name: 'Wireless Noise-Cancelling Headphones',
    description: 'Premium over-ear headphones with active noise cancellation, 30hr battery life, and Hi-Res audio support.',
    price: 299.99,
    comparePrice: 349.99,
    category: 'Electronics',
    brand: 'SoundPro',
    images: [{ url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500' }],
    stock: 50,
    ratings: 4.5,
    numReviews: 128,
    isFeatured: true,
    tags: ['headphones', 'wireless', 'audio'],
  },
  {
    name: 'Smart Watch Series X',
    description: 'Advanced smartwatch with health monitoring, GPS, 5-day battery, and water resistance up to 50m.',
    price: 399.99,
    comparePrice: 449.99,
    category: 'Electronics',
    brand: 'TechWear',
    images: [{ url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500' }],
    stock: 30,
    ratings: 4.7,
    numReviews: 89,
    isFeatured: true,
    tags: ['smartwatch', 'fitness', 'wearable'],
  },
  {
    name: 'Premium Running Shoes',
    description: 'Lightweight performance running shoes with responsive cushioning and breathable mesh upper.',
    price: 129.99,
    comparePrice: 159.99,
    category: 'Sports',
    brand: 'SpeedRun',
    images: [{ url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500' }],
    stock: 100,
    ratings: 4.3,
    numReviews: 245,
    isFeatured: true,
    tags: ['shoes', 'running', 'sports'],
  },
  {
    name: 'Mechanical Gaming Keyboard',
    description: 'TKL mechanical keyboard with Cherry MX switches, RGB backlighting, and programmable macros.',
    price: 149.99,
    category: 'Electronics',
    brand: 'GamePro',
    images: [{ url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500' }],
    stock: 75,
    ratings: 4.6,
    numReviews: 312,
    tags: ['keyboard', 'gaming', 'mechanical'],
  },
  {
    name: 'Organic Cotton T-Shirt',
    description: '100% organic cotton t-shirt with sustainable dyeing process. Available in multiple colors.',
    price: 34.99,
    category: 'Clothing',
    brand: 'EcoWear',
    images: [{ url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500' }],
    stock: 200,
    ratings: 4.2,
    numReviews: 567,
    tags: ['tshirt', 'organic', 'clothing'],
  },
  {
    name: 'JavaScript: The Good Parts',
    description: 'The classic programming book by Douglas Crockford. Essential reading for JS developers.',
    price: 24.99,
    category: 'Books',
    brand: "O'Reilly",
    images: [{ url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500' }],
    stock: 150,
    ratings: 4.8,
    numReviews: 892,
    tags: ['javascript', 'programming', 'books'],
  },
  {
    name: '4K Ultra HD Camera',
    description: 'Professional mirrorless camera with 4K video, 24MP sensor, and in-body image stabilization.',
    price: 1299.99,
    comparePrice: 1499.99,
    category: 'Electronics',
    brand: 'PixelMaster',
    images: [{ url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500' }],
    stock: 20,
    ratings: 4.9,
    numReviews: 156,
    isFeatured: true,
    tags: ['camera', '4k', 'photography'],
  },
  {
    name: 'Yoga Mat Pro',
    description: 'Extra thick 6mm eco-friendly yoga mat with superior grip, alignment lines, and carry strap.',
    price: 59.99,
    category: 'Sports',
    brand: 'ZenFit',
    images: [{ url: 'https://images.unsplash.com/photo-1601925228869-fc3f4bba90d8?w=500' }],
    stock: 80,
    ratings: 4.4,
    numReviews: 423,
    tags: ['yoga', 'fitness', 'mat'],
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    console.log('Data cleared');

    const createdUsers = await User.create(users);
    console.log(`${createdUsers.length} users seeded`);

    const adminUser = createdUsers[0];
    const productData = products.map((p) => ({ ...p, seller: adminUser._id }));
    const createdProducts = await Product.create(productData);
    console.log(`${createdProducts.length} products seeded`);

    console.log('\n✅ Database seeded successfully!');
    console.log('Admin: admin@ecommerce.com / admin123');
    console.log('User:  john@example.com / password123');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seedDB();
