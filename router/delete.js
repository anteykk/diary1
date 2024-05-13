let {Router} = require(`express`);
let Days = require(`../models/day`);

let router = Router();

//! Удаления выбранной записи
router.get(`/:id`, async (req,res)=>{

  await Days.update(
    { _id : req.session.user._id },
    { $pull : { "writes" : { _id: req.params.id} } }
 );

 req.session.user = await Days.findOne({_id: req.session.user._id});
 await req.session.save();



  //await Days.findByIdAndDelete(req.params.id);

  res.redirect(`/`);
})

module.exports = router;