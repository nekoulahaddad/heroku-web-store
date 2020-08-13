import React , {Component} from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem, NavLink} from 'reactstrap';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {NavLink as RouterNavLink} from 'react-router-dom';
import SignOut from './SignOut';


 

class AppNavbar extends Component {

state = {
      isOpen: false
    };

static propTypes = {
  isAuthenticated:PropTypes.bool
}

toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }


             

render () {

	return (
      <Navbar color="dark" dark  expand="md">
          <Nav className="ml-auto" navbar>
          <NavbarBrand tag={RouterNavLink} to="/Landing">My shop</NavbarBrand>
          </Nav>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
                  
            { !this.props.isAuthenticated  ? (
              <Nav className="ml-auto" navbar>  
              <NavItem>
               <NavLink tag={RouterNavLink}  to="/SignIn">SignIn</NavLink>
               </NavItem>
               <NavItem>
               <NavLink tag={RouterNavLink} to="/SignUp">SignUp</NavLink>
              </NavItem>
              </Nav>
              ):
              <Nav className="ml-auto" navbar> 
              <NavItem>
                <NavLink className="fa fa-user mt-1" tag={RouterNavLink} to="/User"><span className="ml-1">Profile</span></NavLink>
              </NavItem>
              <NavItem>
                <NavLink className="fa fa-key mt-1" tag={RouterNavLink} to="/ChangePassword"><span className="ml-1">Change Password</span></NavLink>
              </NavItem>
               <NavItem>
                <NavLink className="fa fa-plus mt-1" tag={RouterNavLink} to="/Items"><span className="ml-1">Add item</span></NavLink>
              </NavItem>
              <NavItem>
                <NavLink className="fa fa-shopping-cart mt-1" tag={RouterNavLink} to="/Cart"><span className="ml-1">Cart</span> </NavLink>
              </NavItem>
              <NavItem>
                <NavLink className="fa fa-history mt-1" tag={RouterNavLink} to="/History"><span className="ml-1">History</span> </NavLink>
              </NavItem>
              <NavItem>
              <SignOut />
              </NavItem>
              </Nav>
                }
            
          </Collapse>
        </Navbar>
		)
}


}


const mapStateToProps = state => ({
  isAuthenticated:state.auth.isAuthenticated
})

export default connect(mapStateToProps,null)(AppNavbar);