const jwt = require("jsonwebtoken");

module.exports = function auth(req, res, next) {
   const accessToken = req.headers["x-access-token"];
   if (!accessToken) {
      return res.status(401).json({
         message: "Access token not found!",
      });
   } else {
      try {
         const decoded = jwt.verify(accessToken, process.env.SECRET_TOKEN);
         req.accessTokenPayload = decoded;
         next();
      } catch (err) {
         return res.status(401).json({
            message: "Invalid access token!",
         });
      }
   }
};
