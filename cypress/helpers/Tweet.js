import * as OAuth from "oauth";
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
const sendTweet = (status, consumerKey, applicationKey, userAccessToken, userSecret) => {
  const oauth = new OAuth.OAuth(
      'https://api.twitter.com/oauth/request_token',
      'https://api.twitter.com/oauth/access_token',
      consumerKey,
      applicationKey,
      '1.0A',
      null,
      'HMAC-SHA1'
  );
  const postBody = {
    'status': status
  };

// console.log('Ready to Tweet article:\n\t', postBody.status);
  oauth.post('https://api.twitter.com/1.1/statuses/update.json',
      userAccessToken,  // oauth_token (user access token)
      userSecret,  // oauth_secret (user secret)
      postBody,  // post body
      '',  // post content type ?
      function(err, data, res) {
        if (err) {
          console.log(err);
        } else {
          // console.log(data);
        }
      });
}

export default sendTweet;