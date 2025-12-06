
const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/certificateController');

router.get('/', (req,res)=>{
  res.json([{ title:'React Native', description:'Learn RN', videoUrl:'https://www.w3schools.com/html/mov_bbb.mp4' }]);
});

router.get('/certificate', certificateController.generateCertificate);

module.exports = router;
