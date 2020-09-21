/*
 * This is an enumerated type to hold the types of cells required to represent a maze.
 */
MazeCellTypes = {
	WALL: '#',
	PASSAGEWAY: ' ',
	SOLUTION: '@',
	FRONTIER: 'F',
	VISITED: 'V',
}

class MazeCell {
	constructor(row, col, type) {
		this.row = row;
		this.col = col;
		this.type = type;
		// only used by Dijkstra's and A*
		this.priority = Infinity;
	}

	projection() {
		var projection = '';
		if (this.type === MazeCellTypes.WALL) {
			projection = "WALL cell at "
		}
		// a cell doesn't stop being a passageway when it becomes part of a solution.
		else if (this.type === MazeCellTypes.PASSAGEWAY || this.type === MazeCellTypes.SOLUTION) {
			projection = "PASSAGEWAY cell at "
		}
		projection += '[' + this.row + ',' + this.col + ']';
		return projection;

		//looks like its some sort of 2D array that is specifying the row and col of the specified 
		//wall or passageway
	}
}

class Maze {
	/* 
	 *this function constructs the maze object, and accepts an argument,
	 * plainTextMaze, which is an nxn string representation of a maze
	 * with each cell described by single-character MazeCellTypes.
	 */

	constructor(plainTextMaze) {
		// split the string into rows
		this.maze = plainTextMaze.split('\n')

		for (var i = 0; i < this.maze.length; i++) {
			// store each row as a char array
			this.maze[i] = this.maze[i].split('');

			for (var j = 0; j < this.maze[i].length; j++) {
				var type = this.maze[i][j];
				this.maze[i][j] = new MazeCell(i, j, type);
			}
		}

		this.start = this.maze[1][0];
		this.destination = this.maze[this.maze.length - 2][this.maze[0].length - 1];

		// each object in the cell array is of type MazeCell
		// the start and end locations are hardcoded because the program has to have some fixed starting point
		// and fixed ending point so the program knows where the finish is
	}

	/*
	 * this function determines whether the argument cell meets the destination criteria
	 */
	destinationPredicate(cell) {
		if (this.destination.row === cell.row && this.destination.col == cell.col)
			return true;
		else
			return false;
		// this function returns true if the current cell has found the ending cell, 
		// thus ending the seach
	}

	/*
	 * this function returns all of the neighbors of the argument cell (it does not
	 * check whether those neighbors have been visited)
	 */
	getNeighbors(cell) {
		var neighbors = [];

		//testing cell below
		if (cell.row + 1 < this.maze.length &&
			this.maze[cell.row + 1][cell.col].type === MazeCellTypes.PASSAGEWAY) {
			neighbors.push(this.maze[cell.row + 1][cell.col])
		}

		//testing cell to the right
		if (cell.col + 1 < this.maze[cell.row].length &&
			this.maze[cell.row][cell.col + 1].type === MazeCellTypes.PASSAGEWAY) {
			neighbors.push(this.maze[cell.row][cell.col + 1]);
		}

		//testing cell above
		if (cell.row - 1 >= 0 &&
			this.maze[cell.row - 1][cell.col].type === MazeCellTypes.PASSAGEWAY) {
			neighbors.push(this.maze[cell.row - 1][cell.col]);
		}

		//testing cell to the left
		if (cell.col - 1 >= 0 &&
			this.maze[cell.row][cell.col - 1].type === MazeCellTypes.PASSAGEWAY) {
			neighbors.push(this.maze[cell.row][cell.col - 1]);
		}

		return neighbors;
	}


	/*
	 * this function uses a breadth first search to solve the maze. When the solution
	 * is found, the function modifies the maze by marking each cell of the solution
	 * with the type MazeCellTypes.SOLUTION. 
	 */
	solveMazeBFS() {
		// create the queue to hold the cells we have visited but need
		// to return to explore (we will treat the array like a queue)
		var frontier = new Array()
		frontier.push(this.start);

		// create a set to hold the cells we have visited and add the 
		// first element
		var visited = new Set();
		visited.add(this.start.projection())

		// create a map to hold cells to parents, set first element's
		// parents as false (is source cell). Generally, the parents
		// map will have projection values as keys and objects as values.
		var parents = new Array();
		parents[this.start.projection()] = false;

		// search and continue searching  while there are still items in the queue
		while (frontier.length >= 1) {

			// get the next element in the queue
			var current = frontier.shift();

			// mark the next element as visited
			current.type = MazeCellTypes.VISITED;

			// test to see if it meets the destination criteria
			if (this.destinationPredicate(current)) {
				// we've reached the destination! Awesome!
				break;
			}

			// get the neighbors of the current cell (passageways)
			var neighbors = this.getNeighbors(current);

			// one by one, add neighbors to the queue
			for (var i = 0; i < neighbors.length; i++) {

				var neighbor = neighbors[i].projection();

				// see if we've already visited this cell
				if (!visited.has(neighbor)) {
					// if we haven't,  add it to the visited set
					visited.add(neighbor);
					// add current as the neighbor's parent
					parents[neighbor] = current;
					// add the neighbor to the queue
					frontier.push(neighbors[i])
						// set the neighbor to have a "frotier" type
					neighbors[i].type = MazeCellTypes.FRONTIER;
				}
			}
		}

		// backtrack through each cell's parent and set path cells to type
		// solution
		while (current) {
			current.type = MazeCellTypes.SOLUTION;
			current = parents[current.projection()];
		}
	}

	/*
	 * this function uses a depth first search to solve the maze. When the solution
	 * is found, the function modifies the maze by marking each cell of the solution
	 * with the type MazeCellTypes.SOLUTION. 
	 */
	solveMazeDFS() {
		// TODO
	}
	
	/*
	 * this function uses a Dijkstra's algorithm to solve the maze. When the solution
	 * is found, the function modifies the maze by marking each cell of the solution
	 * with the type MazeCellTypes.SOLUTION. 
	 */
	solveMazeDijkstra() {
		// TODO
	}
	
	/*
	 * this function uses A* to solve the maze. When the solution
	 * is found, the function modifies the maze by marking each cell of the solution
	 * with the type MazeCellTypes.SOLUTION. 
	 */
	solveMazeAStar() {
		// TODO
	}

	
	/*
	 * this function returns the number of cells that are included in the solution path.
	 */
	cellCounts() {
		var counter = []
		counter['solution'] = 0;
		counter['visited'] = 0;
		counter['frontier'] = 0;
		for (var i = 0; i < this.maze.length; i++) {
			for (var j = 0; j < this.maze[i].length; j++) {
				if (this.maze[i][j].type === MazeCellTypes.SOLUTION) {
					counter['solution']++;
				}
				if (this.maze[i][j].type === MazeCellTypes.SOLUTION ||
					this.maze[i][j].type == MazeCellTypes.VISITED) {
					counter['visited']++;
				}
				if (this.maze[i][j].type === MazeCellTypes.FRONTIER) {
					counter['frontier']++;
				}
			}
		}
		return counter;
	}

}