// Util import
import { sleep } from '../sleep';

// Interfaces
interface IParams {
  actionName: string;
  action: () => Promise<any>;
  attempt?: number;
  delay?: number;
}

const executeAction = async (params: IParams): Promise<any> => {
  const { actionName, action, attempt = 1 } = params;

  try {
    const result = await action();
    console.log(
      attempt > 1
        ? `🆗 ${actionName} success with attempt ${attempt} ❎. `
        : `🆗 ${actionName} success.`,
    );
    return result;
  } catch (err: any) {
    if (attempt > 5) {
      throw new Error(
        `❌ ${actionName} failure after ${attempt - 1} retries. ${
          err?.message
        }`,
      );
    }

    console.log(
      `❌ ${actionName} attempt ${attempt} failed. 🔄 Retrying... ${err.message} `,
    );
    await sleep(params.delay || 5000);
    return executeAction({
      ...params,
      attempt: attempt + 1,
    });
  }
};

export { executeAction };
