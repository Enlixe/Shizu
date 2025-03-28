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

        const commands: object[] = this.GetJson(this.client.commands);

        const rest = new REST().setToken(this.client.config.token)

        const setCommands: any = await rest.put(Routes.applicationGuildCommands(this.client.config.client_id, this.client.config.dev_guild), {
            body: commands
        })

        console.log(`Successfully set ${setCommands.length} commands`)
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