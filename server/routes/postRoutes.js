import express from 'express'
import * as dotenv from 'dotenv'
import { v2 as cloudinary } from 'cloudinary'
/* 
https://console.cloudinary.com/console/

images leri burada kaydedip mongodb de url ini kaydedeceğiz
 */
import Post from '../mongodb/models/post.js'

dotenv.config()

const router = express.Router()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// http://localhost:8080/api/v1/post
// GET ALL POST

router.route('/').get(async (req, res) => {
  try {
    const posts = await Post.find({})
    res.status(200).json({ success: true, data: posts })
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: 'Fetching posts failed, please try again',
      })
  }
})

//localhost:8080/api/v1/post
// CREATE POST
http: router.route('/').post(async (req, res) => {
  try {
    const { name, prompt, photo } = req.body

    // images leri cloudinary de kaydedeceğiz
    
   const photoUrl = await cloudinary.uploader.upload(photo) 

    // images lerin url ni mongo db de saklayacağız
    const newPost = await Post.create({
      name,
      prompt,
      photo: photoUrl.url,
    })

    res.status(200).json({ success: true, data: newPost })
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: 'Unable to create a post, please try again',
      })
  }
})

export default router
