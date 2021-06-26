
async function getMovieData(e) {
    e.preventDefault();

    const apiKey = '92d3000a'
    const url = `http://www.omdbapi.com/?page=4&apikey=${apiKey}`

    let response = await fetch(url);
    let data = await response.json();

    console.log(data)

    
}

$('#startBtn').on('click', getMovieData);