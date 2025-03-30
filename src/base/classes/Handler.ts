import { glob } from "glob";
import path from "path";
import IHandler from "../interfaces/IHandler";
import ShizuClient from "./ShizuClient";
import Event from "./Events";
import Command from "./Command";
import SubCommand from "./SubCommand";

export default class Handler implements IHandler {
  client: ShizuClient;
  constructor(client: ShizuClient) {
    this.client = client;
  }

  async LoadEvents(): Promise<void> {
    const files: string[] = (await glob("dist/events/**/*.js")).map((file) =>
      path.resolve(file)
    );

    await Promise.all(
      files.map(async (file: string) => {
        try {
          const e: Event = new (await import(file)).default(this.client);
          this.registerEvent(e, file);
        } catch (error: any) {
          this.client.logger.error(
            `Failed to load event from file ${file}: ${error.message}`,
            ["Handler", "LoadEvents"]
          );
        }
      })
    );
  }

  private registerEvent(event: Event, file: string): void {
    if (!event.name) {
      delete require.cache[require.resolve(file)];
      console.log(`${file.split("/").pop()} doesn't have a name`);
      return;
    }

    const execute = (...args: any[]) => event.Execute(...args);

    //@ts-ignore
    if (event.once) this.client.once(event.name, execute);
    //@ts-ignore
    else this.client.on(event.name, execute);

    delete require.cache[require.resolve(file)];
  }

  async LoadCommands(): Promise<void> {
    const files: string[] = (await glob("dist/commands/**/*.js")).map((file) =>
      path.resolve(file)
    );

    await Promise.all(
      files.map(async (file: string) => {
        try {
          const c: Command | SubCommand = new (await import(file)).default(
            this.client
          );
          this.registerCommand(c, file);
        } catch (error: any) {
          this.client.logger.error(
            `Failed to load command from file ${file}: ${error.message}`,
            ["Handler", "LoadCommands"]
          );
        }
      })
    );
  }

  private registerCommand(command: Command | SubCommand, file: string): void {
    if (!command.name) {
      delete require.cache[require.resolve(file)];
      console.log(`${file.split("/").pop()} doesn't have a name`);
      return;
    }

    if (file.split("/").pop()?.split(".")[2]) {
      this.client.subCommands.set(command.name, command);
    } else {
      this.client.commands.set(command.name, command as Command);
    }

    delete require.cache[require.resolve(file)];
  }
}
