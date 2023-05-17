import express from "express";
import { loginUser } from '../controllers/userController.js';
const userRouter = express.Router();

rootRouter.post('/login', loginUser);


export default userRouter;

//userRouter.route('/change-password').all(protectorMiddleware).get(getChangePassword).post(postChangePassword)
//userRouter.get("/github/start",publicOnlyMiddleware, startGithubLogin);
//userRouter.get("/github/finish",publicOnlyMiddleware, finishGithubLogin);
//userRouter.get("/:id",see);
