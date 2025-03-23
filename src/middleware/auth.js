const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  try {
    // Get token from the Authorization header
    const token = req.header("Authorization").split(" ")[1];

    // If no token, return an error
    if (!token) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY); // Replace JWT_SECRET with your secret key
    console.log(decoded);

    // Attach the decoded user to the request object
    req.user = decoded;
    req.role = decoded.role;

    // Move to the next middleware or route handler
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = authenticate;