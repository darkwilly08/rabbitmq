const fs = require('fs');

const amqpsUrl = process.env.AMQPS_URL;
let amqpOptions = null;

if (process.env.NODE_ENV !== 'production') {
  amqpOptions = {
    ca: [fs.readFileSync('../../../certificates/ca_certificate.pem')],
  };
}

module.exports = { amqpsUrl, amqpOptions };
