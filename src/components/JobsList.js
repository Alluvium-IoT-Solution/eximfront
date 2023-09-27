import React, { useContext, useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { ClientContext } from "../Context/ClientContext";
import "../styles/job-list.scss";
import useJobColumns from "../customHooks/useJobColumns";
import { getTableRowsClassname } from "../utils/getTableRowsClassname";
import useFetchJobList from "../customHooks/useFetchJobList";
import { detailedStatusOptions } from "../assets/data/detailedStatusOptions";
import { useParams } from "react-router-dom";
// import SelectFieldsModal from "./SelectFieldsModal";
import { UserContext } from "../Context/UserContext";
import { SelectedYearContext } from "../Context/SelectedYearContext";
import { apiRoutes } from "../utils/apiRoutes";
import axios from "axios";
import { convertToExcel } from "../utils/convertToExcel";

function JobsList() {
  const { importerName } = useContext(ClientContext);
  const { user } = useContext(UserContext);
  const { selectedYear } = useContext(SelectedYearContext);
  const [headers, setHeaders] = useState([]);

  const [detailedStatus, setDetailedStatus] = useState("");
  const columns = useJobColumns(detailedStatus);
  const { rows, total, pageState, setPageState, setFilterText } =
    useFetchJobList(detailedStatus, selectedYear);
  const params = useParams();
  const { reportFieldsAPI, downloadReportAPI } = apiRoutes();

  // // Modal
  // const [openModal, setOpenModal] = React.useState(false);
  // const handleOpenModal = () => setOpenModal(true);
  // const handleCloseModal = () => setOpenModal(false);

  useEffect(() => {
    async function getReportFields() {
      const res = await axios(`${reportFieldsAPI}/${params.importer}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      });
      setHeaders(res.data);
    }
    getReportFields();
    // eslint-disable-next-line
  }, [params.importer]);

  const handleReportDownload = async () => {
    const res = await axios.get(
      `${downloadReportAPI}/${selectedYear}/${params.importer}/${params.status}`,
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      }
    );

    function customSort(a, b) {
      // Helper function to parse date strings into Date objects
      function parseDate(dateString) {
        const parts = dateString.split("-");
        return new Date(parts[0], parts[1] - 1, parts[2]);
      }

      // Extract the arrival dates from each job item
      const arrivalDatesA = a.container_nos.map(
        (container) => container.arrival_date
      );
      const arrivalDatesB = b.container_nos.map(
        (container) => container.arrival_date
      );

      // Filter out empty arrival dates
      const validArrivalDatesA = arrivalDatesA.filter((date) => date);
      const validArrivalDatesB = arrivalDatesB.filter((date) => date);

      // If there are valid arrival dates in both job items, compare the earliest dates
      if (validArrivalDatesA.length > 0 && validArrivalDatesB.length > 0) {
        const earliestDateA = new Date(
          Math.min(...validArrivalDatesA.map(parseDate))
        );
        const earliestDateB = new Date(
          Math.min(...validArrivalDatesB.map(parseDate))
        );

        // Compare the dates as Date objects
        if (earliestDateA < earliestDateB) {
          return -1;
        } else if (earliestDateA > earliestDateB) {
          return 1;
        } else {
          return 0;
        }
      }

      // If only one job item has valid arrival dates, it comes first
      if (validArrivalDatesA.length > 0) {
        return -1;
      }
      if (validArrivalDatesB.length > 0) {
        return 1;
      }

      // If neither job item has valid arrival dates, leave them in their original order
      return 0;
    }

    // Sort the job items using the custom sorting function
    const sortedJobItems = res.data.sort(customSort);

    convertToExcel(
      sortedJobItems,
      importerName,
      params.status,
      detailedStatus,
      headers
    );
  };

  return (
    <>
      <div className="jobs-list-header">
        <h5>{user.role !== "Executive" ? importerName : user.importer}</h5>
        <input
          type="text"
          placeholder="Search Jobs"
          onChange={(e) => setFilterText(e.target.value)}
        />
        <select
          name="status"
          onChange={(e) => setDetailedStatus(e.target.value)}
        >
          {detailedStatusOptions.map((option) => (
            <option key={option.id} value={option.value}>
              {option.name}
            </option>
          ))}
        </select>

        <button
          onClick={() => handleReportDownload()}
          style={{ cursor: "pointer" }}
          aria-label="export-btn"
        >
          Export
        </button>
      </div>

      <DataGrid
        getRowId={(row) => row.job_no}
        sx={{
          padding: "0 30px",
          height: "600px",
          "& .MuiDataGrid-row:hover": {
            backgroundColor: "#f8f5ff",
          },
        }}
        className="table expense-table"
        headerAlign="center"
        rows={rows}
        columns={columns}
        stickyHeader
        rowCount={total}
        loading={pageState.isLoading}
        rowsPerPageOptions={[25]}
        getRowHeight={() => "auto"}
        pagination
        page={pageState.page - 1}
        pageSize={25}
        paginationMode="server"
        onPageChange={(newPage) => {
          setPageState((old) => ({ ...old, page: newPage + 1 }));
        }}
        autoHeight={false}
        disableSelectionOnClick
        getRowClassName={getTableRowsClassname}
        disableColumnMenu
      />

      {/* <SelectFieldsModal
        openModal={openModal}
        handleOpenModal={handleOpenModal}
        handleCloseModal={handleCloseModal}
        rows={rows}
        importerName={user.role !== "User" ? importerName : user.importer}
        status={params.status}
        detailedStatus={detailedStatus}
      /> */}
    </>
  );
}

export default JobsList;
