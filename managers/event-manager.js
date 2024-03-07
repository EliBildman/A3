const ApiManager = require('./api-manager');
const log = require('../logging/loggers/manager-logger')('EventManager');

const events = {};

// (head: string, name: string) => Runner
const makeEventRunner = (head, name) => {
  return (predicate, payload) => {
    ApiManager.getListeners()
      .filter((l) => l.event.head === head && l.event.name === name)
      .forEach((l) => {
        if (predicate(l.props)) {
          log.verbose('Fire Event', { head, name, props: l.props });
          if (l.fragment) ApiManager.runFragment(l.fragment, payload);
        }
      });
  };
};

// (head: string, event: Event)
module.exports.register = (head, event) => {
  event.fire = makeEventRunner(head, event.name);
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
