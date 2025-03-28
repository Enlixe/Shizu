import { Events, Guild } from "discord.js";
import Event from "../../base/classes/Events";
import ShizuClient from "../../base/classes/ShizuClient";
import GuildConfig from "../../base/schemas/GuildConfig";

export default class GuildDelete extends Event {
    constructor(client: ShizuClient) {
        super(client, {
            name: Events.GuildDelete,
            description: "Guild Delete",
            once: false
        })
    }

    async Execute(guild: Guild) {
        try {
            await GuildConfig.deleteOne({guildId: guild.id})
        } catch (err) {
            console.error(err)
        }
    }
}