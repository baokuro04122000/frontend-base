import { TablePaginationConfig } from "antd";
import { SorterResult } from "antd/lib/table/interface";

import baseClient, { BASE_URL } from "../api/baseClient";
import { AuthApiFactory, Configuration, UserCredentialResponse } from "../api/openapi-generator";
import { AUTH_USER_DATA_LS_ITEM } from "../constants/authentication";


import {
  RequestSearchParams,
  DefaultResponse,
  Query,
  FilterApiParams,
  FilterQuery,
} from "../interfaces/api";

export const responseToTablePagination = (
  response: DefaultResponse
): TablePaginationConfig => {
  const { limit, offset, total } = response;
  let current: number | undefined = undefined;
  if (offset !== undefined && limit !== undefined) {
    current = offset + 1;
  }
  return {
    total,
    pageSize: limit,
    current,
  };
};

export const tablePaginationToRequest = (
  pagination?: TablePaginationConfig
): RequestSearchParams => {
  if (!pagination) return {};
  const { current, pageSize } = pagination;
  let offset: number | undefined = undefined;
  if (current !== undefined && pageSize !== undefined) {
    offset = (current - 1) ;
  }
  return {
    limit: pageSize,
    offset,
  };
};

export const tableSorterToRequest = <T = { [key: string]: unknown }>(
  sorter?: SorterResult<T>
): RequestSearchParams => {
  if (!sorter) return {};
  const { field, order } = sorter;

  return {
    sort_by: field?.toString(),
    order_by: order ? order.toString() : undefined,
  };
};

export const filtersToRequest = <T>(
  filters?: FilterApiParams<T>
): RequestSearchParams => {
  const { offset, limit } = tablePaginationToRequest(filters?.pagination);
  const { sort_by, order_by } = tableSorterToRequest(filters?.sort);
  const filter = filterToSearchParams(filters?.query);

  return { offset, limit, sort_by, order_by, filter };
};

export const ObjectToSearchParams = (query?: Query, parentObjKey?: string) => {
  if (!query) return undefined;
  let searchParams = new URLSearchParams();
  const _parentObjKey = parentObjKey ? parentObjKey + "." : "";
  for (const [rootKey, rootValue] of Object.entries(query)) {
    const appendKey = _parentObjKey + rootKey;
    if (typeof rootValue !== "object" || rootValue === null) {
      let appendValue;
      if (rootValue === null) {
        appendValue = "null";
      } else if (rootValue === undefined) {
        appendValue = "undefined";
      } else {
        appendValue = rootValue.toString();
      }
      searchParams.append(appendKey, appendValue);
    } else if (!Array.isArray(rootValue)) {
      const nestedObjParams = new URLSearchParams(
        ObjectToSearchParams(rootValue, appendKey)
      );
      searchParams = new URLSearchParams({
        ...Object.fromEntries(searchParams),
        ...Object.fromEntries(nestedObjParams),
      });
    } else {
      for (let i = 0; i < rootValue.length; i++) {
        const nestArrayParams = new URLSearchParams(
          ObjectToSearchParams({ [i]: rootValue[i] }, appendKey)
        );
        searchParams = new URLSearchParams({
          ...Object.fromEntries(searchParams),
          ...Object.fromEntries(nestArrayParams),
        });
      }
    }
  }

  return searchParams;
};

export const filterToSearchParams = (filters?: FilterQuery[]) => {
  if (!filters) return undefined;
  let searchParams = new URLSearchParams();

  for (let i = 0; i < filters.length; i++) {
    const filter = filters[i];
    const nestedParams = ObjectToSearchParams(filter, `filters.${i}`);
    if (!nestedParams) continue;
    searchParams = new URLSearchParams({
      ...Object.fromEntries(searchParams),
      ...Object.fromEntries(nestedParams),
    });
  }

  return searchParams;
};

export const firstLetterUppercase = (text: string): string => {
  text.toLowerCase()
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export const getAccessTokenFromLocalStorage = (name: string) => {
  const authData  = localStorage.getItem(name)
  if(!authData) return 
  const parsedUserData: UserCredentialResponse = JSON.parse(authData);
  return parsedUserData.access_token
}

export const formatTime = (time: string) => {
  const date: Date = new Date(time)
  const dateString = date.toDateString().split(" ")
  const timeString = date.toLocaleTimeString().split(" ")  
  return `${dateString[1]} ${dateString[2]}, ${dateString[3]} ${timeString[0]} ${timeString[1]}`
}
export const isEmpty = (obj: any) => {
  for(const prop in obj) {
    if(Object.prototype.hasOwnProperty.call(obj, prop)) {
      return false;
    }
  }

  return JSON.stringify(obj) === JSON.stringify({});
}
