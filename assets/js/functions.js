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

function triggerCountdown() {
    clearInterval(countdownID)
    countdown.innerHTML = '300'
    countdownID = setInterval(() => {
        countdown.innerHTML = Number(countdown.innerHTML) - 1
        countdown.innerHTML == '0' && gameOver()

    }, 1000)
}
function gameOver() {
    bgMusic.pause()
    new Audio('game over.wav').play()
    inputString.innerHTML = ''
    clearInterval(countdownID)
    keysAllowed=false

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
    for (let i = 0; i < result.length; i++) {
        occupied.push(direction == 'horizontal' ? cellNo + i : cellNo + (i * 10))
        let style = `margin-left:${direction == 'horizontal' ? X + (i * 50) : X}px; margin-top:${direction == 'vertical' ? Y + (i * 50) : Y}px; transform:scale(0);`
        html += `<div class='block' style='${style}'>${result[i].toUpperCase()}</div>`
    }

    /*          This function will return an array: occupied. occupied array will consist of cellNos of all those cells which are below the blocks generated (using this result). */
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
    /*     let X = 0;
        let Y = 0; */
    let direction = ['horizontal', 'vertical'][Math.floor(Math.random() * 2)]
    /*     keep tracking of data of all correct placements in a global variable: data. */
    data.push({ result: results[0], direction: direction, occupied: placeResult(results[0], direction, X, Y) })
}

/*  we have another array: remaining which will only contain those
  words from the results array that have not been correctly placed
   yet. */
/*     The provided code and explanation describe the logic used to place words from a "remaining" array into a grid, ensuring they intersect correctly with previously placed words.

1. Remaining Words: The `remaining` array contains words that haven't been placed yet. The code iterates through `remaining[0]` (the first unplaced word) and checks how it can be intersected with words already placed in the grid.

2. Three Nested Loops:
- Loop A: Iterates through the characters of `remaining[0]`.
- Loop B: Iterates through previously placed words in the `data` array.
- Loop C: Iterates through the characters of each placed word.
 
3. Matching Logic:
- If a character in `remaining[0]` matches a character in a placed word, the cell number of the matching character (`intersectCellNo`) is calculated.
- The direction of placement is inverted (horizontal becomes vertical, and vice versa).

4. Placement Calculations:
- The starting cell number (`firstAlphabetCellNo`) is calculated based on the direction of placement:
    - If horizontal, it's the intersect cell minus the character's index.
    - If vertical, it's the intersect cell minus the index multiplied by 10.
- This information (word, direction, starting cell) is stored in the `placements` array.

5. Summary: The code systematically checks how words can intersect by comparing characters and calculates the starting position and direction of each word based on these intersections.
*/
/* Example of one placement:
intersectCellNo = 63
 
Index of 'a' in 'legal' = index_A = 3
firstAlphabetCellNo = 63 - 3 = 60 */
function placeResults() {
    data = []
    blocks().forEach(block => block.remove())
    cells.forEach(cell => cell.style.opacity = '1')

    let results = getResults();
    /*     console.log(results) */
    placeFirstResult(results);
    let remaining = results.slice(1)  /*  we have another array: remaining which will only contain those words from the results array that have not been correctly placed yet. */

    for (let iterations = 0; iterations < 15; iterations++) {
        if (data.length == 10) {
            break
        }
        let placements = [];
        // Loop through each letter of remaining[0]
        Array.from(remaining[0]).forEach((alphabet_A, index_A) => {

            // Loop through each object in data (previously placed words)
            data.forEach((object) => {

                // Loop through each letter of the placed word (object.result)
                Array.from(object.result).forEach((alphabet_B, index_B) => {

                    // Check if alphabet_A matches alphabet_B (intersection point)
                    if (alphabet_A == alphabet_B) {

                        // Find the intersection cell number
                        let intersectCellNo = object.occupied[index_B];

                        // Invert the direction of the current word
                        let direction = invertDirection(object.direction);

                        // Determine the starting cell number based on the direction
                        let firstAlphabetCellNo = (direction == 'horizontal') ? intersectCellNo - index_A : intersectCellNo - (index_A * 10)

                        // Push the placement data to the placements array
                        placements.push({ result: remaining[0], direction, firstAlphabetCellNo })
                    }
                })
            })
        })

        let validPlacement = false
        for (let i = 0; i < placements.length; i++) {
            let X = cellNoToX(placements[i].firstAlphabetCellNo)
            let Y = cellNoToY(placements[i].firstAlphabetCellNo)
            delete placements[i].firstAlphabetCellNo
            placements[i].occupied = placeResult(remaining[0], placements[i].direction, X, Y)

            let outOfGrid = false
            blocks().forEach((block) => {
                if (marginLeft(block) < 0 || marginLeft(block) > 450 || marginTop(block) < 0 || marginTop(block) > 450) {
                    outOfGrid = true
                }
            })

            let test = true;
            if (!outOfGrid) {
                let gridWords = getGridWords()
                gridWords.forEach((word) => {
                    if (!results.slice(0, data.length + 1).includes(word)) {
                        test = false;
                    }
                })
                if (new Set(gridWords).size != gridWords.length || gridWords.length != results.slice(0, data.length + 1).length) {
                    test = false
                }
            }

            if (test && !outOfGrid) {
                validPlacement = true
                data.push(placements[i])
                remaining.shift()
                break
            }
            else {
                for (let j = 0; j < remaining[0].length; j++) {
                    container.lastChild.remove()
                }
            }

        }
        if (!validPlacement) {
            results.push(results.splice(results.indexOf(remaining[0]), 1)[0])
            remaining.push(remaining.shift())
        }
    }
    arrangeBlocks()
    cells.forEach((cell, cellNo) => {
        if (!data.find(object => object.occupied.includes(cellNo))) {
            cell.style.opacity = '0'
        }
    })
}


function getGridWords() {
    let gridWords = [];

    for (let row = 0; row <= 9; row++) {
        let word = '';

        for (let column = 0; column <= 9; column++) {
            if (getBlocksAtCellNo((row * 10) + column).length) {
                word = word + getBlocksAtCellNo((row * 10) + column)[0].innerHTML;

                if (word.length > 1 && column == 9) {
                    gridWords.push(word.toLowerCase());
                }
            } else {
                word.length > 1 && gridWords.push(word.toLowerCase())
                word = '';
            }
        }
    }



    for (let column = 0; column <= 9; column++) {
        let word = ' ';

        for (let row = 0; row <= 9; row++) {
            if (getBlocksAtCellNo((row * 10) + column).length) {
                word = word + getBlocksAtCellNo((row * 10) + column)[0].innerHTML;

                if (word.length > 1 && row == 9) {
                    gridWords.push(word.toLowerCase());
                }
            } else {
                word.length > 1 && gridWords.push(word.toLowerCase());
                word = ' ';
            }
        }
    }
    return gridWords

}

function getBlocksAtCellNo(cellNo) {
    let blocksFound = [];

    blocks().forEach((block) => {
        if (marginLeft(block) == cellNoToX(cellNo) && marginTop(block) == cellNoToY(cellNo)) {
            blocksFound.push(block);
        }
    });

    return blocksFound;
}

function arrangeBlocks() {
    let min_X = +Infinity
    let max_X = -Infinity
    let min_Y = +Infinity
    let max_Y = -Infinity

    blocks().forEach((block) => {
        min_X = Math.min(min_X, marginLeft(block))
        max_X = Math.max(max_X, marginLeft(block))
        min_Y = Math.min(min_Y, marginTop(block))
        max_Y = Math.max(max_Y, marginTop(block))

    })

    let emptyColumnsOnLS = min_X / 5
    let emptyColumnsOnRS = (450 - max_X) / 5


    data.forEach((object) => {
        object.occupied = object.occupied.map(cellNo => cellNo + Math.trunc((emptyColumnsOnRS - emptyColumnsOnLS) / 2))
    })
    blocks().forEach((block) => {
        block.style.marginLeft = `${marginLeft(block) + (Math.trunc((emptyColumnsOnRS - emptyColumnsOnLS) / 2) * 50)}px`
    })

    let emptyRowsOnUS = min_Y / 50
    let emptyRowsOnBS = (450 - max_Y) / 50
    data.forEach((object) => {
        object.occupied = object.occupied.map(cellNo => cellNo + (Math.trunc((emptyRowsOnBS - emptyRowsOnUS) / 2) * 10))
    })
    blocks().forEach((block) => {
        block.style.marginTop = `${marginTop(block) + (Math.trunc((emptyRowsOnBS - emptyRowsOnUS) / 2) * 50)} px`
    })
}





/* placeResults();
console.log(data); // Ensure this shows the correct full array */