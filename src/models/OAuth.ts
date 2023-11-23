import EnvVars from '../constants/EnvVars';
import { OAuthApp, App, } from 'octokit'

// **** Instansiate the oauth **** //

// const clientId = EnvVars.OAuth.ClientId;
// const clientSecret = EnvVars.OAuth.ClientSecret;
const clientId = process.env.OAUTH_CLIENT_ID?.toString() ?? ''
const clientSecret = process.env.OAUTH_CLIENT_SECRET?.toString() ?? ''
const oAuth = new OAuthApp({
  clientId,
  clientSecret,
  defaultScopes: ["user:email"]
});

// **** Exports **** //

export default oAuth