import { Schema, model } from "mongoose";

const WarehouseSchema = new Schema({
  name: { type: String, required: true },
  status: { type: String, required: true },
  restaurant_id: {
    type: Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
});

export const Warehouse = model("Warehouse", WarehouseSchema);
