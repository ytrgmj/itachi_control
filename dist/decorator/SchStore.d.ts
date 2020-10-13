export default function (): <T extends new (...args: any[]) => {}>(constructor: T) => {
    new (...args: any[]): {
        buildQuery(): Promise<any>;
    };
} & T;
