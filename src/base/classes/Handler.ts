import { glob } from "glob";
import path from "path";
import IHandler from "../interfaces/IHandler";
import ShizuClient from "./ShizuClient";
import Event from "./Events";
import Command from "./Command";
import SubCommand from "./SubCommand";

export default class Handler implements IHandler {
    client: ShizuClient;
    constructor(client: ShizuClient){
        this.client = client
    }

    async LoadEvents(): Promise<void> {
        const files = (await glob('build/events/**/*.js')).map(file => path.resolve(file));
    
        files.map(async (file: string) => {
            try {
                const e: Event = new (await import(file)).default(this.client);
    
                if (!e.name) {
                    return delete require.cache[require.resolve(file)] && console.log(`${file.split('/').pop()} doesn't have a name`);
                }
    
                const execute = (...args: any[]) => e.Execute(...args);
    
                //@ts-ignore
                if (e.once) this.client.once(e.name, execute);
                //@ts-ignore
                else this.client.on(e.name, execute);
            } catch (error: any) {
                this.client.logger.error(`Failed to load event from file ${file}: ${error.message}`, ["Handler", "LoadEvents"]);
            } finally {
                return delete require.cache[require.resolve(file)];
            }
        });
    }

    async LoadCommands(): Promise<void> {
        const files = (await glob('build/commands/**/*.js')).map(file => path.resolve(file));
    
        files.map(async (file: string) => {
            try {
                const c: Command | SubCommand = new (await import(file)).default(this.client);
    
                if (!c.name) {
                    return delete require.cache[require.resolve(file)] && console.log(`${file.split('/').pop()} doesn't have a name`);
                }
    
                if (file.split('/').pop()?.split('.')[2]) {
                    return this.client.subCommands.set(c.name, c);
                }
    
                this.client.commands.set(c.name, c as Command);
            } catch (error: any) {
                this.client.logger.error(`Failed to load command from file ${file}: ${error.message}`, ["Handler", "LoadCommands"]);
            } finally {
                return delete require.cache[require.resolve(file)];
            }
        });
    }
}