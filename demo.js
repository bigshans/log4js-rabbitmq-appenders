const log4js = require('log4js');
const { RabbitmqAppenders } = require('./index');

log4js.configure({
  appenders: {
    mq: {
      type: RabbitmqAppenders,
      host: '127.0.0.1',
      port: 5672,
      username: '',
      password: '',
      routing_key: 'log',
      exchange: 'log',
      mq_type: 'direct',
      durable: true
    }
  },
  categories: { default: { appenders: ['mq'], level: 'info' } }
});

const log = log4js.getLogger();

log.info('hello');
