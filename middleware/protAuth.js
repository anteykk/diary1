module.exports = function (req,res,next){
  if(req.session.accept){
    res.redirect(`/loat`);
    return;
  }

  next();
}