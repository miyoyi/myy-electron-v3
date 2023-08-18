// export interface UserInfo {
//   id?: number;
//   attributionChannelId?: number;
//   createTime?: string;
//   distributionStatus?: number;
//   isFirstLogin?: number;
//   isLeader?: number;
//   isOrgLeader?: number;
//   loginIp?: string;
//   loginTime?: string;
//   mobile?: string;
//   modifyTime?: string;
//   name?: string;
//   organizationId?: number;
//   postGroupId?: number;
//   postName?: string;
//   status?: number;
//   statusName?: string;
//   username?: string;
// }
export interface UserState {
  // clientId?: string;
  // clientName?: string;
  // clientSecret?: string;
  // expire?: string;
  // memberType?: string;
  // token?: string;
  // info?: UserInfo;
  channelId?: number;
  clientSecret?: string;
  id?: number;
  isDeleted?: number;
  isLeader?: number;
  mobile?: string;
  name?: string;
  postGroupId?: number;
  status?: number;
  token?: string;
  username?: string;
}
