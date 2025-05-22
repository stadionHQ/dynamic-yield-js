import type { FromSchema } from 'json-schema-to-ts';
import * as schemas from './schemas';

export type ChooseVariationsBodyParam = FromSchema<typeof schemas.ChooseVariations.body>;
export type ChooseVariationsResponse200 = FromSchema<typeof schemas.ChooseVariations.response['200']>;
export type ChooseVariationsResponse401 = FromSchema<typeof schemas.ChooseVariations.response['401']>;
export type ChooseVariationsResponse422 = FromSchema<typeof schemas.ChooseVariations.response['422']>;
export type SearchBodyParam = FromSchema<typeof schemas.Search.body>;
export type SearchResponse200 = FromSchema<typeof schemas.Search.response['200']>;
export type SearchResponse401 = FromSchema<typeof schemas.Search.response['401']>;
export type SearchResponse422 = FromSchema<typeof schemas.Search.response['422']>;
