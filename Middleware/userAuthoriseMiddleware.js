const jwt = require("jsonwebtoken");

//  for verrifying jwt for user------------------------------------

module.exports = function verifyToken(req,res,next){
  const token = req.headers["authorization"];

  if(!token){
    return res.status(403).json({ error: "No token provided" });
  }

  jwt.verify(token,process.env.USER_ACCESS_TOKEN_SECRET, (err,decoded) => {
      if (err) {
        return res.status(401).json({ error: "Unauthorized" });
      }

     req.username = decoded.username;
     next(); 
  });
};