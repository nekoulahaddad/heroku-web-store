import React, {Component} from 'react';
import {connect} from 'react-redux';
import {changePassword} from '../actions/authActions';
import PropTypes from 'prop-types';
import {Col, Row,Container,UncontrolledAlert, Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import {clearErrors} from '../actions/errorActions';
import  password_pic from '../cover/password.png';

class ChangePassword extends Component {

state = {
oldPassword:"",
newPassword:"",
msg:null
  };

static propTypes = {
isAuthenticated:PropTypes.bool,
error: PropTypes.object.isRequired,
clearErrors: PropTypes.func.isRequired,
changePassword:PropTypes.func.isRequired
};



componentDidUpdate(prevProps) {
  const {error} = this.props;
  if (error !== prevProps.error) { // y3nee 2no ma ykoon null masalan
    if (error.id === 'CHANGE_PASSWORD_FAIL') {
      this.setState({ msg:error.msg.msg }); // if you open redux web tools .. you will see that the msg is stored if error.msg.msg
  } else {
    this.setState({msg:null})
  }
}
}

onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();
    const oldPassword = this.state.oldPassword;
    const newPassword = this.state.newPassword;
    this.props.changePassword({oldPassword,newPassword});
};


render() {
        return (
          <div>
{this.state.msg ? (
<Alert color='danger'>{this.state.msg}</Alert>
) : null} 
            <div className="container-fluid">
{this.state.msg ? (
<Alert color='danger'>{this.state.msg}</Alert>
) : null}
<div>
{ this.props.isAuthenticated ? (
  <Container>
  <Row>
  <Col className="align-self-center" md={6}>
  <Form className="navor"  onSubmit={this.onSubmit}>
         <FormGroup className="mr-3">
          <Label for="oldPassword">old Password</Label>
          <Input type="password" name="oldPassword" id="oldPassword" placeholder="Enter your old password password please!" onChange={this.onChange} />
        </FormGroup>
        <FormGroup className="mr-3">
          <Label for="newPassword">new Password</Label>
          <Input type="password" name="newPassword" id="newPassword" placeholder="Enter your new password please!" onChange={this.onChange} />
        </FormGroup>
        <Button className="mr-3">Submit</Button>
 </Form>
 </Col>
 <Col md={6} className="d-none d-sm-block">
 <img alt="pass" className="sign_pic" src={password_pic} />
 </Col>
 </Row>
 </Container>
):(<div className="mt-3"><UncontrolledAlert color="info">Please! Log in to continue</UncontrolledAlert></div>)}
 </div>
</div>
</div>
        );
    }
}


const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    error: state.error
});


export default connect(mapStateToProps, {changePassword,clearErrors })(ChangePassword);