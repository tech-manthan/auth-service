import { sign } from "jsonwebtoken";
import fs from "node:fs";
import path from "node:path";

import { AccessTokenPayload, RefreshTokenPayload } from "../types/token.type";

import CONFIG from "../config";
import createHttpError from "http-errors";
import { Repository } from "typeorm";
import { RefreshToken, User } from "../entity";
import { TokenServiceConstructor } from "../types/service.type";

export default class TokenService {
  private privateKey: Buffer;
  private refreshTokenRepository: Repository<RefreshToken>;
  constructor({ refreshTokenRepository }: TokenServiceConstructor) {
    this.refreshTokenRepository = refreshTokenRepository;
    try {
      this.privateKey = fs.readFileSync(
        path.join(__dirname, "../../certs/private.pem"),
      );
    } catch {
      const error = createHttpError(500, "error while reading private key");
      throw error;
    }
  }

  generateAccessToken(payload: AccessTokenPayload) {
    return sign(payload, this.privateKey, {
      algorithm: "RS256",
      expiresIn: Number(CONFIG.ACCESS_MAX_AGE),
      issuer: "auth-service",
    });
  }

  generateRefreshToken(payload: RefreshTokenPayload) {
    return sign(payload, CONFIG.REFRESH_TOKEN_SECRET as string, {
      algorithm: "HS256",
      expiresIn: Number(CONFIG.REFRESH_MAX_AGE),
      issuer: "auth-service",
      jwtid: payload.id,
    });
  }

  async persistRefreshToken(user: User) {
    return await this.refreshTokenRepository.save({
      user: user,
      expiresAt: new Date(Date.now() + Number(CONFIG.REFRESH_MAX_AGE)),
    });
  }

  async deleteRefreshTokens(user: User) {
    return await this.refreshTokenRepository.delete({
      user: user,
    });
  }
}
