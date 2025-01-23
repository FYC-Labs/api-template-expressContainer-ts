import geo from 'geoip-lite';

// DTO import
import { IAgentInfoDTO } from '../dtos/IAgentInfoDTO';
import { IParsedUserAgentInfoDTO } from '../dtos/IParsedUserAgentInfoDTO';

// Provider import
import { IUserAgentInfoProvider } from '../models/IUserAgentInfoProvider';

class GeoLookupUserAgentInfo implements IUserAgentInfoProvider {
  async lookup(
    requester: IAgentInfoDTO,
  ): Promise<IParsedUserAgentInfoDTO | undefined> {
    const localhost = requester.ip === '127.0.0.1' || requester.ip === '::1';

    if (!requester) return undefined;

    const data = {
      desktop: requester.isDesktop,
      mobile: requester.isMobile,
      ip: requester.ip,
      ip_info:
        localhost || requester.ip === undefined
          ? null
          : geo.lookup(requester.ip),
      browser_name: requester.browser?.name,
      browser_version: requester.browser?.version,
      origin_host: requester.origin?.host,
      origin_url: requester.origin?.url,
      os: requester.os,
      platform: requester.platform,
    } as IParsedUserAgentInfoDTO;
    return data;
  }
}

export { GeoLookupUserAgentInfo };
