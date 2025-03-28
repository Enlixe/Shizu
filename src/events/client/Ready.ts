import { Collection, Events, REST, Routes } from "discord.js";
import Event from "../../base/classes/Events";
import ShizuClient from "../../base/classes/ShizuClient";
import Command from "../../base/classes/Command";

export default class Ready extends Event {
    constructor(client: ShizuClient) {
        super(client, {
            name: Events.ClientReady,
            description: "Ready event",
            once: true
        })
    }

    async Execute() {
        console.log(`${this.client.user?.tag} is ready!`)

        const clientId = this.client.devMode ? this.client.config.dev_client_id : this.client.config.client_id;
        const rest = new REST().setToken(this.client.config.token)

        if (!this.client.devMode) {
            const globalCommands: any = await rest.put(Routes.applicationCommands(clientId), {
                body: this.GetJson(this.client.commands.filter(cmd => !cmd.dev))
            })

            console.log(`Successfully loaded ${globalCommands.length} global commands.`)
        }

        const devCommands: any = await rest.put(Routes.applicationGuildCommands(clientId, this.client.config.dev_guild), {
            body: this.GetJson(this.client.commands.filter(cmd => cmd.dev))
        })

        console.log(`Successfully loaded ${devCommands.length} developer commands.`)
    }

    private GetJson(commands: Collection<string, Command>): object[] {
        const data: object[] = [];

        commands.forEach((cmd) => {
            data.push({
                name: cmd.name,
                description: cmd.description,
                options: cmd.options,
                default_member_permission: cmd.default_member_permission.toString(),
                dm_permission: cmd.dm_permission
            })
        })

        return data;
    }
}