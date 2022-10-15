require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });

const mqtt = require('../config/mqtt');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const run = async () => {
  mqtt.connect();

  await sleep(1000);

  mqtt.subscribePersistentData();

  mqtt.setCallback((topic, message) => {
    console.log(topic, message.toString());
  });

  await sleep(100000);
};

run()
  .catch((err) => console.error(err))
  .finally(() => process.exit(0));
