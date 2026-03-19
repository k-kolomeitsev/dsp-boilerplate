/** @type {import('orval').Config} */
const config = {
  api: {
    input: './api.yaml',
    output: {
      mode: 'tags-split',
      target: 'src/hooks/generated/target.ts',
      schemas: 'src/hooks/generated',
      client: 'react-query',
      httpClient: 'axios',
      prettier: true,
      mock: false,
      override: {
        mutator: {
          path: './src/helpers/custom-client.ts',
          name: 'useCustomInstance',
        },
        query: {
          // Generate queryFn with AbortSignal support (TanStack Query v5).
          signal: true,
          version: 5,
        },
      },
    },
    hooks: {
      afterAllFilesWrite: 'prettier --write',
    },
  },
};

export default config;
