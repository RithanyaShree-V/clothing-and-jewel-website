require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();

    console.log('\n=== DATABASE COLLECTIONS ===\n');

    for (const collection of collections) {
      const collName = collection.name;
      const count = await db.collection(collName).countDocuments();
      console.log(`📊 ${collName}: ${count} documents`);
    }

    console.log('\n=== SAMPLE DATA ===\n');

    // Products
    const productCount = await mongoose.connection.collection('products').countDocuments();
    console.log(`✅ Products: ${productCount}`);
    if (productCount > 0) {
      const sample = await mongoose.connection.collection('products').findOne();
      console.log('   Sample:', sample?.name || 'N/A');
    }

    // Users
    const userCount = await mongoose.connection.collection('users').countDocuments();
    console.log(`✅ Users: ${userCount}`);
    if (userCount > 0) {
      const sample = await mongoose.connection.collection('users').findOne();
      console.log('   Sample:', sample?.email || 'N/A');
    }

    // Orders
    const orderCount = await mongoose.connection.collection('orders').countDocuments();
    console.log(`✅ Orders: ${orderCount}`);
    if (orderCount > 0) {
      const sample = await mongoose.connection.collection('orders').findOne();
      console.log('   Sample:', sample?.orderNumber || 'N/A');
    }

    // Reviews
    const reviewCount = await mongoose.connection.collection('reviews').countDocuments();
    console.log(`✅ Reviews: ${reviewCount}`);
    if (reviewCount > 0) {
      const sample = await mongoose.connection.collection('reviews').findOne();
      console.log('   Sample:', `${sample?.rating}⭐ - ${sample?.text?.substring(0, 50)}...`);
    }

    // Carts
    const cartCount = await mongoose.connection.collection('carts').countDocuments();
    console.log(`✅ Carts: ${cartCount}`);

    // Admins
    const adminCount = await mongoose.connection.collection('admins').countDocuments();
    console.log(`✅ Admins: ${adminCount}`);

    console.log('\n=== VERIFICATION COMPLETE ===\n');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

connectDB();
