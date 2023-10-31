import "express-session";

declare module "express-session" {
    interface SessionData {
        country_code: string;
    }
}
