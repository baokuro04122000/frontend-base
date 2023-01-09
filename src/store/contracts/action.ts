import { SorterResult, TablePaginationConfig } from "antd/lib/table/interface";
import { AppThunk } from "..";
import { Contract } from "../../api/openapi-generator";
import { responseToTablePagination } from "../../utils";
import {
  setContracts,
  setContractsLoading,
  setContractsPagination,
} from "./slice";
import { ContractsQuery } from "../../interfaces/api";
import { getContracts } from "../../api/contract";

export const actionGetContracts = (
  _pagination?: TablePaginationConfig,
  _query?: ContractsQuery[],
  sort?: SorterResult<Contract>
): AppThunk<Promise<void>> => {
  return async (dispatch, getState) => {
    try {
      dispatch(setContractsLoading(true));
      let query: ContractsQuery[] | undefined = undefined;
      const queryActualAmount =
        getState().contracts.contractsFilterActualAmount;
      const queryCode = getState().contracts.contractsFilterCode;
      if (_query) {
        query = _query;
      } else if (queryActualAmount || queryCode) {
        query = [];
        if (queryActualAmount) query.push(queryActualAmount);
        if (queryCode) query.push(queryCode);
      }
      const pagination =
        _pagination || getState().contracts.contractsPagination;

      const { data } = await getContracts({ pagination, query, sort });

      const convertedPagination = responseToTablePagination(data);

      dispatch(setContracts(data?.list || []));
      dispatch(setContractsPagination(convertedPagination));
    } catch (error) {
      console.error("CAN'T GET CONTRACTS");
    } finally {
      dispatch(setContractsLoading(false));
    }
  };
};
