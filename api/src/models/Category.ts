import mongoose, { Document, Schema } from "mongoose";

export interface ICategory extends Document {
  title: string;
  description?: string;
  color?: string;
  resource?: string;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String },
    color: { type: String },
    resource: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<ICategory>("Category", categorySchema);


