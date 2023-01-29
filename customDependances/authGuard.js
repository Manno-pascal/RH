const CompagnyModel = require('../models/compagny.js')


let routeGuard = async (req,res,next)=> {
    let user = await CompagnyModel.findOne({_id:req.session.compagnyId})
    if (user) {
        next()
    } else{
        res.redirect('/')
    }
}

module.exports = routeGuard            