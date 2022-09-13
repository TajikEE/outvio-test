import jwt from "jsonwebtoken";

export const verifyAuth = (req, res, next) => {
  // Note that since there is no signup and login routes, so the jwt token is signed below.
 
  if (!process.env.JWT_TOKEN) {
    return res.status(403).send({
      message: "No token provided!",
    });
  }

  const token = jwt.sign({ userId: process.env.USER_ID }, process.env.JWT_SECRET);

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }
    req.userId = decoded.userId

    next();
  });
};
