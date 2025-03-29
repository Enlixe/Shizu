import { EmbedBuilder, Events, Guild } from "discord.js";
import Event from "../../base/classes/Events";
import ShizuClient from "../../base/classes/ShizuClient";
import GuildConfig from "../../base/schemas/GuildConfig";

export default class GuildCreate extends Event {
    constructor(client: ShizuClient) {
        super(client, {
            name: Events.GuildCreate,
            description: "Guild Create",
            once: false
        })
    }

    async Execute(guild: Guild) {
        try {
            if (!await GuildConfig.exists({ guildId: guild.id })) {
                await GuildConfig.create({ guildId: guild.id });
            }
    
            const owner = await guild.fetchOwner();
            if (this.client.config.dev_user.includes(owner.id)) {
                owner?.send({
                    embeds: [new EmbedBuilder()
                        .setColor(this.client.config.color.default)
                        .setDescription(`Hey <@${owner.id}>! Thanks for inviting me to your server!`)]
                }).catch(err => {
                    this.client.logger.error(`Failed to send welcome message: ${err.message}`, ["Event", "GuildCreate"]);
                });
            }
        } catch (error: any) {
            this.client.logger.error(`Error in GuildCreate event: ${error.message}`, ["Event", "GuildCreate"]);
        }
    }
}