const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Create indexes
    await createIndexes();
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

const createIndexes = async () => {
  try {
    const db = mongoose.connection.db;
    
    // Operation logs indexes
    await db.collection('operationlogs').createIndex({ treeType: 1, timestamp: -1 });
    await db.collection('operationlogs').createIndex({ timestamp: -1 });
    await db.collection('operationlogs').createIndex({ treeType: 1, operation: 1 });

    // Experiments indexes
    await db.collection('experiments').createIndex({ pattern: 1, timestamp: -1 });

    console.log('Database indexes created successfully');
  } catch (error) {
    console.error('Error creating indexes:', error.message);
  }
};

module.exports = connectDB;
