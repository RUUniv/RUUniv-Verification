import { utilities } from 'nest-winston';
import { transports } from 'winston';
import * as winston from 'winston';
import * as winstonDaily from 'winston-daily-rotate-file';

const appName = 'RUUNIV';
const isProduction = process.env.NODE_ENV;
const logDir = __dirname + '/../../logs';

export const dailyOptions = (level: string) => {
  return {
    level,
    datePattern: 'YYYY-MM-DD',
    dirname: logDir + `/${level}`,
    filename: `%DATE%.${level}.log`,
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
  };
};

export const winstonTransports = [
  new transports.Console({
    level: isProduction === 'production' ? 'info' : 'silly',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.ms(),
      utilities.format.nestLike(appName, { colors: true, prettyPrint: true }),
    ),
  }),
  new winstonDaily(dailyOptions('info')),
  new winstonDaily(dailyOptions('warn')),
  new winstonDaily(dailyOptions('error')),
];
