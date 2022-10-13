const fs = require("fs");
const amqp = require("amqplib");
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

const amqpsUrl = process.env.AMQPS_URL;
let amqpOptions = null;
if (process.env.NODE_ENV !== "production") {
  amqpOptions = {
    ca: [
      fs.readFileSync(
        "C:/Users/darkw/Documents/NetBeansProjects/rabbitmq/certificates/ca_certificate.pem"
      ),
    ],
  };
}

const run = async () => {
  const conn = await amqp.connect(amqpsUrl, amqpOptions);

  console.log("connection", conn);
};

run();
