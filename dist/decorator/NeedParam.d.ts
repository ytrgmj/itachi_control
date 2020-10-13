export default function (keys: Array<string>): <T extends new (...args: any[]) => {}>(constructor: T) => {
    new (...args: any[]): {
        _getNeedParamKey(): Array<string>;
    };
} & T;
