// Require the native Node's fyle system module
const fs = require('fs');
// Require the discord.js module
const Discord = require("discord.js");
// Require the config.json module
const { prefix, token } = require("./config.json");
// Create a new Discord client
const client = new Discord.Client();
// Create a Discord collection of commands
client.commands = new Discord.Collection();

const WebSocket = require('./WS/WebSocket');

const Department = require('./WS/Department');


// Create a list of files that store all the bot commands available in separate files ("commands" folder)
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const cooldowns = new Discord.Collection();

// Connect to the WebSocket thourgh the appropiate port
var webSocket = new WebSocket('123456', 5665, client);

// An array that contains all the departments with its respective members
var department = [];

// Tries to catch data from file (sort of database)
try {
  const data = fs.readFileSync('team.json', 'utf-8');
  if (data) {
    const parsedData = JSON.parse(data);
    department = parsedData;
  }
} catch (err) {
  console.log(err);
  return;
}

// Scroll through the collection of command files above and import them
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

// When the client is ready, run this code
// this event will only trigger one time after logging in
client.once("ready", () => {
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

  // If arguments are required in that command and the user did't provide one
  if (command.args && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`;
    // if there is any command usage property in the command file
    if (command.usage) {
      // add the instruction about command usage
      reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
    }
    // send a reply message with error or related instructions
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

  if (command.add) {
    try {
      let createdDP = command.execute(message, args, department);
      if (createdDP != null) {
        department.push(createdDP);
        let data = JSON.stringify(department, null, department.length);
        fs.writeFileSync('team.json', data);
      }
      return;
    } catch (error) {
      console.error(error);
      message.reply('There was an error trying to execute that command!')
    }
  }

  // If there is any kind of error catch it and print a message in reply
  try {
    // Execute the given command
    command.execute(message, args);
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

