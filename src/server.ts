import app from "./app";
import CONFIG from "./config";
import { AppDataSource } from "./database/data-source";
import { createAdmin, logger } from "./utils";

const startServer = async () => {
  const PORT = CONFIG.PORT;

  try {
    await AppDataSource.initialize();
    logger.info("Database Connected successfully");
    app.listen(PORT, async () => {
      await createAdmin();
      logger.info(`Server Listening on Port ${PORT}`);
    });
  } catch (err) {
    if (err instanceof Error) {
      logger.error(err.message);
    }
    process.exit(1);
  }
};

void startServer();
