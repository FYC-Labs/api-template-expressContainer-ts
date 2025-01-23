interface IAppError {
  key: string;
  message: string;
  statusCode?: number;
  debug?: {
    [key: string]: any;
  };
}

class AppError {
  public readonly key: string;

  public readonly message: string;

  public readonly statusCode: number;

  public readonly debug:
    | {
        [key: string]: any;
      }
    | undefined;

  public readonly errorCode: string;

  public readonly action: Promise<void>;

  constructor(params: IAppError) {
    this.key = params.key;
    this.message = params.message;
    this.statusCode = params.statusCode || !!params.debug ? 500 : 400;
    this.debug = params.debug;
  }
}

export { AppError };
