import React, { useState } from 'react';
import { Card, Col, Container, Navbar, Row } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import FooterComponent from '../../Components/FooterComponent';

// Images
import Logo from '../../Assets/Images/LAF-logo.png';
import LandingPageImg from '../../Assets/Images/landing_page_image.jpg';

// Components
import ForgetPasswordCard from './ForgetPasswordCard';
import LoginCard from './LoginCard';


function LoginMainPage() {
    const history = useHistory();
    const imgvar = LandingPageImg;
    const box1Style = { backgroundColor: '#35ac65', color: '#333333', padding: '20px' };
    const box2Style = { backgroundColor: '#35ac65', color: '#333333', padding: '20px' };

    if (localStorage.getItem('access_token')) {
        history.push('/home');
    }
    const [showLoginUp, setShowLoginUp] = useState(true);
    const [ForgotPassword, setForgotPassword] = useState(false);

    function handleToggleForm() {
        window.location = '/signup'
    }
    function showLoginPage() {
        window.location = '/login'
    }
    function showForgotPassword() {
        setForgotPassword(true)
    }

    return (
        <div className='landing-main' >
            <Navbar style={{ height: '80px' }}>
                <Navbar.Brand href="#"><img width={200} src={Logo} /></Navbar.Brand>

                <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text>
                        <a href="#about">About Us</a>
                    </Navbar.Text>
                    <br />
                    <Navbar.Text className="ml-5">
                        <a href="#contact">Contact</a>
                    </Navbar.Text>
                </Navbar.Collapse>

            </Navbar>
            <Container fluid>

                <Row>
                    <Col lg={6} md={12} xs={12} className='pt-3 d-flex flex-column justify-content-center align-items-center px-4' >
                        <img src={LandingPageImg} alt="Image" className="img-fluid" />
                    </Col>
                    <Col lg={{ span: 6, order: 'last' }} md={{ span: 12, order: 'first' }} xs={{ span: 12, order: 'first' }} className='d-flex justify-content-center align-items-center px-2' >
                        <Card className='w-75 border shadow'>
                         
                                {ForgotPassword ? <ForgetPasswordCard /> : <LoginCard />}

                            {!ForgotPassword ?
                                <div style={{ textAlign: 'center', paddingBottom: '5px' }}> <h6 className='mt-3'>{showLoginUp ? 'Don\'t have an account? ' : 'Already have an account? '}<a style={{ textDecoration: 'underline', color: 'darkgreen',cursor: 'pointer' }} onClick={handleToggleForm}>Click here</a></h6></div>
                                : <></>}
                            {/* <Button variant='link' size='sm' onClick={handleToggleForm} className='mb-3 mx-4' >{showLoginUp ? 'New User' : 'Already has an account?'} </Button> */}
                            {!ForgotPassword ? <div style={{ textAlign: 'center', paddingBottom: '10px' }}><h6 className='mt-3'>{showLoginUp ? 'Forgot Password?' : ''}<a style={{ textDecoration: 'underline', color: 'darkgreen',cursor: 'pointer' }} onClick={showForgotPassword}>Click here</a></h6> </div>
                                : <div style={{ textAlign: 'center', paddingBottom: '10px' }}><h6 className='mt-3'>{'Back to Login '}<a style={{ textDecoration: 'underline', color: 'darkgreen',cursor: 'pointer' }} onClick={showLoginPage}>Click here</a></h6></div>}
                        </Card>
                    </Col>
                </Row>
            </Container>
            <FooterComponent/>
        </div>
    );
}

export default LoginMainPage;