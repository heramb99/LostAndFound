import React, { useEffect, useMemo, useState } from "react";
import { Button, Dropdown, Form, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import noImg from "../../Assets/Images/No-Image-Placeholder.png";
import sensitiveImg from "../../Assets/Images/sensitive.jpg";
import FilterOptions from "../../Components/FilterOptions";
import { API_URL } from "../../config/api-end-points";
import { ApiRequest } from "../../helpers/api-request";

const LostCatalogue = () => {
  const [isFilterOpen, setFilterOpen] = useState(true);
  const [items, setItems] = useState([]);
  const [lostItems, setlostItems] = useState([]);
  const toggleFilter = () => setFilterOpen(!isFilterOpen);
  const BaseColor = "#35ac65";

  const [showClaimModal, setShowClaimModal] = useState(false);
  const [selectedLinkItem, setSelectedLinkItem] = useState(null);
  const [currentClaimItem, setCurrentClaimItem] = useState(null);

  const containerFlexStyle = {
    display: "flex",
    width: "100%",
    justifyContent: "center",
  };

  const componentAStyle = {
    flex: "1",
    padding: "16px",
    boxShadow: "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)",
    outline: "2px solid #35ac65",
    padding: "20px",
    borderBottom: "none",
  };

  const componentBStyle = {
    flex: "3",
    padding: "16px",
  };

  const cardStyle = {
    background: "#fff",
    borderRadius: "8px",
    padding: "16px 16px 25px 16px",
    marginBottom: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    transition: "transform 0.2s",
    cursor: "pointer",
    overflow: "hidden",
    height: "360px",
    width: "100%",
  };

  const cardHoverStyle = {
    transform: "scale(1.05)",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
  };

  const imageStyle = {
    width: "200px",
    height: "200px",
    borderRadius: "8px",
    objectFit: "cover",
  };

  const itemInfoStyle = {
    flex: "1",
    marginLeft: "16px",
    textAlign: "center",
  };

  const itemNameStyle = {
    color: "#333",
    fontSize: "20px",
    // margin: "0",
    // maxHeight: "30px",
    maxHeight: "1.4em",
    overflow: "hidden",
    textOverflow: "ellipsis",
    // whiteSpace: "nowrap",
  };

  const itemTextStyle = {
    color: "#333",
    fontSize: "15px",
    margin: "4px 0px",
    maxHeight: "1.4em",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  const defaultImageStyle = {
    width: "200px",
    height: "200px",
    borderRadius: "8px",
    objectFit: "cover",
    background: "#f0f0f0",
  };

  const buttonStyle = {
    backgroundColor: "#35ac65",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    padding: "8px 16px",
    cursor: "pointer",
    width: "200px",
  };

  const lightButtonStyle = {
    backgroundColor: "#75e6a3",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    padding: "8px 16px",
    cursor: "pointer",
    pointerEvents: "none",
    width: "200px",
  };

  const itemContainerStyle = {
    display: "flex",
    flexWrap: "wrap",
    width: "100%",
  };

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
    backgroundColor: BaseColor,
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
  const userEmail = localStorage.getItem("user_email");
  const fetchItemsData = async () => {
    const filters = {
      createdBy: {
        value: userEmail,
        mode: "equals",
      },
      foundItem: {
        value: false,
        mode: "equals",
      },
    };

    const requestBody = {
      filters,
      page: 0,
      size: 500,
      sortField: "postedAt",
      sortDirection: "DESC",
    };

    ApiRequest.fetch({
      method: "post",
      url: `${API_URL}/api/v1/items/search`,
      data: requestBody,
    })
      .then((lostItemList) => {
        setlostItems([...lostItemList.content]);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const openClaimModal = () => {
    fetchItemsData();
    setShowClaimModal(true);
  };

  const closeClaimModal = () => {
    setShowClaimModal(false);
  };

  const submitClaim = (itemId) => {
    if (!selectedLinkItem) {
      toast.error("Link your lost item to proceed!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return;
    }
    ApiRequest.fetch(
      {
        method: "put",
        url: `${API_URL}/api/v1/items/claims/request`,
        params: {
          itemId: currentClaimItem,
          userId: userEmail,
          lostItemId: selectedLinkItem.id,
        },
      },
      false
    )
      .then((data) => {
        toast.success("Claim Request Raised Successfully!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      })
      .catch((e) => {
        console.log("error", e);
      })
      .finally(() => {
        setShowClaimModal(false);
        setSelectedLinkItem(null);
        setCurrentClaimItem(null);
        fetchData();
      });
  };

  const handleClaimModal = (id) => {
    setCurrentClaimItem(id);
    openClaimModal();
  };
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedItems, setPaginatedItems] = useState([]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchData(newPage);
  };

  const Pagination = ({ totalPages, currentPage, handlePageChange }) => {
    const visiblePages = 10;
    const totalSets = Math.ceil(totalPages / visiblePages);
    const currentSet = Math.ceil(currentPage / visiblePages);

    const renderPaginationButtons = () => {
      const buttons = [];

      const startPage = (currentSet - 1) * visiblePages + 1;
      const endPage = Math.min(currentSet * visiblePages, totalPages);

      for (let page = startPage; page <= endPage; page++) {
        buttons.push(
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            style={{
              backgroundColor: currentPage === page ? BaseColor : "transparent",
              color: currentPage === page ? "#fff" : BaseColor,
              border: "none",
              borderRadius: "4px",
              padding: "8px 16px",
              margin: "4px",
              cursor: "pointer",
            }}>
            {page}
          </button>
        );
      }

      return buttons;
    };

    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        {currentSet > 1 && (
          <button
            onClick={() => handlePageChange((currentSet - 1) * visiblePages)}
            style={{
              backgroundColor: BaseColor,
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              padding: "8px 16px",
              margin: "4px",
              cursor: "pointer",
            }}>
            {"<<"}
          </button>
        )}
        {renderPaginationButtons()}
        {currentSet < totalSets && (
          <button
            onClick={() => handlePageChange(currentSet * visiblePages + 1)}
            style={{
              backgroundColor: BaseColor,
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              padding: "8px 16px",
              margin: "4px",
              cursor: "pointer",
            }}>
            {">>"}
          </button>
        )}
      </div>
    );
  };

  const renderPagination = () => {
    return (
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        handlePageChange={handlePageChange}
      />
    );
  };

  const ItemCard = ({ item }) => {
    const {
      title,
      image,
      postedAt,
      location,
      sensitive,
      description,
      id,
      claimRequested,
      claimedBy,
      claimRequestAccepted,
    } = item;

    const renderItemImage = () => {
      if (sensitive) {
        return (
          <img
            src={sensitiveImg}
            alt="Default"
            style={{
              ...defaultImageStyle,
              objectFit: "cover",
              width: "200px",
              height: "200px",
            }}
          />
        );
      } else {
        if (!image) {
          return (
            <img
              src={noImg}
              alt="Default"
              style={{
                ...defaultImageStyle,
                objectFit: "cover",
                width: "200px",
                height: "200px",
              }}
            />
          );
        } else {
          return (
            <img
              src={image[0]}
              alt={title}
              style={{
                ...imageStyle,
                objectFit: "cover",
                width: "200px",
                height: "200px",
              }}
            />
          );
        }
      }
    };

    const [isHovered, setHovered] = useState(false);

    const cardContentStyle = {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      height: "100%",
    };

    return (
      <div
        style={{
          ...cardStyle,
          width: "calc(33.33% - 2.5%)",
          margin: "1.25%",
          ...(isHovered && cardHoverStyle),
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}>
        <div style={cardContentStyle}>
          <div style={{ textAlign: "center" }}>{renderItemImage()}</div>
          <div style={itemInfoStyle}>
            <p style={itemNameStyle}>{title}</p>
            <p style={itemTextStyle}>
              Posted at: {new Date(postedAt).toLocaleDateString("en-CA")}
            </p>
            <p style={itemTextStyle}>Description: {description}</p>
          </div>
          <div style={{textAlign:'center'}}>
          {claimedBy == userEmail ? (
            <button style={lightButtonStyle}>Claim Approved</button>
          ) : Object.values(claimRequestAccepted).some(
              (filter) => filter === userEmail
            ) ? (
            <button style={lightButtonStyle}>Claim Accepted</button>
          ) : Object.values(claimRequested).some(
              (filter) => filter === userEmail
            ) ? (
            <button style={lightButtonStyle}>Claim Requested</button>
          ) : (
            <button
              onClick={() => {
                handleClaimModal(id);
              }}
              style={buttonStyle}>
              Claim
            </button>
          )}
        </div>
        </div>
      </div>
    );
  };

  const ItemList = ({ items }) => {
    return (
      <div style={{ display: "flex", flexWrap: "wrap", width: "100%" }}>
        {items?.map((item, index) => (
          <ItemCard key={index} item={item} />
        ))}
      </div>
    );
  };

  const [totalPages, setTotalPages] = useState(0);

  const fetchData = (page = 1, filterParams = {}) => {
    const requestBody = {
      filters: {
        foundItem: {
          value: true,
          mode: "equals",
        },
        ...filterParams,
        returned: {
          value: false,
          mode: "equals",
        },
      },
      page: page - 1,
      size: itemsPerPage,
      sortField: "postedAt",
      sortDirection: "DESC",
    };

    ApiRequest.fetch({
      method: "post",
      url: `${API_URL}/api/v1/items/search`,
      data: requestBody,
    })
      .then((data) => {
        setItems(data.content);
        setTotalPages(data.totalPages);
        setPaginatedItems(data.content);
      })
      .catch((e) => {});
  };

  useEffect(() => {
    fetchData();
  }, []);

  const MemoizedItemList = useMemo(() => {
    return <ItemList items={paginatedItems} />;
  }, [paginatedItems]);

  const applyFilter = (filterParams) => {
    fetchData(1, filterParams);
  };

  const openLostItemPage = () => {
    window.location = "/lost-form";
  };

  return (
    <div>
      <div style={containerFlexStyle}>
        <div style={componentAStyle}>
          <div style={filterLabelContainerStyle}>
            <div
              style={filterLabelStyle}
              className="filter-toggle"
              onClick={toggleFilter}>
              {isFilterOpen ? "Hide Filter Options" : "Show Filter Options"}
            </div>
          </div>
          {isFilterOpen && (
            <div style={filterOptionsContainerStyle}>
              <FilterOptions applyFilter={applyFilter} />
            </div>
          )}
        </div>
        <div style={componentBStyle}>
          <h1 style={{ textAlign: "center", fontSize: "40px", color: "#333" }}>
            LOST CATALOGUE:
          </h1>
          {MemoizedItemList}
          {renderPagination()}
        </div>
      </div>
      {showClaimModal && (
        <Modal show={showClaimModal} onHide={closeClaimModal}>
          <Modal.Header closeButton>
            <Modal.Title>
              <h5 className="mb-0">Select Lost Item to Link</h5>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="mb-5 pb-5">
            <Form className="mb-5">
              <Form.Group controlId="lostItemLink">
                <div className="d-flex flex-row">
                  <Form.Label>Select Lost Item:</Form.Label>
                  <Dropdown>
                    <Dropdown.Toggle
                      variant="light"
                      id="dropdown-basic"
                      style={{ width: "250px", marginLeft: "30px" }}>
                      {selectedLinkItem
                        ? selectedLinkItem.title
                        : "No Option Selected"}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {lostItems?.map((item) => (
                        <Dropdown.Item
                          key={item.id}
                          style={{
                            width: "250px",
                            marginRight: "10px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                          onClick={() => setSelectedLinkItem(item)}>
                          <img
                            src={item.image[0]}
                            alt={item.title}
                            style={{
                              width: "50px",
                              height: "40px",
                              marginRight: "10px",
                            }}
                          />
                          {item.title}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="info" onClick={openLostItemPage}>
              Report New Lost Item
            </Button>
            <Button variant="secondary" onClick={closeClaimModal}>
              Close
            </Button>
            <Button variant="success" onClick={submitClaim}>
              Submit Claim
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default LostCatalogue;
