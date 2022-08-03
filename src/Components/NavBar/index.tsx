import React from "react";
import {Nav,NavLink,NavMenu} from './navBarElements';

const NavBar = ()=>{
    return(
        <>
          <Nav>
            <NavMenu>
                <NavLink to={"/"} >Home</NavLink>
            </NavMenu>
          </Nav>
        </>
    )
}

export default NavBar;