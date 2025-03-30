import {
  ActionRowBuilder,
  ChatInputCommandInteraction,
  ComponentType,
  EmbedBuilder,
  Interaction,
  PermissionsBitField,
  StringSelectMenuBuilder,
} from "discord.js";
import Command from "../../base/classes/Command";
import ShizuClient from "../../base/classes/ShizuClient";
import Category from "../../base/enums/Category";
import { DEFAULT_COOLDOWN, DEFAULT_TIMEOUT } from "../../base/constants";

const EMOJIS: Record<string, string> = {
  utilities: "📝",
  administrator: "🛠️",
  // developer category is intentionally left out
};

export default class Help extends Command {
  private commandCache: Map<string, string> = new Map();

  constructor(client: ShizuClient) {
    super(client, {
      name: "help",
      description: "Get a list of all the commands from a certain category.",
      category: Category.Utilities,
      default_member_permission:
        PermissionsBitField.Flags.UseApplicationCommands,
      dm_permission: true,
      cooldown: DEFAULT_COOLDOWN * 5,
      options: [],
    });
  }

  async Execute(interaction: ChatInputCommandInteraction) {
    const { channel } = interaction;

    // Fetch commands once and cache them
    if (this.commandCache.size === 0) {
      try {
        const commands = await this.client.application?.commands.fetch();
        commands?.forEach((cmd) => {
          this.commandCache.set(cmd.name, cmd.id);
        });
      } catch (error) {
        console.error("Failed to fetch commands:", error);
        return interaction.reply({
          embeds: [
            this.client.config.createEmbed(
              "error",
              "Failed to fetch commands."
            ),
          ],
          ephemeral: true,
        });
      }
    }

    const categories = this.getCategories();

    const embed = this.client.config
      .createEmbed("default")
      .setDescription(
        "See lists of commands by selecting a category down below!"
      )
      .setAuthor({
        name: `${this.client.user?.username}'s Commands`,
        iconURL: `${this.client.user?.avatarURL()}`,
      });

    const component = this.createSelectMenu(categories, false);

    const initEmbed = await interaction.reply({
      embeds: [embed],
      components: component.map((row) => row.toJSON()),
    });

    const filter = (interaction: Interaction) =>
      interaction.user.id === interaction.user.id;

    const collector = channel?.createMessageComponentCollector({
      filter,
      componentType: ComponentType.StringSelect,
      time: DEFAULT_TIMEOUT,
    });

    collector?.on("collect", async (interaction) => {
      const [directory] = interaction.values;
      const category = categories.find(
        (x) => x.directory.toLowerCase() === directory
      );

      const commandFields = this.createCommandFields(category?.commands || []);

      const categoryEmbed = this.client.config
        .createEmbed("default")
        .setTitle(
          `${EMOJIS[directory.toLowerCase()]} ${this.formatString(directory)} commands`
        )
        .setDescription(
          `A list of all the commands categorized under ${directory}.`
        )
        .addFields(commandFields);

      await interaction.update({ embeds: [categoryEmbed] });
    });

    collector?.on("end", () => {
      initEmbed.edit({ components: this.createSelectMenu(categories, true) });
    });
  }

  private getCategories() {
    const dirs = [...new Set(this.client.commands.map((cmd) => cmd.category))];
    return dirs
      .filter((dir) => dir !== Category.Developer) // Exclude the developer category
      .map((dir) => {
        const getCmds = this.client.commands
          .filter((cmd) => cmd.category === dir)
          .map((cmd) => ({
            name: cmd.name,
            description:
              cmd.description || "There is no description for this command.",
          }));
        return {
          directory: dir ? this.formatString(dir) : "Not set",
          commands: getCmds,
        };
      });
  }

  private createSelectMenu(categories: any[], state: boolean) {
    return [
      new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId("help")
          .setPlaceholder("Find category")
          .setDisabled(state)
          .addOptions(
            categories.map((cmd) => ({
              label: cmd.directory,
              value: cmd.directory.toLowerCase(),
              description: `Commands from ${cmd.directory} category.`,
              emoji: EMOJIS[cmd.directory.toLowerCase()],
            }))
          )
      ),
    ];
  }

  private createCommandFields(commands: any[]) {
    return commands.map((cmd) => {
      const commandId = this.commandCache.get(cmd.name);
      return {
        name: `</${cmd.name}:${commandId}>`,
        value: `\`${cmd.description}\``,
        inline: true,
      };
    });
  }

  private formatString(str: string) {
    return `${str && str[0].toUpperCase()}${str && str.slice(1).toLowerCase()}`;
  }
}
