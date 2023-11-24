/**
 * Environments variables declared here.
 */

/* eslint-disable node/no-process-env */

export default {
  NodeEnv: (process.env.NODE_ENV ?? ''),
  Port: (process.env.PORT ?? 0),
  DbServer: (process.env.DATABASE_SERVER ?? ''),
  DbDatabase: (process.env.DATABASE_DATABASE ?? ''),
  DbUsername: (process.env.DATABASE_USERNAME ?? ''),
  DbPassword: (process.env.DATABASE_PASSWORD ?? '')
} as const;
