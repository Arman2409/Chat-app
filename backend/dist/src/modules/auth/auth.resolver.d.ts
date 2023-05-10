import { AuthService } from "./auth.service";
export declare class AuthResolver {
    private readonly auth;
    constructor(auth: AuthService);
    signUp(name: string, email: string, image: string, password: string): Promise<any>;
    signIn(ctx: any, email: string, password: string): Promise<any>;
    signOut(ctx: any): string;
    setSession(ctx: any, token: string): any;
    recoverPassword(email: string): any;
    changePassword(id: string, password: string): any;
}
