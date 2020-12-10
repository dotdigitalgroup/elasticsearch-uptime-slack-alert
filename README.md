# Elasticsearch Uptime Slack Alert

A tool to send Slack notifications when Elasticsearch Uptime monitors change its status. The application detects and send a message when status of a monitor is changed from `up` to `down` or  `down` to `up`.

## Usage

Create the config file :

```shell
$ cp config.json.sample config.json
```

Configure with your credentials:

```
{
  "interval_ms": 60000                                            ## Interval time to check Elasticsearch status
  "search_min_ago": 5                                             ## Time from now to search for monitors on Elasticsearch
  "elasticsearch_url": "https://myelastic.com"                    ## Elasticsearch endpoint (only https)
  "elasticsearch_apikey": "ApiKey YmxhYmxhOmJsYWJsYWJsYWJsYQ=="   ## Elasticsearch base64 ApiKey
  "elasticsearch_index": "heartbeat-*"                            ## Elasticsearch index with heartbeat data
  "slack_webhookUrl": "https://hooks.slack.com/services/..."      ## Slack Incoming webhook (URL)
  "slack_channel": "#mychannel"                                   ## Slack channel configured for the Incoming webhook
}
```

Run the application:

```shell
$ node index.js
```



## Creating an API Key in Elasticsearch

Configure the `name` and `index` values and send the following post request:

```json
POST /_security/api_key
{
  "name": "elasticsearch-uptime-slack-alert",
  "role_descriptors": {
    "role-a": {
      "cluster": ["all"],
      "index": [
        {
          "names": ["heartbeat-*"],
          "privileges": ["read"]
        }
      ]
    }
  }
}
```

The response should be something like this:

```json
{
  "id" : "IdiDIdiIdiDidiD",
  "name" : "elasticsearch-uptime-slack-alert",
  "api_key" : "aPiKeYAPiKEyApikE"
}
```

With the `id` and `api_key`, create a **base64 ApiKey**:

```shell
$ echo -n "<id>:<api_key>" | base64
```

You can test the **base64 ApiKey** using the command:

```shell
$ curl -H "Authorization: ApiKey <BASE64_APIKEY>" https://<ELASTICSEARCH_URL>/_cluster/health
```



## Creating a Slack Incoming Webhook

You need to create an *Slack app*, enable *Incoming Webhooks* and then, create an *Incoming Webhook*.

Follow the instructions on the Slack tutorial: https://api.slack.com/messaging/webhooks.