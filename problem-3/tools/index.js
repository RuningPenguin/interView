exports.getUsername = function (username) {
  // 数据库返回数据
  const userName = 'a_12345';
  return username === userName
}

exports.getUseInfo = function (username, password) {
  // 数据库返回数据
  const userName = 'a_12345';
  const passWord = 'a_12345';
  if (username === userName && password === passWord) {
    return 'token'
  } else {
    return false
  }
}