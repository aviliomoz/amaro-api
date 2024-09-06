import { Schema, model } from "mongoose";

const CurrencySchema = new Schema({
  code: { type: String, required: true },
  name: { type: String, required: true },
  symbol: { type: String, required: true },
});

export const Currency = model("Currency", CurrencySchema);
