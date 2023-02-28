const routes = {};

module.exports.register = (socket) => {
    routes[socket.id] = socket;
};

module.exports.getRoutes = () => {
    return routes;
};
