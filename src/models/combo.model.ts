import { Schema, model } from "mongoose";

const ComboSchema = new Schema({
  category_id: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  fixed_price: { type: Boolean, required: true },
  status: { type: String, required: true },
  restaurant_id: {
    type: Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
  content: {
    type: [
      {
        product_id: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        amount: { type: Number, required: true },
        price: { type: Number, required: true },
        replacements: {
          type: [
            {
              product_id: {
                type: Schema.Types.ObjectId,
                ref: "Product",
                required: true,
              },
              amount: { type: Number, required: true },
              price: { type: Number, required: true },
            },
          ],
        },
      },
    ],
  },
});

export const Combo = model("Combo", ComboSchema);
