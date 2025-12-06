
const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const jwt = require('jsonwebtoken');

router.get('/', async (req,res)=>{
  const jobs = await Job.find({});
  res.json(jobs);
});

router.get('/:id', async (req,res)=>{
  const job = await Job.findById(req.params.id);
  res.json(job);
});

router.post('/:id/apply', async (req,res)=>{
  const auth = req.headers.authorization;
  if(!auth) return res.status(401).json({ error: 'Unauthorized' });
  try{
    jwt.verify(auth.split(' ')[1], 'secret');
    res.json({ ok:true });
  }catch(e){
    res.status(401).json({ error:'Invalid token' });
  }
});

module.exports = router;
