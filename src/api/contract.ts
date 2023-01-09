import { FilterApiParams } from "../interfaces/api";
import { filtersToRequest } from "../utils";
import baseClient, { BASE_URL } from "./baseClient";
import { ContractApiFactory } from "./openapi-generator";

const contractApiFactory = ContractApiFactory(undefined, BASE_URL, baseClient);

export const getContracts = <T>(filters?: FilterApiParams<T>) => {
  const { filter, offset, limit, sort_by, order_by } = filtersToRequest(filters);
  return contractApiFactory.contractsGet(
    undefined,
    offset,
    limit,
    sort_by,
    order_by,
    { params: filter }
  );
};

export const getContractById = (contractId: number) => {
  return contractApiFactory.contractsContractIdGet(contractId);
};
