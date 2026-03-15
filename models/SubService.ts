import {
  Schema,
  model,
  models,
  Types,
  type InferSchemaType,
} from 'mongoose';

const subServiceSchema = new Schema(
  {
    serviceId: { type: Types.ObjectId, ref: 'Service', required: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, unique: true },
    shortDescription: { type: String, default: '' },
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    indexStatus: {
      type: String,
      enum: ['index', 'noindex'],
      default: 'index',
    },
    status: {
      type: String,
      enum: ['published', 'unpublished'],
      default: 'published',
    },
  },
  { timestamps: true },
);

export type SubServiceDocument = InferSchemaType<typeof subServiceSchema>;

export const SubServiceModel =
  models.SubService || model('SubService', subServiceSchema);
