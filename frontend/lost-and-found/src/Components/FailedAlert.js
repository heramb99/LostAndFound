import React from 'react'
import { Alert } from 'react-bootstrap'
import { X } from 'react-bootstrap-icons'


const FailedAlert = ({ text }) => (
    <Alert className='py-0 my-1' variant='danger' >
        <X /> <small>{text}</small>
    </Alert>
)

export default FailedAlert