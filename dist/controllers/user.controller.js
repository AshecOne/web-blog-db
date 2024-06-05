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
exports.UserController = void 0;
const prisma_1 = __importDefault(require("../prisma"));
class UserController {
    updateProfile(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = resp.locals.user;
                const { username, email } = req.body;
                const updatedUser = yield prisma_1.default.user.update({
                    where: { id },
                    data: { username, email },
                });
                return resp.status(200).send({
                    rc: 200,
                    success: true,
                    message: "User profile updated successfully",
                    data: updatedUser,
                });
            }
            catch (error) {
                console.log(error);
                return resp.status(500).send({
                    rc: 500,
                    success: false,
                    message: "Internal server error",
                });
            }
        });
    }
}
exports.UserController = UserController;
