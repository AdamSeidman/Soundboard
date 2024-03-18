/**
 * Functions for playing sounds.
 */

const fs = require('fs')
const config = require('../client/config.json')
const { createAudioResource, createAudioPlayer, NoSubscriberBehavior,
    joinVoiceChannel, AudioPlayerStatus } = require('@discordjs/voice')

const soundDir = './assets/sounds'
var voiceChannel = undefined

var effectList = []

fs.readdir(`${soundDir}`, (err, files) => {
    files.forEach(file => {
        if (file.toLowerCase().endsWith(config.constants.soundEffectType)) {
            let name = file.trim().substring(0, file.length - config.constants.soundEffectType)
            effectList.push({
                name: name.split('_').map(x => x.slice(0, 1).toUpperCase().concat(x.slice(1))).join(' '),
                value: `${name}${config.constants.soundEffectType}`
            })
        }
    })
})

var enterVoiceChannel = function (channel) {
    if (channel === undefined || channel === null) return false
    if (voiceChannel !== undefined) {
        if (channel.id === voiceChannel.channel.id) {
            console.log('Tried to re-enter a voice channel.')
            return false
        }
        console.log('enterVoiceChannel() called while already in voice.')
        console.log('voiceChannel info will be deleted.\n\r')
    }

    console.log(`Entering voice channel ID #${channel.id} with Soundboard bot`)
    const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        group: channel.client.user.id,
        adapterCreator: channel.guild.voiceAdapterCreator
    })

    voiceChannel = { connection: connection, channel: channel, paused: false }
    return true
}

var exitVoiceChannel = function () {
    if (voiceChannel === undefined) return false

    if (voiceChannel.player !== undefined) {
        voiceChannel.player.stop()
    }

    voiceChannel.connection.destroy()
    voiceChannel = undefined
    return true
}

var playEffect = function (sound, channel) {
    if (sound === undefined || channel === undefined) return false

    if (voiceChannel === undefined) {
        enterVoiceChannel(channel)
    }

    voiceChannel.player = createAudioPlayer({
        behaviors: {
            noSubscriber: NoSubscriberBehavior.Pause
        }
    })
    voiceChannel.paused = false

    voiceChannel.player.play(createAudioResource(fs.createReadStream(`${soundDir}/${sound}`)))
    voiceChannel.connection.subscribe(voiceChannel.player)

    voiceChannel.player.on(AudioPlayerStatus.IDLE, () => {
        if (!voiceChannel.paused) {
            delete voiceChannel.player
        }
    })

    voiceChannel.player.on('error', console.error)
}

var getSoundObject = function() {
    return JSON.parse(JSON.stringify({effects: effectList}))
}

module.exports = {
    enterVoiceChannel,
    exitVoiceChannel,
    playEffect,
    getSoundObject
}
