async function authenticateAdmin(req, res, next) {
  try {
    if (!req?.user?.isAdmin) {
      return res.sendStatus(401);
    }
    return next();
  } catch (error) {
    return res.sendStatus(500);
  }
}

module.exports = authenticateAdmin;
