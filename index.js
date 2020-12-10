const Elasticsearch = require("./lib/Elasticsearch");
const Request = require("./lib/Request");
const Uptime = require("./lib/Uptime");
const Slack = require("./lib/Slack");
const Config = require("./config.json");

const slack = new Slack(Config.slack_webhookUrl, Config.slack_channel);
const uptime = new Uptime(slack);
const elasticRequest = new Request({
  url: Config.elasticsearch_url,
  auth: Config.elasticsearch_apikey,
});

setInterval(async () => {
  elasticRequest
    .post({
      path: `/${Config.elasticsearch_index}/_search`,
      body: Elasticsearch.getQuery(Config.search_min_ago),
    })
    .then((data) => {
      let parsedData = Elasticsearch.parseResult(data);
      uptime.setState(parsedData);
    })
    .catch((err) => {
      if (err === "ElasticsearchParseError") {
        slack.sendMessage(`Can't parse Elasticsearch data`);
      } else {
        slack.sendMessage(`Can't connect to Elasticsearch\n${err}`);
      }
    });
}, Config.interval_ms);
