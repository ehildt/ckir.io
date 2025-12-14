export type SupportedToolMethod = 'tools/list' | 'tools/call';

export type SupportedToolFunction =
  | 'vectors.collection.list'
  | 'vectors.collection.create'
  | 'vectors.collection.delete'
  | 'vectors.collection.embed.upsert'
  | 'vectors.collection.embed.delete'
  | 'vectors.collection.search.text'
  | 'vectors.collection.search.vector';

export type McpGenericType<
  T extends { name: SupportedToolFunction } = {
    arguments: any;
    name: SupportedToolFunction;
  },
> = {
  params: T;
  id: number;
  jsonrpc: '2.0';
  method: SupportedToolMethod;
};
