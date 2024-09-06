import { Schema, model } from "mongoose";

const SubproductSchema = new Schema({
  category_id: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  name: { type: String, required: true },
  um: { type: String, required: true },
  yield: { type: Number, required: true },
  status: { type: String, required: true },
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

export const Subproduct = model("Subproduct", SubproductSchema);
