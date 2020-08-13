import React from 'react';
import {Row,Col,Container} from 'reactstrap';
import  password_pic from '../cover/sign.png';

function About() {

    return (

        <Container className="mt-3">
          <Row>
  <Col className="align-self-center" md={6}>

  <h1>HELLO !</h1>
  <h6>My name is Nekoula, and i am a Full stack MERN developer</h6>
 </Col>
 <Col md={6} className="d-none d-sm-block">
 <img alt="about" className="sign_pic" src={password_pic} />
 </Col>
 </Row>
         
        </Container>
    )
}

export default About
