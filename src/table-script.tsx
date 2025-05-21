import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { useMemo } from "react";
import sourceData from "./source-data.json";
import type { SourceDataType, TableDataType } from "./types";

/**
 * Example of how a tableData object should be structured.
 *
 * Each `row` object has the following properties:
 * @prop {string} person - The full name of the employee.
 * @prop {number} past12Months - The value for the past 12 months.
 * @prop {number} y2d - The year-to-date value.
 * @prop {number} may - The value for May.
 * @prop {number} june - The value for June.
 * @prop {number} july - The value for July.
 * @prop {number} netEarningsPrevMonth - The net earnings for the previous month.
 */

const tableData: TableDataType[] = (
  sourceData as unknown as SourceDataType[]
).map((dataRow, index) => {
  const employee = dataRow?.employees;
  const external = dataRow?.externals;
  const team = dataRow?.teams;

  const now = new Date();
  const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevMonthStr = prevMonth.toISOString().split("T")[0];

  const person = `${employee?.firstname ?? external?.firstname ?? team?.name} ${
      employee?.lastname ?? external?.lastname ?? ""
  }`.trim();

  const utilisation = employee?.workforceUtilisation ?? external?.workforceUtilisation ?? team?.workforceUtilisation;

  const getUtilisationByMonth = (month: string) => {
      return utilisation?.lastThreeMonthsIndividually?.find(
          (element: { month: string; utilisationRate: string }) => element.month === month
      )?.utilisationRate ?? "0";
  };

  const getNetEarningsPrevMonth = () => {
      const matchingQuarter = utilisation?.quarterEarnings?.find(
          (element: { earnings: number; start: string; name: string; end: string }) =>
              prevMonthStr >= element.start && prevMonthStr <= element.end
      );

      return matchingQuarter?.earnings ?? "0";
  };

  const row: TableDataType = {
      person: `${person}`,
      past12Months: `${parseFloat(utilisation?.utilisationRateLastTwelveMonths ?? "0")}%`,
      y2d: `${parseFloat(utilisation?.utilisationRateYearToDate ?? "0")}%`,
      may: `${parseFloat(getUtilisationByMonth("May"))}%`,
      june: `${parseFloat(getUtilisationByMonth("June"))}%`,
      july: `${parseFloat(getUtilisationByMonth("July"))}%`,
      netEarningsPrevMonth: `${getNetEarningsPrevMonth()} EUR`,
  };

  return row;
});

const Example = () => {
  const columns = useMemo<MRT_ColumnDef<TableDataType>[]>(
    () => [
      {
        accessorKey: "person",
        header: "Person",
      },
      {
        accessorKey: "past12Months",
        header: "Past 12 Months",
      },
      {
        accessorKey: "y2d",
        header: "Y2D",
      },
      {
        accessorKey: "may",
        header: "May",
      },
      {
        accessorKey: "june",
        header: "June",
      },
      {
        accessorKey: "july",
        header: "July",
      },
      {
        accessorKey: "netEarningsPrevMonth",
        header: "Net Earnings Prev Month",
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: tableData,
  });

  return <MaterialReactTable table={table} />;
};

export default Example;
