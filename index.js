import express from "express";
import { promises as fs } from "fs";
import winston from "winston";
import swaggerUi from "swagger-ui-express";
import accountsRouter from "./routes/account.routes.js";
import { swaggerDocument } from "./doc.js";

const app = express();
app.use(express.json());
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const { readFile, writeFile } = fs;

global.fileName = "accounts.json";

//gravacao logs
const { combine, timestamp, label, printf } = winston.format;
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});
global.logger = winston.createLogger({
  level: "silly",
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "my-bank-api.log" }),
  ],
  format: combine(label({ label: "my-bank-api" }), timestamp(), myFormat),
});
//fim gravacao logs

app.use("/account", accountsRouter);

app.listen(3000, async () => {
  try {
    await readFile(fileName);
    logger.info("app listening");
  } catch (err) {
    const initialJsons = {
      nextId: 1,
      accounts: [],
    };
    writeFile(fileName, JSON.stringify(initialJsons))
      .then(() => {
        logger.info("app listening and file created");
      })
      .catch((err) => {
        logger.error(err);
      });
  }
});
