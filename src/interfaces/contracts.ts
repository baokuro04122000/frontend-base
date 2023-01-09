import { TablePaginationConfig } from "antd";
import { Contract } from "../api/openapi-generator";
import { ContractsQuery } from "./api";

export interface ContractsSlice {
  contracts: Contract[];
  contractsLoading: boolean;
  contractsPagination?: TablePaginationConfig;
  contractsFilterActualAmount?: ContractsQuery;
  contractsFilterCode?: ContractsQuery;
}
