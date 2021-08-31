const express = require('express');
const router = express.Router();
const fs = require('fs');
let tags = [];

router.get('/', function(req, res, next) {
  let obj = {};
  fs.readFile('data.json', 'utf-8', (err,data) => {
    let tableData = JSON.parse(data);
    tableData.totalCount = tableData.data.length;
    let resData = checkData(req.query, tableData.data);
    if (err) {
      res.send('获取数据失败')
    } else {
      obj.code = 0;
      obj.data = resData;
      obj.totalCount = tableData.totalCount;
      res.send(obj)
    }
  });
});

router.get('/tree', function (req, res, next) {
  fs.readFile('jsons/treeData.json', 'utf-8',(err,data) => {
    if (err) {
      res.send('获取数据失败')
    } else {
      res.send(data)
    }
  })
});

router.get('/classList', function (req, res, next) {
  fs.readFile('jsons/classPage/index.json', 'utf-8', (err, data) => {
    if (err) {
      res.send('获取数据失败')
    } else {
      let ary = JSON.parse(data);
      tags = ary.data;
      res.send(data)
    }
  })
});

router.get('/addTagList', function (req, res, next) {
  fs.readFile('jsons/classPage/addTagList.json', 'utf-8', (err, data) => {
    if (err) {
      res.send('获取数据失败')
    } else {
      res.send(data)
    }
  })
});

router.get('/saveTag', function (req, res, next) {
  const { query } = req;
  fs.readFile('jsons/classPage/addTagList.json', 'utf-8', (err, data) => {
    const tempAry = JSON.parse(data);
    let tempObj = saveTag(query.checkTag, tempAry.data);
    if (err) {
      res.send('获取数据失败')
    } else {
      fs.writeFile('jsons/classPage/index.json', JSON.stringify(tempObj), 'utf-8', (err, data) => {
        if (err) {
          res.send('写入数据失败')
        } else {
          res.send(tempObj)
        }
      })
    }
  })
});

router.get('/delTag', function (req, res, next) {
  const { query } = req;
  fs.readFile('jsons/classPage/index.json', 'utf-8', (err, data) => {
    const tempAry = JSON.parse(data);
    let returnObj = deleteTag(query.tagId, tempAry.data);
    if (err) {
      res.send('获取数据失败')
    } else {
      fs.writeFile('jsons/classPage/index.json', JSON.stringify(returnObj), 'utf-8', (err, data) => {
        if (err) {
          res.send('写入数据失败')
        } else {
          res.send(returnObj)
        }
      })
    }
  })
})

// 方法
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

function saveTag(checkTag, data) {
  let tempAry = [], obj = {};
  data.map(item => {
    checkTag && checkTag.length > 0 ? checkTag.map(sonItem => {
      if (item.tagId === Number(sonItem)) {
        tempAry.push(item)
      }
    }) : []
  });
  obj.code = 0;
  obj.data = tempAry;
  obj.msg = '请求成功';
  return obj
}

function deleteTag(id, data) {
  const obj = {};
  const newData = data.filter(item => item.tagId !== Number(id));
  obj.code =0;
  obj.data = newData;
  obj.msg = '请求成功';
  return obj
}

module.exports = router;
