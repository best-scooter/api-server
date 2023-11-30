import EnvVars from '../constants/EnvVars';
import { App } from 'octokit'

// **** Instansiate the oauth **** //

// const clientId = EnvVars.OAuth.ClientId;
// const clientSecret = EnvVars.OAuth.ClientSecret;
// const clientId = process.env.OAUTH_CLIENT_ID?.toString() ?? ''
// const clientSecret = process.env.OAUTH_CLIENT_SECRET?.toString() ?? ''
// const oAuth = new OAuthApp({
//   clientId,
//   clientSecret,
//   defaultScopes: ["user:email"]
// });

const githubApp = new App({
  appId: EnvVars.GithubAppId,
  privateKey: EnvVars.GithubPrivateKey,
  oauth: {
    clientId: EnvVars.OAuthClientId,
    clientSecret: EnvVars.OAuthClientSecret
  }
});

// **** Exports **** //

export default githubApp
