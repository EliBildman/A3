const actions = {};

module.exports.register = (head, action) => {
  if (!(head in actions)) {
    actions[head] = [];
  }
  actions[head].push(action);
};

// (head: string, name: string) => Action
module.exports.getAction = (head, name) => {
  return actions[head].find((a) => a.name == name);
};

module.exports.getActions = (descriptions) => {
  if (descriptions) {
    const descs = {};
    for (const head in actions) {
      descs[head] = actions[head].map((a) => {
        return {
          name: a.name,
          triggers: a.triggers,
          input: a.input,
          output: a.output,
          direct_connections: a.direct_connections,
        };
      });
    }
    return descs;
  }
  return actions;
};
