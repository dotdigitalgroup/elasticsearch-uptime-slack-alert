const https = require("https");
class Request {
  constructor({ url, auth }) {
    Object.assign(this, { url, auth });
  }

  post(params) {
    const { path, body } = params;
    return new Promise((resolve, reject) => {
      const data = JSON.stringify(body);
      let result = "";
      const options = {
        hostname: this.url,
        port: 443,
        path: path,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": data.length,
        },
      };

      if (this.auth) {
        options.headers["Authorization"] = this.auth;
      }
      const req = https.request(options, (res) => {
        res.on("data", (d) => {
          result += d;
        });

        res.on("end", () => {
          if (res.statusCode === 200) {
            try {
              resolve(JSON.parse(result));
            } catch (error) {
              resolve(result);
            }
          } else {
            reject(`Request responded with status code ${res.statusCode}`);
          }
        });
      });

      req.on("error", (error) => {
        reject(error.message);
      });

      req.write(data);
      req.end();
    });
  }
}

module.exports = Request;
