import { Schema, model, Document, Types } from "mongoose";

// 1. Definir la interfaz de TypeScript
export interface IArea extends Document {
  name: string;
  status: string;
  restaurant_id: Types.ObjectId;
}

// 2. Crear el esquema de Mongoose utilizando la interfaz
const AreaSchema = new Schema<IArea>({
  name: { type: String, required: true },
  status: { type: String, required: true },
  restaurant_id: {
    type: Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
});

// 3. Crear y exportar el modelo de Mongoose
export const Area = model<IArea>("Area", AreaSchema);
