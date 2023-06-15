const Manager = require('../managers/head-manager');
const CronParser = require('cron-parser');
const Constants = require('../constants');

const MS_PER_SECOND = 1000;
const BOSTON_LOC = {
  lat: 42.3601,
  lon: -71.0589,
};

const onSchedule = {
  name: 'onSchedule',
  props: [{ name: 'cron_string', type: Constants.TYPES.STRING }],
  output: [
    {
      name: 'year',
      type: Constants.TYPES.NUMBER,
    },
    {
      name: 'month',
      type: Constants.TYPES.NUMBER,
    },
    {
      name: 'day',
      type: Constants.TYPES.NUMBER,
    },
    {
      name: 'hour',
      type: Constants.TYPES.NUMBER,
    },
    {
      name: 'minute',
      type: Constants.TYPES.NUMBER,
    },
    {
      name: 'second',
      type: Constants.TYPES.NUMBER,
    },
  ],
};

const events = {
  onSchedule,
};

const wait = {
  name: 'wait',
  triggers: [],
  input: [
    {
      name: 'time',
      type: Constants.TYPES.NUMBER,
      input: Constants.INPUT.RAW,
    },
  ],
  output: [],
  run: (_, payload, props) => {
    const time = props.time;
    return new Promise((res, rej) => {
      setTimeout(res, time ?? 0);
    });
  },
  direct_connections: true,
};

const getNow = {
  name: 'getNow',
  triggers: [],
  input: [],
  output: [
    {
      name: 'now',
      type: Constants.TYPES.NUMBER,
    },
  ],
  run: (_, payload, props) => {
    const time = new Date().getTime();
    payload.now = time;
  },
  direct_connections: true,
};

const getSunriseTime = () => {
  const now = new Date();
  let times = SunCalc.getTimes(now, BOSTON_LOC.lat, BOSTON_LOC.lon);
  return times.sunrise.getTime();
};

// get todays sunrise time
const getSunrise = {
  name: 'getSunrise',
  triggers: [],
  input: [],
  output: [
    {
      name: 'sunrise',
      type: Constants.TYPES.NUMBER,
    },
  ],
  run: (_, payload, props) => {
    const sunrise = getSunriseTime();
    payload.sunrise = sunrise;
  },
  direct_connections: true,
};

const getSunsetTime = () => {
  const now = new Date();
  let times = SunCalc.getTimes(now, BOSTON_LOC.lat, BOSTON_LOC.lon);
  return times.sunset.getTime();
};

const getSunset = {
  name: 'getSunset',
  triggers: [],
  input: [],
  output: [
    {
      name: 'sunset',
      type: Constants.TYPES.NUMBER,
    },
  ],
  run: (_, payload, props) => {
    const sunset = getSunsetTime();
    payload.sunset = sunset;
  },
  direct_connections: true,
};

const actions = {
  wait,
  getNow,
  getSunrise,
  getSunset,
};

const sockets = {};

const head = {
  name: 'Time',
  events,
  actions,
  sockets,
};

module.exports.initialize = () => {
  Manager.register(head);

  //registration adds a [event].fire(pred, output) member for each event
  const check_schedule = setInterval(() => {
    const now = new Date();

    const out = {
      year: now.getFullYear(),
      month: now.getMonth(),
      day: now.getDate(),
      hour: now.getHours(),
      minute: now.getMinutes(),
      second: now.getSeconds(),
    };

    events.onSchedule.fire((props) => {
      if (!props.cron_string) {
        return false;
      }

      const cron_expression = CronParser.parseExpression(props.cron_string);
      const next = cron_expression.next().getTime() / MS_PER_SECOND;
      const now_floor = Math.floor(now.getTime() / MS_PER_SECOND) + 1; // see if upcoming second is the second the cronstring will run in
      return next === now_floor; //this is a horredous hack i hope i can change it one day
    }, out);
  }, MS_PER_SECOND);
};
