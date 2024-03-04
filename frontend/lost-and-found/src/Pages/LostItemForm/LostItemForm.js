import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  Image,
  Modal,
  Row,
} from "react-bootstrap";
import { BsImage } from "react-icons/bs";
// import { CSSTransition } from 'react-transition-group';
// import LocationPicker from './LocationPicker';
// import 'leaflet/dist/leaflet.css';

import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {
  FileArrowUpFill,
  PencilSquare,
  XCircle
} from "react-bootstrap-icons";
import { toast } from "react-toastify";
import { API_URL } from "../../config/api-end-points.js";
import { ApiRequest } from "../../helpers/api-request.js";
import { storage } from "./../../firebase-config.js";
import "./LostItemForm.css";
import MapWrapper from "./MapWrapper";

const LostItemForm = () => {
  const [formData, setFormData] = useState({
    itemName: "",
    itemDescription: "",
    isSensitive: false,
    category: "",
  });
  const fileInputRef = useRef(null);
  const userEmail = localStorage.getItem("user_email");
  const [errorMessage, setErrorMessage] = useState(null);
  const [alertType, setAlertType] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedLostItem, setSelectedLostItem] = useState(null);
  const [editedLostItem, setEditedLostItem] = useState(null);
  const [lostItems, setlostItems] = useState([]);
  const [locations, setLocations] = useState([]);
  const [refreshMap, setRefreshMap] = useState(true);

  const [mediaFiles, setMediaFiles] = useState([]);

  const [newImages, setNewImages] = useState([]);

  const selectedFileNames = new Set();
  const handleEdit = (lostItem) => {
    setLocations([]);
    setSelectedLostItem(lostItem);
    setEditedLostItem({ ...lostItem });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedLostItem(null);
    setNewImages([]);
  };
  const handleSaveChanges = async () => {
    const newfileLinks = await uploadImages(newImages);
    editedLostItem.image = [...editedLostItem.image, ...newfileLinks];
    if (locations.length > 0) {
      editedLostItem.location.x = locations[0].lng;
      editedLostItem.location.y = locations[0].lat;
      editedLostItem.location.coordinates = [
        locations[0].lng,
        locations[0].lat,
      ];
    }

    ApiRequest.fetch({
      method: "put",
      url: `${API_URL}/api/v1/items/${editedLostItem.id}`,
      data: editedLostItem,
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
        setRefreshMap(false);
        setRefreshMap(true);
        fetchItemsData();
      });

    setShowModal(false);
    setSelectedLostItem(null);
  };

  const handleNewImagesChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setNewImages([...newImages, ...selectedFiles]);
  };
  const handleDeleteImage = (imageUrl) => {
    const updatedEditedLostItem = { ...editedLostItem };
    updatedEditedLostItem.image = updatedEditedLostItem.image.filter(
      (img) => img !== imageUrl
    );
    setEditedLostItem(updatedEditedLostItem);
  };

  const handleDeleteNewImage = (index) => {
    const updatedNewImages = [...newImages];
    updatedNewImages.splice(index, 1);
    setNewImages(updatedNewImages);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleEditInputChange = (e, field) => {
    const { value } = e.target;
    setEditedLostItem((prev) => ({ ...prev, [field]: value }));
  };
  const removeImage = (index) => {
    const updatedImages = [...editedLostItem.image];
    updatedImages.splice(index, 1);
    setEditedLostItem((prev) => ({ ...prev, image: updatedImages }));
  };

  useEffect(() => {
    fetchItemsData();
  }, []);

  async function fetchItemsData() {
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
      size: 20,
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
  }

  const handleMediaChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const newFiles = selectedFiles.filter(
      (file) => !selectedFileNames.has(file.name)
    );
    setMediaFiles([...mediaFiles, ...newFiles]);
    newFiles.forEach((file) => selectedFileNames.add(file.name));
    // console.log(mediaFiles,selectedFileNames)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!locations) {
      toast.error("Please select a location", {
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
    if (!formData["category"]) {
      toast.error("Please select a category", {
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
    //uploading images
    const fileLinks = await uploadImages(mediaFiles);
    const coordinates = [locations[0].lng, locations[0].lat];
    //submitting form data
    try {
      const dataToSend = {
        title: formData["itemName"],
        description: formData["itemDescription"],
        createdBy: userEmail,
        image: fileLinks,
        location: {
          coordinates: coordinates,
          type: "Point",
        },
        foundItem: false,
        sensitive: formData["isSensitive"],
        category: formData["category"],
      };

      ApiRequest.fetch({
        method: "post",
        url: `${API_URL}/api/v1/items`,
        data: dataToSend,
      })
        .then((response) => {
          toast.success("Lost Item Reported!!", {
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
          toast.error("Item not reported, Try Again!", {
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
        .finally(() => {
          setRefreshMap(false);
          setRefreshMap(true);
      fetchItemsData();

        });
      setFormData({
        itemName: "",
        itemDescription: "",
        isSensitive: false,
        category: "",
      });
      setLocations([]);
      setMediaFiles([]);
      // setErrorMessage("Lost Item Reported!!");
      // window.location = '/home'
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    } catch (error) {
      // Handle login errors
      setErrorMessage(
        error.response?.data?.error_description ||
          "An error occurred during form submission"
      );
      setAlertType(false);
    }
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

  const removeFile = (index) => {
    const updatedMediaList = [...mediaFiles];
    const filename = updatedMediaList[index].name;
    updatedMediaList.splice(index, 1);
    setMediaFiles(updatedMediaList);
    selectedFileNames.delete(filename);
  };

  return (
    <div style={{ height: "100vh", overflow: "hidden" }}>
      <div className="app">
        <div
          className="section"
          style={{ width: "40%", overflowY: "scroll", paddingBottom: "120px" }}>
          <h2
            style={{ textAlign: "center", color: "#333", fontWeight: "bold" }}>
            Your Recent lost items
          </h2>
          <div style={{ marginRight: "20px", marginLeft: "20px" }}>
            {lostItems.length == 0 ? (
              <h6 style={{ textAlign: "center" }}>
                You haven't posted any lost item
              </h6>
            ) : (
              lostItems.map((lostItem, index) => (
                <Card
                  className="shadow mb-2" 
                  style={{
                    width: "100%",
                    height: "200px",
                    position: "relative",
                    borderRadius:'10px'
                  }}
                  key={index}>
                  <li className="item-card" style={{ height: "100%", overflow:'hidden' }}>
                    <div
                      className="item-actions"
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        zIndex: "1",
                      }}>
                      <PencilSquare
                        size={20}
                        className="mr-2"
                        onClick={() => handleEdit(lostItem)}
                      />
                    </div>
                    <img
                      className="card-image"
                      src={lostItem.image[0]}
                      alt={lostItem.title}
                    />
                    <div className="item-detail">
                      <h6 className="item-row">
                        <strong>Name: </strong>
                       <p className="title-styling" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",width:'150px' }}> {lostItem.title}</p>
                      </h6>
                      <h6 className="item-row">
                        <strong>Description: </strong>
                        {lostItem.description.slice(0, 12) + "..."}
                      </h6>
                      <h6 className="item-row">
                        <strong>Category: </strong>
                        {lostItem.category}
                      </h6>
                      <h6 className="item-row">
                        <strong>Date: </strong>
                        {new Date(lostItem.postedAt).toLocaleDateString(
                          "en-CA"
                        )}
                      </h6>
                      <h6 className="item-row">
                        <strong>Found Status: </strong>
                        {lostItem.foundItem ? "Found" : "Not Found"}
                      </h6>
                    </div>
                  </li>
                </Card>
              ))
            )}
          </div>
        </div>
        <div
          className="section"
          style={{ width: "60%", overflowY: "scroll", paddingBottom: "130px" }}>
          <h2
            style={{ textAlign: "center", color: "#333", fontWeight: "bold" }}>
            Add New lost item here!
          </h2>
          <Form onSubmit={handleSubmit} className="lost-item-form">
            <Form.Group className="lost-item-group">
              <Form.Label style={{ color: "#333", fontWeight: "bold" }}>
                Item Name
              </Form.Label>
              <Form.Control
                type="text"
                name="itemName"
                value={formData.itemName}
                onChange={handleInputChange}
                className="lost-item-input"
                required
              />
            </Form.Group>
            <Form.Group className="lost-item-group">
              <Form.Label
                style={{
                  color: "#333",
                  marginRight: "5px",
                  fontWeight: "bold",
                }}>
                Item Description
              </Form.Label>
              <Form.Control
                as="textarea"
                name="itemDescription"
                value={formData.itemDescription}
                onChange={handleInputChange}
                className="lost-item-textarea"
                required
              />
            </Form.Group>
            <Form.Group className="lost-item-group">
              <Form.Label
                style={{
                  color: "#333",
                  marginRight: "5px",
                  fontWeight: "bold",
                }}>
                Item Category
              </Form.Label>
              <Form.Select
                style={{ width: "100%", height: "40px" }}
                aria-label="personal"
                onChange={handleInputChange}
                name="category"
                value={formData.category}>
                <option>Select Category</option>
                <option value="personal">Personal Item</option>
                <option value="electronics">Electronics</option>
                <option value="document">Document</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="lost-item-group">
              <Form.Check
                type="checkbox"
                label="Is this item sensitive? or consists any sensitive items?"
                name="isSensitive"
                checked={formData.isSensitive}
                onChange={handleInputChange}
                className="lost-item-checkbox"
              />
            </Form.Group>
            <Form.Group className="lost-item-group">
              <Form.Label style={{ color: "#333", fontWeight: "bold" }}>
                Upload Images or Videos
              </Form.Label>
              <Form.Control
                ref={fileInputRef}
                style={{ height: "fit-content" }}
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleMediaChange}
                className="lost-item-input"
                required
              />
            </Form.Group>
            <div className="lost-item-group">
              <h6 style={{ color: "#333", fontWeight: "bold" }}>
                Selected Files
              </h6>
              <ul>
                {mediaFiles.map((mediaFile, index) => (
                  <Card key={index}>
                    <li
                      className="border shadow p-2"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}>
                      <div style={{ overflow: "hidden" }}>
                        <FileArrowUpFill className="mr-2" />
                        {mediaFile.name}
                      </div>
                      <Button
                        className="ml-1"
                        style={{
                          backgroundColor: "white",
                          height: "10xp",
                          width: "10xp",
                          border: "1px solid white",
                        }}
                        onClick={() => removeFile(index)}>
                        <XCircle style={{ color: "red" }} />
                      </Button>
                    </li>
                  </Card>
                ))}
              </ul>
            </div>
            <div className="lost-item-group">
              <Form.Label style={{ color: "#333", fontWeight: "bold" }}>
                Location Picker
              </Form.Label>
              {/* <LocationPicker onLocationChange={addLocation} /> */}
              {refreshMap && (
                <MapWrapper
                  locations={locations}
                  setLocationsFun={setLocations}
                />
              )}
            </div>

            <Button
              type="submit"
              className="lost-item-button">
              Submit
            </Button>

            {errorMessage && (
              <Alert
                variant={alertType ? "success" : "danger"}
                style={{ marginTop: "10px" }}>
                {errorMessage}
              </Alert>
            )}
          </Form>
        </div>
        <Modal
          show={showModal}
          onHide={handleCloseModal}
          dialogClassName="custom-modal"
          size="lg">
          <Modal.Header closeButton>
            <Modal.Title style={{ color: "#35ac65" }}>
              {"Edit Lost Item"}
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
                  }}>
                  Title
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter title"
                  value={editedLostItem?.title || ""}
                  onChange={(e) => handleEditInputChange(e, "title")}
                />
              </Form.Group>
              <Form.Group controlId="formDescription">
                <Form.Label
                  style={{
                    color: "#333",
                    marginRight: "5px",
                    fontWeight: "bold",
                  }}>
                  Description
                </Form.Label>
                <Form.Control
                  as="textarea"
                  placeholder="Enter description"
                  value={editedLostItem?.description || ""}
                  onChange={(e) => handleEditInputChange(e, "description")}
                />
              </Form.Group>
              <Form.Label
                style={{
                  color: "#333",
                  marginRight: "5px",
                  fontWeight: "bold",
                }}>
                Item Category
              </Form.Label>
              <Form.Select
                style={{ width: "100%", height: "40px" }}
                aria-label="personal"
                onChange={(e) => handleEditInputChange(e, "category")}
                value={editedLostItem?.category || "personal"}>
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
                }}>
                Images:
              </Form.Label>
              <Container>
                <Row>
                  {(editedLostItem?.image || []).map((img, index) => (
                    <Col
                      xs={4}
                      className="text-center p-2 shadow mb-4 item-edit-card"
                      key={index}>
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
                        block>
                        Delete
                      </Button>
                    </Col>
                  ))}

                  {newImages?.map((img, index) => (
                    <Col
                      xs={4}
                      className="text-center p-2 shadow mb-4 item-edit-card"
                      key={index}>
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
                        block>
                        Delete
                      </Button>
                    </Col>
                  ))}
                </Row>
              </Container>
              {/* <Form.Group controlId="formImages">
                    
                            <Form.Control
                                style={{ marginTop: '10px' }}
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleNewImagesChange}
                                className="lost-item-input"
                            />
                    </Form.Group> */}

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
                    }}>
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
                            lat: editedLostItem?.location?.y,
                            lng: editedLostItem?.location?.x,
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
              className="save-color-button">
              {selectedLostItem ? "Save Changes" : "Confirm"}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default LostItemForm;
