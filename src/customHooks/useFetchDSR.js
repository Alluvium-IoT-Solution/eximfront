import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { apiRoutes } from "../utils/apiRoutes";

function useFetchJobList(detailedStatus, selectedYear) {
  const importer = localStorage.getItem("importerName");
  const [rows, setRows] = useState([]);
  const params = useParams();
  const { dsrAPI } = apiRoutes();
  const [pageState, setPageState] = useState({
    isLoading: false,
    page: 1,
  });
  const [total, setTotal] = useState(0);

  useEffect(() => {
    console.log(
      `${dsrAPI}/${selectedYear}/${importer
        .toLowerCase()
        .replace(/ /g, "_")
        .replace(/\./g, "")
        .replace(/\//g, "_")
        .replace(/-/g, "")
        .replace(/_+/g, "_")
        .replace(/\(/g, "")
        .replace(/\)/g, "")
        .replace(/\[/g, "")
        .replace(/\]/g, "")
        .replace(/,/g, "")}`
    );
    async function getData() {
      setRows([]);

      const res = await axios(
        `${dsrAPI}/${selectedYear}/${importer
          .toLowerCase()
          .replace(/ /g, "_")
          .replace(/\./g, "")
          .replace(/\//g, "_")
          .replace(/-/g, "")
          .replace(/_+/g, "_")
          .replace(/\(/g, "")
          .replace(/\)/g, "")
          .replace(/\[/g, "")
          .replace(/\]/g, "")
          .replace(/,/g, "")}`
      );
      console.log(res);
      setPageState((old) => ({
        ...old,
        isLoading: false,
      }));

      setRows(res.data);
      setTotal(res.data.total);
    }

    getData();
  }, [
    params.client,
    params.status,
    detailedStatus,
    dsrAPI,
    selectedYear,
    params.importer,
    pageState.page,
    pageState.pageSize,
  ]);

  return { rows, total, pageState, setPageState };
}

export default useFetchJobList;
