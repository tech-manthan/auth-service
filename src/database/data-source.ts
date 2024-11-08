import "reflect-metadata";
import { DataSource } from "typeorm";
import CONFIG from "../config";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: CONFIG.DB_HOST,
  port: Number(CONFIG.DB_PORT),
  username: CONFIG.DB_USERNAME,
  password: CONFIG.DB_PASSWORD,
  database: CONFIG.DB_NAME,
  // Always keep false
  synchronize: false,
  logging: false,
  entities: ["src/entity/*.ts"],
  migrations: ["src/migration/*.ts"],
  subscribers: [],
});
