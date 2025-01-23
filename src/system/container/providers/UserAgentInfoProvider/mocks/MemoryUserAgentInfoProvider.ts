/* eslint-disable @typescript-eslint/ban-types */
// Interface import
import { IUserAgentInfoProvider } from '../models/IUserAgentInfoProvider';

// Interfaces
interface IBrowser {
  name: string;
  version: string;
}

interface IOrigin {
  host: string;
  url: string;
}

interface IRequest {
  isMobile: boolean;
  isDesktop: boolean;
  ip: string;
  browser: IBrowser;
  origin: IOrigin;
  os: string;
  platform: string;
}

interface IResponse {
  desktop: boolean;
  mobile: boolean;
  ip: string;
  ip_info: object | string | null;
  browser_name: string;
  browser_version: string;
  origin_host: string;
  origin_url: string;
  os: string;
  platform: string;
}

class MemoryUserAgentInfoProvider implements IUserAgentInfoProvider {
  async lookup(requester: IRequest): Promise<IResponse> {
    const localhost = requester.ip === '127.0.0.1' || requester.ip === '::1';

    const data = {
      desktop: requester.isDesktop,
      mobile: requester.isMobile,
      ip: requester.ip,
      ip_info: localhost ? '127.0.0.1' : null,
      browser_name: requester.browser.name,
      browser_version: requester.browser.version,
      origin_host: requester.origin.host,
      origin_url: requester.origin.url,
      os: requester.os,
      platform: requester.platform,
    };
    return data;
  }
}

export { MemoryUserAgentInfoProvider };
