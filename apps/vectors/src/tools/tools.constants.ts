import { VECTORS_UPSERT_POINTS } from './vectors.collection-embed-upsert.tool';
import { VECTORS_CREATE_COLLECTION } from './vectors-collection-create.tool';
import { VECTORS_DELETE_COLLECTION } from './vectors-collection-delete.tool';
import { VECTORS_DELETE_POINTS } from './vectors-collection-embed.delete.tool';
import { VECTORS_LIST_COLLECTIONS } from './vectors-collection-list.tool';
import { VECTORS_COLLECTION_SEARCH_TEXT } from './vectors-collection-search-text.tool';
import { VECTORS_COLLECTION_SEARCH_VECTOR } from './vectors-collection-search-vector.tool';

export const MCP_TOOLS_LIST = {
  id: 1,
  jsonrpc: '2.0',
  result: {
    tools: [
      VECTORS_COLLECTION_SEARCH_TEXT,
      VECTORS_COLLECTION_SEARCH_VECTOR,
      VECTORS_DELETE_POINTS,
      VECTORS_UPSERT_POINTS,
      VECTORS_LIST_COLLECTIONS,
      VECTORS_CREATE_COLLECTION,
      VECTORS_DELETE_COLLECTION,
    ],
  },
};
