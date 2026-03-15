import { Schema, model, models, type InferSchemaType } from 'mongoose';

const blogSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, unique: true },
    category: { type: String, required: true, trim: true },
    publishedDate: { type: Date, required: true },
    featuredImage: { type: String, default: '' },
    shortDescription: { type: String, default: '' },
    body: { type: String, default: '' },
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

export type BlogDocument = InferSchemaType<typeof blogSchema>;

export const BlogModel = models.Blog || model('Blog', blogSchema);
