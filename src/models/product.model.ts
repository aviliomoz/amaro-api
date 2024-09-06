import { Schema, model } from "mongoose";

const ProductSchema = new Schema({
  category_id: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: String, required: true },
  type: { type: String, required: true },
  um: { type: String, required: true },
  has_equivalence: { type: Boolean, required: true },
  equivalence: {
    type: [
      {
        um: { type: String, required: true },
        amount: { type: String, required: true },
      },
    ],
  },
  weight_control: { type: Boolean, required: true },
  tare: {
    type: [
      {
        um: { type: String, required: true },
        amount: { type: String, required: true },
      },
    ],
  },
  cost: { type: Number, required: true },
  restaurant_id: {
    type: Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
  recipe: {
    type: [
      {
        item_id: { type: Schema.Types.ObjectId, required: true },
        item_type: { type: String, required: true },
        amount: { type: Number, required: true },
        um: { type: String, required: true },
      },
    ],
  },
});

export const Product = model("Product", ProductSchema);
