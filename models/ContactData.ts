import { Schema, model, models, type InferSchemaType } from 'mongoose';

const contactDataSchema = new Schema(
  {
    emails: {
      type: [String],
      default: [],
      validate: [(val: string[]) => val.length > 0, 'At least one email required'],
    },
    phones: {
      type: [String],
      default: [],
      validate: [(val: string[]) => val.length > 0, 'At least one phone required'],
    },
    address: { type: String, default: '' },
  },
  { timestamps: true },
);

export type ContactDataDocument = InferSchemaType<typeof contactDataSchema>;

export const ContactDataModel =
  models.ContactData || model('ContactData', contactDataSchema);
