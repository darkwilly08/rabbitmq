var mqtt = require('mqtt');

const mqttUrl = process.env.MQTT_URL;
const options = {
  clientId: 'client01',
  clean: false,
  reconnectPeriod: 1000,
  username: 'zmmvpldj:zmmvpldj',
  password: 'm6rxSYcVGJHyy7DFA4thlxnMkTE_eicM',
};

var mqttClient = null;
let callback = null;

const topics = ['#'];

module.exports = {
  connect: () => {
    if (mqttClient == null || (mqttClient.connected === false && mqttClient.reconnecting === false)) {
      mqttClient = mqtt.connect(mqttUrl, options);
      mqttClient.on('connect', () => {
        console.log('mqtt connection established');
        mqttClient.on('message', (topic, message) => {
          console.log('queue messages', Buffer.from(message).toString());
          if (callback !== null) {
            callback(topic, message);
          }
        });
      });
      mqttClient.on('error', (err) => {
        console.error('mqtt connection error', err);
      });
    }
  },
  closeConnection: () => {
    if (mqttClient != null) {
      mqttClient.end();
      realTimeSubscription = null;
    }
  },
  subscribePersistentData: () => {
    if (mqttClient !== null) {
      topics.forEach((val) => {
        mqttClient.subscribe(val, { qos: 1 }, (err) => {
          if (!err) {
            console.log(`subscribed to ${val}`);
          }
        });
      });
    }
  },
  unsubscribePersistentData: () => {
    if (mqttClient !== null) {
      constants.TOPICS.forEach((val) => {
        mqttClient.unsubscribe(val, (err) => {
          if (!err) {
            console.log(`topic listener removed - ${val}`);
          }
        });
      });
    }
  },
  setCallback: (call) => {
    callback = call;
  },
  publish: (topic, message) => {
    if (mqttClient !== null) {
      mqttClient.publish(topic, message, null, (err) => {
        console.log(err);
      });
    }
  },
};
