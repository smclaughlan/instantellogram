import React, { useState } from "react";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import { fade, makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import { sendLogoutReq } from "../redux/user";
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';

import "../css/nav.css";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundImage: theme.gradientBackground,
    width: "100%",
    height: '64px',
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  logout: {
    width: 'min-content',
  },
  search: {
    position: 'absolute',
    left: '32px',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(3),
    marginLeft: theme.spacing(3),
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
  },
}));



const NavBar = (props) => {
  const classes = useStyles();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchHeight, setSearchHeight] = useState('0')

  const toggleNav = e => {
    const navMenu = document.querySelector(".mobile-nav-overlay");

    if (navMenu.style.visibility === "hidden") {
      navMenu.style.visibility = "visible";
      navMenu.style.height = "180px";
    } else if (e && e.relatedTarget && e.relatedTarget.classList.contains('menuItem')) {
      props.history.push(`${e.relatedTarget.parentElement.pathname}`)
      navMenu.style.visibility = "hidden";
      navMenu.style.height = 0;
    } else if (e && e.relatedTarget && e.relatedTarget.classList.contains('logoutButton')) {
      logOut()
    } else {
      navMenu.style.visibility = "hidden";
      navMenu.style.height = 0;
    }
  };

  const openSearch = () => {
    const searchMenu = document.querySelector(".search-bar");
    const navMenu = document.querySelector(".mobile-nav-overlay");

    navMenu.style.visibility = "hidden";
    navMenu.style.height = 0;

    searchMenu.style.visibility = "visible";
    setSearchHeight(`${45*searchMenu.childElementCount}`)
  };

  const closeSearch = e => {
    if (e && e.relatedTarget) {
      if (e.relatedTarget.classList.contains('searchItem')) {
        props.history.push(`/profile/${e.relatedTarget.value}`)
      }
  }
    const searchMenu = document.querySelector(".search-bar");
    if (searchMenu) {
      searchMenu.style.visibility = "hidden";
      setSearchHeight('0');
    }
  }

  const updateSearch = (e) => {
    setSearchTerm(e.target.value);
    const numberOfResults = Object.keys(props.userIds).filter((key)=>{if(props.userIds[key].username.toLowerCase().includes(e.target.value.toLowerCase())){return true}}).length
    setSearchHeight(`${45*numberOfResults}`)
  }

  const logOut = () => {
    const navMenu = document.querySelector(".mobile-nav-overlay");
    if (navMenu.style.visibility === "visible") {
      toggleNav();
    }
    props.sendLogoutReq();
  };

  const mobileNavigation = props.currentUserId ? (
    <div
      className="mobile-nav-overlay"
      style={{ height: 0, visibility: "hidden" }}
    >
      <NavLink
        style={{ color: "white", width: "100%"}}
        to={`/`}
        onClick={toggleNav}
      >
        <Button className="menuItem" style={{ width: "100%" }} color="inherit">Home</Button>
      </NavLink>
      <NavLink
        style={{ color: "white", width: "100%"}}
        to={`/profile/${props.currentUserId}`}
        onClick={toggleNav}
      >
        <Button className="menuItem" style={{ width: "100%" }} color="inherit">Profile</Button>
      </NavLink>
      <NavLink style={{ color: "white", width: "100%"}} to="/upload" onClick={toggleNav}>
        <Button className="menuItem" style={{ width: "100%" }} color="inherit">Upload</Button>
      </NavLink>
      <div className={classes.logout} style={{ color: "white", width: "100%"}}>
        <Button className={`${classes.logout} logoutButton`} style={{ width: "100%" }} color="inherit" onClick={logOut}>
          Logout
        </Button>
      </div>
    </div>
  ) : (
    <div
      className="mobile-nav-overlay"
      style={{ height: 0, visibility: "hidden" }}
    >
      <NavLink style={{ color: "white", width: "100%"}} to="/register" onClick={toggleNav}>
        <Button color="inherit">Register</Button>
      </NavLink>
      <NavLink style={{ color: "white", width: "100%"}} to="/login" onClick={toggleNav}>
        <Button color="inherit">Login</Button>
      </NavLink>
    </div>
  );

  const searchBar = props.userIds ? (
    <div
      className="search-bar"
      style={{ height: `${searchHeight}px`, visibility: "hidden" }}
    >
      {Object.keys(props.userIds).map((key) => {
        if (props.userIds[key].username.toLowerCase().includes(searchTerm.toLowerCase()) && searchTerm !== "") {
          return (
            <NavLink key={key} style={{ color: "white", width: "100%"}} to={`/profile/${key}`} >
              <Button className={'searchItem'} style={{ width: "100%" }} color="inherit" value={`${key}`} onClick={closeSearch}>{props.userIds[key].username}</Button>
            </NavLink>
          )
        } else if (searchTerm === "") {
          return (
            <NavLink key={key} style={{ color: "white", width: "100%" }} to={`/profile/${key}`} >
              <Button className={'searchItem'} style={{ width: "100%" }} color="inherit" value={`${key}`} onClick={closeSearch}>{props.userIds[key].username}</Button>
            </NavLink>
          )
        } else {
          return ""
        }
      })}
    </div>
  ) : (
    ""
  );

  const searchInput = props.currentUserId ? (
      <div className={classes.search}>
        <div className={classes.searchIcon}>
          <SearchIcon />
        </div>
        <InputBase
          placeholder="Search…"
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
          onChange={(event) => { updateSearch(event) }}
          inputProps={{ 'aria-label': 'search', 'onFocus': openSearch, 'onBlur': closeSearch,}}
        />
      </div>
    ) : (
      ""
    )

  return (
    <>
      <AppBar position="fixed" className={classes.root}>
        <Toolbar className={classes.root} style={{ justifyContent: "center" }}>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            id="mobile-menu-icon"
            onClick={toggleNav}
            onBlur={toggleNav}
          >
            <MenuIcon />
          </IconButton>

          {searchInput}
        </Toolbar>
      </AppBar>
      {mobileNavigation}
      {searchBar}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    currentUserId: state.user.currentUserId,
    userIds: state.search.userIds,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    sendLogoutReq: () => dispatch(sendLogoutReq()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
