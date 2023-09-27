import React, { useContext, useEffect, useState } from "react";
import { Button } from "@mui/material";
import { useFormik } from "formik";
import { TextField } from "@mui/material";
import axios from "axios";
import Autocomplete from "@mui/material/Autocomplete";
import { apiRoutes } from "../utils/apiRoutes";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import { UserContext } from "../Context/UserContext";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const RemoveJobsForm = (props) => {
  const users = props.usernames.map((username, index) => ({
    username,
    jobsCount: props.counts[index],
  }));

  const [importerData, setImporterData] = useState([]);
  const [importers, setImporters] = useState([]);
  const { user } = useContext(UserContext);

  const { removeJobsAPI, importerListToAssignJobs, getAssignedImporterAPI } =
    apiRoutes();

  const userList = users.map(
    (user) => `${user.username}: Pending Jobs- ${user.jobsCount}`
  );

  const formik = useFormik({
    initialValues: {
      user: null,
    },

    onSubmit: async (values) => {
      const data = {
        username: values.user.split(":")[0].trim(),
        importers: importers.map((importer) => ({
          importer: importer,
          importerURL: importer
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
            .replace(/,/g, ""),
        })),
      };

      const res = await axios.post(removeJobsAPI, data, {});
      if (res.status === 200) {
        alert("Jobs removed successfully");
      }

      props.handleCloseRemoveJobsModal();
    },
  });

  useEffect(() => {
    async function getImporterList() {
      const res = await axios.get(
        `${getAssignedImporterAPI}/${formik.values.user.split(":")[0].trim()}`
      );
      setImporterData(res.data.map((importer) => importer.importer));
    }

    getImporterList();
    // eslint-disable-next-line
  }, [formik.values]);

  const handleChangeUserAutocomplete = (event, value) => {
    formik.setFieldValue("user", value);
  };

  const handleChange = (event) => {
    setImporters(event.target.value);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Autocomplete
        disablePortal
        options={userList}
        getOptionLabel={(option) => option}
        width="100%"
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select user"
            error={formik.touched.user && Boolean(formik.errors.user)}
            helperText={formik.touched.user && formik.errors.user}
          />
        )}
        id="user"
        name="user"
        onChange={handleChangeUserAutocomplete}
        value={formik.values.user}
        style={{ marginBottom: "15px" }}
      />

      <FormControl sx={{ width: "100%", height: "55px" }}>
        <InputLabel
          id="demo-multiple-checkbox-label"
          className="assign-jobs-select"
          sx={{ backgroundColor: "#fff", paddingRight: "10px" }}
        >
          Select Importer
        </InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          multiple
          value={importers}
          input={<OutlinedInput label="Tag" />}
          renderValue={(selected) => selected.join(", ")}
          MenuProps={MenuProps}
          id="importer"
          name="importer"
          onChange={handleChange}
          sx={{ height: "55px" }}
        >
          {importerData.map((name) => (
            <MenuItem key={name} value={name}>
              <Checkbox checked={importers.indexOf(name) > -1} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        fullWidth
        type="submit"
        className="submit-form-btn"
        aria-label="assign-jobs-btn"
      >
        Remove
      </Button>
    </form>
  );
};

export default RemoveJobsForm;
