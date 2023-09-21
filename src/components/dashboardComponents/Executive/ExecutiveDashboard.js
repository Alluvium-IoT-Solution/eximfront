import React, { useContext, useState } from "react";
import "../../../styles/dashboard.scss";
import RegisterModal from "../../modals/RegisterModal";
import JobsOverview from "../JobsOverview";
import ImporterWiseDetails from "../ImporterWiseDetails";
import { Container, Row, Col } from "react-bootstrap";
import AssignJobsModal from "../AssignJobsModal";
import { UserContext } from "../../../Context/UserContext";
import { SelectedYearContext } from "../../../Context/SelectedYearContext";
import { SelectedImporterContext } from "../../../Context/SelectedImporterContext";
import { TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { AssignedImportersContext } from "../../../Context/AssignedImportersContext";
import { ClientContext } from "../../../Context/ClientContext";

const ExecutiveDashboard = () => {
  // Modal
  const [openRegisterModal, setoOpenRegisterModal] = useState(false);
  const [openAssignJobsModal, setOpenAssignJobsModal] = useState(false);
  const handleCloseRegisterModal = () => setoOpenRegisterModal(false);
  const handleCloseAssignJobsModal = () => setOpenAssignJobsModal(false);
  const { selectedYear } = useContext(SelectedYearContext);
  const { assignedImporters } = useContext(AssignedImportersContext);
  const { selectedImporter, setSelectedImporter } = useContext(
    SelectedImporterContext
  );
  const { setImporterName } = useContext(ClientContext);

  const { user } = useContext(UserContext);

  const importerList =
    assignedImporters.length !== 0
      ? assignedImporters.map((importer) => importer.importer)
      : [];

  return (
    <>
      <Container fluid className="dashboard-container">
        <div style={{ display: "flex", marginTop: "20px" }}>
          <h4 style={{ flex: 1 }}>Hello, {user.username}</h4>
          {user.role === "Executive" ||
            (user.role === "Assistant Manager" && (
              <Autocomplete
                options={importerList}
                getOptionLabel={(option) => option}
                sx={{ width: "500px !important" }}
                renderInput={(params) => (
                  <TextField {...params} label="Select importer" />
                )}
                id="user"
                name="user"
                onChange={(event, newValue) => {
                  setImporterName(newValue);
                  setSelectedImporter(newValue);
                  localStorage.setItem("importerName", newValue);
                }}
                value={selectedImporter}
                style={{ marginBottom: "15px" }}
              />
            ))}
        </div>

        <JobsOverview selectedYear={selectedYear} />

        <Container fluid className="dashboard-container">
          <Row>
            {user.role !== "Executive" && user.role !== "Assistant Manager" && (
              <ImporterWiseDetails selectedYear={selectedYear} />
            )}
            <Col xs={6} className="dashboard-col"></Col>
          </Row>
        </Container>
      </Container>
      <RegisterModal
        openRegisterModal={openRegisterModal}
        handleCloseRegisterModal={handleCloseRegisterModal}
      />
      <AssignJobsModal
        openAssignJobsModal={openAssignJobsModal}
        handleCloseAssignJobsModal={handleCloseAssignJobsModal}
      />
    </>
  );
};

export default ExecutiveDashboard;
