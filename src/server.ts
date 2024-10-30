import app from "./app";
import CONFIG from "./config";

const startServer = () => {
  const PORT = CONFIG.PORT;

  try {
    app.listen(PORT, () => {
      console.log(`Listening on Port ${PORT}`);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

startServer();
