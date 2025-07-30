/** Requires a logged-in user */
//Ensures req.user exists — otherwise 401
export default async function requireUser(req, res, next) {
  if (!req.user) return res.status(401).send("Unauthorized");
  next();
}
