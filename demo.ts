import { configure, getLogger } from "log4js";
import { RabbitmqAppenders } from ".";

configure({
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
      timeout: 100000,
      layout: {
        type: "pattern",
        pattern: "%m",
      },
      formatter(loggingEvent: any, layout: any) {
        return JSON.stringify({
          level: loggingEvent.levelStr,
          data: layout(loggingEvent),
          categoryName: loggingEvent.categoryName,
        });
      },
    },
  },
  categories: { default: { appenders: ["mq"], level: "info" } },
});

const logger = getLogger();
logger.info("hello");
