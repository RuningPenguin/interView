var express = require('express');
var router = express.Router();
var JsonBean = require('../tools/jsonBean');
var { getUsername, getUseInfo } = require('../tools/index');



router.post('/signup', function (req, res, next) {
  const { username, password } = req.body;
  let jsonBean = new JsonBean(false, 500, '用户名已存在');

  function verification() {

    function testPass(str) {
      var rC = {
        lW: '[a-z]',
        uW: '[A-Z]',
        nW: '[0-9]'
      };
      function Reg(str, rStr) {
        var reg = new RegExp(rStr);
        if (reg.test(str)) return true;
        else return false;
      }
      var tR = {
        l: Reg(str, rC.lW),
        u: Reg(str, rC.uW),
        n: Reg(str, rC.nW),
      };
      if (str.length <= 6) {
        jsonBean = new JsonBean(false, 401, '密码不规范，长度须 6 位以上');
        return false;
      }
      if (!((tR.l && tR.u) || (tR.l && tR.n) || (tR.u && tR.n))) {
        jsonBean = new JsonBean(false, 401, '密码不规范，密码须包含大写，小写，数字至少二项');
        return false;
      }
    }

    function testUser(str) {
      var rC = {
        dW: '^[0-9]',
        wW: '[a-z]',
        nW: '[0-9]',
        lW: '[_]'
      }
      function Reg(str, rStr) {
        var reg = new RegExp(rStr);
        if (reg.test(str)) return true;
        else return false;
      }
      var tR = {
        d: Reg(str, rC.dW),
        w: Reg(str, rC.wW),
        n: Reg(str, rC.nW),
        l: Reg(str, rC.lW),
      };
      //长度在 5 - 20 之间
      if (str.length < 5 || str.length > 20) {
        jsonBean = new JsonBean(false, 401, '用户名不规范，长度应在 5 - 20 之间')
        return false;
      }
      if (tR.d) {
        jsonBean = new JsonBean(false, 401, '用户名不规范，不能以数字开头')
        return false
      }
      if (!(tR.w && tR.n && tR.l)) {
        jsonBean = new JsonBean(false, 401, '用户名不规范，用户名由小写英文字母，数字，及下划线组成')
        return false
      }
    }
    testUser(username);
    testPass(password);
    return true;
  }

  if (!getUsername(username)) {
    if (verification()) {
      jsonBean = new JsonBean(true, 200, null)
    }
  }


  res.send(jsonBean);

});

router.post('/login', function (req, res, next) {
  const { username, password } = req.body;
  let jsonBean = new JsonBean(false, 500, '用户名或密码不正确');

  let token = getUseInfo(username, password);
  if (token) {
    jsonBean = new JsonBean(true, 200, token);
    res.cookie('name', username, { maxAge: 12 * 60 * 60 * 1000 });
    res.cookie('token', token, { maxAge: 12 * 60 * 60 * 1000 });
  }


  res.send(jsonBean);

});

module.exports = router;
