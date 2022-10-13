const fs = require("fs");
const amqp = require("amqplib");

const run = async () => {
  const conn = await amqp.connect("amqps://darkwilly08:123asd456@ubuntu//", {
    ca: [
      fs.readFileSync(
        "C:/Users/darkw/Documents/NetBeansProjects/rabbitmq/certificates/ca_certificate.pem"
      ),
    ],
  });

  console.log("connection", conn);
};

run();
