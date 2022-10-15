require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });

const amqp = require('amqplib');

const { amqpsUrl, amqpOptions } = require('../config/amqp');
const { queues } = require('../constants/rabbitmq');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const run = async () => {
  const conn = await amqp.connect(amqpsUrl, amqpOptions);

  const channel = await conn.createChannel();

  await channel.assertQueue(queues.ONE_TO_ONE, { durable: false });

  setInterval(async () => {
    const data = Math.random() > 0.5 ? 'task1.task2.task3' : 'task1';
    channel.sendToQueue(queues.ONE_TO_ONE, Buffer.from(data)); // sendToQueue is the same as publish, but it sends to a default exchange
    console.log('msg sent', data);
  }, 1000);

  await sleep(10000);

  conn.close();
};

run().finally(() => process.exit(0));
