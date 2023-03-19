import { expressjwt } from "express-jwt";
import jwtClient from "jwks-rsa";

import {
  AUTH_AUDIENCE,
  AUTH_ISSUER,
  AUTH_JWKSURI,
} from "../constants/config.const.js";

export const protect = expressjwt({
  secret: jwtClient.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: AUTH_JWKSURI,
  }),
  audience: AUTH_AUDIENCE,
  issuer: AUTH_ISSUER,
  algorithms: ["RS256"],
  getToken: function fromHeaderOrQuerystring(req) {
    if (
      req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
      return req.headers.authorization.split(" ")[1];
    } else if (req.query && req.query.token) {
      return req.query.token;
    }
    return null;
  },
});
