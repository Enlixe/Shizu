import IConfig from "./IConfig";

export default interface IShizuClient {
    config: IConfig;

    Init(): void;
}