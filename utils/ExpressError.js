class ExpressError extends Error {
  constructor(sts, msg) {
    super();
    this.sts = sts;
    this.msg = msg;
  }
}

module.exports = ExpressError;
