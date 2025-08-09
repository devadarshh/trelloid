import "express";

declare module "express-serve-static-core" {
  interface Request {
    auth: {
      userId: string;
      sessionId?: string;
      getToken?: () => Promise<string>;
    };
  }
}
