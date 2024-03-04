import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import noImg from '../Assets/Images/No-Image-Placeholder.png';
import sensitiveImg from '../Assets/Images/sensitive.jpg';
import { API_URL } from "../config/api-end-points";
import { ApiRequest } from '../helpers/api-request';
import './MainDashboardComponent.css';
import MapWrapper from './MapWrapper';

const LostCatalogue = () => {
  const [isFilterOpen, setFilterOpen] = useState(true);
  const [items, setItems] = useState([]);
  const toggleFilter = () => setFilterOpen(!isFilterOpen);
  const BaseColor = '#35ac65';
  
  const containerFlexStyle = {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
  };
  const componentAStyle = {
    flex: '1',
    padding: '16px',
  };

  const componentBStyle = {
    flex: '3',
    padding: '16px',
  };

  const cardStyle = {
    background: '#fff',
    borderRadius: '8px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    transition: 'transform 0.2s',
    cursor: 'pointer',
    overflow: 'hidden',
  };
  
  const cardHoverStyle = {
    transform: 'scale(1.05)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
  };

  const imageStyle = {
    width: '200px',
    height: '200px',
    borderRadius: '8px',
    objectFit: 'cover',
  };

  const itemInfoStyle = {
    flex: '1',
    marginLeft: '16px',
    textAlign: 'center',
  };

  const itemNameStyle = {
    color: '#333',
    fontSize: '20px',
    margin: '0',
  };

  const itemTextStyle = {
    color: '#333',
    fontSize: '15px',
    margin: '4px 0',
  };

  const defaultImageStyle = {
    width: '200px',
    height: '200px',
    borderRadius: '8px',
    objectFit: 'cover',
    background: '#f0f0f0',
  };

  const buttonStyle = {
    backgroundColor: BaseColor,
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    padding: '8px 16px',
    cursor: 'pointer',
  };

  const itemContainerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
  };

  const filterContainerStyle = {
    width: '100%',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
  };


  const filterOptionsStyle = {
    width: '100%',
    border: '1px solid #ddd',
    borderRadius: '4px',
    padding: '8px',
    margin: '8px 0',
  };

  const filterButtonStyle = {
    backgroundColor: BaseColor,
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    padding: '8px 16px',
    margin: '8px 0',
    cursor: 'pointer',
  };
  const clearButtonStyle = {
    backgroundColor: '#cf534e',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    padding: '8px 16px',
    margin: '8px 0',
    cursor: 'pointer',
  };

  const filterLabelStyle = {
    width: '75%',
    background: BaseColor,
    color: '#fff',
    fontSize: '20px',
    padding: '5px 0',
    textAlign: 'center',
    cursor: 'pointer',
  };
  const filterLabelContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
  };
  const filterOptionsContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  // Pagination settings
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
 

  const paginatedItems = items.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const renderPagination = () => {
    const totalPages = Math.ceil(items.length / itemsPerPage);
    const pagination = [];

    for (let page = 1; page <= totalPages; page++) {
      pagination.push(
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          style={{
            backgroundColor: currentPage === page ? BaseColor : 'transparent',
            color: currentPage === page ? '#fff' : BaseColor,
            border: 'none',
            borderRadius: '4px',
            padding: '8px 16px',
            margin: '4px',
            cursor: 'pointer',
          }}
        >
          {page}
        </button>
      );
    }

    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>{pagination}</div>
    );
  };

  const ItemCard = ({ item }) => {
    const { title, image, postedAt, location, sensitive, description } = item;
  
    const renderItemImage = () => {
      if (sensitive) {
        return <img src={sensitiveImg} alt="Default" style={defaultImageStyle} />;
      } else {
        if (!image) {
          
        return <img src={noImg} alt="Default" style={defaultImageStyle} />;

        } else {
          return <img src={image[0]} alt={title} style={imageStyle} />;
        }
      }
    };
  
    const [isHovered, setHovered] = useState(false);
  
    const cardContentStyle = {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100%',
    };
  
    return (
      <div
        style={{
          ...cardStyle,
          width: 'calc(33.33% - 2.5%)',
          margin: '1.25%',
          ...(isHovered && cardHoverStyle), // Apply hover style
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div style={cardContentStyle}>
          <div style={{textAlign:'center'}}>
          {renderItemImage()}
          </div>
          <div style={itemInfoStyle}>
            <h3 style={itemNameStyle}>{title}</h3>
            <p style={itemTextStyle}>Posted at: {postedAt}</p>
            {/* <p style={itemTextStyle}>Location: {location}</p> */}
            <p style={itemTextStyle}>Description: {description}</p>
          </div>
          <button style={buttonStyle}>Claim</button>
        </div>
      </div>
    );
  };
  
  
  
  
  const ItemList = ({ items }) => {
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
      {items?.map((item, index) => (
          <ItemCard key={index} item={item} />
        ))}
      </div>
    );
  };
  
  const FilterOptions = () => {
    const [selectedFilters, setSelectedFilters] = useState([]);
  const [location, setLocation] = useState('');
  const [radius, setRadius] = useState('');
  const [keyword, setKeyword] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
    
  
    const handleFilterChange = (event) => {
      const value = event.target.value;
      if (selectedFilters.includes(value)) {
        setSelectedFilters(selectedFilters.filter((filter) => filter !== value));
      } else {
        setSelectedFilters([...selectedFilters, value]);
      }
    };
  
    const handleClearFilters = () => {
      // Clear all filter values and reset the filters
      setSelectedFilters([]);
      setLocation('');
      setRadius('');
      setKeyword('');
      setSelectedDate('');
      setSelectedCategory('');
    };
  
    const handleSubmit = (event) => {
      event.preventDefault();
      if (selectedFilters.includes('category') && selectedCategory === '') {
        toast.error('Please select a category!', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        });
      } else if (selectedFilters.includes('date') && selectedDate === '') {
        toast.error('Please select a date!', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        });
      } else if (selectedFilters.includes('keyword') && keyword === '') {
        toast.error('Please enter a keyword!', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        });
      } else {
     

      // Check if "Location" filter is checked
  const isLocationFilterChecked = selectedFilters.includes('location');

  if (isLocationFilterChecked && (!location || !radius)) {
    toast.error('please select location and radius!', {
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

  // Check if "Keyword" filter is checked
  if (selectedFilters.includes('keyword') && keyword) {
    filterParams.keyword = keyword;
  }

  // Check if "Date" filter is checked
  if (selectedFilters.includes('date') && selectedDate) {
    filterParams.date = selectedDate;
  }

  // Check if "Location" filter is checked
  if (selectedFilters.includes('location') && location && radius) {
    let selectedLong = location[0]?.lng ? location[0]?.lng : ''
  let selectedLat = location[0]?.lat ? location[0]?.lat : ''
    filterParams.longitude = selectedLong;
    filterParams.latitude = selectedLat;
    filterParams.distance = radius;
  }

  // Check if "Category" filter is selected
  if (selectedCategory) {
    filterParams.category = selectedCategory;
  }


      ApiRequest.fetch({
        method: 'get',
        url: `${API_URL}/api/v1/item/get-list-by-filter?isFoundItem=true`,
        params: filterParams,
    }).then((data) => {
      setItems(data);
    }).catch(e => { })
    };
  }

    

    return (
      <form  >
        <div style={filterContainerStyle}>
        <label>
            Category:
            <span style={{fontSize:'16px',marginRight:'6px'}}></span>

            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              <option value="">All Categories</option>
              <option value="personal">Personal Item</option>
              <option value="electronics">Electronics</option>
              <option value="document">Document</option>
            </select>
          </label>
          <label >
            <input
              type="checkbox"
              value="keyword"
              checked={selectedFilters.includes('keyword')}
              onChange={handleFilterChange}
            />
            <span style={{fontSize:'16px',marginRight:'4px'}}></span>
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
            <input
              type="checkbox"
              value="date"
              checked={selectedFilters.includes('date')}
              onChange={handleFilterChange}
            />
            <span style={{fontSize:'16px',marginRight:'4px'}}></span>

            Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={filterOptionsStyle}
          />
           
          <label>
            <input
              type="checkbox"
              value="location"
              checked={selectedFilters.includes('location')}
              onChange={handleFilterChange}
            />
            <span style={{fontSize:'16px',marginRight:'4px'}}></span>

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
  
  

  useEffect(() => {
    
      ApiRequest.fetch({
        method: 'get',
        url: `${API_URL}/api/v1/item/get-list?isFoundItem=true`
    }).then((data) => {
      setItems(data);
    }).catch(e => { })
 
  }, [])

  const MemoizedItemList = useMemo(() => {
    return <ItemList items={paginatedItems} />;
  }, [paginatedItems]);


  return (
    <div>
      {/* <Navbar></Navbar> */}
    <div style={containerFlexStyle}>
      <div style={componentAStyle}>
        <div style={filterLabelContainerStyle}>
          <div style={filterLabelStyle} className="filter-toggle" onClick={toggleFilter}>
            {isFilterOpen ? 'Hide Filter Options' : 'Show Filter Options'}
          </div>
        </div>
        {isFilterOpen && (
          <div style={filterOptionsContainerStyle}>
            <FilterOptions />
          </div>
        )}
      </div>
      <div style={componentBStyle}>
      <h1 style={{ textAlign: 'center', fontSize: '40px', color: '#333' }}>
  LOST CATALOGUE:
</h1>

        {MemoizedItemList}
        {renderPagination()}
      </div>
    </div>
    </div>
  );
};

export default LostCatalogue;
