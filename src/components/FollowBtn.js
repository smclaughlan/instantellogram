import React from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { sendFollowReq, sendUnfollowReq } from "../redux/user";
import { getFollowings } from "../redux/user";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));

const FollowBtn = (props) => {
  const classes = useStyles();
  let followedId = window.location.href.split("/")[4];
  React.useEffect(() => {
    let userId = parseInt(window.localStorage.getItem("currentUserId"));
    props.getFollowings(userId);
  }, []);

  const handleFollow = async () => {
    let userId = window.localStorage.getItem("currentUserId");
    props.sendFollowReq(userId, followedId);
  };

  const handleUnfollow = async () => {
    let userId = window.localStorage.getItem("currentUserId");
    props.sendUnfollowReq(userId, followedId);
  };

  return props.followings ? (
    props.followings.includes(parseInt(window.location.href.split("/")[4])) ? (
      <div className={classes.root}>
        <Button variant="contained" color="primary" onClick={handleUnfollow}>
          UnFollow
        </Button>
      </div>
    ) : (
        <div className={classes.root}>
          <Button variant="contained" color="primary" onClick={handleFollow}>
            Follow
        </Button>
        </div>
      )
  ) : (
      <CircularProgress
        size='100px'
        style={{
          alignSelf: 'center',
          top: '40%',
          position: 'relative',
        }}
      />
    );
};

const mapStateToProps = (state) => {
  return {
    token: state.user.token,
    followings: state.user.profile.followings,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    sendFollowReq: (...args) => dispatch(sendFollowReq(...args)),
    sendUnfollowReq: (...args) => dispatch(sendUnfollowReq(...args)),
    getFollowings: (...args) => dispatch(getFollowings(...args)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FollowBtn);
