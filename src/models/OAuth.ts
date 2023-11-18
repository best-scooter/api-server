import { OAuthApp, App, } from 'octokit'

// **** Instansiate the oauth **** //

const clientId = "ab37ccfd44b552a7f961";
const clientSecret = "1bb0534a49e6243820daddb3e308a33b93b07c2e";
const oAuth = new OAuthApp({
  clientId,
  clientSecret,
  defaultScopes: ["user:email"]
});

// **** Exports **** //

export default oAuth