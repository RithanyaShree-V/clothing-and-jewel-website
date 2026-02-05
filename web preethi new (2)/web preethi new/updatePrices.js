const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb+srv://rithanyashreev23bir_db_user:fXQGP23bT3e4G6GC@cluster0.9lavtqd.mongodb.net/vedhas-clothing?retryWrites=true&w=majority')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Connection Error:', err));

// Define Product Schema
const productSchema = new mongoose.Schema({
  id: Number,
  name: String,
  category: String,
  price: Number,
  image: String,
  description: String,
  isNew: Boolean,
  stock: Number
}, { collection: 'products' });

const Product = mongoose.model('Product', productSchema);

// Updated prices mapping by category
const pricesMap = {
  'Kurti': [699, 799, 899, 999, 1099, 1199, 1299, 1399, 999, 1199],
  'Sarees': [1499, 1599, 1699, 1749, 1799, 1999, 2099, 2199, 1499, 2249],
  'Jewelry': [499, 599, 699, 799, 899, 1299, 1499, 1999, 2499, 4999],
  'Handbags': [999, 1099, 1199, 1299, 1399, 1499, 1599, 1699, 1799, 1899],
  'Maternity Wears': [1199, 1299, 1399, 1499, 1599, 1699, 1799, 1899, 1999, 1199]
};

// Update products by category and ID within that category
async function updatePrices() {
  try {
    const categoryIndices = {
      'Kurti': 0,
      'Sarees': 0,
      'Jewelry': 0,
      'Handbags': 0,
      'Maternity Wears': 0
    };

    // Get all products sorted by ID
    const products = await Product.find().sort({ id: 1 });
    
    for (let product of products) {
      const category = product.category;
      if (pricesMap[category]) {
        const idx = categoryIndices[category];
        const newPrice = pricesMap[category][idx % pricesMap[category].length];
        
        await Product.updateOne(
          { _id: product._id },
          { $set: { price: newPrice } }
        );
        
        console.log(`Updated ${product.name} (${category}) from ₹${product.price} to ₹${newPrice}`);
        categoryIndices[category]++;
      }
    }

    console.log('\n✅ All prices updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error updating prices:', error);
    process.exit(1);
  }
}

updatePrices();
