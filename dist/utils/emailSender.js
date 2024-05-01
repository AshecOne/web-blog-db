"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPassword = exports.sendEmail = void 0;
const path_1 = __importDefault(require("path"));
const nodemailer_1 = require("../lib/nodemailer");
const fs_1 = __importDefault(require("fs"));
const handlebars_1 = __importDefault(require("handlebars"));
const sendEmail = (email, subject, content, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const templatePath = path_1.default.join(__dirname, "../templates", "register.hbs");
        const templateSource = yield fs_1.default.readFileSync(templatePath, "utf-8");
        const compiledTemplate = handlebars_1.default.compile(templateSource);
        const html = compiledTemplate(data);
        yield nodemailer_1.transporter.sendMail({
            from: process.env.MAIL_SENDER,
            to: email,
            subject,
            html: content || html,
        });
    }
    catch (error) {
        throw error;
    }
});
exports.sendEmail = sendEmail;
const forgotPassword = (email, subject, content, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const templatePath = path_1.default.join(__dirname, "../templates", "forgotpassword.hbs");
        const templateSource = yield fs_1.default.readFileSync(templatePath, "utf-8");
        const compiledTemplate = handlebars_1.default.compile(templateSource);
        const html = compiledTemplate(data);
        yield nodemailer_1.transporter.sendMail({
            from: process.env.MAIL_SENDER,
            to: email,
            subject,
            html: content || html,
        });
    }
    catch (error) {
        throw error;
    }
});
exports.forgotPassword = forgotPassword;
