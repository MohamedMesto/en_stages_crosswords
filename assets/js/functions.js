/* Coordinates(X,Y) of a cell = Margin values (left,top) of block placed over that particular cell.
 coordsToCellNo(X,Y) will take X, Y coords of any cell as arguments and will return the no / index of that cell. */


// Converts coordinates (X, Y) to a cell number based on a grid size of 50px
function coordsToCellNo(X, Y) {
    return ((Y / 50) * 10) + (X / 50)
}

// Converts a cell number back to the X coordinate
function cellNoToX(cellNo) {
    return (cellNo % 10) * 50
}

// Converts a cell number back to the Y coordinate
function cellNoToY(cellNo) {
    return Math.trunc(cellNo / 10) * 50
}

// Gets the margin-left value of a block element
function marginLeft(block) {
    return Number(block.style.marginLeft.split('px')[0])
}


// Gets the margin-top value of a block element
function marginTop(block) {
    return Number(block.style.marginTop.split('px')[0])
}

// Inverts the direction from horizontal to vertical and vice versa
function invertDirection(direction) {
    return direction == 'horizontal' ? 'vertical' : 'horizontal'
}

// Returns all elements with the class 'block'
function blocks() {
    return document.querySelectorAll('.block')
}

/* This function will receive the result to be placed,
the direction in which the result is to be placed,
and the coordinates of that particular cell which
will be below the block showing the first alphabet of result.
 */
function placeResult(result, direction, X, Y) {
    let html = ''
    let occupied = []
    let cellNo = coordsToCellNo(X, Y)

/*     Generate the HTML (.block divs) of the result to be placed
 */    
    for(let i=0; i<result.length; i++){
        occupied.push(direction=='horizontal' ? cellNo+i : cellNo+(i*10))
        let style = `margin-left:${direction=='horizontal'?X+(i*50):X}px; margin-top:${direction=='vertical'?Y+(i*50): Y}px;`
        html += `<div class='block' style='${style}'>${result[i].toUpperCase()}</div>`
            }

/*          This function will return an array: occupied.
            occupied array will consist of cellNos of all those cells which are
            below the blocks generated (using this result). */

        container.insertAdjacentHTML('beforeend', html)

    return occupied
}

/* The 6 unique random alphabets will be stored in a string: sample. We'll make sample a global variable. The words which we get back from dictionary will be stored in an array: results. */


/* If word in the dictionary is formed of such an alphabet that is not part of sample, then we don't need such a word in the results array. */

function getResults() {

    let results
    let alphabets = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
    do {
        sample = ''
        results = []
        let toBeSelectedFrom = [...alphabets]

        for (let i = 0; i < 6; i++) {
            let randomAlphabet = toBeSelectedFrom[Math.floor(Math.random() * toBeSelectedFrom.length)]
            sample = sample + randomAlphabet
            toBeSelectedFrom.splice(toBeSelectedFrom.indexOf(randomAlphabet), 1)

        }

        sample = sample.split('').sort().join('')
        alphaKeys.forEach((elem, index) => {
            elem.querySelector('b').innerHTML = sample[index].toUpperCase()

        })

        dictionary.forEach((word) => {
            let test = true
            alphabets.forEach((alphabet) => {
                if (word.includes(alphabet) && !sample.includes(alphabet)) {
                    test = false
                }
            })
            if (test) {
                if (word.length > 2 && word.length < 7) {
                    results.push(word)
                }
            }
        })
    }
    while (results.length <= 15 || results.filter(result => result.length >= 5).length > 3)
    results.sort((a, b) => b.length - a.length)
    results = results.slice(0, 15)
    return results
}

 



/* "The process of placing the 1st result is very easy and 
different from placing rest of the results.
 So let's make a separate function for placing 
 the 1st result from the results array." */



 function placeFirstResult(results) {
    let X = 150;
    let Y = 150;
    let direction = ['horizontal', 'vertical'][Math.floor(Math.random() * 2)];


    /* 
    keep tracking of data of all correct placements in a global 
    variable: data. */

    data.push({
        result: results[0], 
        direction: direction, 
        occupied: placeResult(results[0], direction, X, Y)
    });
}

function placeResults() {
    let results = getResults();
    placeFirstResult(results);
}









 