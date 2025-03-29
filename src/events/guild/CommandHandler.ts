import { ChatInputCommandInteraction, Collection, EmbedBuilder, Events } from "discord.js";
import Event from "../../base/classes/Events";
import ShizuClient from "../../base/classes/ShizuClient";
import Command from "../../base/classes/Command";

export default class CommandHandler extends Event {
    constructor(client: ShizuClient) {
        super(client, {
            name: Events.InteractionCreate,
            description: "Command Handler",
            once: false

        })
    }
    Execute(interaction: ChatInputCommandInteraction) {
        if (!interaction.isChatInputCommand()) return;
    
        //@ts-ignore
        const cmd: Command = this.client.commands.get(interaction.commandName);
    
        //@ts-ignore
        if (!cmd) return interaction.reply({ content: "This command doesn't exist", flags: 64 }) && this.client.commands.delete(interaction.commandName);
    
        if (cmd.dev && !this.client.config.dev_user.includes(interaction.user.id)) {
            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor("Red")
                    .setDescription(`❌ This command is only available to developers.`)
                ],
                flags: 64
            });
        }
    
        const { cooldowns } = this.client;
        if (!cooldowns.has(cmd.name)) cooldowns.set(cmd.name, new Collection());
    
        const now = Date.now();
        const timestamps = cooldowns.get(cmd.name);
        const cooldownAmount = (cmd.cooldown || 3) * 1000;
    
        if (timestamps?.has(interaction.user.id) && (now < (timestamps?.get(interaction.user.id) || 0) + cooldownAmount)) {
            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor("Red")
                    .setDescription(`❌ Please wait another \`${((((timestamps?.get(interaction.user.id) || 0) + cooldownAmount) - now) / 1000).toFixed(1)}\` seconds, before reusing the \`${cmd.name}\` command`)
                ],
                flags: 64
            });
        }
    
        timestamps?.set(interaction.user.id, now);
        setTimeout(() => timestamps?.delete(interaction.user.id), cooldownAmount);
    
        try {
            const subCommandGroup = interaction.options.getSubcommandGroup(false);
            const subCommand = `${interaction.commandName}${subCommandGroup ? `.${subCommandGroup}` : ""}.${interaction.options.getSubcommand(false)}`;
    
            return this.client.subCommands.get(subCommand)?.Execute(interaction) || cmd.Execute(interaction);
        } catch (error: any) {
            this.client.logger.error(`Error executing command ${cmd.name}: ${error.message}`, ["CommandHandler"]);
            interaction.reply({ content: "An error occurred while executing the command.", ephemeral: true });
        }
    }
}