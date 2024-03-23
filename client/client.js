/**
 * Main entry point for Soundboard bot.
 */

const Discord = require('discord.js')
const utils = require('../base/utils')
const config = require('./config.json')
const { setupWebServers } = require('../base/web')


const client = new Discord.Client({ intents: config.intents, partials: config.partials })
client.login(config.token)

let checkOnLeaving = guild => {
    if (guild.id !== config.guildId) {
        utils.gracefullyLeave(guild)
    }
}

client.on('ready', () => {
    setupWebServers()
    utils.getChannelById = id => client.channels.cache.filter(x => x instanceof Discord.TextChannel).find(x => x.id === id)
    utils.getUserById = async id => await client.users.fetch(id)
    console.log('Soundboard Bot Initialized')
    client.guilds.cache.forEach(checkOnLeaving)

    utils.getVoiceChannel = (id) => client.channels.cache.find(x => x instanceof Discord.VoiceChannel && `${x.id}` == `${id}`)
})

client.on('guildCreate', checkOnLeaving)
client.on('error', console.error)
