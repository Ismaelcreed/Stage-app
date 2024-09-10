import { Request } from 'express';

export interface GraphQLContext {
    req: Request & { user?: { email: string } };
}
