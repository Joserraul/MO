import {Schema, model} from 'mongoose';

const cartSchema = new Schema({
  products: [{
    product : {
      type: Schema.Types.ObjectId,
      ref: 'product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      default: 1
    }
  }],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

export const cartModel = model('cart', cartSchema);