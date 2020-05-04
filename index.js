/**
###############################################################################################

  > For support, visit https://github.com/eartharoid/DiscordTickets/#readme
  > Author's website: https://eartharoid.ml

  @name DiscordTickets
  @author Eartharoid <eartharoid@gmail.com>
  @license GNU-GPLv3

###############################################################################################
*/

const fs = require('fs');
const Discord = require('discord.js');
const leeks = require('leeks.js');
const log = require(`leekslazylogger`);
const config = require('./config.json');
const { version, homepage } = require('./package.json');
const { openTicket, closeTicket } = require('./controllers/ticket.js')
const client = new Discord.Client();
client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();
const now = Date.now();

let trigger = null;

const commands = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
log.init('DiscordTickets (bot created by Eartharoid)')
log.info(`Starting up...`)


/**
 * After the bot logged in
 */
client.once('ready', () => {

  log.info(`Initialising bot...`)
  for (const file of commands) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
    log.console(`> Loading '${config.prefix}${command.name}' command`);
  }
  log.success(`Connected to Discord API`)
  log.success(`Logged in as ${client.user.tag}`)
  client.user.setPresence({game: {name: config.playing, type: config.activityType},status: config.status})
    .catch(log.error);

  if (config.useEmbeds) {
    const embed = new Discord.RichEmbed()
      .setAuthor(`${client.user.username} / Ticket Log`, client.user.avatarURL)
      .setColor("#2ECC71")
      .setDescription(":white_check_mark: **Started succesfully**")
      .setFooter(`${config.name} | Support`);
    client.channels.get(config.logChannel).send(embed)
  } else {
    client.channels.get(config.logChannel).send(":white_check_mark: **Started succesfully**")
  }
  if (client.guilds.get(config.guildID).member(client.user).hasPermission("ADMINISTRATOR", false)) {
    log.info(`Checking permissions...`);
    setTimeout(function() {
      log.success(`Required permissions have been granted\n\n`)
    }, 1250);

    if (config.useEmbeds) {
      const embed = new Discord.RichEmbed()
        .setAuthor(`${client.user.username} / Ticket Log`, client.user.avatarURL)
        .setColor("#2ECC71")
        .setDescription(":white_check_mark: **Required permissions have been granted**")
        .setFooter(`${config.name} | Support`);
      client.channels.get(config.logChannel).send(embed)
    } else {
      client.channels.get(config.logChannel).send(":white_check_mark: **Started succesfully**")
    }
  } else {
    log.error(`Required permissions have not been granted`)
    log.error(`Please give the bot the 'ADMINISTRATOR' permission\n\n`)
    if (config.useEmbeds) {
      const embed = new Discord.RichEmbed()
        .setAuthor(`${client.user.username} / Ticket Log`, client.user.avatarURL)
        .setColor("#E74C3C")
        .setDescription(":x: **Required permissions have not been granted**\nPlease give the bot the `ADMINISTRATOR` permission")
        .setFooter(`${config.name} | Support`);
      client.channels.get(config.logChannel).send({
        embed
      })
    } else {
      client.channels.get(config.logChannel).send(":white_check_mark: **Started succesfully**")
    }
  }

  /**
   * Send trigger message on #Support channel
   */
  if (config.useEmbeds) {
    const embed = new Discord.RichEmbed()
      .setAuthor(`${client.user.username}`, client.user.avatarURL)
      .setColor(config.colour)
      .setDescription(`React with ${config.reactionEmoji} to create a support ticket`)
      .setFooter(`${config.name} | Support`);

    const supportChannel = client.channels.get(config.supportChannel);

    supportChannel.bulkDelete(10);

    supportChannel.send(embed)
      .then((message) => {
        message.react(config.reactionEmoji)
        .catch((err) => console.error("Failed to react"))

        trigger = message.id;
      })
      .catch((err) => console.error(`Message was not send: ${err}`))
  } 
  else {
    supportChannel.send(`React with ${config.reactionEmoji} to create a support ticket`)
      .then((message) => {
      })
      .catch((err) => console.error(`Message was not send: ${err}`));
  }

});


/**
 * Listening for reaction
 */
client.on('messageReactionAdd', async (reaction, user) => {
  if (trigger != null) {
    if (reaction.message.id === trigger && user.id !== client.user.id && reaction.emoji.name === config.reactionEmoji) {
      openTicket(reaction.message, user);
    }
  }
})



/**
 * Message Analyse
 */
client.on('message', async message => {
  if (message.author.bot) return;
  if (message.channel.type === "dm") {
    if (message.author.id === client.user.id) return;
    if (config.logDMs) {
      if (config.useEmbeds) {
        const embed = new Discord.RichEmbed()
          .setAuthor(`${client.user.username} / Ticket Log`, client.user.avatarURL)
          .setTitle("DM Logger")
          .addField("Username", message.author.tag, true)
          .addField("Message", message.content, true)
          .setFooter(`${config.name} | Support`);
        client.channels.get(config.logChannel).send(embed)
      } else {
        client.channels.get(config.logChannel).send(`DM received from **${message.author.tag} (${message.author.id})** : \n\n\`\`\`${message.content}\`\`\``);
      }
    } else {
      return
    };

  }
  if (message.channel.bot) return;

  const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|\\${config.prefix})\\s*`);
  if (!prefixRegex.test(message.content)) return;
  const [, matchedPrefix] = message.content.match(prefixRegex);
  const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

  if (command.guildOnly && message.channel.type !== 'text') {
	   return message.channel.send(`Sorry, this command can only be used on the server.`)
  }

  if (command.args && !args.length) {
    if (config.useEmbeds) {
        const embed = new Discord.RichEmbed()
          .setColor("#E74C3C")
          .setDescription(`\n**Usage:** \`${config.prefix}${command.name} ${command.usage}\`\nType \`${config.prefix}help ${command.name}\` for more information`)
        return message.channel.send({embed})

    } else {
      return message.channel.send(`**Usage:** \`${config.prefix}${command.name} ${command.usage}\`\nType \`${config.prefix}help ${command.name}\` for more information`)
    }
  };


  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }

  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 3) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      if (config.useEmbeds) {
        const embed = new Discord.RichEmbed()
          .setColor("#E74C3C")
          .setDescription(`:x: **Please do not spam commands** (wait ${timeLeft.toFixed(1)}s)`)
        return message.channel.send({embed})
      } else {
        return message.reply(`please do not spam commands (wait ${timeLeft.toFixed(1)}s)`);
      }

    }
  }
  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);


  try {
    command.execute(message, args);
    log.console(`${message.author.tag} used the '${command.name}' command`)
  } catch (error) {
    log.error(error);
    message.channel.send(`:x: **Oof!** An error occured whilst executing that command.\nThe issue has been reported.`);
    log.error(`An unknown error occured whilst executing the '${command.name}' command`);
  }

});

/**
 * Error catching
 */
client.on('error', error => {
  log.warn(`Potential error detected\n(likely Discord API connection issue)\n`);
  log.error(`Client error:\n${error}`);
});
client.on('warn', (e) => log.warn(`${e}`));

if(config.debugLevel == 1){ client.on('debug', (e) => log.debug(`${e}`)) };

process.on('unhandledRejection', error => {
  log.warn(`An error was not caught`);
  log.error(`Uncaught error: \n${error.stack}`);
});
process.on('beforeExit', (code) => {
  log.basic(log.colour.yellowBright(`Disconected from Discord API`));
  log.basic(`Exiting (${code})`);
});

/**
 * Bot login
 */
client.login(config.token);
