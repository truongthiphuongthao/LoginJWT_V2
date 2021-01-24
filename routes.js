const Router = require('express').Router()
const db = require('./database/models')
const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken')
const secretKey = "mySecretKey"
const path = require("path");


// function
function authenticateToken(req, res, next) {
  // Gather the jwt access token from the request header
  // const authHeader = req.headers['authorization']
  // const token = authHeader && authHeader.split(' ')[1]
  // if (token == null) return res.sendStatus(401) // if there isn't any token
  console.log(req.cookies)
  // jwt.verify(req.cookies, secretKey, (err, user) => {
  //   console.log('error authenticateToken:', err)
  //   if (err) return res.sendStatus(403)
  //   req.user = user
  //   next() // pass the execution off to whatever request the client intended
  // })
}

// display dashboard page
Router.get('/dashboard', async (req, res) =>{
	//get all post
	let post = await db.Post.find({})
	// get all comment
	let comment = await db.Comment.find({})
	res.render('index', {
		posts: post,
		comments: comment
	})
})

// display login page
Router.get('/', async(req, res) => {
  console.log(req.header.cookies)
  res.render('login')
})

Router.get('/register', async(req, res) => {
  res.render('register')
})

// display add post page
Router.get('/add-post', async(req, res) => {
  res.render('add-post')
})

// display update post page
Router.get('/update-post/:id', async(req, res) => {
	try{
		let post_id = await db.Post.findById(req.params.id)
		console.log(post_id)
		res.render('update-post', {
			post_id : post_id,
		})
	}catch(err){
		console.log(err)
		throw err
	}
})

// resgiter
Router.post('/register', async(req, res) => {
  try{
    let newUser = await new db.User({
        username: req.body.username.toString(),
        password: req.body.password.toString()
    })
    await newUser.save()
    res.json({
      message: "Register successfully!"
    })
  }catch(err){
    console.log(err)
    throw err
  }
})

//login
Router.post('/login', async(req, res) => {
  try{
    let username = req.body.username
    let password = req.body.password
    let user = await db.User.findOne({username: username, password: password})
    let data
    if(!user){
      console.log("User not exist")
      data = {
        message: "User not exist"
      }
    }
    else{
      // create token and payload data
      let token = jwt.sign({user: user}, secretKey, { expiresIn: '1h' })
      data = {
        userId: user._id,
        token: token,
        message: "Login successfully"
      }
      console.log(jwt)
      console.log(token)
      res.cookie(jwt, token).send(data)
      console.log("login: ",data)
    }
  }catch(err){
    console.log(err)
    throw err
  }
})

// delete post
Router.delete('/delete-post/:postId', authenticateToken, async (req, res) => {
	try{
		let postId = ObjectId(req.params.postId)
		console.log(postId)
		let comments = await db.Comment.find({post_id: postId})
		console.log(comments)
		if(comments != null){
			await db.Post.findByIdAndDelete({_id: postId})
			console.log("Deleted successfully post")
			for(let comment of comments){
				await db.Comment.findByIdAndDelete({_id: comment.post_id})
			}
			console.log("Deleted successfully comment")
			res.send("Deleted successfully")
		}
		else{
			await db.Post.findByIdAndDelete({_id: postId})
			console.log("Deleted successfully post")
			res.send("Deleted successfully")
		}

	}catch(err){
		console.log(err)
		throw err
	}
})

// save post
Router.post('/add-post', async(req, res) => {
	try{
		let post_content = req.body.post_content
		let image_links = req.body.image_links
    console.log(post_content)
    console.log(image_links)
		let newPost = await new db.Post({
			post_content: post_content,
			image_links: image_links
		})
		await newPost.save()
		console.log(newPost)
		res.send("Create Post successfully")
	}catch(err){
		console.log(err)
		throw err
	}
})

// update post
Router.post('/update-post/:id', async(req, res) => {
	try{
		let id = req.body.id
		let post_content = req.body.post_content
		await db.Post.findByIdAndUpdate(
		{_id: id},
		{$set: {post_content: post_content}},
		{useFindAndModify : false}
		)
		res.send("Update successfully")

	}catch(err){
		console.log(err)
		throw err
	}
})

// save comment
Router.post('/save-comment/:id', async(req, res) => {
	try{
		let post_id = req.body.post_id
		let comment_details = req.body.comment_details
		let newComment = await new db.Comment({
			post_id: post_id,
			comment_details: comment_details
		})
		await newComment.save()
		res.send("Create Comment successfully")
	}catch(err){
		console.log(err)
		throw err
	}
})

Router.delete('/delete-comment/:id', async(req, res) => {
	try{
		let _id = req.body._id
		await db.Comment.findByIdAndDelete({_id: _id})
		res.send("Delete comment successfully")
	}catch(err){
		console.log(err)
		throw err
	}
})

// edit comments
Router.post('/update-comment/:id', async(req, res) =>{
	try{
		let _id = req.body._id
		let comment_details = req.body.comment_details
		await db.Comment.findByIdAndUpdate(
			{_id: _id},
			{$set: {comment_details: comment_details}},
			{useFindAndModify : false}
		)
		console.log("Update comment successfully")
		res.send("Update comment successfully")
	}catch(err){
		console.log(err)
		throw err
	}
})


module.exports = Router
