class Elasticsearch {
  /**
   * Parse raw data from Elasticsearch to
   * { 'monitor-name': { status: 'up or down', url: 'https://...' }, ... }
   * @param {Object} data Raw data from Elasticsearch
   */
  static parseResult(data) {
    try {
      let dataParsed = data.aggregations.by_monitors.buckets.map((bucket) => {
        let obj = {};
        let name = bucket.key;
        let status = bucket.top_hit.hits.hits[0]._source.monitor.status;
        let url = bucket.top_hit.hits.hits[0]._source.url.full;
        obj[name] = { status, url };
        return obj;
      });

      var object = dataParsed.reduce(
        (obj, item) => (
          (obj[Object.keys(item)[0]] = Object.values(item)[0]), obj
        ),
        {}
      );
      return object;
    } catch (error) {
      console.log(error);
      throw "ElasticsearchParseError";
    }
  }

  /**
   * Searches for all monitors status in a range of 'minutesAgo', limiting with
   * the most recent timestamp.
   * @param {*} minutesAgo Minutes ago in the search for monitors
   */
  static getQuery(minutesAgo) {
    return {
      _source: ["@timestamp", "monitor.status", "monitor.name", "url.full"],
      sort: [
        {
          "@timestamp": {
            order: "desc",
          },
        },
      ],
      size: 0,
      query: {
        bool: {
          should: [
            {
              term: {
                "monitor.status": {
                  value: "up",
                },
              },
            },
            {
              term: {
                "monitor.status": {
                  value: "down",
                },
              },
            },
          ],
          filter: [
            {
              range: {
                "@timestamp": {
                  from: `now-${minutesAgo}m`,
                },
              },
            },
          ],
        },
      },
      aggregations: {
        by_monitors: {
          terms: {
            field: "monitor.name",
          },
          aggs: {
            top_hit: {
              top_hits: {
                sort: [
                  {
                    "@timestamp": {
                      order: "desc",
                    },
                  },
                ],
                _source: {
                  includes: [
                    "monitor.name",
                    "monitor.status",
                    "url.full",
                    "url.domain",
                  ],
                },
                size: 1,
              },
            },
          },
        },
      },
    };
  }
}

module.exports = Elasticsearch;
