import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Alert, Col,Row, Card } from 'react-bootstrap';
import { CSSTransition } from 'react-transition-group';
import './FoundItemForm.css';
import MapWrapper from './MapWrapper';
import axios from 'axios';

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './../../firebase-config.js';
import { ApiRequest } from '../../helpers/api-request.js';
import { API_URL } from '../../config/api-end-points.js';
import { toast } from 'react-toastify';
import { XLg, X, XCircle, FileArrowUpFill, Eye, PencilSquare } from 'react-bootstrap-icons'


const FoundItemForm = ({ isOpen, onRequestClose, resetVariable }) => {
  const [formData, setFormData] = useState({
    itemName: '',
    itemDescription: '',
    isSensitive: false,
  });

  const userEmail = localStorage.getItem('user_email');

  const [errorMessage, setErrorMessage] = useState(null);
  const selectedFileNames = new Set();
  useEffect(() => {
    if (resetVariable) {
      setIsSubmitted(false);
      setFormData({
        itemName: '',
        itemDescription: '',
        isSensitive: false,
      });
    }

    return () => {};
  }, [resetVariable]);

  const onHideHandle = () => {
    setIsSubmitted(false);
    setFormData({
      itemName: '',
      itemDescription: '',
      isSensitive: false,
    });
  };

  const [mediaFiles, setMediaFiles] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [locations, setLocations] = useState([]);

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleMediaChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
        const newFiles = selectedFiles.filter((file) => !selectedFileNames.has(file.name));
        setMediaFiles([...mediaFiles, ...newFiles]);
        newFiles.forEach((file) => selectedFileNames.add(file.name));

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (locations.length < 1) {
      toast.error('Please select a location', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
      });
      return
  }
  if (!formData["category"]) {
      toast.error('Please select a category', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
      });
      return

  }


    // Uploading images
    const fileLinks = await uploadImages(mediaFiles);
    const coordinates = [locations[0].lng, locations[0].lat];
      const dataToSend = {
        title: formData['itemName'],
          description: formData['itemDescription'],
          createdBy: userEmail,
          image: fileLinks,
          location: {
            coordinates: coordinates,
            type: 'Point',
          },
          foundItem: true,
          sensitive: formData['isSensitive'],
          category : formData["category"]
      };
      
      ApiRequest.fetch({method: 'post',
      url: `${API_URL}/api/v1/items`,
      data: dataToSend,})
        .then((response) => {
          toast.success('Found Item Reported!!', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'dark',
        });
        setIsSubmitted(true);
        })
        .catch((error) => {
            toast.error('Found not reported, Try Again!', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'dark',
            });

        })
        .finally(() => {
          setMediaFiles([])
          setLocations([])
        // window.location = '/home';
        })
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
          console.log(file.name, url);
        } catch (error) {
          console.error('Error getting download URL:', error);
        }
      }

      console.log('Images uploaded successfully.');
      return fileLinks;
    } catch (error) {
      console.error('Error uploading images:', error);
      return [];
    }
  }

  const removeFile = (index) => {
    const updatedMediaList = [...mediaFiles];
    const filename = updatedMediaList[index].name
    updatedMediaList.splice(index, 1);
    setMediaFiles(updatedMediaList);
    selectedFileNames.delete(filename);
};


  return (
    <CSSTransition
      in={isOpen}
      timeout={300}
      classNames="fade"
      unmountOnExit
    >
      <Modal show={isOpen} onHide={onRequestClose} size={'lg'}>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: '#35ac65' }}>Report Found Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isSubmitted ? (
            <Alert variant="success">Thank you for your submission!</Alert>
          ) : (
            <Form onSubmit={handleSubmit} className="found-item-form">
              <Form.Group as={Col} controlId="formItemName">
                <Form.Label style={{ fontWeight: 'bold' }}>Item Name</Form.Label>
                <Form.Control
                  type="text"
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formItemDescription">
                <Form.Label style={{ fontWeight: 'bold' }}>
                  Item Description
                </Form.Label>
                <Form.Control
                  as="textarea"
                  name="itemDescription"
                  value={formData.itemDescription}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
             
              <Row className="mb-3 mt-4" style={{width:'100%'}}>
              <Col xs={5} md={5} className="d-flex">
              <Form.Check
                  type="checkbox"
                  label={
                    <span style={{ fontWeight: 'bold' }}>
                      Is item sensitive?
                    </span>
                  }
                  name="isSensitive"
                  checked={formData.isSensitive}
                  onChange={handleInputChange}
                  style={{ fontSize: '1rem' }}
                />
                </Col>
                <Col xs={7} md={7} className="d-flex">
                  <Form.Label style={{ fontWeight: 'bold' ,marginRight:'15px',marginTop:'5px'}}>
                    Item Category:
                  </Form.Label>
                {/* </Col>
                <Col xs={4} md={4}> */}
                  <Form.Select
                    style={{
                      height: '40px',
                      borderRadius: '0'
                    }}
                    aria-label="category"
                    onChange={handleInputChange}
                    name="category"
                  >
                    <option>Select Category</option>
                    <option value="personal">Personal Item</option>
                    <option value="electronics">Electronics</option>
                    <option value="document">Document</option>
                  </Form.Select>
                </Col>
              </Row>



              <Form.Group as={Col} controlId="formMedia" className='mt-2'>
                <Form.Label style={{ fontWeight: 'bold' }}>
                  Upload Images or Videos
                </Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={handleMediaChange}
                  required
                />
              </Form.Group>
              <div style={{textAlign:'left', width:'100%', padding:'15px'}}>
                
                            <h6 style={{ color: "#333", fontWeight: "bold" }}>Selected Files</h6>
                            <ul>
                                {mediaFiles.map((mediaFile, index) => (
                                    <Card key={index}>
                                        <li className='border shadow p-2' style={{ display: "flex", justifyContent: "space-between" }}>
                                            <div style={{ overflow: "hidden" }}>
                                                <FileArrowUpFill className='mr-2' />
                                                {mediaFile.name}
                                            </div>
                                            <Button className="ml-1"
                                                style={{ backgroundColor: "white", height: "10xp", width: "10xp", border: "1px solid white" }}
                                                onClick={() => removeFile(index)}>
                                                <XCircle style={{ color: "red" }} />
                                            </Button>
                                        </li>
                                    </Card>
                                ))}
                            </ul>
                        </div>

              <Form.Group as={Col} controlId="formLocation" className='mt-2'>
                <Form.Label style={{ fontWeight: 'bold' }}>
                  Location Picker
                </Form.Label>
                <MapWrapper
                  style={{ width: '900px' }}
                  locations={locations}
                  setLocationsFun={setLocations}
                />
              </Form.Group>
              <Button
                variant="primary"
                type="submit"
                className="found-item-button"
                style={{ backgroundColor: '#35ac65', borderColor: '#35ac65' }}
              >
                Submit
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </CSSTransition>
  );
};

export default FoundItemForm;
