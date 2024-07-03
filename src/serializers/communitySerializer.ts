import mongoose from "mongoose";

export interface addCommunityRequest {
  name: string,
  memberList : {
    member: string,
    role: string,
  }[]
}
export function communitySerializer(data: addCommunityRequest) {
  
  const finalFilters = {
    name: data.name,
    memberList : data.memberList
  };
  return finalFilters;
}
