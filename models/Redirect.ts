import { Schema, model, models, type InferSchemaType } from 'mongoose';

/** SEO redirect managed in `/admin/redirects`; applied to requests by `proxy.ts`. */
const redirectSchema = new Schema(
  {
    /** Normalized path (see `normalizeRedirectSource`); a trailing `/*` makes it a wildcard. */
    source: { type: String, required: true, trim: true, unique: true },
    destination: { type: String, required: true, trim: true },
    statusCode: { type: Number, enum: [301, 302], default: 301 },
    enabled: { type: Boolean, default: true },
    note: { type: String, default: '' },
    /** `auto` = created when a page/blog URL was renamed in the admin. */
    origin: { type: String, enum: ['manual', 'auto'], default: 'manual' },
    hits: { type: Number, default: 0 },
    lastHitAt: { type: Date, required: false },
  },
  { timestamps: true },
);

export type RedirectDocument = InferSchemaType<typeof redirectSchema>;

export const RedirectModel = models.Redirect || model('Redirect', redirectSchema);
