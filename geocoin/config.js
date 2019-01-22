const env = process.env;

export const nodeEnv = env.NODE_ENV || 'development';

export const logStars = function(message) {
  console.info('**********');
  console.info(message);
  console.info('**********');
};

export default {
  // mongodbUri: 'mongodb://shaune:887536@178.62.40.252:27017/geocoinDB',
  mongodbUri: 'mongodb://localhost:27017/geocoinDB', /* Need to get this secured*/
  port: env.PORT || 3655,
  host: env.HOST || '0.0.0.0',
  get serverUrl() {
    return `http://${this.host}:${this.port}`;
  }
};
