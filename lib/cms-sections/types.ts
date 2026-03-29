export type CmsLinkValue = {
  kind: 'internal' | 'external';
  href: string;
  label: string;
};

export type CmsSectionFieldInput =
  | 'text'
  | 'textarea'
  | 'url'
  | 'imageUrl'
  | 'link'
  | 'select';

export type CmsSectionFieldDef = {
  key: string;
  label: string;
  input: CmsSectionFieldInput;
  placeholder?: string;
  options?: { value: string; label: string }[];
};

export type CmsSectionItemListDef = {
  key: string;
  label: string;
  input: 'itemList';
  maxItems?: number;
  /** Shown under the list label in the admin form (e.g. how links apply on the site). */
  helperText?: string;
  itemFields: CmsSectionFieldDef[];
};

export type CmsSectionFieldDefinition = CmsSectionFieldDef | CmsSectionItemListDef;

export type CmsSectionCategory =
  | 'Hero'
  | 'Social proof'
  | 'Content'
  | 'Features'
  | 'Conversion'
  | 'Media'
  | 'Layout'
  | 'Specialized';

export type CmsSectionDefinition = {
  type: string;
  label: string;
  description: string;
  category: CmsSectionCategory;
  /** Tailwind gradient classes for admin thumbnail */
  previewClass: string;
  fields: CmsSectionFieldDefinition[];
  /** Default payload merged on add */
  defaultData: Record<string, unknown>;
};

export type CmsPageSection = {
  key: string;
  type: string;
  order: number;
  data: Record<string, unknown>;
};
