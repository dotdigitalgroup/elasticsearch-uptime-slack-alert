const Request = require("../Request");
const URL = require("url");

class Slack {
  constructor(webhookUrl, channel) {
    const url = URL.parse(webhookUrl);
    const hostname = url.hostname;
    this.slackRequest = new Request({ url: hostname });
    this.path = url.pathname;
    this.channel = channel;
  }

  /**
   * Send a custom message using Slack Incoming Webhooks
   * @param {String} appName Application name
   * @param {String} appUrl Application appurl
   * @param {String} status Application status ('up' or 'down')
   */
  sendStatusMessage(appName, appUrl, status) {
    let payload = {
      channel: this.channel,
      text: "",
      attachments: [
        {
          text: `*${appName}* is *${status.toUpperCase()}*\nUrl: ${appUrl}`,
          color: status === "down" ? "#CC3643" : "#48A868",
          attachment_type: "default",
        },
      ],
    };

    return this.slackRequest
      .post({
        path: this.path,
        body: payload,
      })
      .then((data) => {
        return true;
      })
      .catch((err) => {
        return err;
      });
  }

  /**
   * Send a simple message using Slack Incoming Webhooks
   * @param {String} message Message to Slack
   */
  sendMessage(message) {
    let payload = {
      channel: this.channel,
      text: message,
    };

    return this.slackRequest
      .post({
        path: this.path,
        body: payload,
      })
      .then(() => {
        return true;
      })
      .catch((err) => {
        return err;
      });
  }
}

module.exports = Slack;
