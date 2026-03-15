import { Schema, model, models, type InferSchemaType } from 'mongoose';

const pageSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, unique: true },
    path: { type: String, required: true, trim: true, unique: true },
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    headerMetaTags: { type: String, default: '' },
    footerMetaTags: { type: String, default: '' },
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

export type PageDocument = InferSchemaType<typeof pageSchema>;

export const PageModel = models.Page || model('Page', pageSchema);
