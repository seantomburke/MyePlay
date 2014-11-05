var texts = {
	no_moves	: 'no more moves in this column',
	game_over	: 'game over'
}

var options = {
	button : {  
		undo		: $('#options > button.undo'),
		restart		: $('#options > button.restart'),
		save		: $('#options > button.save'),
		load		: $('#options > button.load'),
		set			: function(btn, state){
			state = state ? false : true;
			this[btn].prop('disabled', state);
		}
	},
	
	bind_buttons : function(){
		var that = this;
		
		// reset the buttons
		$('#options > button').prop('disabled',false);
		
		this.button.restart.bind("click", $.proxy(that, 'restart'));
	},
	
	restart : function(){
		with(board){
			arr = utility.make2Darray(8)
			turn = 'blue';
			quatro.length = 0;
			win = false;
			table.find('div[class]').not('#handle').removeAttr('class').empty();
			animating = false;
			handle.show();
		}
		$('#handle').stop().css('top','-55px')[0].className = board.turn;
	}
}

var utility = {
	make2Darray : function(len){
		var a = [];
		while(a.push([]) < len); 
		return a;
	},
	// so each 2d array in the array will represent a row
	transformArrayByRows : function(arr){
		var a = [], r, c;
		for( r=0; r<8; r++ ){
			for( c=0; c < arr[r].length; c++ ){
				if( !a[c] )
					a[c] = utility.make2Darray(8); 
				a[c][r] = arr[r][c];
			}
		}
		return a;
	},
	// so each 2d array in the array will represent a column
	transformArrayByCols : function(arr){
		var a = utility.make2Darray(8), r, c;
		for( c=0; c<arr.length; c++ ){
			for( r=0; r<8; r++ ){
			   a[r].push(arr[c][r]); 
			}
		}
		return a;
	},
	// shift each row left/right by it's position, for example, row #1 will be shifted by 1, and row #3 by 3
	shift : function(arrRows, side){
		side = side || 'left';
		var a = $.extend(true, [], arrRows);
		for( var i=0, len = a.length; i<len; i++ ){
			if( side == 'left' )
				a[i].splice(0,i);
			else if( side == 'right' ){
				// don't shift first row
				if( i ){
					a[i] = new Array(i).concat(a[i]); // add 'i' amound of empty values in the beginging of the array
					a[i].splice(-i);
				}
			}
		}
		return a;
	}
}

var board = {
	turn : 'blue',
	col : 0,						// the column which the mouse if currently over
	win : false,
	animating : false,				// flag, true when animating the 'handle' object (dropping a piece)
	quatro : [], 					// each time a pair is checked, and found identical, it's inserted into here
	arr : utility.make2Darray(8),	// create an empty 2D array of length 9
	handle : $('<div>').attr('id','handle').append('<b><b></b></b>'),
	
	init : function(container){
		//this.table = this.makeTable();		// create the board table
		//this.cells = this.table.find('td'); // cache the table cells
		this.table = this.makeBoard();		// create the board table
		
		this.handle.addClass( board.turn ).appendTo(this.table);
		//this.cells = this.table.find('div'); // cache the table cells
		
		this.userEvents();
		container.append(this.table);	// append the board to the DOM only once it's completed
		
		options.bind_buttons();
	},
	
	// returns a 3x3 table
	makeTable : function(){
		var table = $('<table/>').attr('cellpadding',0).attr('cellspacing',0),
			tr, td, row;
		
		for( tr=0; tr < 8; tr++ ){
			row = $('<tr/>').appendTo(table);
			for( td=0; td < 8; td++ ){
				row.append( $('<td/>') );
			}
		}
		return table;
	},
	
	makeBoard : function(){
		var cols, rows, col,
			board = $('<div>').addClass('board');
		
		for( cols=8; cols--; ){
			col = $('<aside>').appendTo(board);
			for( rows=8; rows--; ){
				$('<div>').appendTo(col).data('index',7-cols+''+rows);
			}
			//$('<div>').append('<b><b></b></b>').appendTo(col).addClass('drop');
		}
		return board;
	},
	
	userEvents : function(){
		var that = this,
			asides = $(this.table).find('aside');
		
		
		$(this.table)
			.delegate('div', 'click', userInput_mouseclick )
			.delegate('aside', 'mouseover', moveHandle );
			
		function userInput_mouseclick(e){
			if( that.animating ) return;
			e.stopPropagation();  // just in case
			
			// do not allow moves if game was won by any side
			if( that.win )
				return;

			var col, row, move;
			col = $(e.currentTarget).data('index')[0]|0;
			row = 7 - that.arr[col].length;

			that.makeMove(row,col);
		}
		
		function moveHandle(e){
			var col = that.col = asides.index( $(this) );
			if( !that.animating ){
				// check which column is the mouse over now
				board.handle.css('left', col*51 );
			}
		}
	},
	
	makeMove : function(row,col){
		var that = this, cell, position, duration;
		// check if a move can be made for this column
		if( this.arr[col].length == 8 ){
			console.log(texts.no_moves);
			return false;
		}
		// push the move
		this.arr[col].push(this.turn);
		
		// add piece to the board (after animation)
		animateFall();
		
		// piece falling down animation
		function animateFall(){
			that.animating = true;
			position = row * 51;
			duration = row * 80 + 150;
			
			that.handle.animate({ top:position }, duration, "easeOutBounce", function(){
				that.animating = false;
				that.handle.hide();
				// draw the piece on the board cell
				cell = that.table.find('aside').eq(col).find('div').eq(row);
				cell.addClass(that.turn).append('<b><b></b></b>');
				// check for a win
				if( that.checkWin(7-row, col) )
					that.gameOver();
				else{
					// put the handle at the column the mouse CURRENTLY is
					that.handle.show().css({top:'-55px', left:that.col*51}).find('> b > b').animate({padding:'22px'},400, "easeOutExpo"); // bring the handle back to the top
					that.changeTurn();
				}
			});
		}
	},

	changeTurn : function(){
		this.turn = this.turn == 'red' ? 'blue' : 'red';
		// change the handle's color
		this.handle[0].className = this.turn;
	},

	/*-----------------------------------------------------------------
		Check for 4 in a Row, Col or Diagonal
		for rows, only check the row that has changed, same for cols
	/*-----------------------------------------------------------------*/
	checkWin : function(r, c){
		var arr = this.arr,
			quatro = [],
			i, j, victory = false;

		function checkRow(){
			quatro.length = 0;
			// loop on every row in the array
			for( i=0; i<7; i++ ){
				// if there is nothing in column 3 & 4 in a certain row, it means there cannot be any more straight lines of 4 pieces
				// OR 
				// if there is nothing in Col number 4 for this Row, no point to scan furthar
				if( (!arr[3][r] && !arr[4][r]) || (i==4 && !arr[i][r]) )
					break;

				//console.log( 'checkRow:', arr[i][r], [i,r] );
				// if there is nothing in this cell, continue to the next one in the Row
				if( !arr[i][r] )
					continue;
				// push the found matchs until there are 4
				if( arr[i][r] == arr[i+1][r] ){
					quatro.push( i+""+r );
					// because we are matching couples of cells each time, when the length of 'quatro' is 3, it means [a=b,b=c && c=d] so we need to manually store the last position
					if( quatro.length == 3 )
						quatro.push( i+1+""+r );
				}
				// reset the winning straight array if there was no match
				else
					quatro.length = 0;
				
				// if [a=b,b=c && c=d] then the array will now have 4 itmes (positions) for 4 cells of the same kind
				if( quatro.length == 4 ){
					multiWin(quatro);
					return true;
				}
			}
			return false;
		};
		
		function checkCol(){
			quatro.length = 0;
			// loop on every item in the same row and check if it's the same as the next one 
			for( i=0; i < arr[c].length; i++ ){
				//console.log( 'checkCol :', arr[c][i], [c,i] );
				// increase the count if the next item is same as this one, if not reset it back to '1'
				if( arr[c][i] == arr[c][i+1] ){
					quatro.push( c+""+i );
					if( quatro.length == 3 )
						quatro.push( c+""+(i+1) );
				}
				else
					quatro.length = 0;
				//console.log( arr[i][j] , arr[i][j+1], count );
				if( quatro.length == 4 ){
					multiWin(quatro);
					return true;
				}
			}
			return false;
		};

		function checkDiagonal(){
			var i, j, cr;
			quatro.length = 0;

			function checkPair( c,r,delta ){
				//console.log(c,r,'  delta :',delta);
				// check if this piece if like the next diagonal one, relative to the delta
				if( arr[c][r] && arr[c][r] == arr[c+delta][r+1] ){
					quatro.push( c+''+r );
					if( quatro.length == 3 )
						quatro.push( c+delta+""+(r+1) );
				}
				// make sure that only cells in 'the zone' of the board are checked, and also if there was a win, do not continue
				if( c+delta>0 && c+delta<7 && r+1>=0 && r+1<7 && quatro.length<4 )
					checkPair(c+delta,r+1,delta);
				// if found 4 of the same kind
				if( quatro.length == 4 ){
					multiWin(quatro);
					return true;
				}
				quatro.length = 0;
			}

			// from bottom left to top right
			if( r == 0 ){
				i = c;
				j = r;
			}
			// if higher than distance from left
			else if( r > c ){
				i = 0;
				j = r-c;
			}
			else if( r < c ){
				i = c-r;
				j = 0;
			}
			else
				i=j=0;

			// no need to check this position if the diagonal can't contain 4 cells
			if( i < 5 && checkPair(i,j,1) )
				return true;

			// from bottom right to top left
			cr = 7-c; // Column index from the right side to the left
			
			if( r > cr ){
				i = 7;
				j = r-cr;
			}
			else if( r < cr ){
				j = 0;
				i = c+r;
			}
			else{
				i=7;
				j=0;
			}
			// no need to check this position if the diagonal can't contain 4 cells
			if( i > 2 && checkPair(i,j,-1) )
				return true;

			return false;
		};
		
		// might find more than one winning position (for example diagonal & column)
		function multiWin(quatro){
			board.quatro = board.quatro.concat(quatro); 
		};

		if( checkRow() )
			victory = true;
		if( checkCol() )
			victory = true;
		if( checkDiagonal() )
			victory = true;
		
		return victory;
	},
	
	gameOver : function(){
		console.warn(this.turn == 'red'? 'blue' : 'red',' wins');
		this.win = true;
		var i, o = 1,
			cells = $();	// the "winning" cells collection
		
		for( var i=board.quatro.length; i--; ){
			var col = board.quatro[i][0]|0,
				row = board.quatro[i][1]|0;
				
			cells = cells.add( this.table.find('aside').eq(col).find('div').eq(7-row) );
		}
		
		(function initAnimation(){
			// in case the game was reset, do not recurse
			if( board.quatro.length ){
				for( i=4; i--; ){
					o = o == 1 ? 0.3 : 1;
					cells.animate({ opacity:o }, 180, "easeInQuad");
				}
				setTimeout( initAnimation, 1500 );
			}
		})();
		
		console.warn(texts.game_over);
	}
}

/* jQuery easing */
jQuery.extend( jQuery.easing,{
	def: 'easeOutQuad',
	swing: function (x,t,b,c,d) {
		//alert(jQuery.easing.default);
		return jQuery.easing[jQuery.easing.def](x,t,b,c,d);
	},
	easeInQuad: function (x,t,b,c,d) {
		return c*(t/=d)*t + b;
	},
	easeInQuint: function (x,t,b,c,d) {
		return c*(t/=d)*t*t*t*t + b;
	},
	easeOutQuint: function (x,t,b,c,d) {
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
	},
	easeInOutQuint: function (x,t,b,c,d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
		return c/2*((t-=2)*t*t*t*t + 2) + b;
	},
	easeInSine: function (x,t,b,c,d) {
		return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
	},
	easeOutSine: function (x,t,b,c,d) {
		return c * Math.sin(t/d * (Math.PI/2)) + b;
	},
	easeOutExpo: function (x,t,b,c,d) {
		return (t==d) ? b+c : c * (-Math.pow(2,-10 * t/d) + 1) + b;
	},
	easeInBack: function (x,t,b,c,d,s) {
		if (s == undefined) s = 1.70158;
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	easeOutBack: function (x,t,b,c,d,s) {
		if (s == undefined) s = 1.70158;
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	},
	easeInOutBack: function (x,t,b,c,d,s) {
		if (s == undefined) s = 1.70158; 
		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},
	easeOutBounce: function (x,t,b,c,d) {
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
		} else {
			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
		}
	}
});