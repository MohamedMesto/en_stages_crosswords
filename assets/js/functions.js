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

   /*  Let's have another array: remaining which will only contain those
     words from the results array that have not been correctly placed
      yet. */
    let remaining =results.slice(1)
/*     In each round, we need to place correctly, exactly 10 results from 
    the results array. After placeFirstResult(), only 9 iterations
    of the loop are required to place the other results correctly.
 */
/*     This array will store info about all of the possible placements 
    (correct & wrong both) of a result in the grid. Basically we need 
    info on: the ways in which a result can be intersected with
     correctly placed results in the grid. */

     /* Loop A: Uses Array.from() to convert remaining[0] (presumably a string) into an array of characters and loops through each character (alphabet_A).
Loop B: Loops through each object in the data array. Each object is expected to contain a result property (a string) and potentially other properties (like direction, occupied).
Loop C: Again uses Array.from() to iterate through the characters of the result string of each object in the data array.
Inside the innermost loop (Loop C), you can add logic to handle comparisons or perform actions based on alphabet_A and alphabet_B.
 This structure gives you the ability to perform operations between
  remaining[0] and the result values in data.
/* 
Array.from(remaining[0]).forEach((alphabet_A, index_A) => {  // Loop A: Iterates through remaining[0]
    
    data.forEach((object) => {  // Loop B: Iterates through each object in data
        
        Array.from(object.result).forEach((alphabet_B, index_B) => {  // Loop C: Iterates through each character of result in object
            
            // Logic for comparing alphabet_A and alphabet_B or any other operations can be added here
            
        });
    });
});

 */

/* Array.from(remaining[0]).forEach((alphabet_A, index_A) => {  // Loop A: Iterate through remaining[0]
    data.forEach((object) => {  // Loop B: Iterate through each object in data
        Array.from(object.result).forEach((alphabet_B, index_B) => {  // Loop C: Iterate through the result string in the object
            if (alphabet_A === alphabet_B) {  // Check if characters match
                // Get the intersecting cell number based on the index of alphabet_B in the result string
                let intersectCellNo = object.occupied[index_B];
                // Invert the direction of the current object for placing remaining[0]
                let direction = invertDirection(object.direction);
                // Further logic to place the word using intersectCellNo and direction can go here
                console.log(`Match found! Alphabet: ${alphabet_A}, IntersectCellNo: ${intersectCellNo}, Direction: ${direction}`);
            }
        });
    });
});

 */


/* Explanation of Additions:
firstAlphabetCellNo calculation:
If the direction is 'horizontal', the firstAlphabetCellNo is determined by subtracting the index_A from the intersectCellNo.
If the direction is 'vertical', the firstAlphabetCellNo is determined by subtracting (index_A * 10) from the intersectCellNo 
(since each row in the grid typically spans 10 cells).
Pushing the placement data: The object {result: remaining[0], direction: direction, firstAlphabetCellNo: firstAlphabetCellNo}
 is pushed into the placements array. This keeps track of the word, its placement direction, 
and the starting cell number. */

/* 
Example of one placement:
intersectCellNo = 63
Index of 'a' in 'legal' = index_A = 3
firstAlphabetCellNo = 63 - 3 = 60
 */


    for (let iterations = 0; iterations < 9; iterations++) {
        let placements = [];


        // Loop through each letter of remaining[0]
        Array.from(remaining[0]).forEach((alphabet_A, index_A) => {

            // Loop through each object in data (previously placed words)
            data.forEach((object) => {

                // Loop through each letter of the placed word (object.result)
                Array.from(object.result).forEach((alphabet_B, index_B) => {

                    // Check if alphabet_A matches alphabet_B (intersection point)
                    if (alphabet_A === alphabet_B) {

                        // Find the intersection cell number
                        let intersectCellNo = object.occupied[index_B];

                        // Invert the direction of the current word
                        let direction = invertDirection(object.direction);

                        // Determine the starting cell number based on the direction
                        let firstAlphabetCellNo = (direction === 'horizontal') 
                            ? intersectCellNo - index_A 
                            : intersectCellNo - (index_A * 10);

                        // Push the placement data to the placements array
                        placements.push({
                            result: remaining[0],
                            direction: direction,
                            firstAlphabetCellNo: firstAlphabetCellNo
                        });
                    }

                });

            });

        });

        // Log the placements array during the first iteration
        iterations == 0 &&  console.log(placements)
        
    }

    console.log(remaining);


        
}









 