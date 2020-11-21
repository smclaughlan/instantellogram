import React, { useEffect } from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { getFeedPostReq, getUserProfileReq } from "../redux/user";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Container } from "@material-ui/core";
import { getUserIds } from "../redux/search";


import Image from "./Image";
import '../css/feed.css';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    justifyContent: "space-around",
  },
  paper: {
    padding: theme.spacing(2),
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 20,
    marginBottom: 20,
    maxWidth: 1000,
  },
  image: {
    width: 128,
    height: 128,
  },
  img: {
    margin: "auto",
    display: "block",
    maxWidth: "100%",
    maxHeight: "100%",
  },
  gridList: {
    justifyContent: "space-around",
    maxWidth: 500,
    height: 450,
  },
  topLogo: {
    justifyContent: "space-around",
    margin: "0 auto",
    maxWidth: 1000,
  },
}));

function Feed(props) {
  const classes = useStyles();

  useEffect(() => {
    let id = props.currentUserId;
    props.getFeedPostReq(id);
    props.getUserProfileReq(id);
    props.getUserIds(props.token);
  }, []);


  // if (props.feedPosts) {
  //   props.feedPosts.sort((a, b) => {
  //     if (a.timestamp > b.timestamp) {
  //       return -1;
  //     } else {
  //       return 1;
  //     }
  //   });
  // }

  return (
    ((props.feedPosts && props.user) && props.feedPostsOrd) ?
      <div className={classes.root}>
        <Container className={classes.topLogo}>
          <img alt={"Instantelegram logo"} id='instantelegram-logo' src={"images/logoIG.png"} style={{ margin: '32px auto', borderRadius: '5px', maxWidth: '950px' }}></img>
        </Container>
        <Paper className={classes.paper}>
          <Grid
            container
            spacing={3}
            direction="column"
            justify="center"
            alignContent="center"
            alignItems="flex-start"
          >
            {props.feedPostsOrd.map(({timestamp, postId}) => {
              const post = props.feedPosts[postId];
              return (
                <Grid item className={classes.column1} key={postId}>
                  <Image
                    imageId={postId}
                    postDate={timestamp}
                    imageUrl={post.imageUrl}
                    imageCapt={post.caption}
                    imagePosterUsername={post.username}
                    imagePosterAviUrl={post.avatarUrl}
                    imagePosterId={post.userId}
                  />
                </Grid>
              )
            })}
          </Grid>
        </Paper>
      </div >
      :
      <CircularProgress
        size='100px'
        style={{
          alignSelf: 'center',
          top: '40%',
          position: 'relative',
        }}
      />
  )

}

const mapStateToProps = (state) => {
  return {
    token: state.user.token,
    feedPosts: state.user.feedPosts,
    feedPostsOrd: state.user.feedPostsOrd,
    user: state.user.profile,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getFeedPostReq: (...args) => dispatch(getFeedPostReq(...args)),
    getUserProfileReq: (...args) => dispatch(getUserProfileReq(...args)),
    getUserIds: (...args) => dispatch(getUserIds(...args)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Feed);
