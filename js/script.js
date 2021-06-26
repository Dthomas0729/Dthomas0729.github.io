
const HangmanCinemas = {

    playerOne: {  
        name: '',
        score: 0,
        movieCollection: [],
        guessedLetters: [],
        attemps: 6,
    },
    
    playerTwo: {  
        name: '',
        score: 0,
        movieCollection: [],
        guessedLetters: [],
        attemps: 6,
    }, 

    movieGenres: [],
    gameboard: [],
    movieInPlay: ''

}


async function getMovieData(e) {
    e.preventDefault();

    // const apiKey = '92d3000a'
    // const url = `http://www.omdbapi.com/?page=4&apikey=${apiKey}`

    const apiKey = 'd08176009f77ef9e59b466044b7df500'
    const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`
    
    let response = await fetch(url);
    let data = await response.json();

    console.log(data)

    
}

$('#startBtn').on('click', getMovieData);