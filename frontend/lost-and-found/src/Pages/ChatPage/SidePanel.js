import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from 'react';
import { Alert } from 'react-bootstrap';
import { db } from "./../../firebase-config";



const SidePanel = (props) => {

    const currentUser = localStorage.getItem('user_email');
    const [usersForChat, setUsersForChat] = useState([]);
    const [showAlert, setShowAlert] = useState(false);

    const selectUserFunction = props.selectUserFunction;
    const selectedUser = props.selectedUser;


    const handleSelect = (user) => {

        selectUserFunction(user);
    };

    function getNameForChat(chatopt){
        if(chatopt.postedBy===currentUser){
            return "Request by "+chatopt.requestBy;
        }else{
            return "Found by "+chatopt.postedBy;
        }
    }


    useEffect(() => {
        const getChats = () => {
            const unsub = onSnapshot(doc(db, "chatConnections/" + currentUser), (doc) => {

                if (doc.exists()) {
                    const usersData = doc.data();
                    const userList = []
                    Object.keys(usersData).forEach(key => {

                        userList.push({
                            name: usersData[key].name,
                            lastUpdatedTimestamp: usersData[key].lastUpdatedTimestamp,
                            lastMessage: usersData[key].lastMessage,
                            postedBy: usersData[key].postedBy,
                            requestBy:usersData[key].requestBy,
                            photoUrl: usersData[key].photoUrl,
                            chatDocumentId: key,
                            lastMessageBy: usersData[key].lastMessageBy,
                            itemId: usersData[key].itemId
                        })
                    });
                    setUsersForChat(userList);
                }

            });

            return () => {
                unsub();
            };
        };

        currentUser && getChats();
    }, [currentUser]);

    useEffect(() => {
        if (usersForChat.length > 0 && usersForChat[0].lastMessageBy != currentUser) {
            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
            }, 2000);
        } else {
            setShowAlert(false);
        }
    }, [usersForChat])

    return (
        <div className='side-panel'>
            <div className='listHeader'>
                <p>Conversations</p>
            </div>
            {showAlert ?
                <Alert variant="success">
                    You have received new messages!
                </Alert> :
                <></>
            }
            {usersForChat.length === 0 ? 
            <div style={{textAlign:"center",padding:"50x"}}><p>No Conversations</p></div>
            : usersForChat.sort((a, b) => b.lastUpdatedTimestamp - a.lastUpdatedTimestamp).map((user, index) => (
                <div className='userChatCard' key={index} onClick={() => handleSelect(user)}>
                    <img src={user.photoUrl} style={{ height: '50px', width: '50px', borderRadius: "50%" }}></img>
                    <div className='messagerInfo'>
                        <span style={{ fontSize: "18px", fontWeight: "500" }}>{user.name}</span>
                        <p style={{ fontSize: "14px" }}>{getNameForChat(user)}</p>
                        <p style={{ fontSize: "14px" }}>{user.lastMessage}</p>
                    </div>
                </div>
            ))}

        </div>
    )
}

export default SidePanel