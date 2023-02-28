const Manager = require('../managers/head-manager');
const CronParser = require('cron-parser');
const Constants = require('../constants');

const MS_PER_SECOND = 1000;

const onSchedule = {
    name: 'onSchedule',
    props: [{ name: 'cron_string', type: Constants.TYPES.STRING }],
    output: [],
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

    //registration adds a [event].fire(pred) member for each event
    const check_schedule = setInterval(() => {
        // fire with predecate :-)
        events.onSchedule.fire((props) => {
            if (!props.cron_string) {
                return false;
            }

            const cron_expression = CronParser.parseExpression(
                props.cron_string
            );
            const next = cron_expression.next().getTime() / MS_PER_SECOND;
            const now = Math.floor(new Date().getTime() / MS_PER_SECOND) + 1; // see if upcoming second is the second the cronstring will run in
            return next === now; //this is a horredous hack i hope i can change it one day
        });
    }, MS_PER_SECOND);
};
