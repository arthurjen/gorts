import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import Error from './Error';
// import styles from './Header.css';

class Header extends Component {

  // static propTypes = {

  // };

  render() { 
    return (
      <div>
        <section>
          <div>
            <h1>GORTS</h1>
          </div>
          <nav>
            <ul>
              <li>
                <NavLink exact to="/">Home</NavLink>
              </li>
            </ul>
          </nav>
        </section>

        <Error/>
      </div>
    );
  }
}
 
export default Header;