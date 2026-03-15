import { Schema, model, models, type InferSchemaType } from 'mongoose';

const adminSchema = new Schema(
  {
    email: { type: String, required: true, trim: true, unique: true },
  },
  { timestamps: true },
);

export type AdminDocument = InferSchemaType<typeof adminSchema>;

export const AdminModel = models.Admin || model('Admin', adminSchema);
