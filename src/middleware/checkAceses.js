const CheckAssess = (acceptRole) => {
    return (req, res, next) => {
      // Check if the user's role matches the accepted role
      if (req.user?.role !== acceptRole) {
        return res
          .status(403)
          .json({ message: "Access denied. Unauthorized role." });
      }
  
      // If the role matches, proceed to the next middleware or route handler
      next();
    };
  };
  
  module.exports = CheckAssess;