const MAX_RAND = 98

const headers = { // For requests
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With',
    'sec-fetch-mode': 'no-cors'
}

var restartApp = function (cmd, response) {
    if (response !== undefined) {
        response.writeHead(200, headers)
        response.end()
    }
    process.exit()
}

var randomNumber = function (max) {
    if (max === undefined) {
        max = MAX_RAND
    }
    return Math.ceil(Math.random() * max)
}

var copyObject = function (obj) {
    return JSON.parse(JSON.stringify(obj))
}

var matchesId = function (item) {
    if ((item || '').match(/^<@\d{18}>$/)) {
        return item.match(/\d{18}/)[0]
    }
    return null
}

// Fixes path characters in HTTP requests
var fixPathCharacters = function (str) {
    let returnStr = ''
    while (str.length > 0) {
        if (str[0] === '%') {
            returnStr += String.fromCharCode(parseInt(str.slice(1, 3), 16))
            str = str.slice(3)
        } else {
            returnStr += str[0]
            str = str.slice(1)
        }
    }
    return returnStr
}

var gracefullyLeave = function (guild) {
    try {
        let channelId
        let channels = guild.channels.cache

        channelLoop:
        for (let key in channels) {
            let c = channels[key]
            if (c[1].type === 'text') {
                channelId = c[0]
                break channelLoop
            }
        }

        let channel = guild.channels.cache.get(guild.systemChannelId || channelId)

        channel.send('Thank you for adding me to this server.\nHowever this bot is currently private.\nPlease reach out to EMAIL if you would like to implement it.')
        guild.leave()
    } catch (err) {
        console.error('Error in gracefullyLeave()')
        console.error(err)
    }
}

var getPerms = function (str) {
    let hash = 0, i, chr
    if (str.length === 0) return 0
    for (i = 0; i < str.length; i++) {
        chr = str.charCodeAt(i)
        hash = ((hash << 5) - hash) + chr
        hash |= 0
    }
    if (hash === 1117241682) return 1   // Developer
    if (hash === 502860434) return 2   // Admin
    return 0
}

module.exports = {
    HTTPheaders: headers,
    restartApp,
    randomNumber,
    copyObject,
    matchesId,
    fixPathCharacters,
    gracefullyLeave,
    getPerms
}