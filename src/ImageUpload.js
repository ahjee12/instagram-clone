import React, {useState} from 'react'
import firebase from "firebase";
import { storage, db } from './Firebase.js';
import { Input, Button } from '@material-ui/core';
import './ImageUpload.css'


function ImageUpload({username}) {

    const [progress, setProgress] = useState(0)
    const [caption, setCaption] = useState('')
    const [file, setFile] = useState('')

    const [image, setImage] = useState(null)
    // const [url, setUrl] = useState('')


  const handleChange = (e) =>{
        //file아니고 files라는 거 주의!
        if(e.target.files[0]){
            setImage(e.target.files[0])
            setFile(e.target.value)
        }
        
    }

    const handleUpload = () =>{
        const uploadTask = storage.ref(`images/${image.name}`).put(image)
        uploadTask.on(
            'state_changed', 
            (snapshot) => {
                //progress function
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes)*100)
                setProgress(progress)
            },
            (error) =>{
                //Error function
                alert(error.message)
            },
            () =>{
                //complete function
               storage.ref('images')
                      .child(image.name)
                      .getDownloadURL()
                      .then(url => {
                        //   setUrl(url)
                          //post image inside db
                          db.collection('posts').add({
                              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                              caption: caption,
                              imageUrl: url,
                              username: username
                          })

                          setProgress(0)
                          setCaption('')
                          setFile('')
                          setImage(null)
                      }) 
            }
        )
    }

    return (
        <div className='imageupload'>
           <div className="bg"></div>
           <div className="imageupload_container">
            {/* <h1>abc</h1> */}
            <progress className='imageupload_progress' value={progress} max='100'/>
                        {/* caption */}
            <Input type="text" placeholder='글쓰기' onChange={event => setCaption(event.target.value)} value={caption}/>

            {/* file picker */}
            <Input type="file" onChange={handleChange} value={file}/>

            {/* post button */}
            <Button className='imageupload_button' onClick={handleUpload}>
                Upload
            </Button>
           </div>
            
          
            
        </div>
    )
}

export default ImageUpload
