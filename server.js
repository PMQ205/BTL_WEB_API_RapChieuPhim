import dotenv       from "dotenv";
dotenv.config();

import express      from "express";
import cors         from "cors";
import helmet       from "helmet";
import compression  from "compression";
import session      from "express-session";
import path         from "path";

import "./Sources/config/Database/db.js";
import { logger }   from "./Sources/config/logger.js";
//---------------------------------------------routers----------------------------------------------
import Film_Router  from "./Sources/Routes/Film_Route.js";
import Auth_Router  from "./Sources/Routes/Auth_Route.js";
import homeRoute    from "./Sources/Routes/home.Route.View.js";

import { errorHandler } from "./Sources/middleware/error.middleware.js";


const app = express();

                                                              /* ===== VIEW ENGINE ===== */
app.set("view engine", "ejs");                                // khai báo với express rằng sẽ dùng ejs để render giao diện

app.set("views", path.join(process.cwd(), "Sources/views"));  //Chỉ định thư mục chứa các file giao diện
app.use(express.static(path.join(process.cwd(), "Sources/public")));

                                                           /* ===== MIDDLEWARE ===== */
app.use(
  helmet({
    contentSecurityPolicy: false
  })
);

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(compression());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));


/* ===== SESSION (PHẢI TRƯỚC ROUTER) ===== */
app.use(session({
  secret: "flix_secret",
  resave: false,
  saveUninitialized: false
}));  

/* ===== ROUTES ===== */

app.use("/auth", Auth_Router);  // AUTH
app.use("/films", Film_Router); // API
app.use("/", homeRoute);        // VIEW

/* ===== ERROR HANDLER ===== */
app.use(errorHandler);

/* ===== START SERVER ===== */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server đang chạy tại http://localhost:${PORT}`);
});
