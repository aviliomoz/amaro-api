import { Schema, model } from "mongoose";

const RestaurantSchema = new Schema({
  name: { type: String, required: true },
  currency_id: { type: Schema.Types.ObjectId, ref: "Currency", required: true },
  purchase_tax: { type: Number, required: true },
  sales_tax: { type: Number, required: true },
  status: { type: String, required: true },
  team: {
    type: [
      {
        user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
        role: { type: String, required: true },
      },
    ],
  },
});

export const Restaurant = model("Restaurant", RestaurantSchema);
