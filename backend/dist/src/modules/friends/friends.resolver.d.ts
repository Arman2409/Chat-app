import { FriendsService } from "./friends.service";
export declare class FriendsResolver {
    private readonly service;
    constructor(service: FriendsService);
    addFriend(ctx: any, id: string): Promise<any>;
    removeFriend(ctx: any, id: string): Promise<any>;
    getRequests(ctx: any, arr: number[]): Promise<any>;
    confirmFriend(ctx: any, id: string): Promise<{
        token: any;
        message?: undefined;
    } | {
        message: string;
        token?: undefined;
    }>;
}
