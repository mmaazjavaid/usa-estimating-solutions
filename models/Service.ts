import { Schema, model, models, type InferSchemaType } from 'mongoose';

const serviceSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, unique: true },
    path: { type: String, default: '' },
    shortDescription: { type: String, default: '' },
    image: { type: String, default: '' },
    imageAlt: { type: String, default: '' },
    metaImage: { type: String, default: '' },
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
    displayInFooterMenu: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export type ServiceDocument = InferSchemaType<typeof serviceSchema>;

export const ServiceModel = models.Service || model('Service', serviceSchema);
