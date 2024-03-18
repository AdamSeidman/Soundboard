const { endpoints } = require('../web/endpoints')
const { createServer } = require('../web/server')

const WEB_PORT = 8080

// Can create more maps if there are more UIs
var serverMaps = [
    {
        fileLocation: `${__dirname}\\..\\web\\ui\\`,
        endpoints: endpoints,
        port: WEB_PORT
    }
]

// Run everything using provided libraries in ./web
var setup = function () {
    serverMaps.forEach(map => {
        map.server = createServer(map.fileLocation, map.endpoints, map.port)
    })
}

module.exports = {
    setupWebServers: setup
}
