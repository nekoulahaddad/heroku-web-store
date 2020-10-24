import React, { Component } from 'react';
import {Container,Row,UncontrolledAlert,Col, Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import { register } from '../actions/authActions';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { clearErrors } from '../actions/errorActions';
import  sign from '../cover/sign3.png';

class SignUp extends Component {
    state = {
        name: '',
        email: '',
        password: '',
        msg: null
    };

    static propTypes = {
        isAuthenticated: PropTypes.bool,
        error: PropTypes.object.isRequired,
        register: PropTypes.func.isRequired,
        clearErrors: PropTypes.func.isRequired,
        user: PropTypes.object
    }

    componentDidUpdate(prevProps) {
        const { error} = this.props;
        if (error !== prevProps.error) { // y3nee 2no ma ykoon null masalan
            if (error.id === 'REGISTER_FAIL') {
                this.setState({ msg: error.msg.msg }); // if you open redux web tools .. you will see that the msg is stored if error.msg.msg
            } else {
                this.setState({ msg: null })
            }
        }
    }


    _onFocus = e => {
        document.getElementById("message").style.display = "block";     
    }

    _onBlur = e => {
        document.getElementById("message").style.display = "none";
    }


    onChangePass = e => {
       const letter = document.getElementById("letter");
       const capital = document.getElementById("capital");
       const number = document.getElementById("number");
       const length = document.getElementById("length");
       const lowerCaseLetters = /[a-z]/g;
       if(e.target.value.match(lowerCaseLetters)) {  
    letter.classList.remove("invalid");
    letter.classList.add("valid");
  } else {
    letter.classList.remove("valid");
    letter.classList.add("invalid");
  }
  
  // Validate capital letters
  const upperCaseLetters = /[A-Z]/g;
  if(e.target.value.match(upperCaseLetters)) {  
    capital.classList.remove("invalid");
    capital.classList.add("valid");
  } else {
    capital.classList.remove("valid");
    capital.classList.add("invalid");
  }

  // Validate numbers
  const numbers = /[0-9]/g;
  if(e.target.value.match(numbers)) {  
    number.classList.remove("invalid");
    number.classList.add("valid");
  } else {
    number.classList.remove("valid");
    number.classList.add("invalid");
  }
  
  // Validate length
  if(e.target.value.length >= 8) {
    length.classList.remove("invalid");
    length.classList.add("valid");
  } else {
    length.classList.remove("valid");
    length.classList.add("invalid");
  }

  if(letter && letter.classList.contains("valid") && capital.classList.contains("valid") && number.classList.contains("valid") && length.classList.contains("valid")){
    document.getElementById("sign_up_button").classList.remove("disabledContent")
      }else document.getElementById("sign_up_button").classList.add("disabledContent")
        this.setState({
            [e.target.name]: e.target.value });


    }


    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value });
    }

    onSubmit = e => {
        e.preventDefault();
        const { name, email, password} = this.state;

        const newUser = {
            name,
            email,
            password
        };
        this.props.register(newUser);
        this.props.clearErrors();
    };


    render() {
        return (
            
            <div>
{this.state.msg ? (
<Alert color='danger'>{this.state.msg}</Alert>
) : null}
<div>
{ !this.props.isAuthenticated ? (
    <Container>
<Row>
<Col className="align-self-center" md={6}>
<Form className="navor" onSubmit={this.onSubmit}>
<FormGroup className="mr-3">
  <i className="fa fa-user icon mr-1"></i>
  <Label for="name">Name</Label>
  <Input type="text" name="name" id="name" placeholder=" Whats your name !" onChange={this.onChange} />
</FormGroup>  
<FormGroup className="mr-3">
  <i className="fa fa-envelope icon mr-1"></i>
  <Label for="email">Email</Label>
  <Input type="email" name="email" id="email" placeholder="Enter your email please !" onChange={this.onChange} />
</FormGroup>
<FormGroup className="mr-3">
  <i className="fa fa-key icon mr-1"></i>
  <Label for="password">Password</Label>
  <Input 
  type="password" 
  name="password" 
  id="password" 
  placeholder="Enter your password please !"
  onFocus={this._onFocus}
  onBlur={this._onBlur} 
  onChange={this.onChangePass}
   />
</FormGroup> 
<Button id="sign_up_button" className="mr-3 disabledContent">Submit</Button>
</Form>
<div id="message" className="mt-3">
  <h5>Password must contain the following:</h5>
  <p id="letter" className="invalid ml-5">A <b>lowercase</b> letter</p>
  <p id="capital" className="invalid ml-5">A <b>capital (uppercase)</b> letter</p>
  <p id="number" className="invalid ml-5">A <b>number</b></p>
  <p id="length" className="invalid ml-5">Minimum <b>8 characters</b></p>
</div>        
</Col>
<Col md={6} className="d-none d-sm-block">
 <img alt="sign" className="sign_pic" src={sign} />
 </Col>
 </Row>
 </Container>
):(<div className="mt-3"><UncontrolledAlert color="info">welcome {this.props.user.name}  .... you are a member now</UncontrolledAlert></div>)}
 </div>
</div>

        );

    }


}


const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    error: state.error,
    user: state.auth.user
});


export default connect(mapStateToProps, { register, clearErrors })(SignUp);