// src/routers/rootRouter.js
import express from "express";
import { login,loginUser, home, join ,joinUser} from '../controllers/userControllers.js';
const rootRouter = express.Router();

rootRouter.get('/', home);
rootRouter.get('/login',login);
rootRouter.post('/login', loginUser);
rootRouter.get('/join', join);
rootRouter.post('/join', joinUser);
export default rootRouter;
//import {getJoin,postJoin, getLogin,postLogin} from "../controllers/userController"
//import {home, search} from "../controllers/videoController";
//import {protectorMiddleware, publicOnlyMiddleware} from '../middlewares'
//rootRouter.route("/join").all(publicOnlyMiddleware).get(getJoin).post(postJoin);
//rootRouter.route("/login").all(publicOnlyMiddleware).get(getLogin).post(postLogin);
//rootRouter.get("/search",search);;


