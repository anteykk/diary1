module.exports = function (req,res,next){
  if(!req.session.accept){
    req.flash(`error`, `Для действия на сайте вам нужно авторизоваться`);
    res.redirect(`/`)
    return;
  }

  next();
}