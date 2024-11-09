import { sign } from "jsonwebtoken";
import { AccessTokenPayload, RefreshTokenPayload } from "../types/token.type";

import CONFIG from "../config";
import { Repository } from "typeorm";
import { RefreshToken, User } from "../entity";
import { TokenServiceConstructor } from "../types/service.type";
import createHttpError from "http-errors";

export default class TokenService {
  private refreshTokenRepository: Repository<RefreshToken>;
  constructor({ refreshTokenRepository }: TokenServiceConstructor) {
    this.refreshTokenRepository = refreshTokenRepository;
  }

  generateAccessToken(payload: AccessTokenPayload) {
    if (!CONFIG.PRIVATE_KEY) {
      throw createHttpError(500, "private key not set");
    }
    return sign(payload, CONFIG.PRIVATE_KEY, {
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

  async deleteRefreshToken(id: number) {
    await this.refreshTokenRepository.delete({
      id: id,
    });
  }

  async deleteRefreshTokens(user: User) {
    return await this.refreshTokenRepository.delete({
      user: user,
    });
  }
}
