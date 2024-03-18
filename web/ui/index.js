// eslint does not like non-npm .js files
/* eslint-disable */

const ADMIN = 2
const DEVELOPER = 1
const HACKER = 0

var pass = 'X'
var level = 0
var rememberChecked = true

var getCookieItem = function (key) {
    let value = `${document.cookie} `
    let parts = value.split('; ')

    if (parts.map(x => x.slice(0, x.indexOf('='))).includes(key)) {
        value = parts.find(x => x.indexOf(`${key}=`) === 0)
        return decodeURIComponent(value.split('=')[1]).trim()
    }
}

var setCookieItem = function (key, value) {
    document.cookie = `${key}=${encodeURIComponent(value)}; path=/; expires=${new Date(2147483647 * 1000).toUTCString()};`
}

var deleteCookieItem = function (key) {
    document.cookie = `${key}=X; path=/; max-age=0;`
}
