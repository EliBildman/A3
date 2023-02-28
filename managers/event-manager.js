const ApiManager = require('./api-manager');

const events = {};

// (head: string, name: string) => Runner
const makeRunner = (head, name) => {
    return (predicate, payload) => {
        // console.log(ApiManager.getListeners());
        ApiManager.getListeners()
            .filter((l) => l.event.head === head && l.event.name === name)
            .forEach((l) => {
                if (predicate(l.props)) {
                    if (l.fragment) ApiManager.runFragment(l.fragment, payload);
                }
            });
    };
};

// (head: string, event: Event)
module.exports.register = (head, event) => {
    // console.log(head, event.name);
    event.fire = makeRunner(head, event.name);
    if (!(head in events)) events[head] = [];
    events[head].push(event);
};

// (descriptions?: bool) => [EventDescription] | {event_name: Event}
module.exports.getEvents = (descriptions) => {
    if (descriptions) {
        const descs = {};
        for (const head in events) {
            descs[head] = events[head].map((e) => {
                return {
                    name: e.name,
                    props: e.props,
                    output: e.output,
                };
            });
        }
        return descs;
    }
    return events;
};

// (head: string, name: string, predicate?: (EventProps) => bool)
module.exports.fireEvent = (head, name, predicate) => {
    if (!predicate) predicate = (_) => true;
    events[head][name].fire(predicate);
};
