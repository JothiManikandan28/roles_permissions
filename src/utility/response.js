const rescodes = require('./rescodes')

const response = {
  default: (req, res) => {
    const resdefault = { status: res.response && res.response.code < 400 };
    resdefault.data = res.response && res.response.data && res.response.data.data || {} ;
    resdefault.message = res.response && res.response.data && res.response.data.message ? res.response.data.message : (resdefault.status ? rescodes.success : rescodes.error);
    res.status(res?.response && res?.response?.code || 404).send(resdefault);

  },
};

module.exports = response;
