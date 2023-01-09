import {
  ContractListResponse,
  RoleListResponse,
  UserCredentialResponse,
  UserListResponse,
} from "./openapi-generator";
import users from "./users.json";
import contracts from "./contracts.json";

export const createFakeApi = <T>(
  waitTime: number,
  returnValue: { data: T }
) => {
  return new Promise<{ data: T }>((resolve) => {
    setTimeout(() => resolve(returnValue), waitTime);
  });
};

export const fakeLogin = () => {
  const returnValue: UserCredentialResponse = {
    access_token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NjI0NjAzNjgsImlhdCI6MTY2MTg1NTU2OCwiaXNzIjoiaHR0cDovL21zZi50cHB0ZWNobm9sb2d5LmNvbSIsIm5iZiI6MTY2MTg1NTU2OCwiY29udGV4dCI6eyJpZCI6NCwiZnVsbF9uYW1lIjoiVG9tIEhvbGxhbmQiLCJlbWFpbCI6ImFkbWluLnNwZ3RwcEBnbWFpbC5jb20iLCJpc19hZG1pbiI6dHJ1ZSwicm9sZXMiOltdLCJvcmdzIjp7ImlkIjoxLCJuYW1lIjoiU1BHIENvbXBhbnkifX19.E14SdyrouCG_IEC4XvQDzOYRTZJvTJa4sx7hDE28NMo",
    data: {
      id: 4,
      full_name: "Tom Holland",
      email: "admin.spgtpp@gmail.com",
      is_admin: true,
      roles: [],
      orgs: {
        id: 1,
        name: "SPG Company",
      },
    },
  };
  return createFakeApi(300, { data: returnValue });
};

// export const fakeGetUsers = (
//   _q?: string | undefined,
//   offset?: number | undefined,
//   limit?: number | undefined,
//   _sortBy?: string | undefined,
//   _orderBy?: string | undefined
// ) => {
//   const returnValue: UserListResponse = {
//     total: users.length,
//     limit: limit || 10,
//     offset: offset || 0,
//     list: users,
//   };
//   return createFakeApi(300, { data: returnValue });
// };

export const fakeGetRoles = () => {
  const returnValue: RoleListResponse = {
    list: [
      { id: 1, name: "Admin" },
      { id: 2, name: "Sales Admin" },
      // { id: 3, name: "Supply Vendor" },
    ],
  };
  return createFakeApi(300, { data: returnValue });
};

export const fakeGetContracts = () => {
  const returnValue: ContractListResponse = {
    total: users.length,
    limit: 10,
    offset: 0,
    list: contracts,
  };
  return createFakeApi(300, { data: returnValue });
};
