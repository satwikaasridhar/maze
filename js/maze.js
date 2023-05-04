var ctx, wid, hei, cols, rows, maze, stack = [], stack_next = [], stack_wfs = [], begin = { x: -1, y: -1 }, start = { x: -1, y: -1 }, end = { x: -1, y: -1 }, grid = 8, tmp;
var game = 0, solver = 0, minRow = 10, minCol = 10, maxRow = 160, maxCol = 160, isAniSolv = true, isAniMaze = true;
var colorIdx = 0, solverIdx = 0, colors;

colors = [
	["#FFB1A7", "#EEFFFF", "#FA9A71", "#FF7777", "#FFDDAA", "#FF7777", "#FF7777"],
	["#EEFFFF", "#FFDDAA", "#FA9A71", "#FF7777", "#FFB1A7", "#FF7777", "#FF7777"],
	["black",   "green",   "red",     "yellow",  "#772222", "yellow",  "yellow" ],
	["#EAEAEA", "#D4D4D4", "white",   "black",   "white",   "black",   "black"  ]
]
function solverChange() {
	if (game) {
		prompt_settings("It's gaming! Please Change it after game!");
		return;
	}
	solverIdx = parseInt( $("input[name='solvers']:checked").val() );
}
function colorChange() {
	colorIdx = parseInt( $("input[name='colors']:checked").val() );
	if ($("#canvas").length > 0)
		drawMaze();
}
function skip1() {
	if (isAniMaze) {
		isAniMaze = false;
		$("#skp-btn1").fadeOut("slow");
	}
}
function skip2() {
	if (isAniSolv) {
		isAniSolv = false;
		$("#skp-btn2").fadeOut("slow");
	}
}
function iniGame() {
	stack = []; stack_next = []; stack_wfs = [];
	begin = { x: -1, y: -1 }; start = { x: -1, y: -1 }; end = { x: -1, y: -1 };
}
function gameOver() {
	iniGame();
	prompt_play("I'm Done! You can start a new game");
	$("#skp-btn2").fadeOut("slow");
	isAniSolv = $("#inAniSolv").prop('checked');
	$("#solver0").attr("disabled", false);
	$("#solver1").attr("disabled", false);
	$("#solver2").attr("disabled", false);
	$("#solver3").attr("disabled", false);
}
function prompt_settings(message) {
	$("#hint_settings").hide();
	$("#hint_settings").html(message);
	$("#hint_settings").fadeIn("slow");
}
function prompt_play(message) {
	$("#hint_play").hide();
	$("#hint_play").html(message);
	$("#hint_play").fadeIn("slow");
}
function sorter(var_a, var_b) {
	if (solverIdx == 1) {
		var Dis1 = Math.abs(var_a.x - begin.x) + Math.abs(var_a.y - begin.y) + Math.abs(var_a.x - end.x) + Math.abs(var_a.y - end.y);
		var Dis2 = Math.abs(var_b.x - begin.x) + Math.abs(var_b.y - begin.y) + Math.abs(var_b.x - end.x) + Math.abs(var_b.y - end.y);
	}
	if (solverIdx == 0) {
		var Dis1 = Math.abs(var_a.x - end.x) + Math.abs(var_a.y - end.y);
		var Dis2 = Math.abs(var_b.x - end.x) + Math.abs(var_b.y - end.y);
	}
	return Dis2 > Dis1;
}
function isNext(a, b) {
	return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) == 1;
}

function drawRect(VAR, TO) {
	maze[VAR.x][VAR.y] = TO;
	switch (TO) {
		case 0: ctx.fillStyle = colors[colorIdx][0]; break;               
		case 1: ctx.fillStyle = colors[colorIdx][1]; break;   
		case 2: ctx.fillStyle = colors[colorIdx][2]; break;        
		case 3: ctx.fillStyle = colors[colorIdx][3]; break;        
		case 4: ctx.fillStyle = colors[colorIdx][4]; break;   
		case 5: ctx.fillStyle = colors[colorIdx][5]; break;        
		case 6: ctx.fillStyle = colors[colorIdx][6]; break;   
	}
	ctx.fillRect(VAR.x * grid, VAR.y * grid, grid, grid);
}
function drawMaze() {
	for (var i = 0; i < cols; i++) {
		for (var j = 0; j < rows; j++) {
			switch (maze[i][j]) {
				case 0: ctx.fillStyle = colors[colorIdx][0]; break;
				case 1: ctx.fillStyle = colors[colorIdx][1]; break;
				case 2: ctx.fillStyle = colors[colorIdx][2]; break;
				case 3: ctx.fillStyle = colors[colorIdx][3]; break;
				case 4: ctx.fillStyle = colors[colorIdx][4]; break;
				case 5: ctx.fillStyle = colors[colorIdx][5]; break; 
				case 6: ctx.fillStyle = colors[colorIdx][6]; break; 
			}
			ctx.fillRect(grid * i, grid * j, grid, grid);
		}
	}
}
function getFNeighbours(n, sx, sy, a) {
	if (sx - 1 > 0 && maze[sx - 1][sy] == a) {
		n.push({ x: sx - 1, y: sy });
	}
	if (sx + 1 < cols - 1 && maze[sx + 1][sy] == a) {
		n.push({ x: sx + 1, y: sy });
	}
	if (sy - 1 > 0 && maze[sx][sy - 1] == a) {
		n.push({ x: sx, y: sy - 1 });
	}
	if (sy + 1 < rows - 1 && maze[sx][sy + 1] == a) {
		n.push({ x: sx, y: sy + 1 });
	}
	return n;
}
function drawPath() {
	if (start.x == -1)
		return;
	
	do {
		tmp = stack.pop();
		if (isNext(tmp, start)) {
			if (maze[tmp.x][tmp.y] == 2)
				drawRect(tmp, 3);
			start = tmp;
			break;
		}
		if (maze[tmp.x][tmp.y] == 2)
			drawRect(tmp, 4);
	} while (stack.length && !isNext(tmp, start))
	if (stack.length < 1) {
		gameOver();
		return;
	}
}
function BFS_Astar() {
	if (start.x == -1)
		return;
	while (true) {
		if (game == 0 || (start.x == end.x && start.y == end.y) ) {
			game = 0;
			drawPath();
			if (stack.length < 1) 
				return;
		}
		else {
			var neighbours = [];
			getFNeighbours(neighbours, start.x, start.y, 0);
			getFNeighbours(neighbours, start.x, start.y, 5);

			stack.push(start);
			
			if (maze[start.x][start.y] == 4)
				drawRect(start, 2);
			if (neighbours.length) {
				//将可走的地方全存进“可走栈”里，即stack_next，并按BFS贪婪地排序stack_next
				for (var i = 0; i < neighbours.length; ++i) {
					stack_next.push(neighbours[i]);
				
					if (maze[neighbours[i].x][neighbours[i].y] == 0)
						drawRect(neighbours[i], 4);
				}
				stack_next.sort(sorter);
			}
			
			start = stack_next.pop();
		}
		if (isAniSolv) {
			requestAnimationFrame(BFS_Astar);
			return;
		}
	}
}
function WFS() {
	if (start.x == -1)
		return;
	while (true) {
		if (game == 0 || (start.x == end.x && start.y == end.y) ) {
			game = 0;
			drawPath();
			if (stack.length < 1) 
				return;
		}
		else {
			var neighbours = [];
			stack.push(start);
			while (stack_next.length > 0){
				start = stack_next.pop();
				getFNeighbours(neighbours, start.x, start.y, 0);
				getFNeighbours(neighbours, start.x, start.y, 5);
			
				if (start.x == end.x && start.y == end.y){
					requestAnimationFrame( WFS );
					return;
				}
				stack.push(start);
				if (maze[start.x][start.y] == 4)
					drawRect(start, 2);
			}
			if (neighbours.length > 0) {
				for (var i = 0; i < neighbours.length; ++i) {
					stack_next.push(neighbours[i]);
					if (maze[neighbours[i].x][neighbours[i].y] == 0)
						drawRect(neighbours[i], 4);
				}
			}
			
		}
		if (isAniSolv) {
			requestAnimationFrame( WFS );
			return;
		}
	}
}
function DFS() {
	if (start.x == -1)
		return;
	while (true) {
		if (game == 0 || (start.x == end.x && start.y == end.y) ) {
			game = 0;
			drawPath();
			if (stack.length < 1) 
				return;
		}
		else {
			var neighbours = [];
			getFNeighbours(neighbours, start.x, start.y, 0);
			getFNeighbours(neighbours, start.x, start.y, 5);
			stack.push(start);
			if ( maze[start.x][start.y] == 0 )
				drawRect(start, 2);
			if ( neighbours.length > 0 ) {
				for (var i = 0; i < neighbours.length; ++i) {
					stack.push(neighbours[i]);
				}
			}
			else{
				drawRect(start, 4);
				start = stack.pop();
			}
			start = stack.pop();
		}
		if (isAniSolv) {
			requestAnimationFrame(DFS);
			return;
		}
	}
}
function solveMaze() {
	if (start.x == -1)
		return;
	switch (solverIdx) {
		case 0: BFS_Astar(); break;
		case 1: BFS_Astar(); break;
		case 2: stack_next.push(start); WFS(); break;
		case 3: DFS(); break;
	}
}
function getCursorPos(event) {
	if (!game)
		return;
	var rect = this.getBoundingClientRect();
	var x = Math.floor((event.clientX - rect.left) / grid),
		y = Math.floor((event.clientY - rect.top) / grid);
	if (maze[x][y]) return;
	if (start.x == -1) {
		start = { x: x, y: y };
		begin = { x: x, y: y };
		drawRect(begin, 6);
	} else {
		
		if (end.x != -1)
			return;
		end = { x: x, y: y };
		drawRect(end, 5);
		prompt_play("Solving Maze. Enjoy ^_^");
		if (isAniSolv) {
			$("#skp-btn2").fadeIn("slow");
		}
		solveMaze();
	}
}

function scrollEvent(event) {

	if (event.wheelDelta || event.detail) {
		//console.log(document.documentElement.scrollTop);
		if (document.documentElement.scrollTop > 550 && $("#topNav").is(":visible") == false)
			//topNav.style.cssText="display: inline;";
			$("#topNav").fadeIn("slow");
		if (document.documentElement.scrollTop < 550 && $("#topNav").is(":visible") == true)
			//topNav.style.display = "none";
			//topNav.style.cssText="display: none";
			$("#topNav").fadeOut("slow");
	}
}

function getNeighbours(sx, sy, a) {
	var n = [];
	if (sx - 1 > 0 && maze[sx - 1][sy] == a && sx - 2 > 0 && maze[sx - 2][sy] == a) {
		n.push({ x: sx - 1, y: sy }); n.push({ x: sx - 2, y: sy });
	}
	if (sx + 1 < cols - 1 && maze[sx + 1][sy] == a && sx + 2 < cols - 1 && maze[sx + 2][sy] == a) {
		n.push({ x: sx + 1, y: sy }); n.push({ x: sx + 2, y: sy });
	}
	if (sy - 1 > 0 && maze[sx][sy - 1] == a && sy - 2 > 0 && maze[sx][sy - 2] == a) {
		n.push({ x: sx, y: sy - 1 }); n.push({ x: sx, y: sy - 2 });
	}
	if (sy + 1 < rows - 1 && maze[sx][sy + 1] == a && sy + 2 < rows - 1 && maze[sx][sy + 2] == a) {
		n.push({ x: sx, y: sy + 1 }); n.push({ x: sx, y: sy + 2 });
	}
	return n;
}
function createArray(c, r) {
	var m = new Array(c);
	for (var i = 0; i < c; i++) {
		m[i] = new Array(r);
		for (var j = 0; j < r; j++) {
			m[i][j] = 1;
		}
	}
	return m;
}
function createMaze() {
	if (start.x == -1)
		return;
	while (true) {
		var neighbours = getNeighbours(start.x, start.y, 1), l;
		if (neighbours.length < 1) {
			if (stack.length < 1) {
				$("#skp-btn2").fadeOut("slow");
				isAniMaze = $("#inAniMaze").prop('checked');
				prompt_play("Note: Please select two points for path observation by computer.");
				return;
			}
			
			do {
				start = stack.pop();
				neighbours = getNeighbours(start.x, start.y, 1);
			} while (neighbours.length < 1 && stack.length > 0)
			if (stack.length < 1) {
				stack = [];
				start.x = start.y = -1;
				document.getElementById("canvas").addEventListener("mousedown", getCursorPos, false);
				$("#skp-btn1").fadeOut("slow");
				isAniMaze = $("#inAniMaze").prop('checked');
				prompt_play("Note: Please select two points for path observation by computer.");
				return;
			}
		} else {
			var i = 2 * Math.floor(Math.random() * (neighbours.length / 2))
			l = neighbours[i]; drawRect(l, 0);
			l = neighbours[i + 1]; drawRect(l, 0);
			start = l
			stack.push(start)
		}
		if (isAniMaze) {
			requestAnimationFrame(createMaze);
			break;
		}
	}
}
function createCanvas(w, h) {
	var canvas = document.createElement("canvas");
	wid = w; hei = h;
	canvas.width = wid; canvas.height = hei;
	canvas.id = "canvas";
	ctx = canvas.getContext("2d");
	ctx.fillStyle = "black"; ctx.fillRect(0, 0, wid, hei);
	var div = document.getElementById("maze")
	div.appendChild(canvas);
}
function gameStart() {
	if (game)
		return;
	game = 1;
	iniGame();
	$("#solver0").attr("disabled", true);
	$("#solver1").attr("disabled", true);
	$("#solver2").attr("disabled", true);
	$("#solver3").attr("disabled", true);
	prompt_settings("You can change solver and maze size after game!");
	
	if (cols % 2 == 0)--cols;
	if (rows % 2 == 0)--rows;

	var div = document.getElementById("maze");
	var canvas = document.getElementById("canvas");
	if (canvas)
		div.removeChild(canvas);
	createCanvas(grid * cols, grid * rows);
	maze = createArray(cols, rows);
	start.x = Math.floor(Math.random() * (cols / 2));
	start.y = Math.floor(Math.random() * (rows / 2));
	if (!(start.x & 1)) start.x++; if (!(start.y & 1)) start.y++;
	drawRect(start, 0);
	$("#rst-btn").fadeIn("slow");
	prompt_play("Creating Maze~");
	if (isAniMaze)
		$("#skp-btn1").fadeIn("slow");
	createMaze();
	drawMaze();
}
function gameRestart() {
	game = 0;
	var div = document.getElementById("maze");
	var canvas = document.getElementById("canvas");
	div.removeChild(canvas);
	gameStart();
}
function confirm() {
	
	if (game) {
		prompt_settings("It's gaming, please change it after game!!");
		return;
	}
	var inRow = parseInt(document.getElementById("inRow").value);
	var inCol = parseInt(document.getElementById("inCol").value);
	//var isInt = (typeof inRow === 'number' && inRow %1 == 0) && (typeof inCol === 'number' && inCol %1 == 0);
	var isInt = Number.isInteger(inRow) && Number.isInteger(inCol);
	
	if (!isInt) {
		prompt_settings("Please Input TWO Numbers!!!");
		return;
	}
	var isOverflow = (inRow < minRow) || (inCol < minCol) || (inRow > maxRow) || (inCol > maxCol);
	
	if (isOverflow)
		prompt_settings("Your input is TOO BIG/SMALL. We replaced it with boundary limits");
	else
		prompt_settings("Done!");
	cols = Math.min(Math.max(inCol, minCol), maxCol);
	rows = Math.min(Math.max(inRow, minRow), maxRow);
}
function checkChange() {

	if (!game) {
		prompt_settings("Setting done!");
		isAniSolv = $("#inAniSolv").prop('checked');
		isAniMaze = $("#inAniMaze").prop('checked');
	}
	else {
		prompt_settings("It's gaming, please change it after game!!");
		$("#inAniSolv").prop("checked", isAniSolv);
		$("#inAniMaze").prop("checked", isAniMaze);
	}
}
function init() {
	$("#color0").attr('checked', true);
	$("#solver0").attr('checked', true);
	cols = 120; rows = 80;
	$("#toNav").hide();
	$("#rst-btn").hide();
	$("#skp-btn1").hide();
	$("#skp-btn2").hide();

	$("#inAniSolv").prop("checked", true);
	$("#inAniMaze").prop("checked", true);
	solverChange();
	colorChange();
	isAniSolv = true; isAniMaze = true;
	document.addEventListener('DOMMouseScroll', scrollEvent, false);
	
	//window.onmousewheel = document.onmousewheel = scrollEvent;
}
