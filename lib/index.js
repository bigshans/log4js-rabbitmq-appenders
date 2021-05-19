const amqp = require('amqplib');

function rabbitmqAppender(config, layout) {
  const host = config.host || '127.0.0.1';
  const port = config.port || 5672;
  const username = config.username || 'guest';
  const password = config.password || 'guest';
  const exchange = config.exchange || 'log';
  const type = config.mq_type || 'direct';
  const durable = config.durable || false;
  const routingKey = config.routing_key || 'logstash';
  const vhost = config.vhost || '/';
  const shutdownTimeout = config.shutdownTimeout || 10000;
  const formatter = typeof config.formatter === 'function'
    ? config.formatter
    : loggingEvent => layout(loggingEvent);
  const con = {
    protocol: 'amqp',
    hostname: host,
    port: port,
    username: username,
    password: password,
    locale: 'en_US',
    frameMax: 0,
    heartbeat: 0,
    vhost: vhost,
    routing_key: routingKey,
    exchange: exchange,
    mq_type: type,
    durable: durable,
  };
  let messagesToSend = [];
  let promisesWaiting = 0;
  let connection;

  const send = async messages => {
    try {
      promisesWaiting++;
      if (!connection) {
        connection = await amqp.connect(con);
      }
      const ch = await connection.createChannel();
      ch.assertExchange(exchange, type);
      for(const msg of messages) {
        ch.publish(exchange, routingKey, Buffer.from(msg));
      }
      promisesWaiting--;
    } catch(e) {
      console.error(e);
    }
  };

  const publish = message => {
    if (message) {
      messagesToSend.push(message);
    }
    if (messagesToSend.length > 0) {
      const snapshot = messagesToSend;
      messagesToSend = [];
      send(snapshot);
    }
  }


  const closeConnection = (done) => {
    if (connection) {
      connection.close().then(() => {
        connection = null;
        done();
      });
      return;
    }
    done();
  };

  const waiting = () =>  promisesWaiting > 0 || messagesToSend.length > 0;

  const waitForPromises = (done) => {
    let howLongWaiting = 0;
    const checker = () => {
      publish();
      if (howLongWaiting >= shutdownTimeout) {
        closeConnection(done);
        return;
      }
      if (waiting()) {
        howLongWaiting += 50;
        setTimeout(checker, 50);
      } else {
        closeConnection(done);
      }
    };
    checker();
  };

  const appender = loggingEvent => publish(formatter(loggingEvent, layout));

  appender.shutdown = function (done) {
    waitForPromises(done);
  };

  return appender;
}

function configure(config, layouts) {
  let layout = layouts.messagePassThroughLayout;
  if (config.layout) {
    layout = layouts.layout(config.layout.type, config.layout);
  }

  return rabbitmqAppender(config, layout);
}

module.exports = {
  configure,
};
