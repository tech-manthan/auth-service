import { expressjwt } from "express-jwt";
import CONFIG from "../config";
import { Request } from "express";
import { AuthCookie } from "../types/request.type";
import { AppDataSource } from "../database/data-source";
import { RefreshToken } from "../entity";
import { RefreshTokenPayload } from "../types/token.type";
import { logger } from "../utils";

export default expressjwt({
  secret: CONFIG.REFRESH_TOKEN_SECRET!,
  algorithms: ["HS256"],
  getToken(req: Request) {
    const { refreshToken } = req.cookies as AuthCookie;

    return refreshToken;
  },

  async isRevoked(req: Request, token) {
    try {
      const refreshTokenRepo = AppDataSource.getRepository(RefreshToken);

      const refreshToken = await refreshTokenRepo.findOne({
        where: {
          id: Number((token?.payload as RefreshTokenPayload).id),
          user: {
            id: Number(token?.payload.sub),
          },
        },
      });

      return refreshToken === null;
    } catch {
      logger.error("error while getting the refresh token", {
        id: (token?.payload as RefreshTokenPayload).id,
      });
      return true;
    }
  },
});
