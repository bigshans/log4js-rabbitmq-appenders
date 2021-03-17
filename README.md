# log4js-rabbitmq-appenders

This package is fork from [@log4js-node/rabbitmq](https://github.com/log4js-node/rabbitmq) . That package has been unmaintained for a long time so I fix some bug here.

## Configuration

Same as [@log4js-node/rabbitmq](https://github.com/log4js-node/rabbitmq) .

- `type` - `@log4js-ndoe/rabbitmq`
- `host` - `string` (optional, defaults to `127.0.0.1`) - the location of the rabbitmq server
- `port` - `integer` (optional, defaults to `5672`) - the port the rabbitmq server is listening on
- `username` - `string` (optional, defaults to `guest`) - username to use when authenticating connection to rabbitmq
- `password` - `string` (optional, defaults to `guest`) - password to use when authenticating connection to rabbitmq
- `routing_key` - `string` (optional, defaults to `logstash`) - rabbitmq message's routing_key
- `durable` - `string` (optional, defaults to false) - will that RabbitMQ lose our queue.
- `exchange` - `string` (optional, defaults to `log`)- rabbitmq send message's exchange
- `mq_type` - `string` (optional, defaults to `direct`) - rabbitmq message's mq_type
- `vhost` - `string` (optional, defaults to `/`) - vhost to use
- `layout` - `object` (optional, defaults to `messagePassThroughLayout`) - the layout to use for log events (see [layouts](https://github.com/log4js-node/rabbitmq/blob/master/layouts.md)).
- `shutdownTimeout` - `integer` (optional, defaults to `10000`) - maximum time in milliseconds to wait for messages to be sent during log4js shutdown.

The appender will use the RabbitMQ Routing model command to send the log event messages to the channel.

## Example

CommonJS:

```javascript
const log4js = require('log4js');
const { RabbitmqAppenders } = require('log4js-rabbitmq-appenders');

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
```

TypeScript:

```typescript
import { configure, getLogger } from 'log4js';
import { RabbitmqAppenders } from 'log4js-rabbitmq-appenders';

configure({
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
          durable: true,
          timeout: 100000,
        }
      },
      categories: { default: { appenders: ['mq'], level: 'info' } }
});

const logger = getLogger();
logger.info('hello');
```

