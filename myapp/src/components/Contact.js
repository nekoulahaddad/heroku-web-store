import React from 'react';
import {Row,Col,Container} from 'reactstrap';
import  password_pic from '../cover/contact.png';

function Contact() {

    return (

        <Container className="mt-3">
          <Row>
  <Col className="align-self-center" md={6}>

  <h1 className="mb-3">Contact Us</h1>
  <h5 className="text-primary">BY PHONE</h5>
  <h6 className="text-secondary">+7-919-918-9861</h6>
   <h5 className="text-primary">BY EMAIL</h5>
  <h6 className="text-secondary">nekoulahaddad@gmail.com</h6>
   <h5 className="text-primary">ADDRESS</h5>
  <h6 className="text-secondary">Russia, Moscow</h6>
 </Col>
 <Col md={6} className="d-none d-sm-block">
 <img alt="#" className="sign_pic" src={password_pic} />
 </Col>
 </Row>
         
        </Container>
    )
}

export default Contact
