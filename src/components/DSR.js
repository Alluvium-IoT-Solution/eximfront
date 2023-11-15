import React, { useContext, useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { ClientContext } from "../Context/ClientContext";
import "../styles/job-list.scss";
import { getTableRowsClassname } from "../utils/getTableRowsClassname";
import useFetchDSR from "../customHooks/useFetchDSR";
import { detailedStatusOptions } from "../assets/data/detailedStatusOptions";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Context/UserContext";
import { SelectedYearContext } from "../Context/SelectedYearContext";

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
  const navigate = useNavigate();

  const [detailedStatus, setDetailedStatus] = useState("all");

  const { rows, pageState, setPageState, setFilterJobNumber } = useFetchDSR(
    detailedStatus,
    selectedYear
  );

  const columns = [
    {
      field: "_id",
      sortable: false,
      hide: true,
      headerName: "ID",
    },

    {
      field: "job_no",
      sortable: false,
      headerName: "Job Number",
      width: 100,
      align: "center",
    },

    {
      field: "job_date",
      sortable: false,
      headerName: "Job Date",
      width: 100,
      align: "center",
    },

    {
      field: "supplier_exporter",
      sortable: false,
      headerName: "Supplier/Exporter",
      width: 300,
      align: "center",
    },

    {
      field: "invoice_number",
      sortable: false,
      headerName: "Invoice Number",
      align: "center",
      width: 150,
    },

    {
      field: "invoice_date",
      sortable: false,
      headerName: "Invoice Date",
      width: 160,
      align: "center",
    },

    {
      field: "awb_bl_no",
      sortable: false,
      headerName: "BL No",
      width: 200,
      align: "center",
      renderCell: (cell) => {
        return cell.row.awb_bl_no.toString();
      },
    },

    {
      field: "awb_bl_date",
      sortable: false,
      headerName: "BL Date",
      width: "160",
      align: "center",
    },

    {
      field: "commodity",
      sortable: false,
      headerName: "Commodity",
      width: "160",
      align: "center",
    },

    {
      field: "no_of_pkgs",
      sortable: false,
      headerName: "No of Pkgs",
      width: "160",
      align: "center",
    },

    {
      field: "net_weight",
      sortable: false,
      headerName: "Net Weight",
      width: "160",
      align: "center",
    },

    {
      field: "loading_port",
      sortable: false,
      headerName: "POL",
      width: "160",
      align: "center",
    },

    {
      field: "arrival_date",
      sortable: false,
      headerName: "Arrival Date",
      width: 250,
      align: "center",
      renderCell: (cell) => {
        return cell.row.container_nos.map((container, id) => {
          return (
            <React.Fragment key={id}>
              {container.arrival_date}
              <br />
            </React.Fragment>
          );
        });
      },
    },

    {
      field: "free_time",
      sortable: false,
      headerName: "Free Time",
      width: "160",
      align: "center",
    },

    {
      field: "detention_from",
      sortable: false,
      headerName: "Detention From",
      width: 250,
      align: "center",
      renderCell: (cell) => {
        return cell.row.container_nos.map((container, id) => {
          return (
            <React.Fragment key={id}>
              {container.detention_from}
              <br />
            </React.Fragment>
          );
        });
      },
    },

    {
      field: "shipping_line_airline",
      sortable: false,
      headerName: "Shipping Line",
      width: "160",
      align: "center",
    },

    {
      field: "container_no",
      sortable: false,
      headerName: "Container Number",
      width: 250,
      align: "center",
      renderCell: (cell) => {
        console.log(cell);
        return cell.row.container_nos.map((container, id) => {
          return (
            <React.Fragment key={id}>
              {container.container_number}
              <br />
            </React.Fragment>
          );
        });
      },
    },

    {
      field: "size",
      sortable: false,
      headerName: "Size",
      width: 250,
      align: "center",
      renderCell: (cell) => {
        return cell.row.container_nos.map((container, id) => {
          return (
            <React.Fragment key={id}>
              {container.size}
              <br />
            </React.Fragment>
          );
        });
      },
    },

    {
      field: "remarks",
      sortable: false,
      headerName: "Remarks",
      width: "160",
      align: "center",
    },

    {
      field: "do_validity",
      sortable: false,
      headerName: "DO Validity",
      width: "160",
      align: "center",
    },

    {
      field: "remarks",
      sortable: false,
      headerName: "Remarks",
      width: "160",
      align: "center",
    },

    {
      field: "be_no",
      sortable: false,
      headerName: "BE No",
      width: "160",
      align: "center",
    },

    {
      field: "be_date",
      sortable: false,
      headerName: "BE Date",
      width: "160",
      align: "center",
    },

    {
      field: "assessment_date",
      sortable: false,
      headerName: "Assessment Date",
      width: "160",
      align: "center",
    },

    {
      field: "examination_date",
      sortable: false,
      headerName: "Examination Date",
      width: "160",
      align: "center",
    },

    {
      field: "duty_paid_date",
      sortable: false,
      headerName: "Duty Paid Date",
      width: "160",
      align: "center",
    },

    {
      field: "out_of_charge_date",
      sortable: false,
      headerName: "Out of Charge Date",
      width: "160",
      align: "center",
    },

    {
      field: "detailed_status",
      sortable: false,
      headerName: "Detailed Status",
      width: 250,
      align: "center",
    },
  ];

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
        disableColumnMenu
      />
    </>
  );
}

export default JobsList;
