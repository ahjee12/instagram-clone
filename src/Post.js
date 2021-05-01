import React, {useState, useEffect} from 'react';
// import logo_react from './react.png';
import  './Post.css';
import { Button, Input, Avatar } from '@material-ui/core';
import {db} from './Firebase.js'
import firebase from 'firebase';

function Post({postId, user, username, caption, imageUrl}) {
    const [comments, setComments] = useState([])
    const [comment, setComment] = useState('')

    useEffect(() => {
        let unsubscribe;
        
        if(postId){
            unsubscribe = db.collection("posts")
                            .doc(postId)
                            .collection('comments')
                            .orderBy('timestamp', 'asc')
                            .onSnapshot((snapshot) => {
                                setComments(snapshot.docs.map((doc) => doc.data()));
                                console.log(snapshot)
                                console.log(comments)

                            })
        }
 

        return () =>{
            unsubscribe();
        }
        
    }, [postId])

    const postComment = (event) =>{
        event.preventDefault();
        db.collection("posts")
          .doc(postId)
          .collection("comments")
          .add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp() 
        });
        console.log(comment)
        setComment('');
    }

    return (
        <div className="post">

            {/* header */}
            <div className="post_header">
                <Avatar className="post_avatar" alt={username} src="/static/images/avatar/1.jpg" />

                {/* header안에 avatar + username */}
                <h3>{username}</h3>
                
            </div>
            
            {/* image */}
            <div className="post_image_container">
                <img className="post_image" src={imageUrl} alt="logo react"/>
            </div>
            
            {/* username + caption */}
            <h4 className="post_text"><strong>{username}</strong>{caption}</h4>

            <div className="post_comments">
                {
                    comments.map((comment) =>(
                        <p className='post_comments_container'>
                            <strong>{comment.username}</strong> {comment.text}
                        </p>
                    ))
                }
            </div>

            {user &&(
                <form className='post_commentBox'>
                    <Input className='post_input' type="text" placeholder='댓글 달기' value={comment} onChange={(e) => setComment(e.target.value)}/>
                    <Button className='post_button' type='submit' onClick={postComment} disabled={!comment}>Post</Button>
                </form>
            )
            }
           {/* <form className='post_commentBox'>
                <Input className='post_input' type="text" placeholder='댓글 달기' value={comment} onChange={(e) => setComment(e.target.value)}/>
                <Button className='post_button' type='submit' onClick={postComment} disabled={!comment}>Post</Button>
            </form> */}

        </div>
    )
}

export default Post
