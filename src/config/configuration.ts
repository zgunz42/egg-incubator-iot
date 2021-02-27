export default () => ({
  wsKey: process.env.WS_KEY,
  db: {
    uri: `mongodb://${process.env.DB_DOMAIN}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  },
  redis: {
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/${process.env.REDIS_PATH}`,
  },
  mqtt: {
    host: process.env.MQTT_HOST,
    queue: process.env.MQTT_QUEUE,
  },
  motor: {
    rotateDelay: parseInt(process.env.ROTATE_DELAY, 10) || 60,
  },
  lamp: {
    upperBoundTop: parseFloat(process.env.UPPER_BOUND_TOP) || 1.5,
    upperBoundBottom: parseFloat(process.env.UPPER_BOUND_BOTTOM) || 1.5,
    lowerBoundTop: parseFloat(process.env.LOWWER_BOUND_TOP) || 1.5,
    lowerBoundBottom: parseFloat(process.env.LOWWER_BOUND_BOTTOM) || 1.5,
    maxTemperature: parseFloat(process.env.MAX_TEMPERATURE) || 25.0,
    minTemperature: parseFloat(process.env.MIN_TEMPERATURE) || 40.0,
  },
});
