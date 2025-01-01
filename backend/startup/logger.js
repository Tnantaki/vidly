import winston from 'winston'

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  // format: winston.format.printf((err) => err.message),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logfile.log', level: 'error' })
  ]
});

export default logger