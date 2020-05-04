const Discord = require('discord.js');
const config = require('../config.json');
const log = require(`leekslazylogger`);
module.exports = {
  name: 'close',
  description: 'Close a ticket',
  usage: '',
  aliases: ['none'],
  example: '',
  args: false,
  cooldown: config.cooldown,
  guildOnly: true,
  execute(message, args) {
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
  },
};
