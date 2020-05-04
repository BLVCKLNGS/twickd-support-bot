# Twickd Support Bot
Basic Support/Ticket tool with a reaction-based ticket creation for Discord™ based on [DiscordTickets](https://github.com/Eartharoid/DiscordTickets)

## Getting started

Create your Discord™ bot: https://discordapp.com/developers/applications/me

1. Click "**New Application**"
2. Enter a name
3. Click "**Bot**" (left sidebar)
4. Create bot
5. Copy token
6. Paste in your `config.json` file

## Installation

1. Install the dependencies:
```
yarn install
```
2. Copy the example configuration file:
```
cp example-config.json config.json
```
3. Create the log folder:
```
mkdir logs
```
Or with only one command because your time is precious:
```
yarn install && cp example-config.json config.json && mkdir logs
```
---
4. Edit the configuration file to your liking
5. Start the bot
```
yarn start
```

## Commands
- `/close` - close a ticket
- `/add` - add a user to a ticket [`adduser`]
- `/remove` - remove a user from a ticket [`kick`]
- `/ping` - check the latency

You can create even create your own command following the example on `/commands/command.js.example`

## Configuration
name | description | Default | Type
-----|-------------|---------|--------
token | Your discord bot token | | String
prefix | Commands prefix | `/` | String
name | Your bot's name | `Support` | String
guildID | The ID of your server | | String
supportRole | The ID of the role that will be pinged when a new ticket is created | | String
supportChannel | The channel ID where the bot is going to post the message to create a new ticket | | String
ticketsCat | The category ID where the new tickets are going to be created *(Make a private category)* | | String
logChannel | The channel ID where the post is going to post its logs | | String
colour | The HEX color of your bot *(Used in the embed messages)* | `#7f9cf5` | String
playing | The rich presence activity | `new tickets` | String
activityType | The rich presence activity type *(Either PLAYING, WATCHING or LISTENING)* | `LISTENING` | String
status | The status of your bot *(ONLINE, IDLE, DND or INVISIBLE)* | `ONLINE` | String
useEmbeds | Whether to embed messages or no | `true` | Boolean
logDMs | If true, any messages sent from a member to the bot will be logged in the log channel you previously defined | `true` | Boolean
cooldown | Prevents users from spamming commands - seconds to make them wait before reusing a command | `3` | Number
ticketImage | Whether to send an image when a ticket is created. You can change this image, just add `image.png` in the root directory of the project. | `false` | Boolean
tagHereOnly | Only mention staff that are online? If false, `supportRole` will be mentioned when a ticket is created | `false` | Boolean
ticketText | Text sent by the bot when a ticket is openned | `"..."` | Text
debugLevel | 0 = info/warn/error only / 1 = debug messages (a lot more information) | `0` | Boolean


### Credits
- [Eartharoid / DiscordTickets](https://github.com/Eartharoid/DiscordTickets)
- [ohlookitsderpy / leeks.js](https://github.com/ohlookitsderpy/leeks.js)
