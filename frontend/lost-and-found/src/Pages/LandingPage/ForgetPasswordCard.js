import React, { useState } from 'react'
import { Navbar, Card, Col, Container, Row,Button,Form,Alert } from 'react-bootstrap'
import validator from 'validator'
import { toast } from 'react-toastify'
import axios from 'axios'
// Components
import LoginCard from './LoginCard'
import SignUpCard from './SignUpCard'
import { ApiRequest } from '../../helpers/api-request'

function ForgetPasswordCard()  {

    const [email, setEmail] = useState('')
    const [done, setDone] = useState(false)

    const handlePostResetPassword = async (e) => {
        e.preventDefault()
        
        ApiRequest.fetch({
            method: 'post',
            url: 'https://dev-3vtey6tugvrs4132.us.auth0.com/dbconnections/change_password',
            data: {
              client_id: 'XXXXXXXXXXXXXXXXXX',
              email: email,
              connection: 'Username-Password-Authentication',
            },
          })
            .then((response) => {
              setDone(true);
            })
            .catch((error) => {
              toast.error(error.response?.data || error.message);
            })
            .finally(() => {
              setEmail('');
            });
    }

  


 

    return (
        <Card.Body>
            <Card.Title>Password Reset</Card.Title>
            {
                done ?
                    <Alert variant='success' >
                        Your reset password link has been sent to your email
                    </Alert>
                    :
                    <Form onSubmit={handlePostResetPassword}>
                        <Form.Group >
                            <Form.Label>Account Email</Form.Label>
                            <Form.Control value={email} onChange={(evt) => setEmail(evt.currentTarget.value)} required type='email' placeholder='name@email.com' />
                        </Form.Group>
                        <Button type='submit' className='w-100 mt-4' style={{backgroundColor:'#35ac65',color:'white'}}>Reset My Password</Button>
                    </Form>
            }
        </Card.Body>
    )

}

export default ForgetPasswordCard