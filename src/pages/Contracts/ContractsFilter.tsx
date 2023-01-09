import { Button, Input, InputNumber } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import {
  setContractsFilterActualAmount,
  setContractsFilterCode,
} from "../../store/contracts/slice";
import { actionGetContracts } from "../../store/contracts/action";
import { ContractsQuery } from "../../interfaces/api";
import FilterWrapper from "../../components/FilterWrapper";

const ContractsFilter = () => {
  const [code, setCode] = useState("");
  const [actualAmount, setActualAmount] = useState<number | string>("");

  const dispatch = useAppDispatch();

  const pagination = useAppSelector(
    ({ contracts }) => contracts.contractsPagination
  );

  const actualAmountQuery: ContractsQuery | undefined = useMemo(
    () =>
      actualAmount === ""
        ? undefined
        : {
            key: "actual_amount",
            operator: "ge",
            value: actualAmount,
          },
    [actualAmount]
  );

  const codeQuery: ContractsQuery | undefined = useMemo(
    () =>
      code === ""
        ? undefined
        : {
            key: "code",
            operator: "like",
            value: code,
          },
    [code]
  );

  const query = useMemo(
    () =>
      [actualAmountQuery, codeQuery].filter(
        (item) => item !== undefined
      ) as ContractsQuery[],
    [actualAmountQuery, codeQuery]
  );

  const handleSubmit = useCallback(() => {
    dispatch(setContractsFilterActualAmount(actualAmountQuery));
    dispatch(setContractsFilterCode(codeQuery));

    // When search, set pagination back to page 1
    dispatch(actionGetContracts({ ...pagination, current: 1 }, query));
  }, [actualAmountQuery, codeQuery, dispatch, pagination, query]);

  useEffect(() => {
    return () => {
      dispatch(setContractsFilterActualAmount(undefined));
      dispatch(setContractsFilterCode(undefined));
    };
  }, [dispatch]);

  return (
    <FilterWrapper label="Contract Filter">
      <>
        <Input
          placeholder="Contract Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          style={{ flex: 1 }}
        />
        <InputNumber
          min="0"
          style={{ flex: 1 }}
          placeholder="Actual Amount"
          value={actualAmount}
          onChange={(e) => setActualAmount(e ?? "")}
        />
        <Button type="primary" onClick={handleSubmit}>
          Search
        </Button>
      </>
    </FilterWrapper>
  );
};

export default ContractsFilter;
