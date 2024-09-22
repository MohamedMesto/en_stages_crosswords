/* Coordinates(X,Y) of a cell = Margin values (left,top) of block placed over that particular cell.
 coordsToCellNo(X,Y) will take X, Y coords of any cell as arguments and will return the no / index of that cell. */

 
 // Converts coordinates (X, Y) to a cell number based on a grid size of 50px
function coordsToCellNo(X, Y) {
    return (Math.floor(Y / 50) * 10) + Math.floor(X / 50);
}

// Converts a cell number back to the X coordinate
function cellNoToX(cellNo) {
    return (cellNo % 10) * 50;
}

// Converts a cell number back to the Y coordinate
function cellNoToY(cellNo) {
    return Math.floor(cellNo / 10) * 50;
}

// Gets the margin-left value of a block element
function marginLeft(block) {
    return Number(block.style.marginLeft.replace('px', ''));
}

// Gets the margin-top value of a block element
function marginTop(block) {
    return Number(block.style.marginTop.replace('px', ''));
}

// Inverts the direction from horizontal to vertical and vice versa
function invertDirection(direction) {
    return direction === 'horizontal' ? 'vertical' : 'horizontal';
}

// Returns all elements with the class 'block'
function blocks() {
    return document.querySelectorAll('.block');
}
