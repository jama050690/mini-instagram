declare module "jsonwebtoken" {
  export interface SignOptions {
    expiresIn?: string | number;
  }

  export interface JwtPayload {
    [key: string]: unknown;
  }

  export function sign(
    payload: string | Buffer | object,
    secretOrPrivateKey: string,
    options?: SignOptions,
  ): string;

  const jwt: {
    sign: typeof sign;
  };

  export default jwt;
}
