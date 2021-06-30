
let hangmanCinemas = {
    apiKey: 'd08176009f77ef9e59b466044b7df500',

    playerOne: {  
        name: '',
        score: 0,
        movieCollection: [],
        guessedLetters: [],
        attemps: 10,
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

        hangmanCinemas.generateButtons();
        hangmanCinemas.getRandomMovie();   
        
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
            

            $(e.currentTarget).css({
                'background-color': 'green',
                'opacity': '0.6'
            })
        }, 

        function (e) {
            e.preventDefault();

            

            $(e.currentTarget).css({
                'background-color': 'transparent',
                'opacity': '1'
            })
        });

        $('#keyboard button').click(function (e) {

            let letter = $(e.currentTarget).text();
            hangmanCinemas.guessLetter(letter);
        });
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
        let p1Letters = this.playerOne.guessedLetters;
        let p2Letters = this.playerTwo.guessedLetters;

        

        const delimiter = '<i class="fas fa-asterisk"></i>'

        for (const l of this.movieInPlay.title.split('')) {
            
            if ([0,1,2,3,4,5,6,7,8,9].includes(parseInt(l))) {
                this.getRandomMovie()
            } else if (p1Letters.includes(l) || p2Letters.includes(l)) {
                this.gameboard.push(l);
            } else if ([' ', ':', '\'', '!', '-', '.', ',', '*', '&'].includes(l)) {
                this.gameboard.push(l);
            } else if (p1Letters.includes(l.toLowerCase())) {
                this.gameboard.push(l);
            } else {
                this.gameboard.push(delimiter);
            }
        }

        gameboardEl.html(`<h1>${this.gameboard.join('')}`);
        gameboardEl.fadeIn('slow');

        if (this.playerOne.attemps <= 0) {
            $('#keyboard').hide();

            $('#message').append(`
                <h3>You Failed.</h3>
                <p>Would you like to see the answer?</p>
                <button id="revealMovie">REVEAL MOVIE</button>
                <button id="nextMovie">NEXT MOVIE</button>`)
                .fadeIn('slow');

            $('button#revealMovie').click(hangmanCinemas.displayWinScreen);
            $('#message').fadeIn('slow');


        }

        if (this.gameboard.join('') === this.movieInPlay.title) {
            $('#keyboard').hide();

            $('#message').append(`<h1>You Won!</h1>`).fadeIn('slow');

            setTimeout(function(){ hangmanCinemas.displayWinScreen(); }, 3000);

        }
    }, 

    skipMovie: function skipMovie() {
        return
    },

    displayLoseOrWin: function displayLoseOrWin() {
        
    },

    displayWinScreen: function displayWinScreen() {
        
        $('#winScreen').fadeIn("slow");
        $('#gameplayScreen').hide();


        $('div#moviePoster').html(`<img src="${this.movieInPlay.posterUrl}">`);
        $('div#moviePoster img').css({
            'max-width': "-webkit-fill-available",
            'height': 'auto'
        });

        $('#movieTitle').text(this.movieInPlay.title);
        $('#movieDetails').append(`
            <label>Release: <p>${this.movieInPlay.releaseDate}</p> </label>
            <label>Plot: <p>${this.movieInPlay.plot}</p> </label>
        `);
    },

    displayGuessedLetters: function displayGuessedLetters(player) {
        let letters = player.guessedLetters.join('    ');
        
        $('#guessedLetters').html(`<h3>${letters}</h3>`);
    },

    guessLetter: function guessLetter(letter) {
        let player = hangmanCinemas.playerOne

        

        console.log(letter);
        hangmanCinemas.playerOne.guessedLetters.push(letter);

        hangmanCinemas.displayGuessedLetters(player);
        hangmanCinemas.displayBoard();



    },
}   

$('#message').hide();
$('#gameplayScreen').hide();
$('#winScreen').hide();
$('#startBtn').on('click', hangmanCinemas.startGame);

$('#letterBtn').click(hangmanCinemas.guessLetter);
    


multiplayerToggle = $('input[type="checkbox"');

multiplayerToggle.click(hangmanCinemas.toggleMultiplayer);
