export default interface ILogger {
    log(text: string, groups: string[]): void;
    warn(text: string, groups: string[]): void;
    error(text: string, groups: string[]): void;
}