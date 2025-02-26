export interface JwtPayload {
  username: string;
  // JWT standard to hold id in a 'sub' property
  sub: string;
}
