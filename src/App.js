import React, {useState, useEffect} from 'react'
import './App.css';
import logo_instagram from './instagram2.png';
import Post from './Post';
// import bobby from './bobby.jpg';
// import luckyman from './luckyman.jpg';
// import lilac from './lilac.jpg';
import {db, auth} from './Firebase.js';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
// import { Button, Avatar, makeStyles, Modal, Input } from "@material-ui/core";
import { Button, Input, Avatar } from '@material-ui/core';

import ImageUpload from './ImageUpload';

// import InstagramEmbed from 'react-instagram-embed';

function getModalStyle() {
  const top = 50; 
  const left = 50; 

  return {
    height: '300px',
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
  //hook! useState!
  // const [posts, setPosts] = useState([
  //   {
  //     username:"Bobby",
  //     caption:"WOW it works! 쿨!",
  //     //{bobby}이런 식으로 쓰지 않기!
  //     imageUrl: bobby
  //   },
  //   {
  //     username:"Lucky man",
  //     caption:"Great job! Dope!",
  //     imageUrl: luckyman
  //   },
  //   {
  //     username:"Lilac",
  //     caption:"Mind blowing instagram clone!",
  //     imageUrl: lilac
  //   },
  // ]);
  const [posts, setPosts] = useState([]);

  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [openUp, setOpenSignUp] = React.useState(false);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [user, setUser] = useState(null)

  const [openSignIn, setOpenSignIn] = useState(false)
  
  //front 
  useEffect(() =>{
    //backend  unsubscribe 함수 
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if(authUser){
        //user has logged in....
        console.log(authUser)
        setUser(authUser)

        // if(authUser.displayName){
        //   //don't update username

        // }else{
        //   //if we just created someone
        //   return authUser.updateProfile({
        //     displayName: username,
        //   });
        // }
      }else{
        //user has logged out...
        setUser(null)
      }
    })

    return () =>{
      //perform some cleanup actions
      unsubscribe();
    }
  }, [user, username])

  //hook! useEffect! Runs a piece of code based on a specific condition
  useEffect(()=>{
    //this is where the code runs
    // console.log(db)
    db.collection('posts')
      .orderBy('timestamp', 'desc')
      .onSnapshot((snapshot)=>{
        setPosts(snapshot.docs.map(doc => ({
          id: doc.id,
          post: doc.data()
         })
        ))
      })
  },[]);
  // console.log(posts)

  const signIn = (event) =>{
    event.preventDefault();

    auth.signInWithEmailAndPassword(email, password)
        .catch((error) => alert(error.message))
    // console.log(user.displayName)
    
    setEmail('')
    setPassword('')
    setOpenSignIn(false)
  }

  const signUp = (event) =>{
    event.preventDefault();

    auth.createUserWithEmailAndPassword(email, password)
        .then((authUser) =>{
          return authUser.user.updateProfile({
            displayName: username
          })
          //console.log(user.displayName)
          //setUser
        })
        .catch((error) =>alert(error.message))

    setEmail('')
    setPassword('')
    setOpenSignUp(false);
  }


  // setPosts
  return (
    <div className="app">

      {/* modal */}
      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)} >
      <div style={modalStyle} className={classes.paper}>
        {/* <h2 id="simple-modal-title">Text in a modal</h2> */}
        <form className="app_signUp" >
          <center>
            <img className="app_headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png" alt=""/>
          </center>
          <Input type="text" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
          <Input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
          <Button type="submit" onClick ={signIn}>Log in</Button>
        </form>
      </div>
      </Modal>

      <Modal open={openUp} onClose={() => setOpenSignUp(false)} >
      <div style={modalStyle} className={classes.paper}>
        {/* <h2 id="simple-modal-title">Text in a modal</h2> */}
        <form className="app_signUp" >
          <center>
            <img className="app_headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png" alt=""/>
          </center>
          <Input type="text" placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)}/>
          <Input type="text" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
          <Input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
          <Button type="submit" onClick ={signUp}>Sign up</Button>
        </form>
      </div>
      </Modal>

      {/* header */}
      <div className="app_header">
        <img className="app_headerImage" src={logo_instagram} alt="logo instagram"/>
         {/* 로그인 */}
          {user?(
              <div className="app_loginContainer">
                 <Avatar
                    className="app__headerAvatar"
                    alt={user.displayName}
                    src="/static/images/avatar/1.jpg"
                  />
                <Button  onClick ={() => auth.signOut()}>Logout</Button>
               
              </div>    
          ):(         
              <div className="app_loginContainer">
              <Button  onClick ={() => setOpenSignIn(true)}>Log in</Button>
              <Button  onClick ={() => setOpenSignUp(true)}>Sign up</Button>
              </div>   
          )
          }
      </div>

     
    

      {/* 1.post */}
      {/* <Post username="Bobby" caption="WOW it works! 쿨!" imageUrl= {bobby} /> */}
      {/* post */}
      {/* <Post username="Lucky man" caption="Great job! Dope!" imageUrl= {luckyman}/> */}
      {/* post */}
      {/* <Post username="Lilac" caption="Mind blowing instagram clone!" imageUrl= {lilac}/> */}

      {/* 2.post map 사용하기!! */}
      {/* {posts.map( ({username, caption, imageUrl})  => (
              <Post
                username={username}
                caption={caption}
                imageUrl={imageUrl}
              />
       ))} */}


       {/* 3. 포스트 post useState, useEffect */}
       <div className="app_posts">
          <div className="app_postLeft">
           {/* 포스트 모음 */}
          {
            posts.map(({ id, post}) =>(
                <Post key={id} postId={id} user={user} username = {post.username} caption = {post.caption} imageUrl ={post.imageUrl} />
              )
            )
          }
          </div>
          <div className="app_postsRight">
          {/* 인스타그램 인베드 */}
          
            {/* <InstagramEmbed
            url='https://www.instagram.com/p/CK6GZW6jk3c/'
            clientAccessToken='123|456'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          /> */}
            {/* <iframe src="https://www.instagram.com/p/CK6GZW6jk3c/" /> */}
          </div>  
       </div>  
       

      {/* 파일 업로드 */}
      {user?.displayName ?
        (
          <ImageUpload username={user.displayName} />
        ):(
          <div className="imageupload_noUser">
            <div className="bg"></div>
            <div className="imageupload_noUser_container">
               <h3>파일 업로드를 하려면 로그인이 필요합니다!</h3>
              <h3>Sorry you need to login to upload</h3>
            </div>
          </div>
        )
      }
      
      {/* caption */}
      {/* file picker */}
      {/* post button */}
      

    </div>
  );
}

export default App;
