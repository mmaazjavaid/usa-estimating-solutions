import { Schema, model, models, type InferSchemaType } from 'mongoose';

const cmsSectionSchema = new Schema(
  {
    key: { type: String, required: true },
    type: { type: String, required: true },
    order: { type: Number, required: true },
    data: { type: Schema.Types.Mixed, default: {} },
  },
  { _id: false },
);

const pageSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, unique: true },
    path: { type: String, required: true, trim: true, unique: true },
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    metaImage: { type: String, default: '' },
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
    placement: {
      type: String,
      enum: ['none', 'services', 'trades'],
      default: 'none',
    },
    /** seo_only: metadata overlay for static routes; dynamic: render sections at `path` (`/page` or `/trades/page`) */
    renderMode: {
      type: String,
      enum: ['seo_only', 'dynamic'],
      default: 'seo_only',
    },
    sections: { type: [cmsSectionSchema], default: [] },
    /** Set when homepage defaults were migrated to full section payloads (admin-visible copy). */
    homeSectionsVersion: { type: Number, required: false },
    /** Service marketing pages (`/cost-estimation`, etc.) section schema version. */
    serviceMarketingSectionsVersion: { type: Number, required: false },
    /** Trades sub-pages (`/trades/...`) section schema version. */
    tradesSectionsVersion: { type: Number, required: false },
    /** 'independent' = shown in nav; 'under_trade' = nested under a parent trade's types section. */
    tradeLocation: {
      type: String,
      enum: ['independent', 'under_trade'],
      default: 'independent',
    },
    /** Which of the 4 core trade pages this page is nested under (only when tradeLocation = 'under_trade'). */
    parentTrade: {
      type: String,
      enum: ['interior', 'exterior', 'mep', 'structural', null],
      default: null,
    },
    /** Description shown in the parent trade's types section for this child trade. */
    parentTradeDescription: { type: String, default: '' },
  },
  { timestamps: true },
);

export type PageDocument = InferSchemaType<typeof pageSchema>;

export const PageModel = models.Page || model('Page', pageSchema);
