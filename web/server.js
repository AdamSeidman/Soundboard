const connect = require('connect')
const serveStatic = require('serve-static')
const utils = require('../base/utils')
const fixCh = utils.fixPathCharacters

// Set up server using serve-static and listen on port
var createServer = function (fileLocation, endpoints, port) {
    var server = connect()
    server.use(serveStatic(fileLocation))
    endpoints.forEach(item => {
        server.use(`/${item.path}`, async (req, res) => {
            await handleHttpRequest(item, req, res)
        })
    })
    server.listen(port)
    console.log(`Server Initialized on Port ${port}.`)
    return server
}

// On HTTP request, connect request to function
var handleHttpRequest = async function (item, request, response) {
    let data = undefined
    if (request.headers['access-control-request-method'] === undefined) {
        console.log(`\nHTTP REQUEST: '${item.path}'`)
        data = await item.action(fixCh(request.url.slice(1)), response)
        if (data === undefined) {
            await response.writeHead(200, utils.headers)
        } else {
            data = Promise.resolve(data)
            await data.then(value => {
                if (value === undefined) {
                    response.writeHead(200, utils.headers)
                } else {
                    response.write(JSON.stringify(value))
                }
            })
        }
    } else {
        console.log(`Preflight Request: ${request.headers['access-control-request-method']} ${request.url}`)
    }
    await response.end()
    return data
}

module.exports = {
    createServer
}
