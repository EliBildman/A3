const log = require('../logging/loggers/manager-logger')('StatsManager');

const LOG_INTERVAL = 1000 * 60 * 5; // 5 minutes

const log_callbacks = [];

// register a callback to be called every time a log event happens
const onLog = (callback) => {
  log_callbacks.push(callback);
};

// run through regsitered callbacks,
// each gets the stats object to mutate
const logStats = () => {
  const stats = {};
  log_callbacks.forEach((callback) => {
    callback(stats);
  });

  log.verbose('Report Stats', { stats });
};

setInterval(logStats, LOG_INTERVAL);

module.exports = {
  onLog,
};
