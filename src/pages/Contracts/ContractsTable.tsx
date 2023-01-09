import { Table } from "antd";
import { ColumnsType, TablePaginationConfig } from "antd/lib/table";
import { Contract } from "../../api/openapi-generator";
import { useAppSelector, useAppDispatch } from "../../store";
import { v4 as uuidv4 } from "uuid";
import { useCallback, useEffect } from "react";
import { FilterValue, SorterResult } from "antd/lib/table/interface";
import { actionGetContracts } from "../../store/contracts/action";
import {
  setContracts,
  setContractsPagination,
} from "../../store/contracts/slice";

const columns: ColumnsType<Contract> = [
  {
    title: "ID",
    dataIndex: "id",
    width: "5%",
    // sorter: true,
  },
  {
    title: "CODE",
    dataIndex: "code",
    width: "15%",
    // sorter: true,
  },
  {
    title: "VENDOR",
    dataIndex: "supply_vendor_name",
    width: "30%",
    // sorter: true,
  },
  {
    title: "BASE AMOUNT",
    dataIndex: "base_amount",
    width: "15%",
    // sorter: true,
  },
  {
    title: "ACTUAL AMOUNT",
    dataIndex: "actual_amount",
    width: "15%",
    // sorter: true,
  },
  {
    title: "START DATE",
    dataIndex: "start_date",
    width: "10%",
    render: (value) => new Date(value).toLocaleDateString(),
    // sorter: true,
  },
  {
    title: "END DATE",
    dataIndex: "end_date",
    width: "10%",
    render: (value) => new Date(value).toLocaleDateString(),
    // sorter: true,
  },
];

const ContractsTable = () => {
  const contracts = useAppSelector(({ contracts }) => contracts.contracts);
  const loading = useAppSelector(({ contracts }) => contracts.contractsLoading);
  const pagination = useAppSelector(
    ({ contracts }) => contracts.contractsPagination
  );

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(actionGetContracts());
    return () => {
      dispatch(setContractsPagination(undefined));
      dispatch(setContracts([]));
    };
  }, [dispatch]);

  const handlePagination = useCallback(
    (
      pagination: TablePaginationConfig,
      _filter: Record<string, FilterValue | null>,
      sorter: SorterResult<Contract> | SorterResult<Contract>[]
    ) => {
      // Allow sort only 1 column
      if (Array.isArray(sorter)) return;

      dispatch(actionGetContracts(pagination, undefined, sorter));
    },
    [dispatch]
  );

  return (
    <div>
      <Table
        dataSource={contracts}
        loading={loading}
        columns={columns}
        rowKey={() => uuidv4()}
        pagination={pagination}
        onChange={handlePagination}
        scroll={{ x: 700 }}
      />
    </div>
  );
};

export default ContractsTable;
