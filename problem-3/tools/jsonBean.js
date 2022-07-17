class JsonBean {

  constructor(ok, status, msg) {
    this.ok = ok;
    this.status = status;
    msg && (this.msg = msg);
  }

}

module.exports = JsonBean;