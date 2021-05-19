const log4js = require("log4js");
const { RabbitmqAppenders } = require("./index");

log4js.configure({
  appenders: {
    mq: {
      type: RabbitmqAppenders,
      host: "127.0.0.1",
      port: 5672,
      username: "",
      password: "",
      routing_key: "log",
      exchange: "log",
      mq_type: "direct",
      durable: true,
      layout: {
        type: "pattern",
        pattern: '%m',
      },
      formatter(loggingEvent, layout) {
        return JSON.stringify(
          {
            level: loggingEvent.level.levelStr, msg: layout(loggingEvent),
            categoryName: loggingEvent.categoryName,
          }
        );
      },
    },
    out: {
      type: "console",
    },
  },
  categories: { default: { appenders: ["mq", "out"], level: "info" } },
  disableClustering: true,
});

const log = log4js.getLogger();

log.info("hello" + 1);
log.info("fuck" + 2);
log.info("fuck" + 3);
log.info("fuck" + 4);
log.info("fuck" + 5);
log.info("fuck" + 6);
log.info('fu"c"k' + 7);

(async () => log.info('punk1'))();
(async () => log.info('punk2'))();
(async () => log.info('punk3'))();
