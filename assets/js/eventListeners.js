window.addEventListener('load', () => {
    while (data.length != 10) {
        placeResults()
    }
    body.style.filter = 'blur(0px)'
    body.style.backdropFilter = 'blur(0px)'
})
document.addEventListener('click', async () => {
    if (!gameStarted) {
        gameStarted = true
        await new Promise(resolve => setTimeout(resolve, 500))
        bgMusic.play()
        inputString.innerHTML = ''
        triggerCountdown()
        document.querySelectorAll('.alphabetic-key span').forEach(elem => elem.style.opacity = '1')
        keysAllowed = true

    }
    else if (e.key == 'Backspace' && keysAllowed && inputString.innerHTML.length > 0 && !e.repeat) {
        inputString.innerHTML = inputString.innerHTML.slice(0, inputString.innerHTML.length - 1)
        backspaceKeyImg.style.filter = 'brightness (50%)'
        new Audio('assets/audio/backspace.mp3').play()
    }
    else if (e.key == 'Escape' && keysAllowed) {
        gameOver()
    }
    else if (keysAllowed && e.code == 'Space' && !e.repeat && inputString.innerHTML.length >= 3) {
        spaceKeyImg.style.filter = 'brightness (50%)'
        let correct = false
        data.forEach((object) => {
            if (object.result == inputString.innerHTML.toLowerCase() && !solved.includes(inputString.innerHTML.toLowerCase())) {
                correct = true
                new Audio('assets/audio/correct.mp3').play()
                scoreValue.innerHTML = Number(scoreValue.innerHTML) + (object.result.length * 10)
                scoreText.style.color = 'lime'
                scoreText.animate(
                    [{ color: 'lime' }, { color: 'white' }],
                    { duration: 3000, easing: 'linear', fill: 'forwards' }
                )
                object.occupied.forEach((cellNo) => {
                    let blocksArray = getBlocksAtCellNo(cellNo)
                    if (blocksArray.length == 1) {
                        blocksArray[0].style.transform = 'scale(1)'
                    } else if (blocksArray.length == 2) {
                        if (blocksArray[0].style.transform == 'scale(0)') {
                            blocksArray[0].style.transform = 'scale(1)'
                        }
                        else {
                            blocksArray[1].style.transform = 'scale(1)'
                        }
                    }
                })
            }
        })
    }
})

document.addEventListener('keydown', (e) => {
    if (keysAllowed && sample.includes(e.key.toLowerCase()) && inputString.innerHTML.length != 6 && !e.repeat) {
        inputString.innerHTML = inputString.innerHTML + e.key.toUpperCase()
        alphaKeys[sample.indexOf(e.key.toLowerCase())].querySelector('img').style.filter = 'brightness (50%)'
        new Audio('assets/audio/keyPress.mp3').play()


    }
})
document.addEventListener('keyup', (e) => {
    if (keysAllowed && sample.includes(e.key.toLowerCase())) {
        setTimeout(() => {
            alphaKeys[sample.indexOf(e.key.toLowerCase())].querySelector('img').style.filter = 'brightness (100%)'
        }, 100)
    }
})
