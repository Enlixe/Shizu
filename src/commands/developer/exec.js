const {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    PermissionFlagsBits,
    Client,
    EmbedBuilder,
  } = require("discord.js");
const {exec} = require('child_process')

  module.exports = {
    folder: "developer",
    developer: true,
    data: new SlashCommandBuilder()
      .setName("exec")
      .setDescription("Executes commands in the console.")
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
      .setDMPermission(true)
      .addStringOption((option) =>
        option.setName("input").setDescription("Execute inputs.")
        ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} bot
     */
    execute(interaction, bot) {
        let input = interaction.options.getString("input");
        exec(input, (error, stdout) => {
            const resp = stdout || error;
            return interaction.reply({content: `\`\`\`${resp}\`\`\``});
        })
    },
  };
  