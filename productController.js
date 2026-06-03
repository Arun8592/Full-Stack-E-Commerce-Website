const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

// @desc    Get all products with filtering, sorting, pagination
// @route   GET /api/products
exports.getProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  let query = { isActive: true };

  // Search
  if (req.query.search) {
    query.$text = { $search: req.query.search };
  }

  // Category filter
  if (req.query.category) query.category = req.query.category;

  // Brand filter
  if (req.query.brand) query.brand = req.query.brand;

  // Price range
  if (req.query.minPrice || req.query.maxPrice) {
    query.price = {};
    if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
  }

  // Rating filter
  if (req.query.rating) query.ratings = { $gte: Number(req.query.rating) };

  // Featured filter
  if (req.query.featured === 'true') query.isFeatured = true;

  // Sort
  let sortBy = { createdAt: -1 };
  if (req.query.sort === 'price_asc') sortBy = { price: 1 };
  else if (req.query.sort === 'price_desc') sortBy = { price: -1 };
  else if (req.query.sort === 'rating') sortBy = { ratings: -1 };
  else if (req.query.sort === 'popular') sortBy = { numReviews: -1 };

  const [products, total] = await Promise.all([
    Product.find(query).sort(sortBy).skip(skip).limit(limit).select('-reviews'),
    Product.countDocuments(query),
  ]);

  res.json({
    success: true,
    data: products,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

// @desc    Get single product
// @route   GET /api/products/:id
exports.getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('reviews.user', 'name avatar');

  if (!product || !product.isActive) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json({ success: true, data: product });
});

// @desc    Create product (admin)
// @route   POST /api/products
exports.createProduct = asyncHandler(async (req, res) => {
  req.body.seller = req.user._id;
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, data: product });
});

// @desc    Update product (admin)
// @route   PUT /api/products/:id
exports.updateProduct = asyncHandler(async (req, res) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.json({ success: true, data: product });
});

// @desc    Delete product (admin)
// @route   DELETE /api/products/:id
exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  await Product.findByIdAndUpdate(req.params.id, { isActive: false });
  res.json({ success: true, message: 'Product deleted' });
});

// @desc    Create product review
// @route   POST /api/products/:id/reviews
exports.createReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );
  if (alreadyReviewed) {
    res.status(400);
    throw new Error('You have already reviewed this product');
  }

  const review = { user: req.user._id, name: req.user.name, rating: Number(rating), comment };
  product.reviews.push(review);
  product.numReviews = product.reviews.length;
  product.ratings = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;

  await product.save();
  res.status(201).json({ success: true, message: 'Review added' });
});

// @desc    Get product categories
// @route   GET /api/products/categories
exports.getCategories = asyncHandler(async (req, res) => {
  const categories = await Product.distinct('category', { isActive: true });
  res.json({ success: true, data: categories });
});

// @desc    Get all products for admin
// @route   GET /api/products/admin/all
exports.getAdminProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ createdAt: -1 });
  res.json({ success: true, data: products, total: products.length });
});
