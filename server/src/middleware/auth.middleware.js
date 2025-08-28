export const protectRoute = (req, res, next) => {
  // req.auth().isAuthenticated will be true if the user is logged in, it is comming from the Clerk middleware that we have added in server.js
  if (!req.auth().isAuthenticated) {
    return res.status(401).json({ message: 'Unauthorized - you must be logged in' });
  }
  next();
};
