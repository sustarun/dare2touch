/*!
* running the client of the game
*\class client
*/

/*!
* pausing javascript for a few miliseconds
*\fn sleep(miliseconds)
*\memberof client
*\param miliseconds sleep time in miliseconds
*/
function sleep(miliseconds) {
   console.log("Sleep called");
   var currentTime = new Date().getTime();
   var newTime = currentTime - 1;

   while (currentTime + miliseconds >= newTime) {
   		newTime = new Date().getTime();
   }
}
var rsa_pac = undefined;
var my_game_core = new gc(0);
var socket = my_game_core.get_socket();
while (socket == undefined){
	console.log("socket undefined");
	socket = my_game_core.get_socket();
}
var verifieddd = false;

/*!
* sends a request to get rsa package
*\fn send_pack_req()
*\memberof client
*/

function send_pack_req(){
	console.log("sendin package request");
	if (socket == undefined){
		console.log("socket undefined");
	}
	socket.emit('get_package');
	console.log("get_package emit kr diya");
	let co = 1;
	while (!verifieddd){
		console.log("verify nhi hua");
		socket.emit('get_package');
		sleep(50);
		co++;
		if (co >= 100) {
			console.log("Breaking the habit");
			break;
		}
	}
	verifieddd = false;

}

/*
* Is called when window is loaded and then event "get_package" is emmited
*\fn window.onload()
*\memberof client
*/

window.onload = function(){
	console.log("window onload called");
	socket.emit("get_package");
}

/*
* Event is invoked when rsa package is recieved
*\fn Event:rsa_enc_package
*\param data rsa packege
*/

socket.on('rsa_enc_package', function(data){
	console.log("package received");
	rsa_pac = data;
	verifieddd = true;
});

// console.log("reached before join");

/*!
* sends a request to login using username and password
*\fn Join()
*\memberof client
*/

function Join() {
	document.getElementById('username-error-container').innerHTML ='';
	document.getElementById('password-error-container').innerHTML ='';
	Player=document.getElementById('PlayerID').value.trim();
	password=document.getElementById('password').value;
	if(Player==""){document.getElementById('username-error-container').innerHTML ='Please fill in the Username';}
	if(password==""){document.getElementById('password-error-container').innerHTML ='Please fill in the Password';}
	else {
		var enc_pswd = undefined;
		while (rsa_pac === undefined){
			console.log("sleep loop");
			socket.emit('get_package');
			sleep(100);
		}
		enc_pswd = encr(password, rsa_pac.n, rsa_pac.e);
		socket.emit('setPlayerID', {username: Player, pswd: enc_pswd});
	}
};

console.log("reached before signup");

/*!
* sends a request to sign up using the username and password
*\fn Signup()
*\memberof client
*/

function Signup(){
	document.getElementById('username-error-container').innerHTML ='';
	document.getElementById('password-error-container').innerHTML ='';
	newUser = document.getElementById('PlayerID').value.trim();
	password=document.getElementById('password').value;
	repassword=document.getElementById('repassword').value;
	username_length=newUser.toString().length;
	password_length=password.toString().length;
	if(newUser==""){document.getElementById('username-error-container').innerHTML ='Please fill in the Username';}
	else if(password==""){document.getElementById('password-error-container').innerHTML ='Please fill in the Password';}
	else if(password!=repassword){document.getElementById('password-error-container').innerHTML ='The two passwords do not match';}
	else if(username_length >40){document.getElementById('username-error-container').innerHTML ='Username is too long. Keep it below 40 characters';}
	else if(password_length >16){document.getElementById('password-error-container').innerHTML ='Password is too long. Keep it below 16 characters';}
	// else if (password!="password"){document.getElementById('password-error-container').innerHTML ='Wrong Password';}
	else {
		var enc_pswd = undefined;
		while (rsa_pac === undefined){
			socket.emit('get_package');
			sleep(50);
		}
		enc_pswd = encr(password, rsa_pac.n, rsa_pac.e);
		socket.emit('create_player', {username: newUser, pswd: enc_pswd});
	}
}

/*!
* takes you to the sign up window
*\fn Signup_window()
*\memberof client
*/

function Signup_window(){
	document.getElementById('username-error-container').innerHTML ='';
	document.getElementById('password-error-container').innerHTML ='';
	document.getElementById('signup').innerHTML='<center><b>Re-Enter Password </b><input id="repassword" type="password" placeholder="Re-Enter Password" name="repassword"><br>'+
	'<button id="signup_button" class="login_button" type="submit" onclick="Signup()"><b>Sign Up</b></button></center>';
}

console.log("reached before play with Friends");

/*!
* sends a request to play the game with friends
*\fn Play_With_Friends()
*\memberof client
*/

function Play_With_Friends(){
	game_ID = document.getElementById('GameID').value.trim();
	no_OfPlayers = document.getElementById('NoOfPlayers').value.trim();
	if(game_ID==""){document.getElementById('gameid-error-container').innerHTML ='Please enter any Game ID';}
	else if(no_OfPlayers==""){
		no_OfPlayers=4;
		socket.emit('setGameID', {gameID:game_ID, playerID:Player, noOfPlayers:no_OfPlayers});
	}
	else if(isNaN(no_OfPlayers) || (Number(no_OfPlayers) != parseInt(no_OfPlayers)) || Number(no_OfPlayers) <= 0){document.getElementById('gameid-error-container').innerHTML ='Please enter a positive integer for the no. of players field';}
	else if(no_OfPlayers==1){document.getElementById('gameid-error-container').innerHTML ='Please choose <b>play with computer</b> for single player';}
	else socket.emit('setGameID', {gameID:game_ID, playerID:Player, noOfPlayers:no_OfPlayers});		
}

/*!
* sends a request to play in the random arena
*\fn Random_play()
*\memberof client
*/

function Random_play(){
	game_ID=-123456789;
	no_OfPlayers = 4;
	socket.emit('setGameID', {gameID:game_ID, playerID:Player, noOfPlayers:no_OfPlayers});
}

/*!
* Is invoked when a random game is full and then emits an event "setGameID"
*\fn random_game_full
*\memberof client
*\param data it contains an object having Game Id, Player Id, No. of players
*/

socket.on('random_game_full', function(data){
	socket.emit('setGameID', data);
});

/*!
* Event is envoked when chosen Game Id already is already in use and throws an error message
*\fn Event:GameIDExists
*\memberof client
*\param data Game Id
*/

socket.on('GameIDExists', function(data) {
	document.getElementById('gameid-error-container').innerHTML = 'The game with GameID '+ data + ' is full. Try after sometime!!';
});

/*!
* Event is envoked when chosen Player Id already is already in use and throws an error message
*\fn Event:PlayerIDExists
*\memberof client
*\param data Player Id
*/

socket.on('PlayerIDExists', function(data) {
	document.getElementById('username-error-container').innerHTML ='Username <b>'+ data + '</b> already exists. Please try another username.';
});

/*!
* Event is envoked when login is done using same user id through more than one pcs
*\fn Event:do_login
*\memberof client
*/

socket.on('do_login', function(){
	document.getElementById('username-error-container').innerHTML = 'Please login';
});

/*!
* Event is envoked when signup is done
*\fn Event:do_login1
*\memberof client
*/

socket.on('do_login1', function(){
	document.getElementById('username-error-container').innerHTML = 'Please login';
	document.getElementById('signup').innerHTML='<button id="login_button" class="login_button" type="submit" onclick="Join()"><b>Login</b></button><br>';
});

/*!
* Event is envoked when login id does not exists and signup is required
*\fn Event:Event:do_login2
*\memberof client
*\param data Player ID
*/

socket.on('do_login2', function(data){
	document.getElementById('password-error-container').innerHTML = 'User <b>'+ data + '</b> does not exists. Please SignUp below';
});		

/*!
* Event is envoked when login id already exists during sign up and so re-signup is required
*\fn Event:re_signup
*\memberof client
*\param data Player ID
*/

socket.on('re_signup', function(data){
	document.getElementById('username-error-container').innerHTML = 'Username <b>'+ data + '</b> already exists. Please try another username.';
});

/*!
* Event is envoked when login id already exists during sign up and so re-signup is required
*\fn Event:re_enter_credentials
*\memberof client
*\param data Player ID
*/

socket.on('re_enter_credentials', function() {
	document.getElementById('username-error-container').innerHTML ='Wrong credentials<br>\n';
	console.log("We sent wrong credentials");
});

/*!
* Event is envoked when login is successfull and then game id window is displayed
*\fn Event:settingPlayerID
*\memberof client
*\param data Player ID
*/

socket.on('settingPlayerID', function(data){
	Player = data;
	console.log("caught setPlayerID");
	game_id_area();
});

/*!
* Event is envoked when game is over and window is switched from playing area to game id window
*\fn Event:game_over1
*\memberof client
*/

socket.on('game_over1', function(){
	window.onkeydown = null;
	window.location.reload(true);
	game_id_area();
});

/*!
* Event is envoked when a player joins and other players with the same game id is notified that this player has joined
*\fn Event:print_player
*\memberof client
*\param data Player ID
*/

socket.on('print_player', function(data){
	if (data == Player){
		document.body.innerHTML ='<p><button type="submit" onclick="Exit_game()" class="exit_game"><u>Exit Game</u></button><br>'+
		 Player + '</p>'+
		'You are Connected<br>';
	}
	else {document.body.innerHTML +='<b>'+data+ '</b> is Connected<br>';}
});

/*!
* Event is envoked when game starts and playing window is displayed
*\fn Event:display_canvas
*\memberof client
*/

socket.on('display_canvas', function(){
	game_play_area();
});

/*!
* Exits the game and takes you to the Game Id window
*\fn Exit_game()
*\memberof client
*/

function Exit_game(){
	console.log("exit game was called");
	window.onkeydown = null;
	window.location.reload(true);
	socket.emit('disconnect1');
	game_id_area();
}

/*!
* logs out from the current session and takes you to the login page
*\fn logout()
*\memberof client
*/

function logout(){
	socket.emit('logout');
}

/*!
* takes you to the game id window
*\fn game_id_area()
*\memberof client
*/

function game_id_area(){
	window.onkeydown = null;
	document.body.innerHTML = '<div id="everything" class="container"></div>';
	document.getElementById('everything').innerHTML ='<p><button type="submit" onclick="logout()" class="exit_game"><u>Logout</u></button><br>'+
	Player + '</p>'+
	'<center>'+
	'<label><b>Game ID</b></label>&emsp;'+
	'<input id = "GameID" type = "text" name = "GameID" value = "" placeholder = "Enter GameID" class="game">'+
	'<label><b>No. of Players</b></label>&emsp;'+
	'<input id = "NoOfPlayers" type = "text" name = "NoOfPlayers" value = "" placeholder = "Enter the No. of Players(2 or more)" class="game"><br>'+
	'<div id="gameid-error-container" type="error" class="error"></div><br>'+
	'<button type="submit" onclick="Play_With_Friends()" class="play1_button">Play With Friends</button><br><br>'+
	'<a href = "/Single_player/single_ai.html" target = "_blank"><button type="submit" onclick="" class="play_button">Play With Computer</button></a>'+
	'<button type="submit" onclick="Random_play()" class="play_button">Play In Random Arena</button>'+
	'</center>';
}

/*!
* takes you to the game playing window
*\fn game_play_area()
*\memberof client
*/

function game_play_area(){
	document.body.innerHTML ='<p><button type="submit" onclick="Exit_game()" class="exit_game"><u>Exit Game</u></button><br>'+
		Player + '</p>'+
	'<div id = "win"><canvas id="myCanvas" style="border:1px solid #d3d3d3;"></canvas></div>';
}

/*!
* Event is envoked when a player is disconnected and other players are notified of the same
*\fn Event:player_disconnected
*\memberof client
*\param pida Player ID
*/

socket.on('player_disconnected', function(pida){
	document.body.innerHTML += '<b>'+pida+'</b> was disconnected';
});

/*!
* Event is envoked when a window is refreshed
*\fn Event:ref
*\memberof client
*/

socket.on('ref', function(){
	window.location.reload(true);
});
