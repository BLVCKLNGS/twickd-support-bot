const Discord = require('discord.js');
const config = require('../config.json');

/**
 * Open a new ticket
 * 
 * @param {Message} message 
 * @param {User} user 
 */
const openTicket = async function (message, user) {
    let id = user.id.toString().substr(0, 4) + user.discriminator;
    let chan = `ticket-${user.username}-${id}`.toLowerCase();

    if (message.guild.channels.find(channel => channel.name === chan)) {
        if (config.useEmbeds) {
            const err1 = new Discord.RichEmbed()
                .setColor("#E74C3C")
                .setDescription(`:x: You already have an open ticket.`)
            return message.channel.send(err1).then((message) => {
                setTimeout(() => {
                    message.delete();
                }, 5000);
            });
        } else {
            return message.channel.send(`:x: You already have an open ticket.`)
        }

    };

    message.guild.createChannel(chan, {
        type: 'text'
    }).then(async c => {
        c.setParent(config.ticketsCat);
        // let supportRole = message.guild.roles.find(`id`, config.supportRole)
        let supportRole = message.guild.roles.get(config.supportRole)
        if (!supportRole) return message.channel.send(":x: No **Support Team** role found.");


        c.overwritePermissions(message.guild.defaultRole, {
            VIEW_CHANNEL: false,
            SEND_MESSAGES: false
        })
        c.overwritePermissions(message.member, {
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true
        })
        c.overwritePermissions(supportRole, {
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true
        })
        c.setTopic(`${user.username} support ticket`);
        if (config.tagHereOnly) {
            await c.send(`@here, a user has created a new ticket.\n`);
        } else {
            await c.send(`<@&${config.supportRole}>, a user has created a new ticket.\n`);
        };

        if (config.ticketImage) {
            await c.send(`__**Here's your ticket channel, ${user.username}**__`, {
                files: [`./image.png`]
            })
        } else {
            await c.send(`__**Here's your ticket channel, ${user.username}**__`)
        }

        const welcome = new Discord.RichEmbed()
            .setColor(config.colour)
            .setDescription(`**Ticket:**\n\n${config.ticketText}`)


        if (config.useEmbeds) {
            // message.channel.send(created)
            let w = await c.send(welcome)
            await w.pin();
            // c.fetchMessage(c.lastMessageID).delete()
        } else {
            // message.channel.send(`Your ticket (${c}) has been created.\nPlease read the information sent and follow any instructions given.`)
            let w = await c.send(`**Ticket:**\n\n${config.ticketText}`)
            await w.pin()
            // c.fetchMessage(c.lastMessageID).delete()

        }
    })
}

/**
 * Close a ticket
 * 
 * @param {Message} message 
 */
const closeTicket = function (message) {
    if(!message.channel.name.startsWith('ticket-')) {
        if(config.useEmbeds) {
            const notTicket = new Discord.RichEmbed()
                .setColor("#E74C3C")
                .setDescription(`:x: **This command can only be used within a ticket channel**`)
            return message.channel.send(notTicket);
        } else {
            return message.channel.send(`:x: **This command can only be used within a ticket channel**`)
        }
    } 
    else {
        try {
            message.channel.delete()
        } catch(error) {
            log.error(log.colour.red(error));
        }
    }
}

module.exports = {
    openTicket,
    closeTicket
}