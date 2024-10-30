import app from "./app";
import CONFIG from "./config";
import { logger } from "./utils";

const startServer = () => {
  const PORT = CONFIG.PORT;

  try {
    app.listen(PORT, () => {
      logger.info(`Server Listening on Port ${PORT}`);
    });
  } catch (err) {
    if (err instanceof Error) {
      logger.error(err.message);
    }
    process.exit(1);
  }
};

startServer();
