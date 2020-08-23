const BOARD_SIZE = 3;
const FIRST_PLAYER = 'x';
const SECOND_PLAYER = 'o';
const EMPTY_CELL = '';

function BoardStatus() {
    this.cellValues = [];
    for (let row = 0; row < BOARD_SIZE; row++) {
        let rowValues = new Array();
        for (let col = 0; col < BOARD_SIZE; col++) {
            rowValues.push(EMPTY_CELL);
        }
        this.cellValues.push(rowValues);
    }    
    this.status = EMPTY_CELL;
    this.count = 0;    
}

BoardStatus.prototype.setCell = function(row, col, value) {
    this.cellValues[row][col] = value;
    this.count = value === EMPTY_CELL ? this.count - 1 : this.count + 1;
    let [colVal, rowVal, diagVal1, diagVal2] = [[], [], [], []];
    let items = [colVal, rowVal, diagVal1, diagVal2];
    for (let i = 0; i < BOARD_SIZE; i++) {
        if (this.cellValues[row][i] === value) {
            rowVal.push({row : row, col : i});
        }
        if (this.cellValues[i][col] === value) {
            colVal.push({row : i, col : col});
        }
        if (this.cellValues[i][i] === value) {
            diagVal1.push({row : i, col : i});
        }
        if (this.cellValues[i][BOARD_SIZE - i - 1] === value) {
            diagVal2.push({row : i, col : BOARD_SIZE - i - 1});
        }
    }
    let item = items.find (item => item.length === BOARD_SIZE)
    if (item) {
        this.status = value;
    } else {
        this.status = EMPTY_CELL;
    }
    return item;
}

BoardStatus.prototype.getStatus = function() {
    return this.status;
}

BoardStatus.prototype.isFinished = function() {
    return this.getStatus() !== EMPTY_CELL || this.count === BOARD_SIZE * BOARD_SIZE;
}

BoardStatus.prototype.getCell = function(row, col) {
    return this.cellValues[row][col];
}
