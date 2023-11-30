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
  DbPassword: (process.env.DATABASE_PASSWORD ?? ''),
  JwtSecret: (process.env.JWT_SECRET ?? ''),
  GithubAppId: (process.env.GITHUB_APP_ID ?? ''),
  GithubPrivateKey: (process.env.GITHUB_PRIVATE_KEY ?? ''),
  OAuthClientId: (process.env.OAUTH_CLIENT_ID ?? ''),
  OAuthClientSecret: (process.env.OAUTH_CLIENT_SECRET ?? '')
} as const;
