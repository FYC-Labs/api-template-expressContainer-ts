// DTO import
import { IAgentInfoDTO } from '../dtos/IAgentInfoDTO';
import { IParsedUserAgentInfoDTO } from '../dtos/IParsedUserAgentInfoDTO';

export interface IUserAgentInfoProvider {
  lookup(
    requester: IAgentInfoDTO,
  ): Promise<IParsedUserAgentInfoDTO | undefined>;
}
