import React, { useState } from 'react'
import Navbar from '../../Components/Navbar'
import './ChatPage.css'
import MessagePanel from './MessagePanel'
import SidePanel from './SidePanel'

const ChatPage = () => {
    const [selectedUser, setSelectedUser] = useState({
        name:"",
        photoUrl:"",
        chatDocumentId:"",
        email:"",
    });

    return (
        <div style={{height:"100vh",display:"flex",flexDirection:"column",backgroundColor:"#35ac65"}}>
            <Navbar/>
            <div className='chathome'>

                    <div className='chat-container'>
                        <SidePanel selectedUser={selectedUser} selectUserFunction={setSelectedUser}/>
                        <MessagePanel selectedUser={selectedUser} selectUserFunction={setSelectedUser}/>
                    </div>
            </div>
        </div>
    )
}

export default ChatPage