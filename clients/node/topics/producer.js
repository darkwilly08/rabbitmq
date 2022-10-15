require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });

const amqp = require('amqplib');

const { amqpsUrl, amqpOptions } = require('../config/amqp');
const { exchanges, exchangeTypes } = require('../constants/rabbitmq');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const logs = [
  {
    app: 'dmark',
    severity: 'info',
    message: 'This is an info message',
  },
  {
    app: 'dmark',
    severity: 'warning',
    message: 'This is a warning message',
  },
  {
    app: 'ebeer',
    severity: 'error',
    message: 'This is an error message',
  },
  {
    app: 'radars',
    severity: 'info',
    message: 'This is another info message',
  },
];

const run = async () => {
  const conn = await amqp.connect(amqpsUrl, amqpOptions);

  const channel = await conn.createChannel();

  channel.assertExchange(exchanges.LOGS_PERSISTENT, exchangeTypes.TOPIC, { durable: true });

  for (const log of logs) {
    const { severity, app } = log;
    channel.publish(exchanges.LOGS, `${app}.${severity}`, Buffer.from(JSON.stringify(log)));
    console.count('msg sent');
    await sleep(1000);
  }

  await sleep(10000);

  conn.close();
};

run()
  .catch((e) => console.error(e))
  .finally(() => process.exit(0));
