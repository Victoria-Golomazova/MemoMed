export interface JwtPayload {
    sub: string;
    email: string;
}

export interface AuthenticatedRequest {
    user: JwtPayload;
}