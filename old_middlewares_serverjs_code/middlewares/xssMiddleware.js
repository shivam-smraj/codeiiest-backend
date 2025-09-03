// middlewares/xssMiddleware.js
const xss = require("xss");

const xssMiddleware = (req, res, next) => {
  ["body", "query", "params"].forEach((key) => {
    if (req[key]) {
      for (let field in req[key]) {
        if (typeof req[key][field] === "string") {
          req[key][field] = xss(req[key][field]);
        }
      }
    }
  });
  next();
};

module.exports = xssMiddleware;
