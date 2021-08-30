const express = require('express');
const router = express.Router();
const fs = require('fs');

router.get('/:page', function(req, res, next) {
  let obj = {};
  fs.readFile('data.json', 'utf-8', (err,data) => {
    let tableData = JSON.parse(data);
    tableData.totalCount = tableData.data.length;
    let resData = checkData(req.query, tableData.data);
    if (err) {
      res.send('读取失败')
    } else {
      obj.code = 0;
      obj.data = resData;
      obj.totalCount = tableData.totalCount;
      res.send(obj)
    }
  });
});

function checkData(query, data) {
  let tempAry;
  if (query.page === '1') {
    tempAry = data.splice(0,query.count);
    return tempAry
  } else {
    tempAry = data.splice((query.page - 1) * query.count, query.count);
    return tempAry
  }
}

module.exports = router;
