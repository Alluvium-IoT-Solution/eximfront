// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useParams } from "react-router-dom";
// import { convertToTimestamp } from "../utils/convertToTimestamp";
// import { apiRoutes } from "../utils/apiRoutes";

// function useFetchJobList(detailedStatus, selectedYear) {
//   const [rows, setRows] = useState([]);
//   const params = useParams();
//   const { getJobsListAPI } = apiRoutes();

//   useEffect(() => {
//     async function getData() {
//       setRows([]);
//       const res = await axios(
//         `${getJobsListAPI}/${selectedYear}/${params.importer}/jobs/${params.status}`
//       );

//       setRows(res.data);

//       function sortArrayByPriority(array) {
//         const priorityOrder = [
//           "Custom Clearance Completed",
//           "BE Noted, Clearance Pending",
//           "BE Noted, Arrival Pending",
//           "Gateway IGM Filed",
//           "Discharged",
//           "Estimated Time of Arrival",
//         ];

//         const sortedArray = [];
//         const remainingArray = [];

//         array.forEach((item) => {
//           if (
//             item.detailed_status &&
//             priorityOrder.includes(item.detailed_status)
//           ) {
//             sortedArray.push(item);
//           } else {
//             remainingArray.push(item);
//           }
//         });

//         sortedArray.sort((a, b) => {
//           const priorityA = priorityOrder.indexOf(a.detailed_status);
//           const priorityB = priorityOrder.indexOf(b.detailed_status);

//           return priorityA - priorityB;
//         });

//         return sortedArray.concat(remainingArray);
//       }

//       const sortedArray = sortArrayByPriority(res.data);

//       if (detailedStatus === "") {
//         setRows(sortedArray);
//       } else if (detailedStatus === "Estimated Time of Arrival") {
//         const filteredRows = res.data.filter(
//           (item) => item.detailed_status === detailedStatus
//         );

//         const sortedRows = filteredRows.sort((a, b) => {
//           const dateA = convertToTimestamp(a.be_date);
//           const dateB = convertToTimestamp(b.be_date);
//           return dateA - dateB;
//         });
//         setRows(sortedRows);
//       } else if (detailedStatus === "Gateway IGM Filed") {
//         const filteredRows = res.data.filter(
//           (item) => item.detailed_status === detailedStatus
//         );
//         setRows(filteredRows);
//       } else if (detailedStatus === "BE Noted, Arrival Pending") {
//         const filteredRows = res.data.filter(
//           (item) => item.detailed_status === detailedStatus
//         );
//         const sortedRows = filteredRows.sort((a, b) => {
//           const dateA = convertToTimestamp(a.arrival_date);
//           const dateB = convertToTimestamp(b.arrival_date);
//           return dateA - dateB;
//         });
//         setRows(sortedRows);
//       } else if (detailedStatus === "BE Noted, Clearance Pending") {
//         const filteredRows = res.data.filter(
//           (item) => item.detailed_status === detailedStatus
//         );
//         setRows(filteredRows);
//       } else if (detailedStatus === "Custom Clearance Completed") {
//         const filteredRows = res.data.filter(
//           (item) => item.detailed_status === detailedStatus
//         );
//         setRows(filteredRows);
//       }
//     }

//     getData();
//   }, [
//     params.client,
//     params.status,
//     detailedStatus,
//     getJobsListAPI,
//     selectedYear,
//     params.importer,
//   ]);

//   return { rows };
// }

// export default useFetchJobList;

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { convertToTimestamp } from "../utils/convertToTimestamp";
import { apiRoutes } from "../utils/apiRoutes";

function useFetchJobList(detailedStatus, selectedYear) {
  const [rows, setRows] = useState([]);
  const params = useParams();
  const { getJobsListAPI } = apiRoutes();
  const [filterText, setFilterText] = useState("all");
  const [pageState, setPageState] = useState({
    isLoading: false,
    page: 1,
  });
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function getData() {
      setRows([]);
      setPageState((old) => ({ ...old, isLoading: true }));

      const res = await axios(
        `${getJobsListAPI}/${selectedYear}/${params.importer}/jobs/${params.status}/${pageState.page}/${filterText}`
      );

      setPageState((old) => ({
        ...old,
        isLoading: false,
      }));

      setRows(res.data.data);
      setTotal(res.data.total);

      function sortArrayByPriority(array) {
        const priorityOrder = [
          "Custom Clearance Completed",
          "BE Noted, Clearance Pending",
          "BE Noted, Arrival Pending",
          "Gateway IGM Filed",
          "Discharged",
          "Estimated Time of Arrival",
        ];

        const sortedArray = [];
        const remainingArray = [];

        array.forEach((item) => {
          if (
            item.detailed_status &&
            priorityOrder.includes(item.detailed_status)
          ) {
            sortedArray.push(item);
          } else {
            remainingArray.push(item);
          }
        });

        sortedArray.sort((a, b) => {
          const priorityA = priorityOrder.indexOf(a.detailed_status);
          const priorityB = priorityOrder.indexOf(b.detailed_status);

          return priorityA - priorityB;
        });

        return sortedArray.concat(remainingArray);
      }

      const sortedArray = sortArrayByPriority(res.data.data);

      if (detailedStatus === "") {
        setRows(sortedArray);
      } else if (detailedStatus === "Estimated Time of Arrival") {
        const filteredRows = res.data.data.filter(
          (item) => item.detailed_status === detailedStatus
        );

        const sortedRows = filteredRows.sort((a, b) => {
          const dateA = convertToTimestamp(a.be_date);
          const dateB = convertToTimestamp(b.be_date);
          return dateA - dateB;
        });
        setRows(sortedRows);
      } else if (detailedStatus === "Discharged") {
        const filteredRows = res.data.data.filter(
          (item) => item.detailed_status === detailedStatus
        );
        console.log(filteredRows);
        setRows(filteredRows);
      } else if (detailedStatus === "Gateway IGM Filed") {
        const filteredRows = res.data.data.filter(
          (item) => item.detailed_status === detailedStatus
        );
        setRows(filteredRows);
      } else if (detailedStatus === "BE Noted, Arrival Pending") {
        const filteredRows = res.data.data.filter(
          (item) => item.detailed_status === detailedStatus
        );
        const sortedRows = filteredRows.sort((a, b) => {
          const dateA = convertToTimestamp(a.arrival_date);
          const dateB = convertToTimestamp(b.arrival_date);
          return dateA - dateB;
        });
        setRows(sortedRows);
      } else if (detailedStatus === "BE Noted, Clearance Pending") {
        const filteredRows = res.data.filter(
          (item) => item.detailed_status === detailedStatus
        );
        setRows(filteredRows);
      } else if (detailedStatus === "Custom Clearance Completed") {
        const filteredRows = res.data.data.filter(
          (item) => item.detailed_status === detailedStatus
        );
        setRows(filteredRows);
      }
    }

    getData();
  }, [
    params.client,
    params.status,
    detailedStatus,
    getJobsListAPI,
    selectedYear,
    params.importer,
    pageState.page,
    pageState.pageSize,
    filterText,
  ]);

  return { rows, total, pageState, setPageState, setFilterText };
}

export default useFetchJobList;
