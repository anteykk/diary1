module.exports = function (req,res,next){
  res.locals.accept = req.session.accept;
  res.locals.csrf = req.csrfToken();
  next();
}