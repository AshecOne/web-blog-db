"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAIL_APP_PASSWORD = exports.MAIL_SENDER = void 0;
require("dotenv/config");
exports.MAIL_SENDER = process.env.MAIL_SENDER || "haseyong123@gmail.com";
exports.MAIL_APP_PASSWORD = process.env.MAIL_APP_PASSWORD || "ckpyxomvovbpsryn";
