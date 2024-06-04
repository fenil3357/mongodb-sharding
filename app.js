import mongoose from 'mongoose'

const MONGO_URI = 'mongodb://localhost:27017/sharding-test';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const db = mongoose.connection;

db.on('error', (error) => {
  console.log('ERROR WHILE CONNECTING TO MONGODB', error);
})

db.once('open', function () {
  console.log('CONNECTED TO MONGODB SUCCESSFULLY!!')
})

