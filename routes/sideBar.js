const express = require('express');
const router = express.Router();
const fs = require('fs');

router.get('/', (req, res) => {
  fs.readFile('jsons/sidebar/index.json', 'utf-8', (err, data) => {
    if (err) {
      res.send('获取数据失败')
    } else {
      res.send(data)
    }
  })
});

module.exports = router;
