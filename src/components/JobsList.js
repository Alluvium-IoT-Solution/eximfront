import React, { useContext, useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { ClientContext } from "../Context/ClientContext";
import "../styles/job-list.scss";
import useJobColumns from "../customHooks/useJobColumns";
import { getTableRowsClassname } from "../utils/getTableRowsClassname";
import useFetchJobList from "../customHooks/useFetchJobList";
import { detailedStatusOptions } from "../assets/data/detailedStatusOptions";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../Context/UserContext";
import { SelectedYearContext } from "../Context/SelectedYearContext";
import { apiRoutes } from "../utils/apiRoutes";
import axios from "axios";
import { convertToExcel } from "../utils/convertToExcel";

function JobsList() {
  useEffect(() => {
    const savedImporterName = localStorage.getItem("importerName");
    if (savedImporterName === null || savedImporterName === undefined) {
      navigate("/importer");
    }
    // eslint-disable-next-line
  }, []);

  const { importerName } = useContext(ClientContext);
  const { user } = useContext(UserContext);
  const { selectedYear } = useContext(SelectedYearContext);
  const [headers, setHeaders] = useState([]);

  const navigate = useNavigate();

  const [detailedStatus, setDetailedStatus] = useState("all");
  const columns = useJobColumns(detailedStatus);
  const { rows, pageState, setPageState, setFilterJobNumber } = useFetchJobList(
    detailedStatus,
    selectedYear
  );
  const params = useParams();
  const { reportFieldsAPI, downloadReportAPI } = apiRoutes();

  useEffect(() => {
    async function getReportFields() {
      const res = await axios(`${reportFieldsAPI}/${params.importer}`);
      setHeaders(res.data);
    }
    getReportFields();
    // eslint-disable-next-line
  }, [params.importer]);

  const handleReportDownload = async () => {
    if (headers.length === 0) {
      alert("This importer has not been assigned to any user");
      return;
    }
    const res = await axios.get(
      `${downloadReportAPI}/${selectedYear}/${params.importer}/${params.status}`
    );

    convertToExcel(
      res.data,
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
        <select
          name="status"
          onChange={(e) => {
            setDetailedStatus(e.target.value);
            setPageState((old) => ({ ...old, page: 1 }));
          }}
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
          height: "80%",
          "& .MuiDataGrid-row:hover": {
            backgroundColor: "#f8f5ff",
          },
        }}
        className="table expense-table"
        headerAlign="center"
        rows={rows}
        columns={columns}
        stickyHeader
        loading={pageState.isLoading}
        rowsPerPageOptions={[25]}
        getRowHeight={() => "auto"}
        pageSize={25}
        autoHeight={false}
        disableSelectionOnClick
        getRowClassName={getTableRowsClassname}
      />
    </>
  );
}

export default JobsList;
