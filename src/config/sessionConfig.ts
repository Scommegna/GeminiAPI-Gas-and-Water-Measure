import session from "express-session";

import "dotenv/config";

export const sessionConfig = session({
  secret: process.env.SECRET || "secretPass",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false },
});
