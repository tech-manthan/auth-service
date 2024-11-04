import { JwtPayload } from "jsonwebtoken";

export interface TokenPayloadData {
  role: string;
  email: string;
  userId: string;
  refreshTokenId: string;
}

export interface AccessTokenPayload extends JwtPayload {
  role: string;
  email: string;
}

export interface RefreshTokenPayload extends AccessTokenPayload {
  id: string;
}
