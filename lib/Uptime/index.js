class Uptime {
  constructor(slack) {
    this.state = {};
    this.slack = slack;
  }

  /**
   * If the current status is different from the previous one sends a Slack alert.
   * @param {Object} apps Applications names and current status ('up' or 'down')
   */
  setState(apps) {
    for (var key in apps) {
      if (key in this.state) {
        this.state[key] === apps[key].status ||
          this.slack
            .sendStatusMessage(key, apps[key].url, apps[key].status)
            .catch((error) => {
              console.log(error);
            });
        this.state[key] = apps[key].status;
      } else {
        this.state[key] = apps[key].status;
      }
    }
  }
}

module.exports = Uptime;
