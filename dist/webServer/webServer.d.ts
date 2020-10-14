import { Context } from 'itachi_util';
interface WebServerOption {
    /**
     *
     */
    webPath?: string;
    webSocket?: boolean;
    port?: number;
    mids?: Array<any>;
    context?: Context;
    goesTohumpOpen?: boolean;
    notTohumpList?: Array<string>;
}
export default function (opt: WebServerOption): any;
export {};
