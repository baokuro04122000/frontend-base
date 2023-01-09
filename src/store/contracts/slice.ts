import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TablePaginationConfig } from "antd";
import { Contract } from "../../api/openapi-generator";
import { ContractsQuery } from "../../interfaces/api";
import { ContractsSlice } from "../../interfaces/contracts";

const initialState: ContractsSlice = {
  contracts: [],
  contractsLoading: false,
  contractsPagination: undefined,
  contractsFilterActualAmount: undefined,
  contractsFilterCode: undefined,
};

export const contractsSlice = createSlice({
  name: "contracts",
  initialState,
  reducers: {
    setContracts(state, action: PayloadAction<Contract[]>) {
      state.contracts = action.payload;
    },
    setContractsLoading(state, action: PayloadAction<boolean>) {
      state.contractsLoading = action.payload;
    },
    setContractsPagination(
      state,
      action: PayloadAction<TablePaginationConfig | undefined>
    ) {
      state.contractsPagination = action.payload;
    },
    setContractsFilterActualAmount(
      state,
      action: PayloadAction<ContractsQuery | undefined>
    ) {
      state.contractsFilterActualAmount = action.payload;
    },
    setContractsFilterCode(
      state,
      action: PayloadAction<ContractsQuery | undefined>
    ) {
      state.contractsFilterCode = action.payload;
    },
  },
});

export const {
  setContracts,
  setContractsLoading,
  setContractsPagination,
  setContractsFilterActualAmount,
  setContractsFilterCode,
} = contractsSlice.actions;

export default contractsSlice.reducer;
