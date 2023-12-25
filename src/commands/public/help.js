const { channel } = require("diagnostics_channel");
const {
  CommandInteraction,
  ActionRowBuilder,
  EmbedBuilder,
  StringSelectMenuBuilder,
  Client,
  ComponentType,
} = require("discord.js");
const fs = require("fs");

module.exports = {
  folder: "information",
  name: "help",
  description: "Get a list of all the commands from a certain category.",
  dm_permission: false,
  /**
   * @param {CommandInteraction} interaction
   * @param {Client} bot
   */
  async execute(interaction, bot) {
    const { channel } = interaction;
    const emojis = {
      information: "📝",
      moderation: "🛠️",
      developer: "🌸",
      special: "🎄",
    };

    function getCmd(name) {
      const getCmdID = bot.application.commands.cache
        .filter((cmd) => cmd.name === name)
        .map((cmd) => cmd.id);

      return getCmdID;
    }

    // const dirs = fs.readdirSync("./src/commands");
    // var path = require('path');
    // add to each file the folder
    const dirs = [...new Set(bot.commands.map((cmd) => cmd.folder))];

    const formatString = (str) =>
      `${str && str[0].toUpperCase()}${str && str.slice(1).toLowerCase()}`;

    const categories = dirs.map((dir) => {
      const getCmds = bot.commands
        .filter((cmd) => cmd.folder === dir)
        .map((cmd) => {
          return {
            name: cmd.data ? cmd.data.name : cmd.name,
            description:
              (cmd.data ? cmd.data.description : cmd.description) ||
              "There is no description for this command.",
          };
        });

      return {
        directory: dir ? formatString(dir) : "Not set",
        commands: getCmds,
      };
    });

    const Embed = new EmbedBuilder()
      .setDescription(
        "See lists of commands by selecting a category down below!"
      )
      .setColor(bot.config.color.default)
      .setAuthor({
        name: `${bot.user.username}'s Commands`,
        iconURL: bot.user.avatarURL(),
      });

    const components = (state) => [
      new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId("help")
          .setPlaceholder("Find category")
          .setDisabled(state)
          .addOptions(
            categories.map((cmd) => {
              return {
                label: cmd.directory,
                value: cmd.directory.toLowerCase(),
                description: `Commands from ${cmd.directory} category.`,
                emoji: emojis[cmd.directory.toLowerCase() || null],
              };
            })
          )
      ),
    ];

    const initEmbed = await interaction.reply({
      embeds: [Embed],
      components: components(false),
    });

    const filter = (interaction) =>
      interaction.user.id === interaction.member.id;

    const collector = channel.createMessageComponentCollector({
      filter,
      componentType: ComponentType.StringSelect,
      time: 60000,
    });

    collector.on("collect", (interaction) => {
      const [directory] = interaction.values;
      const category = categories.find(
        (x) => x.directory.toLowerCase() === directory
      );

      const categoryEmbed = new EmbedBuilder()
        .setTitle(
          `${emojis[directory.toLowerCase() || null]} ${formatString(
            directory
          )} commands`
        )
        .setDescription(
          `A list of all the commands categorized under ${directory}.`
        )
        .setColor(bot.config.color.default)
        .addFields(
          category.commands.map((cmd) => {
            return {
              name: `</${cmd.name}:${getCmd(cmd.name)}>`,
              value: `\`${cmd.description}\``,
              inline: true,
            };
          })
        );
      interaction.update({ embeds: [categoryEmbed] });
    });

    collector.on("end", () => {
      initEmbed.edit({ components: components(true) });
    });
  },
};
