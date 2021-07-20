const express = require('express');
const router = express.Router();
const { dispatch } = require('./store');

router.post('/pattern', (req, res) => {
  const {body:{pattern = '[]'}} = req;
  dispatch('queuePattern', pattern);
  res.sendStatus(200); 
});


module.exports = router;
