import express from "express";
import { Express } from "express";
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const FRONTEND_URL = process.env.ORIGIN || "https://canvasandchaos.netlify.app";

module.exports = (app:Express) => {
  app.set("trust proxy", 1);
  app.use(
    cors({
      origin: [FRONTEND_URL],
    })
  );
  app.use(logger("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
};
