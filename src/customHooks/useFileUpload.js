// import * as xlsx from "xlsx";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { apiRoutes } from "../utils/apiRoutes";
// import { useState } from "react";

// function useFileUpload(inputRef, alt, setAlt) {
//   const [snackbar, setSnackbar] = useState(false);
//   const navigate = useNavigate();
//   const { addJobAPI, updateJobsDateAPI } = apiRoutes();
//   const [loading, setLoading] = useState(false);

//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];

//     const reader = new FileReader();
//     reader.onload = handleFileRead;
//     reader.readAsBinaryString(file);
//   };

//   const handleFileRead = (event) => {
//     const content = event.target.result;
//     const workbook = xlsx.read(content, { type: "binary" });

//     const worksheet = workbook.Sheets[workbook.SheetNames[0]];
//     const jsonData = xlsx.utils.sheet_to_json(worksheet, {
//       raw: false,
//       defval: "", // provide an empty string to those cells, which have no content in them
//     });

//     // Convert the object keys to lowercase, and in the desired format
//     function modifyKeys(data) {
//       const convertedData = [];

//       for (let i = 0; i < data.length; i++) {
//         const modifiedObject = {};

//         for (let key in data[i]) {
//           let modifiedKey = key
//             .toLowerCase()
//             .replace(/ /g, "_") // replace spaces with underscores
//             .replace(/\./g, "") // replace dots with nothing
//             .replace(/\//g, "_") // replace slashes with underscores
//             .replace(/-/g, ""); // replace dashes with nothing

//           // Extract the year from the job_no using a regular expression
//           if (modifiedKey === "job_no") {
//             const yearMatch = data[i][key].match(/\/(\d{2}-\d{2})$/);
//             if (yearMatch) {
//               modifiedObject["year"] = yearMatch[1];
//             }
//           }

//           modifiedObject[modifiedKey] = data[i][key];
//         }

//         convertedData.push(modifiedObject);
//       }

//       return convertedData;
//     }

//     const convertedData = modifyKeys(jsonData);

//     const yearData = [];
//     convertedData.forEach((item) => {
//       const yearName = item.year;
//       const importerName = item.importer;

//       // Check if the year already exists in yearData
//       const existingYear = yearData.find((year) => year.year === yearName);

//       if (existingYear) {
//         // Check if the importer already exists in the existingYear data array
//         const existingImporter = existingYear.data.find(
//           (importer) => importer.importer === importerName
//         );

//         if (existingImporter) {
//           // If the importer already exists, push the item to its jobs array
//           existingImporter.jobs.push({
//             ...item,
//             year: yearName, // Add the year field without regex transformations
//           });
//         } else {
//           // If the importer doesn't exist, create a new importer object and add it to the existingYear data array
//           const newImporter = {
//             importer: importerName,
//             importerURL: importerName
//               .toLowerCase()
//               .replace(/ /g, "_")
//               .replace(/\./g, "")
//               .replace(/\//g, "_")
//               .replace(/-/g, "")
//               .replace(/_+/g, "_")
//               .replace(/\(/g, "")
//               .replace(/\)/g, "")
//               .replace(/\[/g, "")
//               .replace(/\]/g, "")
//               .replace(/,/g, ""),
//             jobs: [
//               {
//                 ...item,
//                 year: yearName,
//               },
//             ],
//           };
//           existingYear.data.push(newImporter);
//         }
//       } else {
//         // If the year doesn't exist, create a new year object with the importer as the first entry in its data array
//         const newYear = {
//           year: yearName,
//           data: [
//             {
//               importer: importerName,
//               importerURL: importerName
//                 .toLowerCase()
//                 .replace(/ /g, "_")
//                 .replace(/\./g, "")
//                 .replace(/\//g, "_")
//                 .replace(/-/g, "")
//                 .replace(/_+/g, "_")
//                 .replace(/\(/g, "")
//                 .replace(/\)/g, "")
//                 .replace(/\[/g, "")
//                 .replace(/\]/g, "")
//                 .replace(/,/g, ""),
//               jobs: [
//                 {
//                   ...item,
//                   year: yearName,
//                 },
//               ],
//             },
//           ],
//         };
//         yearData.push(newYear);
//       }
//     });

//     // Combine multiple container numbers and their data into an array
//     function handleMultipleContainers(data) {
//       const convertedData = data.map((year) => {
//         const newData = year.data.map((importer) => {
//           const jobsData = importer.jobs.map((item) => {
//             const containerNumbers = item.container_nos.split(",");

//             const containerData = containerNumbers.map((containerNumber) => ({
//               container_number: containerNumber,
//             }));

//             return {
//               ...item,
//               job_no: item.job_no.match(/\/(\d+)\/[^/]*$/)[1], // extract desired part from job number
//               container_nos: containerData,
//             };
//           });

//           return {
//             importer: importer.importer,
//             importerURL: importer.importer
//               .toLowerCase()
//               .replace(/ /g, "_")
//               .replace(/\./g, "")
//               .replace(/\//g, "_")
//               .replace(/-/g, "")
//               .replace(/_+/g, "_")
//               .replace(/\(/g, "")
//               .replace(/\)/g, "")
//               .replace(/\[/g, "")
//               .replace(/\]/g, "")
//               .replace(/,/g, ""),
//             jobs: jobsData,
//           };
//         });

//         return {
//           year: year.year,
//           data: newData,
//         };
//       });

//       return convertedData;
//     }

//     const data = handleMultipleContainers(yearData);

//     // Set file to null so that same file can be selected again
//     if (inputRef.current) {
//       inputRef.current.value = null;
//     }

//     // Upload data to db
//     async function uploadExcelData() {
//       setLoading(true);
//       const res = await axios.post(addJobAPI, data);
//       if (res.status === 200) {
//         setSnackbar(true); // show snackbar
//       } else {
//         alert("Something went wrong");
//       }
//       setLoading(false);
//       navigate("/dashboard");
//     }

//     uploadExcelData().then(() => setAlt(!alt));

//     // update last jobs date in db
//     const date = new Date().toLocaleDateString();
//     async function updateJobsDate() {
//       const res = await axios.post(updateJobsDateAPI, {
//         date,
//       });
//       console.log(res);
//     }

//     updateJobsDate();
//   };

//   // Hide snackbar after 2 seconds
//   setTimeout(() => {
//     setSnackbar(false);
//   }, 2000);

//   return { handleFileUpload, snackbar, loading };
// }

// export default useFileUpload;

import * as xlsx from "xlsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { apiRoutes } from "../utils/apiRoutes";
import { useState } from "react";

function useFileUpload(inputRef, alt, setAlt) {
  const [snackbar, setSnackbar] = useState(false);
  const navigate = useNavigate();
  const { addJobAPI, updateJobsDateAPI } = apiRoutes();
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    const reader = new FileReader();
    reader.onload = handleFileRead;
    reader.readAsBinaryString(file);
  };

  const handleFileRead = (event) => {
    const content = event.target.result;
    const workbook = xlsx.read(content, { type: "binary" });

    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(worksheet, {
      raw: false,
      defval: "", // provide an empty string to those cells, which have no content in them
    });

    // Convert the object keys to lowercase, and in the desired format
    function modifyKeys(data) {
      const convertedData = [];

      for (let i = 0; i < data.length; i++) {
        const modifiedObject = {};

        for (let key in data[i]) {
          let modifiedKey = key
            .toLowerCase()
            .replace(/ /g, "_") // replace spaces with underscores
            .replace(/\./g, "") // replace dots with nothing
            .replace(/\//g, "_") // replace slashes with underscores
            .replace(/-/g, ""); // replace dashes with nothing

          // Extract the year from the job_no using a regular expression
          if (modifiedKey === "job_no") {
            const yearMatch = data[i][key].match(/\/(\d{2}-\d{2})$/);
            if (yearMatch) {
              modifiedObject["year"] = yearMatch[1];
            }
          }

          modifiedObject[modifiedKey] = data[i][key];
        }

        convertedData.push(modifiedObject);
      }

      return convertedData;
    }

    const convertedData = modifyKeys(jsonData);
    const data = convertedData.map((dataItem) => {
      const containerNumbers = dataItem.container_nos
        .split(",")
        .map((container) => ({ container_number: container.trim() }));
      const job_no = dataItem.job_no.match(/\/(\d+)\/[^/]*$/)[1];
      const importerURL = dataItem.importer
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
        .replace(/,/g, "");

      return {
        ...dataItem,
        job_no: job_no,
        importerURL: importerURL,
        container_nos: containerNumbers,
      };
    });

    // Set file to null so that same file can be selected again
    if (inputRef.current) {
      inputRef.current.value = null;
    }

    // Upload data to db
    async function uploadExcelData() {
      setLoading(true);
      const res = await axios.post(addJobAPI, data);
      console.log(res);
      if (res.status === 200) {
        setSnackbar(true); // show snackbar
      } else {
        alert("Something went wrong");
      }
      setLoading(false);
      navigate("/dashboard");
    }

    uploadExcelData().then(() => setAlt(!alt));

    // update last jobs date in db
    const date = new Date().toLocaleDateString();
    async function updateJobsDate() {
      const res = await axios.post(updateJobsDateAPI, {
        date,
      });
      console.log(res);
    }

    updateJobsDate();
  };

  // Hide snackbar after 2 seconds
  setTimeout(() => {
    setSnackbar(false);
  }, 2000);

  return { handleFileUpload, snackbar, loading };
}

export default useFileUpload;
