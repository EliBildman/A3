const Manager = require('../managers/head-manager');
const CronParser = require('cron-parser');
const Constants = require('../constants');

const MS_PER_SECOND = 1000;

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

const actions = {};
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

            const cron_expression = CronParser.parseExpression(
                props.cron_string
            );
            const next = cron_expression.next().getTime() / MS_PER_SECOND;
            const now_floor = Math.floor(now.getTime() / MS_PER_SECOND) + 1; // see if upcoming second is the second the cronstring will run in
            return next === now_floor; //this is a horredous hack i hope i can change it one day
        }, out);
    }, MS_PER_SECOND);
};
