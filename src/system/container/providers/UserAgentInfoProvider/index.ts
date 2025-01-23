import { container } from 'tsyringe';

// Interface import
import { IUserAgentInfoProvider as IUserAgentInfo } from './models/IUserAgentInfoProvider';

// Provider import
import { GeoLookupUserAgentInfo } from './implementations/GeoLookupUserAgentInfo';

const providers = {
  geolookup: new GeoLookupUserAgentInfo(),
};

container.registerInstance<IUserAgentInfo>(
  'UserAgentInfoProvider',
  providers.geolookup,
);
