
function handleRegister(){
  let username = $('#username').val()
  let password = $('#password').val()
  $.ajax({
    url: "/register",
    method: "POST",
    data: {
      username: username,
      password: password
    },
    success: function(res){
      window.location.href = "/"
    }
  })
}
function handleLogin(){
  let username = $('#username').val()
  let password = $('#password').val()

  $.ajax({
    url: "/login",
    method: "POST",
    data: {
      username: username,
      password: password
    },
    success: function(res){
      // alert(res)
     //  console.log(res)
      if(res.token){
        // window.localStorage.setItem('my_token', res.token)
        window.location.href ="/dashboard"
     }
     else{
       alert("Login fail")
     }
    }
  })
}
