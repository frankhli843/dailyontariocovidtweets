
# Daily Ontario Covid Tweets
- I am an Ontario resident who checks the statistics on a daily basis so I can get a sense of the current situation. I wrote this simple bot to make the information more accessible on twitter. My hope is that with more access to information we can all be more informed.
- This code that posts daily Covid numbers for Ontario taken from [the offical government website https://covid-19.ontario.ca/data](https://covid-19.ontario.ca/data)
- It will check for new numbers on a daily basis and post it to the twitter account of your choice.
- This was created in order to make information more accessible.
- I'm running the stats on this twitter account: [@daily_ontario_c](https://twitter.com/daily_ontario_c)

# To run on your own twitter account
- The main logic can be at [cypress/integration/Index.js](https://github.com/frankhli843/dailyontariocovidtweets/blob/main/cypress/integration/Index.js) 
- Requires that you have `config.json` file which the field and fill in Twitter OAuth details
```
{
  "consumerKey": "",
  "applicationKey": "",
  "userAccessToken": "",
  "userSecret": ""
}
```
- To start with UI run: `yarn start`
- To start with command line only run: `yarn headless`
- To run every hour headless: `yarn hourly`


![tweet demo](./img/tweet_example.png)
