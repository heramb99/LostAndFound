import React, { useState } from "react";
import FoundItemForm from "../FoundItemForm/FoundItemForm";

import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import { toast } from "react-toastify";
import MapWrapper from "../../Components/MapWrapper";
import Album from "../Album";
import "./HomePage.css"; // Import the CSS file
import FilterOptions from '../../Components/FilterOptions';

const HomePage = () => {
  const [value, setValue] = React.useState(0);
  const [isFilterOpen, setFilterOpen] = useState(true);
  const toggleFilter = () => setFilterOpen(!isFilterOpen);

  const BaseColor = "#35ac65";

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setFilterParams(null);
  };
  const openLostForm = () => {
    window.location = "/lost-form";
  };

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [resetVariable, setResetVariable] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [filterParams, setFilterParams] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const openForm = () => {
    setIsFormOpen(true);
    setResetVariable(false);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setResetVariable(true);
  };

  const stackButton = {
    marginTop: "20px",
    marginLeft: "20px",
  };

  const albumContainer = {
    width: "100%",
  };

  const componentAStyle = {
    flex: "1",
    padding: "16px",
  };
  const filterLabelStyle = {
    width: "75%",
    background: BaseColor,
    color: "#fff",
    fontSize: "20px",
    padding: "5px 0",
    textAlign: "center",
    cursor: "pointer",
  };
  const filterLabelContainerStyle = {
    display: "flex",
    justifyContent: "center",
  };
  const filterOptionsContainerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const applyFilter = (filterParams) => {
    console.log("filterParams", filterParams)
    window.scrollTo({ top: 0, behavior: 'instant' });
    setFilterParams(filterParams);
  };

  return (
    <div>
      
      <div className="margin-left-20 margin-bottom-20">
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="disabled tabs example"
            centered
          >
            <Tab
              label={
                <Typography
                  variant="body1"
                  fontWeight={value === 0 ? "bold" : "normal"}
                >
                  Item Posted
                </Typography>
              }
            />
            <Tab
              label={
                <Typography
                  variant="body1"
                  fontWeight={value === 1 ? "bold" : "normal"}
                >
                  Claim Request Raised
                </Typography>
              }
            />
            <Tab
              label={
                <Typography
                  variant="body1"
                  fontWeight={value === 2 ? "bold" : "normal"}
                >
                  Claim Request Received
                </Typography>
              }
            />
          </Tabs>
        </Box>
      </div>
      <div className="flex">
        {value === 0 ? (
          <div>
            <div style={componentAStyle} className="filter-container">
              <div style={filterLabelContainerStyle}>
                <div
                  style={filterLabelStyle}
                  className="filter-toggle "
                  onClick={toggleFilter}
                >
                  {isFilterOpen ? "Hide Filter Options" : "Show Filter Options"}
                </div>
              </div>
              {isFilterOpen && (
                <div style={filterOptionsContainerStyle}>
                  <FilterOptions applyFilter={applyFilter} />
                </div>
              )}
            </div>
          </div>
        ) : (
          ""
        )}
        <div style={albumContainer}>
          <Album value={value} filterParams={filterParams}></Album>
        </div>
      </div>

      <FoundItemForm
        isOpen={isFormOpen}
        onRequestClose={closeForm}
        resetVariable={resetVariable}
      />
    </div>
  );
};

export default HomePage;
