const express = require("express");
const bcrypt = require('bcrypt');
require('dotenv').config()
const saltRounds = 10;
const WorkerModel = require('../models/worker.js')
const CompagnyModel = require('../models/compagny.js')
const userRouter = express.Router()
const routeGuard = require('../customDependances/authGuard')
const upload = require('../customDependances/multer')

userRouter.get('/', async (req, res) => {
   try {
      res.render('template/login.twig', {
      })
   } catch (err) {
      console.log(err);
   }
})

userRouter.get('/disconnect', async (req, res) => {
   try {
      req.session.destroy();
      res.redirect("/")
   } catch (err) {
      console.log(err);
   }
})

userRouter.post('/login', async (req, res) => {
   try {
      let login = await CompagnyModel.findOne({ mail: req.body.mail })
      if (login) {
         if (await bcrypt.compare(req.body.password, login.password)) {
            req.session.compagnyId = login._id
            res.redirect('/main')
         } else {
            res.redirect('/')
         }

      } else {
         res.redirect('/')
      }
   } catch (err) {
      console.log(err);
   }
})

userRouter.get('/addCompagny', async (req, res) => {
   try {
      res.render('template/addCompagny.twig')
   } catch (err) {
      console.log(err);
   }
})

userRouter.post('/addCompagny', async (req, res) => {
   try {

      bcrypt.hash(req.body.password, saltRounds, async function (err, hash) {
         req.body.password = hash
         let compagny = new CompagnyModel(req.body)
         compagny.save()
         res.redirect('/')
      })

   } catch (err) {
      console.log(err);
   }
})

userRouter.get('/main', routeGuard, async (req, res) => {
   try {
      let company = await CompagnyModel.findOne({ _id: req.session.compagnyId }).populate("workers");
      let workers = company.workers
      res.render('template/employList.twig', {
         workers: workers
      })
   } catch (err) {
      console.log(err);
   }
})

userRouter.get('/edit/:id', routeGuard, async (req, res) => {
   try {
      let worker
      if (req.params.id != "newUser") {

         worker = await WorkerModel.findOne({ _id: req.params.id })
         console.log(worker);
      }


      res.render('template/addWorker.twig', { id: req.params.id, worker: worker })
   } catch (err) {
      console.log(err);
   }
})

userRouter.post('/addWorker', routeGuard, upload.single('picture'), async (req, res) => {
   try {

      req.body.picture = req.file.filename
      req.body.compagnyId = req.session.compagnyId
      let worker = new WorkerModel(req.body)
      worker.save()
      await CompagnyModel.updateOne({ _id: req.session.compagnyId }, { $push: { workers: worker._id } })
      res.redirect('/main')
   } catch (err) {
      console.log(err);
   }
})

userRouter.get('/delete/:id', routeGuard, async (req, res) => {
   try {
      await WorkerModel.deleteOne({ _id: `${req.params.id}` });
      res.redirect('/main')
   } catch (err) {
      console.log(err);
   }
})




userRouter.post('/edit/:id', routeGuard, upload.single('picture'), async (req, res) => {
   try {
      console.log(req.file);
      if (req.file) {
         req.body.picture = req.file.filename
      }
      await WorkerModel.updateOne({ _id: req.params.id }, req.body)
      res.redirect('/main')
   } catch (err) {
      console.log(err);
   }
})

userRouter.get('/addBlame/:id', routeGuard, async (req, res) => {
   try {
      let worker = await WorkerModel.findOne({ _id: req.params.id });
      worker.warningNumber++
      if (worker.warningNumber >= 3) {
         res.redirect(`/delete/${req.params.id}`)
      } else {
         await WorkerModel.updateOne({ _id: req.params.id }, worker)
      }
      res.redirect('/main')
   } catch (err) {
      console.log(err);
   }
})



module.exports = userRouter


