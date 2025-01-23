/* eslint-disable @typescript-eslint/ban-types */
export interface IParsedUserAgentInfoDTO {
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
