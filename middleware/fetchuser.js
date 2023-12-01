import jwt  from "jsonwebtoken";
import InvalidToken from "../models/InvalidToken.js";

export const fetchuser =async (req, res, next) => {
  //get the user from the jwt token and add id to req object
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ error: "Please authenticate using a valid token" });
  }
  
  try {

    const invalid = await InvalidToken.exists({ token });

    if (invalid) {
      return res.json({message:"Token Invalid"});
    }

    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {   
    res.status(401).send({ error: "Please authenticate using a valid token" });
  }
};
 
