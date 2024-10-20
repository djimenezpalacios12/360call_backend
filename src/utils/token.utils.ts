import jwt from "jsonwebtoken";

export const splitTokenParts = (authorization: string) => {
  return authorization ? authorization.split(" ") : [];
};

export const verifyToken = (authorization: string) => {
  const tokenParts = splitTokenParts(authorization);
  jwt.verify(tokenParts[1], process.env.JWT_SECRET as string);
};

export const decodedToken = (authorization: string) => {
  const tokenParts = splitTokenParts(authorization);
  const decodedToken = jwt.decode(tokenParts[1], { complete: true });
  return decodedToken;
};
