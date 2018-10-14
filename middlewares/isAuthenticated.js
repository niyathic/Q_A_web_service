var isAuthenticated = function (req, res, next) {
    if (req.session.user) {
      next();
    } else {
      next(new Error('YOU IS NOT AUTHENTICATED MY MAN YOU IS NOT'));
    }
  }
  
  module.exports = isAuthenticated;