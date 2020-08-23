let dimension = 16;
let color = "black";

const handleMouseOver = (e) => {
    if (color == "random") {
        let c = () => Math.floor(Math.random() * 256);
        e.target.style.backgroundColor = `rgb(${c()},${c()},${c()})`;
    } else if (color == "gray") {
        let rgba = window.getComputedStyle(e.target).backgroundColor;
        let rgbaVals = rgba.replace(/[^\d,]/g, '').split(',');
        [r, g, b, a] = rgbaVals.map(x => Number(x));
        if (r === g && g === b && r === b) {
            if (e.target.style.backgroundColor === "") {
                [r, g, b] = [229, 229, 229]
            } else {
                [r, g, b] = [r, g, b].map(x => x - 26);
            }
        } else {
            [r, g, b] = [229, 229, 229];
        }
        if (r < 0) {
            [r, g, b] = [0, 0, 0];
        }
        e.target.style.backgroundColor = `rgb(${r},${g},${b})`;
    } else {
        e.target.style.backgroundColor = color;
    }
}

const createGridCell = (row, col) => {
    const div = document.createElement('div');
    div.classList.add('cell');
    div.style.gridColumnStart = col;
    div.style.gridColumnEnd = col + 1;
    div.style.gridRowStart = row;
    div.style.gridRowEnd = row + 1;
    div.addEventListener('mouseover', handleMouseOver);
    return div;
}

const fillGrid = (gridSize) => {
    let grid = document.querySelector('.grid');
    while (grid.firstChild) {
        grid.removeChild(grid.lastChild);
    }
    for (let row = 1; row <= gridSize; row++) {
        for (let col = 1; col <= gridSize; col++) {
            grid.appendChild(createGridCell(row, col));
        }
    }    
}

const clearGrid = () => {
    const grid = document.querySelector('.grid');
    for (let i = 0; i < grid.children.length; i++) {
        grid.children[i].style.backgroundColor = 'white';
    }    
}

const handleClear = (e) => {
    clearGrid();
}

const setGridVisible = (visible) => {
    var elements = document.querySelectorAll('.cell');
    for (var i = 0; i < elements.length; i++ ){
        elements[i].style.borderColor = visible ? "black" : "white";
    }    
}

const toggleGrid = (e) => {
    setGridVisible (e.target.checked)
}

const updateColor = (e) => {
    color = e.target.value;
}

const updateGridSize = (e) => {
    if (e.target.valueAsNumber < 3 || e.target.valueAsNumber > 64) {
        e.target.valueAsNumber = dimension;
    } else {
        dimension = e.target.valueAsNumber;
        clearGrid();
        fillGrid(dimension);
    }
}

document.querySelector('#gridsize').addEventListener('change', updateGridSize);
document.querySelector('#gridlines').addEventListener('change', toggleGrid);
document.querySelector('#color').addEventListener('change', updateColor);
document.querySelector('#clear').addEventListener('click', handleClear);
fillGrid(dimension)