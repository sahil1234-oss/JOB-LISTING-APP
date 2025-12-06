// const mongoose = require('mongoose');

// const connect = async () => {
//   // Support both MONGO_URI & MONGO_URL
//   const uri = process.env.MONGO_URL || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/jobapp';

//   if (!uri) {
//     throw new Error("MongoDB URI NOT FOUND in .env");
//   }

//   await mongoose.connect(uri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   });

//   console.log('MongoDB connected ✅');
// };

// module.exports = connect;







const mongoose = require('mongoose');

const connect = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error("❌ ERROR: MONGO_URI missing in .env");
    process.exit(1);
  }

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  console.log('✅ MongoDB Connected Successfully');
};

module.exports = connect;
