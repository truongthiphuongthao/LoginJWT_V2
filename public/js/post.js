// delete post

function handleDeletePost(value){
	var id_post = value
	$.ajax({
		url: '/delete-post/' + id_post,
		method: 'DELETE',
		data: {
			id_post: id_post
		},
		success: function(res){
			alert(res)
			location.reload()
		}
	})
}

// add post
function handleAddPost(){
	$.ajax({
	 url: '/add-post',
	 method: 'GET',
	 success: function(res){
		 window.location.href = "/add-post"
	 }
 })
}

// add post
var arr_link = []
// get image link in post
function getImageLink(){
		let image_link = $('#image_link').val().trim()
		if (image_link.length == 0) return
		if(arr_link.indexOf(image_link) === -1){
			arr_link.push(image_link)
			$('#main-list').append(`
				<tr id="${image_link}">
					<td>${image_link}</td>
					<td> <button type="button" class="btn btn-secondary" onclick="deleteLink('${image_link}')"> Delete</button> </td>
				</tr>`
			)
		}
}

// event delete link
function deleteLink(image_link){
  var link = document.getElementById("main-list")
	// alert(image_link)
  $(this).parents('tr').first().remove();
	let idx = arr_link.indexOf(image_link);
	if (idx > -1) {
		arr_link.splice(idx, 1)
		link.deleteRow(idx);
	}
}

// // save post
function savePost(){
  let post_content = $('#post_content').val()
	let image_links = arr_link
	// alert(post_content)
	// alert(image_links)
	$.ajax({
		url: '/add-post',
		method: 'POST',
		data: {
			post_content: post_content,
			image_links: image_links
		},
		success: function(res){
			alert(res)
			window.location.href = "/dashboard"
		}
	})
}

// update posts
function updatePost(id){
	let post_content = $('#post_content_update').val()
	$.ajax({
		url: '/update-post/' + id,
		method: 'POST',
		data: {
			id: id,
			post_content: post_content
		},
		success: function(res){
			alert(res)
			window.location.href = "/dashboard"
		}
	})

}
