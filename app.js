import mongoose from 'mongoose'
import { documentModel } from './models/document.model.js';
import dotenv from 'dotenv'
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const db = mongoose.connection;

db.on('error', (error) => {
  console.log('ERROR WHILE CONNECTING TO MONGODB', error);
})

db.once('open', async function () {
  console.log('CONNECTED TO MONGODB SUCCESSFULLY!!')

  for (let i = 1; i <= 100; i++) {
    let doc = new documentModel({
      name: `Document name ${i}`,
      shardKey: i
    })

    await doc.save();
    console.log('Document inserted')
  }
})

