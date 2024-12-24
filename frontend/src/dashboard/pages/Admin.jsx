import React, { useState } from "react";
import { Link } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import Button from "@mui/material/Button";
import styles from "./style.module.css";
import useAdminAuth from "../../hooks/useAdminAuth";

export default function Admin() {
  const [nav, setNav] = useState(false);
  const { logout } = useAdminAuth();

  return (
    <>
      <header>
        <img
          className='size-20'
          src='/images/assets/logo.png'
          alt='Meliora Logo'
        />
        <nav>
          <ul className={nav ? `${styles.show}` : `${styles.hide}`}>
            <li>
              <Link to='/admin/dashboard'>Dashboard</Link>
            </li>
            <li>
              <Link to='/admin/orders'>Orders</Link>
            </li>
            <li>
              <Link to='/admin/products'>Products</Link>
            </li>
            <li>
              <Link to='/admin/packages'>Packages</Link>
            </li>
            <li>
              <Link to='/admin/blogs'>Blogs</Link>
            </li>
            <li>
              <Link to='/admin/account'>Account</Link>
            </li>
          </ul>
        </nav>
        <div className={styles.icons}>
          <span className={styles.hamburger} onClick={() => setNav(!nav)}>
            <GiHamburgerMenu />
          </span>
          <Button onClick={() => logout()} variant='outlined'>
            Logout
          </Button>
        </div>
      </header>
    </>
  );
}
