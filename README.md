# TweetStream
A small app to display a real-time filtered Twitter stream using Node.js, Socket.io, and AngularJS.

[![Join the chat at https://gitter.im/wonder95/tweetstream](https://badges.gitter.im/wonder95/tweetstream.svg)](https://gitter.im/wonder95/tweetstream?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## Documentation

### Setup
In order to run TweetStream, you will need:
- A [Twitter App](https://apps.twitter.com/) so that you can generate appropriate API keys/secrets to connect to their API.
- A server with [Node.js](https://nodejs.org/) installed. You can run one locally for development.
- _(optionally)_ Another web server to act as a configuration server. See the related [TweetStream Drupal](https://github.com/wonder95/tweetstream_drupal) project.

### Local Development
Create a `.env` file in the top level of the project folder. There is an example
one called `example.env` that you can copy and rename to `.env`. This file is not
tracked in Git as it contains sensitive information. See the _Environmental
Variables_ section below for details.

### Environmental variables
There are certain variables that you will need to pass to your ENV variables on
your server. While you can create a .env file on your server, it is recommended
to place that information into environmental variables instead.

**Twitter auth-related ENV vars**<br />
Replace `{value}` with the appropriate contents from your Twitter app settings.

- **API_KEY**={value}
- **API_SECRET**={value}
- **ACCESS_TOKEN**={value}
- **ACCESS_TOKEN_SECRET**={value}

**Default Stream Settings** (optional) <br />
Setting these environmental options will tell TweetStream which tweets to automatically start streaming.

- **STREAM_PATH**=statuses/filter <br />
_usually 'statuses/filter' for public content - see Twitter API docs for more info_
- **STREAM_PARAMS_TRACK**=javascript,angularjs,jquery,nodejs,socketio <br />
_Comma-separated list of terms to track_

**External Server Callback URL** (optional) <br />
TweetStream can use the URL/path below to fetch updated configuration data to update the Default Stream Settings. This is triggered by a request to a special URL on the Node.js server.

- **EXTERNAL_CONFIG_URL**=http://example.com/api/tweetstream/config
- **LOCAL_CONFIG_REQUEST_PATH**=api/tweetstream/refresh-config <br />
_Making a request to this path on your Node.js server will trigger it to request updated information from the EXTERNAL_CONFIG_URL_
