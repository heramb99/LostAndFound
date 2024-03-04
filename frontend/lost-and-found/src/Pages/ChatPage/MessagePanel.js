import { arrayUnion, doc, onSnapshot, updateDoc } from "firebase/firestore";
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Button, Form, Modal } from 'react-bootstrap';
import { Send } from 'react-bootstrap-icons';
import { v4 as uuid } from "uuid";
import { API_URL } from "../../config/api-end-points.js";
import { ApiRequest } from "../../helpers/api-request.js";
import { db } from "./../../firebase-config";
import Message from './Message';


function formatTimestamp(timestamp) {
    const date = new Date(parseInt(timestamp, 10));
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;
    return formattedDate;
}



const MessagePanel = (props) => {

    const [chats, setChats] = useState([]);
    const [inputMessage, setInputMessage] = useState("");
    const [currentItem, setCurrentItem] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const chatSubscriptionRef = useRef(null);


    const selectedUser = props.selectedUser;
    const currentUserEmail = localStorage.getItem('user_email');
    const currentUserName = localStorage.getItem('username');


    const handleChange = (e) => {
        setInputMessage(e.target.value);
    }

    const handleSubmit = async (e) => {
        if (e) {

            e.preventDefault();
        }
        if (inputMessage === "") {
            // setShowAlert(true);
            // setTimeout(() => {
            //     setShowAlert(false);
            // }, 2000);
            return;
        }

        pushMessage(selectedUser,inputMessage,currentUserEmail);

        setInputMessage("");
    }

    const pushMessage= async (selectedUser,inputMessage,currentUserEmail) => {
        await updateDoc(doc(db, "chats/" + selectedUser.chatDocumentId), {
            messages: arrayUnion({
                id: uuid(),
                message: inputMessage,
                sender: currentUserEmail,
                timestamp: Date.now(),
            }),
        });

        var secondUser;
        if (selectedUser.postedBy === currentUserEmail) {
            secondUser = selectedUser.requestBy;
        } else {
            secondUser = selectedUser.postedBy;
        }


        const chatId = selectedUser.chatDocumentId;
        await updateDoc(doc(db, "chatConnections", currentUserEmail), {
            [chatId + ".lastMessage"]: inputMessage,
            [chatId + ".lastUpdatedTimestamp"]: Date.now(),
            [chatId + ".lastMessageBy"]: currentUserEmail
        });

        await updateDoc(doc(db, "chatConnections", secondUser), {
            [chatId + ".lastMessage"]: inputMessage,
            [chatId + ".lastUpdatedTimestamp"]: Date.now(),
            [chatId + ".lastMessageBy"]: currentUserEmail
        });
    }



    useEffect(() => {


        const getChats = async () => {

            if (chatSubscriptionRef.current) {
                chatSubscriptionRef.current();
            }

            if (selectedUser.chatDocumentId.length > 0) {
                const unsub = onSnapshot(doc(db, "chats/" + selectedUser.chatDocumentId), (doc) => {
                    const messageList = [];

                    if (doc.exists()) {
                        const result = doc.data().messages;
                        result.map((msg, index) => {
                            messageList.push({
                                message: msg.message,
                                sender: msg.sender,
                                timestamp: formatTimestamp(msg.timestamp),
                                isOutgoing: msg.sender === currentUserEmail,
                            })
                        });
                    }
                    setChats(messageList);

                });

                chatSubscriptionRef.current = unsub;
                // return () => {
                //     unsub();
                // };

                await ApiRequest.fetch({
                    method: "get",
                    url: `${API_URL}/api/v1/items/` + selectedUser.itemId,
                }).then((response) => {
                    console.log("resp", response)
                    setCurrentItem(response);
                });
            }

        };



        selectedUser && getChats();
        return () => {
            // Unsubscribe from the current subscription when the component is unmounted or selectedUser changes
            if (chatSubscriptionRef.current) {
                chatSubscriptionRef.current();
            }
        };
    }, [selectedUser]);

    function ClaimButton(props) {
        const selectedUser = props.selectedUserProp;
        const currentItem = props.currentItemProp;
        const setCurrentItem = props.setCurrentItemProp;
        const currentUserEmail = props.currentUserEmailProp;
        const setInputMessage = props.setInputMessageProp;
        const [show, setShow] = useState(false);

        var showButton = false;
        var buttonMessage = "Messasge";
        var buttonType = "default";
        const modalApproveBody="Are you sure you want to approve user as owner?"
        const modalReturnBody="Are you sure you want to confirm return?"

        const handleClose = () => setShow(false);
        const handleShow = () => setShow(true);

        if (selectedUser.postedBy == currentUserEmail) {
            if (!currentItem?.claimedBy) {
                buttonMessage = "Approve Claim";
                showButton = true;
                buttonType = "approveType";
            }
        } else {
            if (currentItem?.claimedBy === currentUserEmail) {
                if (!currentItem.returned) {
                    buttonMessage = "Confirm Return";
                    showButton = true;
                    buttonType = "returnType";
                }

            }
        }

        function handleClaimClick(buttonType) {
            if (buttonType === "approveType") {
                const requestBody = {
                    "itemId": selectedUser.itemId,
                    "userId": currentUserEmail,
                    "claimUserId": selectedUser.requestBy
                };

                ApiRequest.fetch({
                    method: "put",
                    url: `${API_URL}/api/v1/items/claims/approve`,
                    params: requestBody,
                }).then((itemResponse) => {
                    if (itemResponse?.claimedBy === selectedUser.requestBy) {
                        const approveMsg="I have approved your claim. Please confirm the return of item";
                        
                        pushMessage(selectedUser,approveMsg,currentUserEmail);
                        ApiRequest.fetch({
                            method: "get",
                            url: `${API_URL}/api/v1/items/` + selectedUser.itemId,
                        }).then((response) => {
                            console.log("resp", response)
                            setCurrentItem(response);
                        });
                        // handleSubmit();
                    }
                })
            } else if (buttonType === "returnType") {
                const requestBody = {
                    "userId": currentUserEmail,
                };

                ApiRequest.fetch({
                    method: "put",
                    url: `${API_URL}/api/v1/items/returned/` + selectedUser.itemId,
                    params: requestBody,
                }).then((itemResponse) => {
                    console.log(itemResponse);
                    if (itemResponse.returned === true) {
                        const returnMsg="Thank you! I have received the item. Please check the rewards page to claim coupon code";
                        // handleSubmit();
                        pushMessage(selectedUser,returnMsg,currentUserEmail);
                        ApiRequest.fetch({
                            method: "get",
                            url: `${API_URL}/api/v1/items/` + selectedUser.itemId,
                        }).then((response) => {
                            console.log("resp", response)
                            setCurrentItem(response);
                        });
                    }
                })
            }

            setShow(false);
        }

        return (
            <>
                {showButton ?
                    <>
                        <Button className='returnButton' onClick={() => handleShow()}>
                            {buttonMessage}
                        </Button>
                        <Modal show={show} onHide={handleClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>Confirm</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>{buttonType==="approveType" ? modalApproveBody:modalReturnBody}</Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>
                                    Close
                                </Button>
                                <Button variant="primary" style={{backgroundColor:"#35ac65"}} onClick={() => handleClaimClick(buttonType)}>
                                    Confirm
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </>
                    :
                    <></>
                }
            </>
        );

    }

    return (
        <div className='message-part'>
            {selectedUser.name == "" ?
                <div className='emptyMessagePanel'>
                    <p>Select a user to chat</p>
                </div> :
                <div className='message-panel'>
                    <div className='userHeader'>
                        <div className='userInfo'>
                            <img src={selectedUser.photoUrl} style={{ height: '50px', width: '50px', borderRadius: "50%" }}></img>
                            <p style={{ marginTop: "10px" }}>{selectedUser.name}</p>
                        </div>
                        <ClaimButton selectedUserProp={selectedUser} currentItemProp={currentItem} currentUserEmailProp={currentUserEmail} setInputMessageProp={setInputMessage} setCurrentItemProp={setCurrentItem} />
                    </div>
                    {showAlert ?
                        <Alert variant="danger">Cannot send empty message</Alert> : <></>}

                    {chats.length === 0 ?
                        <div className='emptyChat'>
                            <p>Start a new conversation</p>
                        </div> :
                        <div className='chats'>
                            {
                                chats.map((currMessage, index) => (

                                    <Message key={index} sender={currMessage.sender === currentUserEmail ? currentUserName : selectedUser.requestBy === currentUserEmail ? selectedUser.postedBy : selectedUser.requestBy} message={currMessage.message} timestamp={currMessage.timestamp} isOutgoing={currMessage.isOutgoing} />
                                ))}
                        </div>
                    }
                    <Form onSubmit={handleSubmit}>
                        <div className='messageInput'>
                            <input type='text' placeholder='Type something...' onChange={handleChange} value={inputMessage} style={{ width: "100%", border: "none", outline: "none", fontSize: "18px" }}></input>
                            <button type='submit' style={{ backgroundColor: "#35ac65", border: "none", height: "40px", width: "40px" }}><Send /></button>
                        </div>
                    </Form>
                </div>
            }
        </div>
    )
}

export default MessagePanel