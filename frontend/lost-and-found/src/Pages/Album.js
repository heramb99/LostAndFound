import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardActions from "@mui/material/CardActions";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import axios from "axios";
import { API_URL } from "../config/api-end-points";
import sensitiveImg from "../Assets/Images/sensitive.jpg";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import DashboardOptions from "../constants/DashboardOptions";
import { ApiRequest } from "../helpers/api-request";
import { toast } from "react-toastify";
import { Form, Modal, Row, Col, Image } from "react-bootstrap";
import { BsImage } from "react-icons/bs";
import { v4 as uuid } from "uuid";
import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase-config";
import MapWrapper from "../Pages/LostItemForm/MapWrapper";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase-config";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import "./Album.css";

const Album = (props) => {
  const [revokeRequest, setRevokeRequest] = useState({
    itemId: "",
    userId: localStorage.getItem("user_email"),
  });

  const [currentLoggedinUser, setcurrentLoggedinUser] = useState(
    localStorage.getItem("user_email")
  );

  const [linkedLostItem, setLinkedLostItem] = useState(null);
  const [currentSelectedItemID, setcurrentSelectedItemID] = useState(null);
  const [seletectedPostedItem, setseletectedPostedItem] = useState(null);
  const [filterClaimStatus, setFilterClaimStatus] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showItemPostedModal, setshowItemPostedModal] = useState(false);

  const cardStyle = {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    boxShadow: 3,
    transition: "transform 0.3s, boxShadow 0.3s, border 0.3s", // Add transitions for a smoother hover effect
    outline: "0.5px solid black",
    "&:hover": {
      transform: "scale(1.05)",
      boxShadow: 5,
      outline: "2px solid #75E6A3", // Adjust the border color and size on hover
      cursor: "pointer",
    },
  };

  const longDescriptionStyle = {
    color: "grey",
    maxHeight: "30px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };
  const titleStyle = {
    maxHeight: "30px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };

  const noDataStyler = {
    display: "flex",
    justifyContent: "center",
  };

  const [searchFilter, setSearchFilter] = useState({
    filters: {},
    page: 0,
    size: 10,
    sortField: "postedAt",
    sortDirection: "DESC", // or 'DESC' depending on your requirement
  });

  useEffect(() => {
    setCurrentPage(1);
    setTotalPages(1);

    const fetchData = async () => {
      await getResult();
    };

    fetchData();
  }, [props.value, props.filterParams]);

  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [locations, setLocations] = useState([]);
  const [newImages, setNewImages] = useState([]);

  const handleEditInputChange = (e, field) => {
    const { value } = e.target;
    setseletectedPostedItem((prev) => ({ ...prev, [field]: value }));
  };

  const handleRevok = async (event) => {
    // const fetchData = async () => {

    setRevokeRequest((prevData) => ({
      ...prevData,
      itemId: event,
      // Update other properties as needed
    }));

    try {
      await ApiRequest.fetch({
        method: "put",
        url: `${API_URL}/api/v1/items/claims/revoke?itemId=${event}&userId=${revokeRequest.userId}`,
      });
      // setItems(response.content);
      toast.success("Request Revoked!");
      await getResult();
    } catch (error) {
      console.error("Error:", error);
    }
    // }
    // fetchData();
  };

  async function uploadImages(files) {
    try {
      const fileLinks = [];

      for (let index = 0; index < files.length; index++) {
        const file = files[index];
        let todayDate = new Date().getUTCMilliseconds().toString();
        const fileRef = ref(
          storage,
          `lostnfound/${file.name}-${todayDate}-${index}`
        );

        try {
          const snapshot = await uploadBytes(fileRef, file);
          const url = await getDownloadURL(snapshot.ref);
          fileLinks.push(url);
        } catch (error) {
          console.error("Error getting download URL:", error);
        }
      }
      return fileLinks;
    } catch (error) {
      console.error("Error uploading images:", error);
      return [];
    }
  }

  const handleItemPostedClick = async (item) => {
    if (props.value === 0) {
      setLocations([]);
      setseletectedPostedItem(item);
      setLinkedLostItem(item);
      setshowItemPostedModal(true);
    }
  };

  const handleAccept = async (itemId, claimRequestUserId) => {
 
    try {
      await ApiRequest.fetch({
        method: "put",
        url: `${API_URL}/api/v1/items/claims/accept?itemId=${currentSelectedItemID.id}&userId=${revokeRequest.userId}&claimRequestLostItemId=${itemId}`,
      }).then(async () => {
        await getResult();
        setShowModal(false);
        // ****************************
        //create chat document
 
        const newChatId = uuid();
        await setDoc(doc(db, "chats", newChatId), {
          "messages": []
        }).then(async (response) => {
 
          //add entry for both users
 
          const userDocRef1 = doc(db, "chatConnections", currentLoggedinUser);
          try {
 
            const snapshot1 = await getDoc(userDocRef1);
 
            if (snapshot1.exists()) {
              await updateDoc(doc(db, "chatConnections", currentLoggedinUser), {
                [newChatId]: {
                  "lastMessage": "",
                  "postedBy": currentLoggedinUser,
                  "requestBy": claimRequestUserId,
                  "lastUpdatedTimestamp": Date.now(),
                  "name": currentSelectedItemID.itemTitle,
                  "photoUrl": currentSelectedItemID.photoUrl,
                  "itemId": currentSelectedItemID.id
                }
 
              }).catch((error) => { console.error("Chat connection issue-1", error) });
            } else {
              await setDoc(doc(db, "chatConnections", currentLoggedinUser), {
                [newChatId]: {
                  "lastMessage": "",
                  "postedBy": currentLoggedinUser,
                  "requestBy": claimRequestUserId,
                  "lastUpdatedTimestamp": Date.now(),
                  "name": currentSelectedItemID.itemTitle,
                  "photoUrl": currentSelectedItemID.photoUrl,
                  "itemId": currentSelectedItemID.id
                }
 
              }).catch((error) => { console.error("Chat connection issue-1", error) });
            }
 
          } catch (error) {
            console.error('Error updating or creating document:');
          }
 
          const userDocRef2 = doc(db, "chatConnections", claimRequestUserId);
 
          try {
 
            const snapshot2 = await getDoc(userDocRef2);
            if (snapshot2.exists()) {
              await updateDoc(doc(db, "chatConnections", claimRequestUserId), {
 
                [newChatId]: {
                  "lastMessage": "",
                  "postedBy": currentLoggedinUser,
                  "requestBy": claimRequestUserId,
                  "lastUpdatedTimestamp": Date.now(),
                  "name": currentSelectedItemID.itemTitle,
                  "photoUrl": currentSelectedItemID.photoUrl,
                  "itemId": currentSelectedItemID.id
                }
 
              }).catch((error) => { console.error("Chat connection issue-3", error) });
            } else {
              await setDoc(doc(db, "chatConnections", claimRequestUserId), {
 
                [newChatId]: {
                  "lastMessage": "",
                  "postedBy": currentLoggedinUser,
                  "requestBy": claimRequestUserId,
                  "lastUpdatedTimestamp": Date.now(),
                  "name": currentSelectedItemID.itemTitle,
                  "photoUrl": currentSelectedItemID.photoUrl,
                  "itemId": currentSelectedItemID.id
                }
 
              }).catch((error) => { console.error("Chat connection issue-33", error) });
            }
          } catch (error) {
            console.error('Error updating or creating document:');
          }
        }
        ).catch((error) => { console.error("Chat array issue", error) });
 
        toast.success("Request Approved! You can now chat with the approved user", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
 
      });
 
      await getResult();
      setShowModal(false);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong!");
    }
  };

  const handleReject = async (itemId, claimRequestUserId) => {

    try {
      await ApiRequest.fetch({
        method: "put",
        url: `${API_URL}/api/v1/items/claims/reject?itemId=${currentSelectedItemID.id}&userId=${revokeRequest.userId}&claimRequestUserId=${claimRequestUserId}`,
      });
      await getResult();
      setShowModal(false);
      toast.success("Request Rejected!");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong!");
    }
  };

  const handleSaveChanges = async (item) => {
    const newfileLinks = await uploadImages(newImages);
    seletectedPostedItem.image = [
      ...seletectedPostedItem.image,
      ...newfileLinks,
    ];
    if (locations.length > 0) {
      seletectedPostedItem.location.x = locations[0].lng;
      seletectedPostedItem.location.y = locations[0].lat;
      seletectedPostedItem.location.coordinates = [
        locations[0].lng,
        locations[0].lat,
      ];
    }

    ApiRequest.fetch({
      method: "put",
      url: `${API_URL}/api/v1/items/${item.id}`,
      data: seletectedPostedItem,
    })
      .then((response) => {
        toast.success("Item Updated Successfully!", {
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
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => {
        getResult();
      });

    setshowItemPostedModal(false);
    setLocations([]);
    // setseletectedPostedItem(null);
  };

  const renderClaims = (item) => {
    const getValueArray = () => {
      switch (filterClaimStatus) {
        case 1:
          return item.claimRequested;
        case 2:
          return item.claimRequestAccepted;
        case 3:
          return item.claimRejected;
        default:
          return null;
      }
    };
    const selectedArray = getValueArray();

    return selectedArray ? (
      <React.Fragment>
        {Object.entries(selectedArray).map(([key, value]) => (
          <Grid item key={key} xs={12} sm={6} md={4} lg={3}>
            <Card key={key} sx={cardStyle}>
              <CardMedia
                component="div"
                sx={{
                  pt: "70%",
                  backgroundSize: "contain",
                  backgroundPosition: "center",
                }}
                image={item.image ? (item.sensitive ? sensitiveImg : item.image[0]) : ""}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom sx={titleStyle}>{item.title}</Typography>
                <Typography style={{ wordWrap: "break-word" }} gutterBottom>
                  User: {value}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  onClick={() =>
                    handleReviewRequest(key, item.id, item.title, item.image[0])
                  }
                  size="large"
                  style={{
                    backgroundColor: "#35ac65",
                    width: "100%",
                    color: "white",
                  }}
                >
                  Review
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </React.Fragment>
    ) : null;
  };

  async function getResult(currentPage = 0) {
    const currentLoggedinUser = localStorage.getItem("user_email");

    setItems([]);

    // Assuming `value` is defined somewhere in your component
    if (props.value === 0) {
      const updatedFilter = {
        ...searchFilter,
        page: currentPage,
        filters: {
          ...searchFilter.filters,
          foundItem: { value: true, mode: "equals" },
          createdBy: { value: currentLoggedinUser, mode: "equals" },
        },
      };
      if (
        typeof props.filterParams === "object" &&
        props.filterParams !== null
      ) {
        // Iterate over key-value pairs in props.filterParams and add filters
        Object.entries(props.filterParams).forEach(([key, fields]) => {
          // if (value != "") {
          if (key === "keyword")
            updatedFilter.filters[key] = {
              value: fields.value,
              mode: "contains",
            };
          // You can customize the mode if needed
          else if (key === "category")
            updatedFilter.filters[key] = {
              value: fields.value,
              mode: "equals",
            };
          else if (key === "location")
            updatedFilter.filters[key] = { value: fields.value, mode: "geo" };
          else if (key === "date") {
            const endDate = `${fields.value}`;
            // updatedFilter.filters.postedAt = {
            //   value: `${value}, 00:00:00 AM`,
            //   mode: "on",
            // };
            updatedFilter.filters.postedAt = {
              value: endDate,
              mode: "on",
            };
          }
          // }
          // You can customize the mode if needed
        });
      }
      getFilteredData(updatedFilter, setItems);
    } else if (props.value === 1) {
      const updatedFilter = {
        ...searchFilter,
        page: 0,
        size: 1000,
        filters: {
          ...searchFilter.filters,
          claimRequested: { value: currentLoggedinUser, mode: "contains" },
        },
      };
      try {
        ApiRequest.fetch({
          method: "get",
          url: `${API_URL}/api/v1/items/request-raised/${currentLoggedinUser}`,
          data: updatedFilter,
        }).then((response) => {
          setItems(response);
          // setTotalPages(response.totalPages);
          // setCurrentPage(response.number + 1);
        });
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      const updatedFilter = {
        ...searchFilter,
        page: 0,
        size: 1000,
        filters: {
          ...searchFilter.filters,
          createdBy: { value: currentLoggedinUser, mode: "equals" },
        },
      };
      getFilteredData(updatedFilter, setItems);
    }
  }

  function getFilteredData(updatedFilter, setItems) {
    try {
      ApiRequest.fetch({
        method: "post",
        url: `${API_URL}/api/v1/items/search`,
        data: updatedFilter,
      }).then((response) => {
        setItems(response.content);
        setTotalPages(response.totalPages);
        setCurrentPage(response.number + 1);
      });
    } catch (error) {
      console.error("Error:", error);
    }
  }
  const handleCloseModal = () => {
    setShowModal(false);
    setshowItemPostedModal(false);
  };

  const handleNewImagesChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setNewImages([...newImages, ...selectedFiles]);
  };
  const handleDeleteImage = (imageUrl) => {
    const updatedEditedFindItem = { ...seletectedPostedItem };
    updatedEditedFindItem.image = updatedEditedFindItem.image.filter(
      (img) => img !== imageUrl
    );
    setseletectedPostedItem(updatedEditedFindItem);
  };

  const handleDeleteNewImage = (index) => {
    const updatedNewImages = [...newImages];
    updatedNewImages.splice(index, 1);
    setNewImages(updatedNewImages);
  };

  const handleReviewRequest = (key, primeItemID, title, photoUrl) => {
    setcurrentSelectedItemID({
      id: primeItemID,
      itemTitle: title,
      photoUrl: photoUrl,
    });
    try {
      ApiRequest.fetch({
        method: "get",
        url: `${API_URL}/api/v1/items/` + key,
      }).then((response) => {
        setLinkedLostItem(response);
        setShowModal(true);
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleChange = (event) => {
    setFilterClaimStatus(event.target.value);
  };

  const Pagination = () => {
    const handleNextPage = () => {
      const newPage = Math.min(currentPage + 1, totalPages);
      setCurrentPage(newPage);
      getResult(newPage - 1);
    };

    const handlePrevPage = () => {
      const newPage = Math.max(currentPage - 1, 1);
      setCurrentPage(newPage);
      getResult(newPage - 1);
    };

    return (
      <>
        {totalPages > 0 ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            mt={3}
          >
            <Button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              variant="contained"
              color="primary"
            >
              Previous
            </Button>
            <Typography
              variant="h6"
              component="span"
              style={{ margin: "0 10px" }}
            >
              Page {currentPage} of {totalPages}
            </Typography>
            <Button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              variant="contained"
              color="primary"
            >
              Next
            </Button>
          </Box>
        ) : (
          ""
        )}
      </>
    );
  };

  return (
    <main>
      {props.value === 2 ? (
        <FormControl sx={{ width: 160 }} style={{ marginLeft: "190px" }}>
          <InputLabel id="demo-simple-select-label">Status</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={filterClaimStatus}
            label="Status"
            onChange={handleChange}
          >
            <MenuItem value={1}>Requested</MenuItem>
            <MenuItem value={2}>Approved</MenuItem>
            <MenuItem value={3}>Rejected</MenuItem>
          </Select>
        </FormControl>
      ) : (
        ""
      )}
      {items !== undefined && items !== null && items.length !== 0 ? (
        <Container sx={{ py: 3 }}>
          {props.value !== 2 ? (
            <Grid container spacing={4}>
              {items.map((item) => (
                <Grid item key={item.id} xs={12} sm={6} md={4} lg={3}>
                  <Card
                    sx={cardStyle}
                    onClick={() => handleItemPostedClick(item)}
                  >
                    <CardMedia
                      component="div"
                      sx={{
                        // 16:9
                        pt: "70%",
                        backgroundSize: "contain",
                        backgroundPosition: "center",
                      }}
                      image={item.image ? (item.sensitive ? sensitiveImg : item.image[0]) : ""}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography sx={titleStyle}>{item.title}</Typography>
                      <Typography
                        sx={longDescriptionStyle}
                      >
                        {item.description}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      {props.value === 1 ? (
                        <Button
                          onClick={() => handleRevok(item.id)}
                          size="large"
                          style={{
                            backgroundColor: "red",
                            width: "100%",
                            color: "white",
                          }}
                        >
                          Revoke
                        </Button>
                      ) : (
                        ""
                      )}
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Grid container spacing={4}>
              {items.map((item) => (
                <React.Fragment key={item.id}>
                  {renderClaims(item)}
                </React.Fragment>
              ))}
            </Grid>
          )}
        </Container>
      ) : (
        <div style={noDataStyler}>No Data</div>
      )}

      {props.value === 0 ? (
        <div>
          <Pagination />
        </div>
      ) : (
        ""
      )}

      <Modal
        show={showModal}
        onHide={handleCloseModal}
        dialogClassName="custom-modal"
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "#35ac65" }}>
            {"Linked Lost Item"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formTitle">
              <Form.Label
                style={{
                  color: "#333",
                  marginRight: "5px",
                  fontWeight: "bold",
                }}
              >
                Title
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title"
                value={linkedLostItem?.title || ""}
                readOnly
              />
            </Form.Group>
            <Form.Group controlId="formDescription">
              <Form.Label
                style={{
                  color: "#333",
                  marginRight: "5px",
                  fontWeight: "bold",
                }}
              >
                Description
              </Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Enter description"
                value={linkedLostItem?.description || ""}
                readOnly
              />
            </Form.Group>
            <Form.Label
              style={{
                color: "#333",
                marginRight: "5px",
                fontWeight: "bold",
              }}
            >
              Item Category
            </Form.Label>
            <Form.Select
              style={{ width: "100%", height: "40px" }}
              aria-label="personal"
              value={linkedLostItem?.category || "personal"}
              disabled
            >
              <option>Select Category</option>
              <option value="personal">Personal Item</option>
              <option value="electronics">Electronics</option>
              <option value="document">Document</option>
            </Form.Select>
            <Form.Label
              style={{
                color: "#333",
                marginRight: "5px",
                fontWeight: "bold",
                marginTop: "5px",
              }}
            >
              Images:
            </Form.Label>

            <Container>
              <Row>
                {(linkedLostItem?.image || []).map((img, index) => (
                  <Col
                    xs={4}
                    className="text-center p-2 shadow mb-4 item-edit-card"
                    key={index}
                  >
                    <div>
                      <Image
                        src={img}
                        alt={`Image ${index + 1}`}
                        style={{ height: "150px", width: "150px" }}
                      />
                    </div>
                  </Col>
                ))}
              </Row>
            </Container>
            <Form.Label
              style={{
                color: "#333",
                marginRight: "5px",
                fontWeight: "bold",
              }}
            >
              Posted Date
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter title"
              value={
                linkedLostItem?.postedAt
                  ? linkedLostItem.postedAt.split("T")[0]
                  : ""
              }
              readOnly
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-evenly",
            }}
          >
            {filterClaimStatus == 1 && props.value == 2 ? (
              <>
                <Button
                  variant="contained"
                  onClick={() =>
                    handleAccept(linkedLostItem.id, linkedLostItem.createdBy)
                  }
                  color="success"
                >
                  Accept
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() =>
                    handleReject(linkedLostItem.id, linkedLostItem.createdBy)
                  }
                >
                  Reject
                </Button>
              </>
            ) : (
              ""
            )}
            <Button
              variant="secondary"
              onClick={handleCloseModal}
              style={{
                backgroundColor: "grey",
                color: "white",
              }}
            >
              Close
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showItemPostedModal}
        onHide={handleCloseModal}
        dialogClassName="custom-modal"
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "#35ac65" }}>
            {"Edit Found Item"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formTitle">
              <Form.Label
                style={{
                  color: "#333",
                  marginRight: "5px",
                  fontWeight: "bold",
                }}
              >
                Title
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title"
                value={seletectedPostedItem?.title || ""}
                onChange={(e) => handleEditInputChange(e, "title")}
              />
            </Form.Group>
            <Form.Group controlId="formDescription">
              <Form.Label
                style={{
                  color: "#333",
                  marginRight: "5px",
                  fontWeight: "bold",
                }}
              >
                Description
              </Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Enter description"
                value={seletectedPostedItem?.description || ""}
                onChange={(e) => handleEditInputChange(e, "description")}
              />
            </Form.Group>
            <Form.Label
              style={{
                color: "#333",
                marginRight: "5px",
                fontWeight: "bold",
              }}
            >
              Item Category
            </Form.Label>
            <Form.Select
              style={{ width: "100%", height: "40px" }}
              aria-label="personal"
              onChange={(e) => handleEditInputChange(e, "category")}
              value={seletectedPostedItem?.category || "personal"}
            >
              <option>Select Category</option>
              <option value="personal">Personal Item</option>
              <option value="electronics">Electronics</option>
              <option value="document">Document</option>
            </Form.Select>
            <Form.Label
              style={{
                color: "#333",
                marginRight: "5px",
                fontWeight: "bold",
                marginTop: "5px",
              }}
            >
              Images:
            </Form.Label>
            <Container>
              <Row>
                {(seletectedPostedItem?.image || []).map((img, index) => (
                  <Col
                    xs={4}
                    className="text-center p-2 shadow mb-4 item-edit-card"
                    key={index}
                  >
                    <div>
                      <Image
                        src={img}
                        alt={`Image ${index + 1}`}
                        style={{ height: "150px", width: "150px" }}
                      />
                    </div>
                    <Button
                      className="delete-image-button mt-2"
                      onClick={() => handleDeleteImage(img)}
                      variant="danger"
                      size="sm"
                      block
                    >
                      Delete
                    </Button>
                  </Col>
                ))}

                {newImages?.map((img, index) => (
                  <Col
                    xs={4}
                    className="text-center p-2 shadow mb-4 item-edit-card"
                    key={index}
                  >
                    <div>
                      <Image
                        src={URL.createObjectURL(newImages[index])}
                        alt={`Image ${index + 1}`}
                        style={{ height: "150px", width: "150px" }}
                      />
                    </div>
                    <Button
                      className="delete-image-button mt-2"
                      onClick={() => handleDeleteNewImage(index)}
                      variant="danger"
                      size="sm"
                      block
                    >
                      Delete
                    </Button>
                  </Col>
                ))}
              </Row>
            </Container>

            <Row className="mb-3 align-items-center">
              <Col xs={6} md={4} className="d-flex">
                <Form.Label style={{ fontWeight: "bold" }}>
                  Add New Images:
                </Form.Label>
              </Col>
              <Col xs={6} md={8} className="d-flex align-items-center">
                <label
                  htmlFor="fileInput"
                  style={{
                    cursor: "pointer",
                    color: "#007bff",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <BsImage style={{ marginRight: "5px" }} />
                  Choose Images
                </label>
                <Form.Control
                  style={{ display: "none" }}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleNewImagesChange}
                  className="lost-item-input"
                  id="fileInput"
                />
              </Col>
            </Row>

            <div className="lost-item-group  mt-3">
              <Form.Label style={{ color: "#333", fontWeight: "bold" }}>
                Location Picker
              </Form.Label>
              <MapWrapper
                locations={
                  locations.length > 0
                    ? locations
                    : [
                        {
                          lat: seletectedPostedItem?.location?.y,
                          lng: seletectedPostedItem?.location?.x,
                        },
                      ]
                }
                setLocationsFun={setLocations}
                isEdit={true}
              />
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleSaveChanges}
            className="save-color-button"
            style={{
              backgroundColor: "#35ac65",
              color: "white",
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </main>

    // </ThemeProvider>
  );
};

export default Album;
