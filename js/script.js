
let hangmanCinemas = {
    apiKey: 'd08176009f77ef9e59b466044b7df500',

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

    multiplayer: false,
    movieGenres: [],
    gameboard: [],
    movieInPlay: '',

    startGame: function startGame() {

        if (hangmanCinemas.multiplayer === false) {
            $('.playerTwo').css('display', 'none');
        } 

        $('#mainMenu').hide();
        $('#gameplayScreen').show();
    },

    toggleMultiplayer: function toggleMultiplayer() {
        if (hangmanCinemas.multiplayer === false) {
            hangmanCinemas.multiplayer = true;
            console.log(hangmanCinemas.multiplayer);
        } else {
            hangmanCinemas.multiplayer = false;
            console.log(hangmanCinemas.multiplayer);
        }
    },

    selectGenres: function selectGenres(params) {
        return
    },

    displayBoard: function displayBoard() {
        return
    },



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
    
    $('#mainMenu').css('display', 'none');
    $('#gameplayScreen').css('display', 'flex');
}

$('#gameplayScreen').hide();
$('#startBtn').on('click', hangmanCinemas.startGame);

multiplayerToggle = $('input[type="checkbox"');

multiplayerToggle.click(hangmanCinemas.toggleMultiplayer);
