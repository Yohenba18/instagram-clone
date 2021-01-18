import React, { useState, useEffect } from "react";
import "./App.css";
import Post from "./Post";
import { auth, db } from "./Firebase";
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from "@material-ui/core";
import ImageUpload from "./ImageUpload";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [openSignIn, setOpenSignIn] =  useState(false);
  const [posts, setPosts] = useState([]);
  const [open,setOpen] = useState(false);
  const [username,setUsername] = useState("");
  const [password,setPassword] = useState("");
  const [email,setEmail] = useState("");
  const [user,setUser] = useState(null);


  useEffect(()=>{
     const unsubscribe =  auth.onAuthStateChanged((authUser) =>{
       if(authUser){
         //user has logged in
           console.log(authUser);
           setUser(authUser);

       }else{
         //user logged out
         setUser(null);
       }
     })

     return (()=>{
       unsubscribe();
     })
  },[user,username]);
  
  useEffect(() => {
    db.collection("posts").orderBy('timestamp','desc').onSnapshot((snapshot) => {
      setPosts(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          post: doc.data(),
        }))
      );
    });
  }, []);

  const signUp = (event) =>{
      event.preventDefault();
      auth.createUserWithEmailAndPassword(email,password)
      .then((authUser)=>{
        return authUser.user.updateProfile({
          displayName: username
        })
      })
      .catch((error) => alert(error.message))

      setOpen(false)
  };

  const signIn = ((event) =>{
    event.preventDefault()
    auth
    .signInWithEmailAndPassword(email,password)
    .catch(error => alert(error.message))

    setOpenSignIn(false)
  })

  return (
    <div className="App">
 <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
      <div style={modalStyle} className={classes.paper}>
      <form className="app_signup">
      <center>
              <img 
                className="app_headerImage"
                height="40px;"
                src="https://toogreen.ca/instagreen/img/instagreen.svg"
                alt=""
              />
      </center>
            <Input 
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            /> 
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input 
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
           <Button onClick={signUp}>Sign Up</Button>
           </form>
     </div>
     
  </Modal>


      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
      <div style={modalStyle} className={classes.paper}>
      <form className="app_signup">
      <center>
              <img 
                className="app_headerImage"
                height="40px;"
                src="https://toogreen.ca/instagreen/img/instagreen.svg"
                alt=""
              />
      </center>
            
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input 
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
           <Button type="submit" onClick={signIn}>Sign In</Button>
           </form>
     </div>
     
  </Modal>

      <div className="app_header">
        <img
          className="app_headerImage"
          src="https://toogreen.ca/instagreen/img/instagreen.svg"
          height="40px;"
          alt=""
        />
        {user? (
          <Button onClick={() => auth.signOut()}>Log out</Button>
         ): (
           <div className="app_loginContianer">
             <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
             <Button onClick={() => setOpen(true)}>Sign Up</Button>
           </div>
        
         )}
      </div>

   
     <div className="app_post">
       <div className="app_postLeft">
       {
         posts.map(({ id, post }) => (
        <Post
          key={id}
          postId={id}
          user={user}
          username={post.username}
          caption={post.caption}
          imageUrl={post.imageUrl}
        />
      ))
    }
       </div>
         <div className="app_postRight">
          <iframe
          title="frame"
          src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FCodingTreeFoundation&tabs=timeline&width=340&height=1500&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"
          width="340"
          height="100%"
          style={{ border: 'none', overflow: 'hidden' }}
          scrolling="no"
          frameborder="0"
          allowTransparency="true"
          allow="encrypted-media"
        ></iframe>
         </div>
      
     </div>
      
        { user?.displayName?
          (<ImageUpload username={user.displayName} />)
        :(
          <h3>Sorry you need to login to upload</h3>
        )
        }
    </div>
  );
}

export default App;
