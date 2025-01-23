import { i18n, TFunction } from 'i18next';

// DTO import
import { IParsedUserAgentInfoDTO } from '@system/container/providers/UserAgentInfoProvider/dtos/IParsedUserAgentInfoDTO';

declare global {
  namespace Express {
    interface Request {
      // i18n
      t: TFunction;
      i18n: i18n;
      language: string;
      languages: string[];

      // User information
      agent_info?: IParsedUserAgentInfoDTO;

      // User
      userData?: User;
    }
  }
}

export {};
