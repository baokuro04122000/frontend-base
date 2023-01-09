import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "..";

export const selectContracts = (state: RootState) => state.contracts;

export const selectContractsList = createSelector(
  selectContracts,
  (contracts) => {
    return contracts.contracts;
  }
);
