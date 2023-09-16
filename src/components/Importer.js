import { Container, Row, Col } from "react-bootstrap";
import React, { useContext, useEffect, useState } from "react";
import { ClientContext } from "../Context/ClientContext";
import { useNavigate } from "react-router-dom";
import "../styles/importer.scss";
import axios from "axios";
import { apiRoutes } from "../utils/apiRoutes";
import { SelectedYearContext } from "../Context/SelectedYearContext";

function Importer() {
  const [filterImporter, setFilterImporter] = useState("");
  const { setImporter, setImporterName } = React.useContext(ClientContext);
  const [importerData, setImporterData] = useState([]);
  const navigate = useNavigate();
  const { importerListAPI } = apiRoutes();
  const { selectedYear } = useContext(SelectedYearContext);

  useEffect(() => {
    async function getImporterList() {
      const res = await axios.get(`${importerListAPI}/${selectedYear}`);
      setImporterData(res.data);
    }
    getImporterList();
    // eslint-disable-next-line
  }, [selectedYear]);

  const filteredData = importerData.filter((importer) => {
    if (filterImporter === "") {
      return true;
    } else if (
      importer.importer !== "--" &&
      importer.importer.toLowerCase().includes(filterImporter.toLowerCase())
    ) {
      return true;
    }
    return false;
  });

  const handleClient = (url, name) => {
    setImporter(url);
    setImporterName(name);
    localStorage.setItem("importer", url);
    localStorage.setItem("importerName", name);
    navigate(`/${url}/jobs/pending`);
  };

  return (
    <Container className="importer">
      <input
        type="text"
        onChange={(e) => setFilterImporter(e.target.value)}
        placeholder="Search importer..."
      />
      <Row className="importer-row">
        {filteredData.map((val, id) => {
          return (
            <Col key={id} xs={12} lg={3} className="importer-col">
              <div
                className="importer-inner-container"
                onClick={() => handleClient(val.importerURL, val.importer)}
              >
                {val.importer}
              </div>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
}

export default Importer;
