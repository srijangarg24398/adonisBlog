'use strict'

//Bring in the model
const Post=use('App/Models/Post')

//Bring in the validator
const { validate } = use('Validator')

class PostController {
	// async index(){
	// 	return 'Posts'
	// }

	//To render a view
	async index({ view }){
		const posts=await Post.all();
		return view.render('posts.index',{
			title:"Latest Posts",
			posts:posts.toJSON()
		})
	}

	async details({ params , view }){
		const post=await Post.find(params.id)
		return view.render('posts.details', {
			post:post
		})
	}

	async add({ view }){
		return view.render('posts.add')
	}

	async store({ request, response, session }){
		//Validate input
		const validation=await validate(request.all(),{
			title:'required|min:3|max:255',
			body:'required|min:3'
		})

		if (validation.fails()){
			session.withErrors(validation.messages()).flashAll()
			return response.redirect('back')	//Same page
		}

		const post=new Post()
		post.title=request.input('title')
		post.body=request.input('body');
		await post.save()
		session.flash({ notification:"Post successfully added!!" })
		return response.redirect('/posts')
	}

	async edit({ params,view }){
		const post=await Post.find(params.id)
		return view.render('posts.edit',{post})
	}

	async update({ params, request, response, session }){
		const validation=await validate(request.all(),{
			title:'required|min:3|max:255',
			body:'required|min:3'
		})
		if (validation.fails()){
			session.withErrors(validation.messages()).flashAll()
			return response.redirect('back')
		}

		const post=await Post.find(params.id)
		post.title=request.input('title')
		post.body=request.input('body')
		await post.save()
		session.flash({ notification:"Post updated successfully!!" })
		return response.redirect('/posts/'+params.id)
	}

	async remove({ params, response, session }){
		const post=await Post.find(params.id)
		await post.delete()
		session.flash({ notification:"Post deleted successfully!!" })
		return response.redirect('/posts')
	}
}

module.exports = PostController
