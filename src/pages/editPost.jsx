import React, {useEffect, useState} from 'react'
import { container, PostForm } from '../components'
import appwriteService from '../appwrite/config'
import { useParams, useNavigate } from 'react-router-dom'


function editPost() {
   
  const [post, setPosts] = useState([])
  const{slug} = useParams()
  const navigate = useNavigate

  useEffect(()=>{
    if(slug){
      appwriteService.getPost(slug).then((post)=>{
        if(post){
          setPosts(post)
        }
      })
    }
    else{
      navigate('/')
    }
  },[slug,navigate])


  return post ? (
    <div className='py-8'>
     <container>
      <PostForm post={post}/>
     </container>
    </div>
  ) : null
}

export default editPost
