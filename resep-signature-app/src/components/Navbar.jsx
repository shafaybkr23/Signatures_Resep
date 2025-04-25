import React from 'react';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
      <div className="container">
        <a className="navbar-brand" href="/">
          <img
            src="http://wavahusada.com/wp-content/uploads/2019/07/Logo-Wava-Husada-putih-menu.png"
            alt="Rumah Sakit"
          />
        </a>
        {/* <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button> */}
        
      </div>
    </nav>
  );
};

export default Navbar;
