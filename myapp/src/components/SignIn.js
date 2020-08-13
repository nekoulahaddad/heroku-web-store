import React , {Component} from 'react';
import {Container,Row, Button, Form, FormGroup, Label, Input, Alert,Col,NavLink } from 'reactstrap';
import {login} from '../actions/authActions';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {clearErrors} from '../actions/errorActions'
import  sign2 from '../cover/sign2.png';
import {NavLink as RouterNavLink} from 'react-router-dom';


class SignIn extends Component {
state={
	email:'',
	password:'',
	msg:null
};


static propTypes = {
  isAuthenticated: PropTypes.bool,
  error: PropTypes.object.isRequired,
  login: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  user:PropTypes.object
}


componentDidUpdate(prevProps) {
  const {error,isAuthenticated} = this.props;
  if (error !== prevProps.error) { // y3nee 2no ma ykoon null masalan
    if (error.id === 'LOGIN_FAIL') {
      this.setState({ msg:error.msg.msg }); // if you open redux web tools .. you will see that the msg is stored if error.msg.msg
  } else {
    this.setState({msg:null})
  }
}
if (isAuthenticated){this.props.history.push("/Landing")}
      else console.log("hi");
}


onChange = e => {
  this.setState({ [e.target.name]: e.target.value });
}


onSubmit = e => {
  e.preventDefault();
  const {email,password} = this.state;

  const User = {
    email,
    password
  };
this.props.login(User);
this.props.clearErrors();
};

//history.push('/')
render() {
return(
  
  <div>
{this.state.msg ? (
<Alert color='danger'>{this.state.msg}</Alert>
) : null}
<div>

{ !this.props.isAuthenticated ? (
  <Container>
  <Row>
  <Col className="align-self-center" md={6}>
<Form className="navor"  onSubmit={this.onSubmit}>
        <FormGroup className="mr-3">
          <i className="fa fa-envelope icon mr-1"></i>
          <Label for="Email">Email</Label>
          <Input type="email" name="email" id="Email" placeholder="Enter your Email please!" onChange={this.onChange} />
        </FormGroup>
        <FormGroup className="mr-3">
          <i className="fa fa-key icon mr-1"></i>
          <Label for="Password">Password</Label>          
          <Input type="password" name="password" id="Password" placeholder="Enter your password please!" onChange={this.onChange} />        
        </FormGroup>
        <Row className="ml-0">
        <span><Button className="mr-3">Submit</Button></span> <span> <NavLink tag={RouterNavLink} to="/SignUp">or ... Sign Up if you don't have an account</NavLink> </span></Row>
 </Form>
 </Col>
 <Col md={6} className="d-none d-sm-block">
 <img alt="sign" className="sign_pic" src={sign2} />
 </Col>
 </Row>
 </Container>
 ):(<Alert>welcome to our shop mr {this.props.user.name}</Alert>

 )}
 </div>
 </div>
 
	);
  
}


}


const mapStateToProps = state => ({
  isAuthenticated:state.auth.isAuthenticated,
  error:state.error,
  user:state.auth.user
});

export default connect(mapStateToProps,{login,clearErrors})(SignIn);

/*



*/