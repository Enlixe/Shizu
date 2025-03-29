import { ActivityType, Collection, Events, REST, Routes } from "discord.js";
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
        this.client.logger.log(`Logged in as ${this.client.user?.tag} (${this.client.user?.id})`, ["Event", "Ready"]);
    
        try {
            await this.registerCmd();
            this.activity();
        } catch (error: any) {
            this.client.logger.error(`Error in Ready event: ${error.message}`, ["Event", "Ready"]);
        }
    }
    
    private async registerCmd() {
        try {
            const clientId = this.client.devMode ? this.client.config.dev_client_id : this.client.config.client_id;
            const rest = new REST().setToken(this.client.config.token);
    
            if (!this.client.devMode) {
                const globalCommands: any = await rest.put(Routes.applicationCommands(clientId), {
                    body: this.GetJson(this.client.commands.filter(cmd => !cmd.dev))
                });
    
                this.client.logger.log(`Successfully loaded ${globalCommands.length} global commands.`, ["Event", "Ready"]);
            }
    
            const devCommands: any = await rest.put(Routes.applicationGuildCommands(clientId, this.client.config.dev_guild), {
                body: this.GetJson(this.client.commands.filter(cmd => cmd.dev))
            });
    
            this.client.logger.log(`Successfully loaded ${devCommands.length} developer commands.`, ["Event", "Ready"]);
        } catch (error: any) {
            this.client.logger.error(`Error registering commands: ${error.message}`, ["Event", "Ready"]);
        }
    }
    
    private activity() {
        try {
            const getActivities = (): string[] => [
                `Playing with ${this.client.guilds.cache.size} lovely servers `,
                `Serving ${this.client.users.cache.size} amazing users `,
                `Spreading joy and code `,
                `Type /help to be friends! `,
                `Listening to your commands `,
                `Making the world cuter, one server at a time `,
            ];
    
            let activityIndex = Math.floor(Math.random() * 6);
            const updateActivity = (): void => {
                try {
                    const activities = getActivities();
                    const activity = activities[activityIndex];
                    this.client.user?.setActivity(activity, { type: ActivityType.Custom, state: activity });
                    activityIndex = (activityIndex + 1) % activities.length;
                } catch (err: Error | any) {
                    this.client.logger.error(`Failed to set activity: ${err.message}`, ["Event", "Ready"]);
                }
            };
    
            updateActivity();
            setInterval(updateActivity, 4 * 60 * 1000); // Update every 4 minutes
        } catch (error: any) {
            this.client.logger.error(`Error setting activity: ${error.message}`, ["Event", "Ready"]);
        }
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