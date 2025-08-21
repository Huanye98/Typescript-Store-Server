const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ errorMessage: "Token is missing" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ errorMessage: "Invalid or expired token" });
  }
}

function roleValidation(requiredRole) {
  return (req, res, next) => {
    if(!req.user){
        return res
        .status(401)
        .json({ errorMessage: "no req.user" });
    }
    
    if ( req.user.role !== requiredRole) {
      return res
        .status(401)
        .json({ errorMessage: "Access denied, not enough clearance" });
    }
    
    next();
  };
}

module.exports = { verifyToken, roleValidation };
