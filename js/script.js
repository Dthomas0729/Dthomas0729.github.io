
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
    movieInPlay: {},

    startGame: function startGame() {

        if (hangmanCinemas.multiplayer === false) {
            $('.playerTwo').css('display', 'none');
        } 

        $('#mainMenu').hide();
        $('#gameplayScreen').show();

        hangmanCinemas.getRandomMovie();   
        
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

    getRandomMovie: async function getRandomMovie(e) {

        // let movieId = 'popular';
        // const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${hangmanCinemas.apiKey}&language=en-US&page=1`
   
        // let response = await fetch(url);
        // let data = await response.json();

        // console.log(data);

        let movieList = [];
   
        for (page = 1; page <= 240; page++) {
            const url = `https://api.themoviedb.org/3/movie/popular?api_key=${this.apiKey}&language=en-US&page=${page}`

            let response = await fetch(url);
            let data = await response.json();
            
            for (const movie of data.results) {
                // console.log(movie);
                movieList.push({
                    id: movie.id,
                    title: movie.title,
                    releaseDate: movie.release_date,
                    posterUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                    plot: movie.overview,
                    genreIds: movie.genre_ids           
                });
            }
        }

        this.movieInPlay = movieList[
            Math.floor(Math.random() * (movieList.length - 1))
        ]

        console.log(this.movieInPlay);

        this.displayBoard()
    },

    displayBoard: function displayBoard() {
        let gameboardEl = $('#gameboard').hide();

        console.log(gameboardEl.html());
        this.gameboard = [];

        const delimiter = '<i class="fas fa-asterisk"></i>'

        for (const l of this.movieInPlay.title.split('')) {
            
            if ([0,1,2,3,4,5,6,7,8,9].includes(parseInt(l))) {
                this.getRandomMovie()
            } else if (this.playerOne.guessedLetters.includes(l) || this.playerTwo.guessedLetters.includes(l)) {
                this.gameboard.push(l);
            } else if (l === ' ' || l === ':' || l === '\'') {
                this.gameboard.push(l);
            } else {
                this.gameboard.push(delimiter);
            }
        }

        gameboardEl.html(`<h1>${this.gameboard.join('')}`);
        gameboardEl.fadeIn('slow');
    }, 

    skipMovie: function skipMovie() {
        return
    },

    displayGuessedLetters: function displayGuessedLetters(player) {
        let letters = player.guessedLetters.join('    ');
        
        $('#guessedLetters').html(`<h3>${letters}</h3>`);
    },

    guessLetter: function guessLetter() {
        let letter = $('#letterInput').val();
        let player = hangmanCinemas.playerOne
        $('#letterInput').val('');

        console.log(letter);
        hangmanCinemas.playerOne.guessedLetters.push(letter);

        console.log(hangmanCinemas.playerOne.guessedLetters)
        hangmanCinemas.displayGuessedLetters(player);
        hangmanCinemas.displayBoard();
    },
}   


$('#gameplayScreen').hide();
$('#startBtn').on('click', hangmanCinemas.startGame);

$('#letterBtn').click(hangmanCinemas.guessLetter);
    


multiplayerToggle = $('input[type="checkbox"');

multiplayerToggle.click(hangmanCinemas.toggleMultiplayer);
