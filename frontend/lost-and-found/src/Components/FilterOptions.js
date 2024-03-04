import Switch from '@mui/material/Switch';
import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MapWrapper from "./MapWrapper";





const filterContainerStyle = {
  width: "100%",
  padding: "16px",
  display: "flex",
  flexDirection: "column",
};

const filterOptionsStyle = {
  width: "100%",
  border: "1px solid #ddd",
  borderRadius: "4px",
  padding: "8px",
  margin: "8px 0",
};

const filterButtonStyle = {
  backgroundColor: "#35ac65",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  padding: "8px 16px",
  margin: "8px 0",
  cursor: "pointer",
};

const clearButtonStyle = {
  backgroundColor: "#cf534e",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  padding: "8px 16px",
  margin: "8px 0",
  cursor: "pointer",
};

const FilterOptions = ({ applyFilter }) => {
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [location, setLocation] = useState("");
  const [radius, setRadius] = useState("");
  const [keyword, setKeyword] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleFilterChange = (event) => {
    const value = event.target.value;
    if (selectedFilters.includes(value)) {
      setSelectedFilters(selectedFilters.filter((filter) => filter !== value));
    } else {
      setSelectedFilters([...selectedFilters, value]);
    }
  };

  const handleClearFilters = () => {
    setSelectedFilters([]);
    setLocation("");
    setRadius("");
    setKeyword("");
    setSelectedDate("");
    setSelectedCategory("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  
    if (selectedFilters.includes("category") && selectedCategory === "") {
      toast.error("Please select a category!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } else if (selectedFilters.includes("date") && selectedDate === "") {
      toast.error("Please select a date!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } else if (selectedFilters.includes("keyword") && keyword === "") {
      toast.error("Please enter a keyword!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } else {
      // Check if "Location" filter is checked
      const isLocationFilterChecked = selectedFilters.includes("location");

      if (isLocationFilterChecked && (!location || !radius)) {
        toast.error("please select location and radius!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }

      const filterParams = {};

      // Check if "Category" filter is selected
      if (selectedCategory) {
        filterParams.category = {
          value: selectedCategory,
          mode: "equals",
        };
      }

      // Check if "Keyword" filter is checked
      if (selectedFilters.includes("keyword") && keyword) {
        filterParams.keyword = {
          value: keyword,
          mode: "contains",
        };
      }

      // Check if "Date" filter is checked
      if (selectedFilters.includes("date") && selectedDate) {
        const startTime = `${selectedDate}T23:59:59.999Z`;

        filterParams.postedAt = {
          mode: "on",
          value: startTime,
        };

        //   filterParams.date = {
        //     mode: "lte",
        //     value: endTime,
        //   };
      }

      // Check if "Location" filter is checked
      if (selectedFilters.includes("location") && location && radius) {
        filterParams.location = {
          value: {
            x: location[0]?.lng ? location[0]?.lng : "",
            y: location[0]?.lat ? location[0]?.lat : "",
            radius: parseFloat(radius),
          },
          mode: "geo",
        };
      }

      applyFilter(filterParams);
    }
  };



  return (
    <form>
      <div style={filterContainerStyle}>
        <label>
          Category:
          <span style={{ fontSize: "16px", marginRight: "6px" }}></span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="personal">Personal Item</option>
            <option value="electronics">Electronics</option>
            <option value="document">Document</option>
          </select>
        </label>
      
        <label>
          <Switch
          checked={selectedFilters.includes("keyword")}
          value="keyword"
          onChange={handleFilterChange}
         />
          <span style={{ fontSize: "16px", marginRight: "4px" }}></span>
          Keyword
        </label>
        <input
          type="text"
          placeholder="Keyword"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={filterOptionsStyle}
        />
        <label>
           <Switch
          checked={selectedFilters.includes("date")}
          value="date"
          onChange={handleFilterChange}
         />
          <span style={{ fontSize: "16px", marginRight: "4px" }}></span>
          Date
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={filterOptionsStyle}
        />

        <label>

           <Switch
          checked={selectedFilters.includes("location")}
          value="location"
          onChange={handleFilterChange}
         />
          <span style={{ fontSize: "16px", marginRight: "4px" }}></span>
          Location
        </label>

        <input
          type="number"
          placeholder="Radius (meters)"
          value={radius}
          onChange={(e) => setRadius(e.target.value)}
          style={filterOptionsStyle}
        />

        <MapWrapper setLocation={setLocation} />

        <button onClick={handleSubmit} style={filterButtonStyle}>
          Apply Filter
        </button>

        <button onClick={handleClearFilters} style={clearButtonStyle}>
          Clear Filter
        </button>
      </div>
    </form>
  );
};

export default FilterOptions;
