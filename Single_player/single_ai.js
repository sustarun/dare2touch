var my_game_core = new ai_gc(0);

/*!
* running the single player game
*\class single_player
*/

/*!
* Starts the game
*\fn startPlay(level)
*\memberof single_player
*\param level level of the game i.e. easy, medium or hard
*/
function startPlay(level){
	game_play_area();
	my_game_core.start_start(level);
}

/*!
* Exist the game to take to the game id window
*\fn Exit_game()
*\memberof single_player
*/

function Exit_game(){
	console.log("exit game was called");
	window.onkeydown = null;
	window.location.reload(true);
	game_id_area();
}

/*!
* takes you to the game window
*\fn game_play_area()
*\memberof single_player
*/

function game_play_area(){
	document.body.innerHTML ='<p><button type="submit" onclick="Exit_game()" class="exit_game"><u>Exit Game</u></button><br>'+
		'<button type="submit" onclick="Logout()> Logout </button>' + '</p>'+
	'<div id = "win"><canvas id="myCanvas" style="border:1px solid #d3d3d3;"></canvas></div>';
}
