const fs = require('fs');
const Discord = require("discord.js");
const { prefix, token } = require("./config.json");
const RWHelper = require('./ReadWriteHelper');
const WebSocket = require('./WS/WebSocket');

const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const cooldowns = new Discord.Collection();


for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

var webSocket = new WebSocket('123456', 5665, client);

client.once("ready", () => {
  console.log("Ready!");
});

client.on("message", (message) => {

  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

  if (!command) return;

  if (command.guildOnly && message.channel.type !== 'text') {
    return message.reply('Non posso eseguire questo comando in una chat privata, utilizza il canale apposito all\'interno del server');
  }

  let reply = ' ';
  if (NoArguments(args, command)) {
    reply = `You didn't provide any arguments, ${message.author}!`;
    reply = AddUsageIfAvailable(command, reply);
    return message.channel.send(reply);
  }

  if (NotEnoughArguments(args, command)) {
    reply = `Not enough arguments provided, ${message.author}!`;
    reply = AddUsageIfAvailable(command, reply);
    return message.channel.send(reply);
  }

  if (NoMultipleInput(args, command)) {
    reply = `Multiple input not supported for this command, ${message.author}!`;
    reply = AddUsageIfAvailable(command, reply);
    return message.channel.send(reply);
  }

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }

  //#region COOLDOWN SETUP

  // The current timestamp
  const now = Date.now();
  // A variable that store the collection for the triggered command
  const timestamps = cooldowns.get(command.name);
  // A viariable to store the necesseray cooldwn amount, if no cooldown is available
  // in JS file the deafault will be 3. The value is then converted in milliseconds
  const cooldownAmount = (command.cooldown || 3) * 1000;
  // If the timestamp collection has the author ID in it
  if (timestamps.has(message.author.id)) {
    // Get the author id and sum it up with the cooldown amount in order to get the correct expiration time
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    // If the expiration time is not passed 
    if (now < expirationTime) {
      // calculate the expiration time
      const timeLeft = (expirationTime - now) / 1000;
      // return a message with the time left
      return message.reply(`please wait ${timeLeft.toFixed(1)} more seconds(s) before reusing the \`${command.name}\` command`);
    }
  }
  // If the timestamp has no author id or if the author id did't get deleted as planned
  // set the author id with the current timestamp
  timestamps.set(message.author.id, now);
  // delete the author id after the cooldown period as passed
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  //#endregion

  try {
    command.execute(message, args, webSocket);
  } catch (error) {
    console.error(error);
    message.reply('There was an error trying to execute that command!');
  }

  client.on('shardError', error => {
    console.error('A websocket connection encountered an error: ', error);
  });

  process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection: ', error);
  });


});

client.login(token);


// ======================================================== FUNCTIONS ================================================================

function AddUsageIfAvailable(command, reply) {
  if (command.usage) {
    reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
  }
  return reply;
}


function NoMultipleInput(args, command) {
  return command.args && args.length > command.minArgs && command.multipleInput === false;
}

function NotEnoughArguments(args, command) {
  return command.args && args.length < command.minArgs;
}

function NoArguments(args, command) {
  return command.args && !args.length;
}

