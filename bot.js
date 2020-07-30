const fs = require('fs');
const Discord = require("discord.js");
const { prefix, token } = require("./config.json");
const RWHelper = require('./ReadWriteHelper');

const client = new Discord.Client();
client.commands = new Discord.Collection();
const WebSocket = require('./WS/WebSocket');
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const cooldowns = new Discord.Collection();

var webSocket = new WebSocket('123456', 5665, client);

var department = [];

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

// When the client is ready, run this code
// this event will only trigger one time after logging in
client.once("ready", () => {
  department = RWHelper.FillDepartmentData(department);
  console.log("Ready!");
});

// When someone writes a message on chat
client.on("message", (message) => {
  // If the written message doesn't start with the bot prefix or
  // the was written by the bot itself, just return doing nothing
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  // Isolate the arguments of the writtenc command
  const args = message.content.slice(prefix.length).split(/ +/);
  // Isolate the name of the command (the one after the bot prefix)
  const commandName = args.shift().toLowerCase();

  // Get the command associated with the command name or the aliasis set in the command file
  const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

  if (!command) return;

  // If there is any guildOnly property in the command file
  // and the channel type is Direct Message
  if (command.guildOnly && message.channel.type !== 'text') {
    return message.reply('I can\'t execute that command on DMs!');
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


  // If the collection of cooldowns ha no such command
  if (!cooldowns.has(command.name)) {
    // Add it in
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


  // If there is any kind of error catch it and print a message in reply
  try {
    department = RWHelper.FillDepartmentData(department);
    // Execute the given command
    command.execute(message, args, department);
    //console.log('After command --> ' + department);
  } catch (error) {
    console.error(error);
    message.reply('There was an error trying to execute that command!');
  }

  // Check and track websocket and network errors
  client.on('shardError', error => {
    console.error('A websocket connection encountered an error: ', error);
  });

  // Diagnose API errors to show more information about them
  process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection: ', error);
  });

});

// Log in to Discord with your app's token
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




