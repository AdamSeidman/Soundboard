const utils = require('../base/utils')
const voice = require('../base/voice')
const { getSoundObject } = require('../base/voice')
const { restartApp, getPerms } = require('../base/utils')

//const LEVEL_ADMIN = 2
const LEVEL_DEV = 1

const GET = '' /* Needs to not be undefined. (Clean) */

var wrap = function(args, level, fn, rets) {
    args = args.split('_')
    let pass = args.shift()
    let response = {resp: 'badDataOrPerms'}
    if (getPerms(pass) >= level) {
        response = fn(args)
    }
    if (rets !== undefined) return response
}

var sendPermLevel = async function(args) {
    args = args.split('_')
    if (args.length < 1) args = ['']
    return {permLevel: getPerms(args[0])}
}

var postTest = async function(args) {
    console.log('TEST!', args)
}

var sendSoundList = function() {
    return getSoundObject()
}

var playEffect = function(args) {
    let file = args.join('_')
    console.log(`Playing ${file} [effect]`)
    let vc = utils.getFirstVC()
    voice.enterVoiceChannel(vc)
    setTimeout(() => voice.playEffect(file, vc), 100)
}

var leaveMusic = function() {
    console.log('Attempting to leave music...')
    voice.exitVoiceChannel()
}

module.exports = {
    endpoints: [
        {path: 'perms-level', action: sendPermLevel},
        {path: 'restart-app', action: cmd => wrap(cmd, LEVEL_DEV, restartApp, false)},
        {path: 'play-effect', action: cmd => wrap(cmd, LEVEL_DEV, playEffect, false)},
        {path: 'leave-music', action: cmd => wrap(cmd, LEVEL_DEV, leaveMusic, false)},
        {path: 'sounds', action: cmd => wrap(cmd, LEVEL_DEV, sendSoundList, false, GET)},
        {path: 'test', action: postTest}
    ]
}
