require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });

const amqp = require('amqplib');

const { amqpsUrl, amqpOptions } = require('../config/amqp');
const { queues } = require('../constants/rabbitmq');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const run = async () => {
  const conn = await amqp.connect(amqpsUrl, amqpOptions);

  const channel = await conn.createChannel();

  await channel.assertQueue(queues.ONE_TO_ONE, { durable: false });

  channel.prefetch(1); // 1 message at a time, until it is acknowledged. This is also util for synchronous processing
  channel.consume(
    queues.ONE_TO_ONE,
    async (msg) => {
      const data = msg.content.toString();
      console.log('msg', data);

      const taskCount = data.split('.').length;

      console.log('taskCount', taskCount);
      await sleep(taskCount * 1000);
      console.log('task done', data);
      channel.ack(msg);
    },
    // If false you need to call channel.ack(msg) to acknowledge the message
    { noAck: false },
  );

  console.log('consumer started');
};

run().finally();
