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
  T extends {
    requestedTools?: any;
    function?: SupportedToolFunction;
  } = {
    arguments: any;
    requestedTools?: any;
    function: SupportedToolFunction;
  },
> = {
  id: number;
  jsonrpc: '2.0';
  method: SupportedToolMethod;
  params: T;
};
