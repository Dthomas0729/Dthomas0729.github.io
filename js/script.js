/*
HANGMAN CINEMAS DOCUMENTATION



*/



let hangmanCinemas = {
    apiKey: 'd08176009f77ef9e59b466044b7df500',

    playerOne: {  
        name: 'PLayer One',
        score: 0,
        guessedLetters: [],
        attempts: 6,
    },
    
    playerTwo: {  
        name: 'Player Two',
        score: 0,
        guessedLetters: [],
        attempts: 6,
    }, 

    multiplayer: false,
    playerTurn: null,
    selectedGenres: [],
    gameboard: [],
    movieInPlay: {},
    letterScores: {
        'vowels': 25,
        'constanants': 50,
        'capitals': 100,
        'movie': 200
    },

    startGame: function startGame() {

        hangmanCinemas.gameboard = [];
        hangmanCinemas.playerOne.guessedLetters = [];
        hangmanCinemas.playerTwo.guessedLetters = [];
        hangmanCinemas.playerOne.attempts = 6;
        hangmanCinemas.playerTwo.attempts = 6;

        hangmanCinemas.displayGuessedLetters(hangmanCinemas.playerOne);
        hangmanCinemas.displayGuessedLetters(hangmanCinemas.playerTwo);

        if (hangmanCinemas.multiplayer === false) {
            $('#playerTwo').css('display', 'none');
        }
        hangmanCinemas.playerTurn = hangmanCinemas.playerOne;

        $('#winScreen').hide();
        $('#mainMenu').hide();
        $('#gameplayScreen').show();

        hangmanCinemas.generateButtons();
        hangmanCinemas.getRandomMovie();   
        
    },

    playerToggle: function playerToggle() {
        if (hangmanCinemas.playerTurn === hangmanCinemas.playerOne) {
            hangmanCinemas.playerTurn = hangmanCinemas.playerTwo;
        } else {
            hangmanCinemas.playerTurn = hangmanCinemas.playerOne
        };
    },

    generateButtons: function generateButtons() {
        let buttonsHTML = 'abcdefghijklmnopqrstuvwxyz'.split('').map(letter => 
        `
            <button 
                class="letterButton"
                id="${letter}"
                >${letter}</button>
        `);

        $('#keyboard').html(buttonsHTML);
        $('#keyboard button').hover(function(e) {
            e.preventDefault()
            
            if (hangmanCinemas.playerTurn === hangmanCinemas.playerOne) {
                $(e.currentTarget).css({
                    'background-color': 'green',
                    'opacity': '1'
                })
            } else {
                $(e.currentTarget).css({
                'background-color': 'orange',
                'opacity': '1'
            })
            }
            
        }, 
        function (e) {
            e.preventDefault();

            $(e.currentTarget).css({
                'background-color': 'transparent',
                'opacity': '1'
            });
        });

        $('#keyboard button').click(function (e) {
            
            let letter = $(e.currentTarget).text();
            hangmanCinemas.guessLetter(letter);

            $(this).unbind("mouseenter mouseleave");
            $(e.currentTarget).css({
                'background-color': 'darkgrey',
                'opacity': '0.3'
            })
            .off('click');    

        });

        $('#message').hide();
        $('#keyboard').show();
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

    getGenreList: async function getGenreList(e) {
        const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${this.apiKey}&language=en-US`;
        
        let response = await fetch(url);
        let data = await response.json();

        console.log(data);
        this.movieGenres 

    },

    getRandomMovie: async function getRandomMovie(e) {

        // let movieId = 'popular';
        // const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${hangmanCinemas.apiKey}&language=en-US&page=1`
   
        // let response = await fetch(url);
        // let data = await response.json();

        // console.log(data);

        let movieList = [];
        let genreList = hangmanCinemas.selectedGenres.join(', ');
   
        for (page = 1; page <=5; page++) {
            const url = `https://api.themoviedb.org/3/discover/movie?api_key=${this.apiKey}&language=en-US&sort_by=popularity.desc&certification_country=US&include_adult=false&page=${page}&with_genres=${genreList}`
            // const url = `https://api.themoviedb.org/3/movie/popular?api_key=${this.apiKey}&language=en-US&page=${page}`
 
            let response = await fetch(url);
            let data = await response.json();  
            console.log(data);
            
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

        this.gameboard = [];
        let p1Letters = this.playerOne.guessedLetters;
        let p2Letters = this.playerTwo.guessedLetters;


        const delimiter = '<i class="fas fa-asterisk"></i>'

        for (const l of this.movieInPlay.title.split('')) {
            
            if ([0,1,2,3,4,5,6,7,8,9].includes(parseInt(l))) {
                this.gameboard.push(l);
            } else if (p1Letters.includes(l) || p2Letters.includes(l)) {
                this.gameboard.push(l);
            } else if ([' ', ':', '\'', '!', '-', '.', ',', '*', '&'].includes(l)) {
                this.gameboard.push(l);
            } else if (p1Letters.includes(l.toLowerCase()) || p2Letters.includes(l.toLowerCase())) {
                this.gameboard.push(l);
            } else {
                this.gameboard.push(delimiter);
            }
        }

        gameboardEl.html(`<h1>${this.gameboard.join('')}`);
        gameboardEl.fadeIn('slow');

        hangmanCinemas.checkWin();
        
    }, 

    skipMovie: function skipMovie() {
        return
    },

    checkWin: function checkWin() {

        if (this.gameboard.join('') === this.movieInPlay.title) {
            $('#keyboard').hide();

            $('#message').html(`<h1>You Won!</h1>`).fadeIn('slow');

            setTimeout(function(){ hangmanCinemas.displayWinScreen(); }, 3000);

        }
    },

    displayWinScreen: function displayWinScreen() {
        
        $('#winScreen').fadeIn("slow");
        $('#gameplayScreen').hide();

        // MOVIE POSTER IMAGE CREATION
        $('div#moviePoster').html(`<img src="${hangmanCinemas.movieInPlay.posterUrl}">`);
            
        $('#movieTitle').text(hangmanCinemas.movieInPlay.title);
        $('#movieDetails').html(`
            <h3 id='movieTitle'>${hangmanCinemas.movieInPlay.title}</h3>
            <label>Release: ${hangmanCinemas.movieInPlay.releaseDate}</label>
            <label>Plot: <p>${hangmanCinemas.movieInPlay.plot}</p> </label>
            <button id="playAgain">Play Aagin</button>
        `);

        $('button#playAgain').css({
            'background-color': 'transparent',
            'border-style': 'solid',
            'border-color': 'white',
            'color': 'white',
            'font-family': 'Poppins, sans-serif',
            'font-size': '20px',
            'padding': '4px',
            'margin': '12px'
        })
        $('button#playAgain').click(hangmanCinemas.startGame);
        
        
    },

    displayGuessedLetters: function displayGuessedLetters(player) {
        let letters = player.guessedLetters.join('     ');
        
        if (player === hangmanCinemas.playerOne) {
            $('#p1GuessedLetters').text(`${letters}`);
        } else {
            $('#p2GuessedLetters').text(`${letters}`);
        }
        


    },

    guessLetter: function guessLetter(letter) {
        let player = hangmanCinemas.playerTurn;

        if (this.movieInPlay.title.toLowerCase().split('').includes(letter) === false) {
            player.attempts -= 1;

        } 
        
        if (player.attempts <= 0) {
            $('#keyboard').hide();

            $('#message').html(`
                <h2>You Ran Out of Guesses.</h2>
                <button id="revealMovie">REVEAL MOVIE</button>
                <button id="playAgain">PLAY AGAIN</button>`)
                .fadeIn('slow');

            $('button#revealMovie').click(hangmanCinemas.displayWinScreen);
            $('button#playAgain').click(hangmanCinemas.startGame);

            $('#message button').css({
                'background-color': 'transparent',
                'border-style': 'solid',
                'border-color': 'white',
                'color': 'white',
                'font-family': 'Poppins, sans-serif',
                'font-size': '20px',
                'padding': '4px',
                'margin': '12px'
            })
            $('#message').fadeIn('slow');

        }

        console.log(hangmanCinemas.playerTurn)

        player.guessedLetters.push(letter);


        hangmanCinemas.displayGuessedLetters(player);
        hangmanCinemas.displayBoard();
        hangmanCinemas.calculateScore(player, letter);

        if (hangmanCinemas.multiplayer === true) {
            hangmanCinemas.playerToggle();
        }
    },

    calculateScore: function calculateScore(player, letter) {
        
        for (i = 0; i < hangmanCinemas.gameboard.length; i++) {
            if (hangmanCinemas.gameboard[i] === letter.toUpperCase()) {
                player.score += 100
            } 
        }

        if ('aeiouy'.split('').includes(letter)) {

            for (i = 0; i < hangmanCinemas.gameboard.length; i++) {
                if (hangmanCinemas.gameboard[i] === letter) {
                    player.score += 25
                } 
            } 
        } else { 

            for (i = 0; i < hangmanCinemas.gameboard.length; i++) {
                if (hangmanCinemas.gameboard[i] === letter) {
                    player.score += 50
                }
            }
        }

        hangmanCinemas.displayScore(player);
        hangmanCinemas.displayLives(player);
    },

    displayScore: function displayScore(player) {
        let score = player.score
        
        if (player === hangmanCinemas.playerOne) {
            $('#p1Score').html(`<i class="fas fa-dollar-sign"></i> ${score}`);
        } else {
            $('#p2Score').html(`<i class="fas fa-dollar-sign"></i> ${score}`);
        }
        
    },

    displayLives: function displayLives(player) {
        let lives = player.attempts
        
        if (player === hangmanCinemas.playerOne) {
            $('#p1Name').html(`<i class="fas fa-user-circle"></i>  Player One - ${lives}`);
        } else {
            $('#p2Name').html(`<i class="fas fa-user-circle"></i>  Player Two - ${lives}`);
        }
        
    },
}   

$('#message').hide();
$('#gameplayScreen').hide();
$('#winScreen').hide();

$('#genreSelect input[type="checkbox"]').click(function(e) {

    let genres = hangmanCinemas.selectedGenres;

    if (genres.includes(e.currentTarget.id)) {
        let index = genres.indexOf(e.currentTarget.id);
        genres.splice(index, 1);
    } else {
        genres.push(e.currentTarget.id);
    }
    
    hangmanCinemas.selectedGenres = genres;
    console.log(hangmanCinemas.selectedGenres);
})

$('#startBtn').on('click', hangmanCinemas.startGame);

$('#letterBtn').click(hangmanCinemas.guessLetter);
    
hangmanCinemas.getGenreList();

multiplayerToggle = $('#multiplayerToggle input[type="checkbox"]');

multiplayerToggle.click(hangmanCinemas.toggleMultiplayer);
