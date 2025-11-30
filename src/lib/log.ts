
type LogParams = {
  requestId: string;
  userId: string;
  path: string;
  status?: number | string;
  message?: string;
};

type LogFn = (params: LogParams) => void;

function createLogger() {
  const format = ({ requestId, userId, path, status = "", message = "" }: LogParams) =>
    `req ${requestId} user ${userId} "${path}" ${status} ${message}`.trim();

  const wrap = (fn: (...args: any[]) => void): LogFn =>
    (params) => fn(format(params));

  return {
    log: wrap(console.log),
    info: wrap(console.info),
    warn: wrap(console.warn),
    error: wrap(console.error),
  };
}

const logger = createLogger();

export default logger;
