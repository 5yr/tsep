import connectRedis from "connect-redis";
import dotenv from "dotenv";
import express from "express";
import expressSession from "express-session";
import path from "path";
import redis from "redis";
import * as routes from "./routers";

const RedisStore = connectRedis(expressSession);

// initialize configuration
dotenv.config();

// port is now available to the Node.js runtime
// as if it were an environment variable
const port = process.env.SERVER_PORT;

const app = express();
app.use(express.json());

// Configure Express to use EJS
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const redisClient = redis.createClient(6379, "127.0.0.1");
app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret: "password",
    store: new RedisStore({ client: redisClient }),
}));

routes.register(app);

// start the express server
app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${port}`);
});
