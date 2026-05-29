const { verifyToken } = require("../service/auth");

function checkForAuthenticationCookie() {
    // console.log("checkForAuthenticationCookie is running");
  return (req, res, next) => {
    try {
        // console.log("inside return");
      const tokenCookie = req.cookies.token;
      req.user = null;

      if (!tokenCookie) {
        return next(); // No cookie = proceed
      }

      const user = verifyToken(tokenCookie);
      if (user) {
        req.user = user;
      }

      return next(); // Always proceed
    } catch (err) {
      console.error("Error in checkForAuthenticationCookie:", err.message);
      return next(); // Even on error, don't block route
    }
  };
}




function restrictTo(role = []) {
    return function (req,res,next){
      if(!req.user) return res.status(401).json({ error: "Not logged in" });
      if(!role.includes(req.user.role)) return res.status(403).json({ error: "Forbidden" });
      // console.log("from restrict-->",req.user);
        return next();
    }
}

module.exports = { checkForAuthenticationCookie, restrictTo };