import { Schema, model } from 'mongoose'

const documentSchema = new Schema({
  name: {
    type: String,
    required: [true, 'document must have a name'],
    maxlength: [50, 'document name can not be more than 50 characters']
  },
  shardKey: {
    type: Number,
    required: [true, 'document must have a shard key']
  }
})

export const documentModel = model('Document', documentSchema);