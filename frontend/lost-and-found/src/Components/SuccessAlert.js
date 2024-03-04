import React from 'react'
import { Alert } from 'react-bootstrap'
import { Check } from 'react-bootstrap-icons'


const SuccessAlert = ({ text }) => (
    <Alert className='py-0 my-1' variant='success' >
        <Check /> <small>{text}</small>
    </Alert>
)

export default SuccessAlert