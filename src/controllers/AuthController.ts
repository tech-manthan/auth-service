import { NextFunction, Response } from "express";
import {
  AuthRequest,
  LoginUserRequest,
  RegisterUserRequest,
} from "../types/request.type";
import { PasswordService, TokenService, UserService } from "../services";
import { AuthControllerConstructor } from "../types/controller.type";
import { Logger } from "winston";
import createHttpError from "http-errors";
import { validationResult } from "express-validator";
import {
  AccessTokenPayload,
  RefreshTokenPayload,
  TokenPayloadData,
} from "../types/token.type";
import CONFIG from "../config";
import { Roles } from "../constants";

export class AuthController {
  private userService: UserService;
  private passwordService: PasswordService;
  private tokenService: TokenService;

  private logger: Logger;

  constructor({
    userService,
    passwordService,
    tokenService,
    logger,
  }: AuthControllerConstructor) {
    this.userService = userService;
    this.passwordService = passwordService;
    this.tokenService = tokenService;
    this.logger = logger;
  }

  sendTokens(res: Response, data: TokenPayloadData) {
    const { email, userId, refreshTokenId, role } = data;
    const accessTokenPayload: AccessTokenPayload = {
      sub: userId,
      email: email,
      role: role,
    };
    const refreshTokenPayload: RefreshTokenPayload = {
      sub: userId,
      email: email,
      role: role,
      id: refreshTokenId,
    };

    const accessToken =
      this.tokenService.generateAccessToken(accessTokenPayload);
    const refreshToken =
      this.tokenService.generateRefreshToken(refreshTokenPayload);

    res.cookie("accessToken", accessToken, {
      domain: "localhost",
      sameSite: "strict",
      maxAge: Number(CONFIG.ACCESS_MAX_AGE),
      httpOnly: true,
    });

    res.cookie("refreshToken", refreshToken, {
      domain: "localhost",
      sameSite: "strict",
      maxAge: Number(CONFIG.REFRESH_MAX_AGE),
      httpOnly: true,
    });
  }

  async register(req: RegisterUserRequest, res: Response, next: NextFunction) {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      res.status(400).json({
        errors: result.array(),
      });
      return;
    }

    const { firstName, lastName, email, password } = req.body;
    this.logger.info("request to register a user", {
      email,
      firstName,
      lastName,
    });

    try {
      const userExist = await this.userService.findUserByEmail(email);

      if (userExist) {
        const err = createHttpError(400, "user already exist, try logging in");
        return next(err);
      }

      const hashedPassword =
        await this.passwordService.hashedPassword(password);

      const user = await this.userService.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: Roles.CUSTOMER,
      });

      this.logger.info("user registered successfully", {
        id: user.id,
      });

      const refreshToken = await this.tokenService.persistRefreshToken(user);

      this.sendTokens(res, {
        email: user.email,
        refreshTokenId: String(refreshToken.id),
        role: user.role,
        userId: String(user.id),
      });

      res.status(201).json({
        id: user.id,
      });
    } catch (err) {
      next(err);
    }
  }

  async login(req: LoginUserRequest, res: Response, next: NextFunction) {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      res.status(400).json({
        errors: result.array(),
      });
      return;
    }

    const { email, password } = req.body;
    this.logger.info("request to login a user", {
      email,
      password: "*******",
    });

    try {
      const user = await this.userService.findUserByEmail(email);

      if (!user) {
        const err = createHttpError(
          400,
          "email or password are wrong,try again",
        );
        return next(err);
      }

      const isPasswordCorrect = await this.passwordService.comparePassword(
        password,
        user.password,
      );

      if (!isPasswordCorrect) {
        const err = createHttpError(
          400,
          "email or password are wrong,try again",
        );
        return next(err);
      }

      await this.tokenService.deleteRefreshTokens(user);
      const refreshToken = await this.tokenService.persistRefreshToken(user);

      this.sendTokens(res, {
        email: user.email,
        refreshTokenId: String(refreshToken.id),
        role: user.role,
        userId: String(user.id),
      });

      this.logger.info("user logged in successfully", { id: user.id });

      res.status(200).json({
        id: user.id,
      });
    } catch (err) {
      next(err);
    }
  }

  async self(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await this.userService.findUserById(Number(req.auth.sub));

      res.status(200).json({ ...user, password: undefined });
    } catch (err) {
      next(err);
    }
  }

  async refresh(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await this.tokenService.deleteRefreshToken(Number(req.auth.id));
      const user = await this.userService.findUserById(Number(req.auth.sub));

      if (!user) {
        const err = createHttpError(400, "inavlid refresh token");
        return next(err);
      }

      const refreshToken = await this.tokenService.persistRefreshToken(user);

      this.sendTokens(res, {
        email: req.auth.email,
        refreshTokenId: String(refreshToken.id),
        role: req.auth.role,
        userId: req.auth.sub,
      });

      this.logger.info("tokens refreshed successfully");
      res.json({
        id: refreshToken.id,
      });
    } catch (err) {
      next(err);
    }
  }

  async logout(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await this.tokenService.deleteRefreshToken(Number(req.auth.id));

      // res.cookie("accessToken", "", {
      //   domain: "localhost",
      //   sameSite: "strict",
      //   maxAge: Number(CONFIG.ACCESS_MAX_AGE),
      //   httpOnly: true,
      // });

      // res.cookie("refreshToken", "", {
      //   domain: "localhost",
      //   sameSite: "strict",
      //   maxAge: Number(CONFIG.REFRESH_MAX_AGE),
      //   httpOnly: true,
      // });
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");

      this.logger.info("user logged out successfully");
      res.json({
        id: req.auth.sub,
      });
    } catch (err) {
      next(err);
    }
  }
}
