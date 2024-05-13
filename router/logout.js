let {Router} = require(`express`);
let router = Router();

//! Выход из аккаунта и деавторизация из сессии
router.get(`/`, async (req,res)=>{
  req.session.destroy(()=>{
    res.redirect(`/`);
  })
})

module.exports = router;