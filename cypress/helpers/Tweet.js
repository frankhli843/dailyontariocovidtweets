import * as OAuth from "oauth";
import Twitter from 'twitter-lite';

/*
*	Code snippet for posting tweets to your own twitter account from node.js.
*	You must first create an app through twitter, grab the apps key/secret,
*	and generate your access token/secret (should be same page that you get the
*	app key/secret).
* 	Uses oauth package found below:
*		https://github.com/ciaranj/node-oauth
*		npm install oauth
*	For additional usage beyond status updates, refer to twitter api
*		https://dev.twitter.com/docs/api/1.1
*/
const sendTweet = async (status, configObject) => {
  console.log(`Attempting to Tweet: ${status}`)
  const { consumerKey, consumerSecret, userAccessToken, userTokenSecret } = configObject;
  const client = new Twitter({
    subdomain: "api", // "api" is the default (change for other subdomains)
    version: "1.1", // version "1.1" is the default (change for other subdomains)
    consumer_key: consumerKey, // from Twitter.
    consumer_secret: consumerSecret, // from Twitter.
    access_token_key: userAccessToken, // from your User (oauth_token)
    access_token_secret: userTokenSecret // from your User (oauth_token_secret)
  });
  await client.post("statuses/update", { status: status }).then(respond => {console.log(respond)});

}

export const tweetMessage = (savedStats) => {
  return `  ${savedStats.latestDate} had ${savedStats.latestCases} cases reported in Ontario. 
  Change since last report: ${savedStats.changeSinceLastReport}. 
  Info taken from covid-19.ontario.ca/`
}

export default sendTweet;