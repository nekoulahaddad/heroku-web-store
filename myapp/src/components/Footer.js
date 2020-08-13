import React from "react";
import {Container,NavLink } from "reactstrap";
import {NavLink as RouterNavLink} from 'react-router-dom';


export default () => {
  return (
    <footer className="border-top pt-3">
    <Container className="text-center text-secondary">
        
          <div>
            <h2>My shop</h2>
          </div>
          <div  className="mt-3"> 
            <NavLink tag={RouterNavLink} className="d-inline"  to="/Landing">Home</NavLink>        
            <NavLink tag={RouterNavLink} className="d-inline" to="/About">About Us</NavLink>
            <NavLink tag={RouterNavLink} className="d-inline" to="/Contact">Contact Us</NavLink>
          </div>
          <div className="mt-3">
          <a className="mr-3" href="https://github.com/nekoulahaddad"><i className="fa fa-github" aria-hidden="true"></i> </a>
          <a className="mr-3" href="https://vk.com/n.khaddad"><i className="fa fa-vk" aria-hidden="true"></i> </a>
          <a  href="https://www.facebook.com/nico12321"><i className="fa fa-facebook-f" aria-hidden="true"></i> </a>
          </div>
          <p className="mt-3">
            &copy; Copyright 2020, Nekoula Haddad. All Rights Reserved.
          </p>
    </Container>
    </footer>
  );
};
