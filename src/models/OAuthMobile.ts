//import EnvVars from '../constants/EnvVars';
import { OAuthApp, App, } from 'octokit'

// **** Instansiate the oauth **** //

// const clientId = EnvVars.OAuth.ClientId;
// const clientSecret = EnvVars.OAuth.ClientSecret;
//const clientId = process.env.OAUTH_CLIENT_ID?.toString() ?? ''
//const clientSecret = process.env.OAUTH_CLIENT_SECRET?.toString() ?? ''

const clientId = "8a13e643a21789547ad0"
const clientSecret = "b8419ff342c26e0af5d68cf999f8a57f26afe6f0"

const oAuthMobile = new OAuthApp({
  clientId,
  clientSecret,
  defaultScopes: ["user:email"]
});

// **** Exports **** //

export default oAuthMobile
