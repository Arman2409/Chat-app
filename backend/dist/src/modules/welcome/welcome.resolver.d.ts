import { WelcomeService } from "./welcome.service";
export declare class WelcomeResolver {
    private readonly service;
    constructor(service: WelcomeService);
    getNews(): Promise<any>;
}
