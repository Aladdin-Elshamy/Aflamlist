const searchBtn = document.getElementById("search-btn");
const results = document.getElementById("results-search");
const saves = document.getElementById("results-save");
const searchTerm = document.getElementById("search");
const loading = document.getElementById("loading");
const empty = document.querySelector(".empty");
let timer = null;
let contentSearch = '';
let savedMovies = [];
let moviesNum = 0;
let listMoviesNum = 0;
let t = 10
const movieIdList = [];

searchTerm.addEventListener("keypress",function(e){
    if(e.key === "Enter"){
        getMovies();
    }
})
searchBtn.addEventListener("click",getMovies);

function displayLoading(){
    loading.classList.remove("hidden");
    empty.classList.add("hidden");
    
}
function stopLoading(){
    loading.classList.add("hidden");
    empty.classList.remove("hidden");
}
function clearMovies() {
    results.innerHTML = "";
    contentSearch = "";
    moviesNum = 0;
}
async function getMovies() {
    clearMovies();
    displayLoading();
    const res = await fetch(`http://www.omdbapi.com/?apikey=3205b2c0&s=${searchTerm.value}`);
    const data = await res.json();
    if (data.Response === "True") {
        listMoviesNum = data.Search.length;
        data.Search.forEach(movie => {
            getMovieInfo(movie.Title);
        })
    } else {
        stopLoading();
        empty.innerHTML = "<p>Unable to find what you're looking for. Please try another search.</p>"
    }

}


async function getMovieInfo(movie) {
    const res = await fetch(`http://www.omdbapi.com/?apikey=3205b2c0&t=${movie}`);
    const data = await res.json();
    displayMovies(data);
}

function displayMovies(movie) {
    for(const [key,value] of Object.entries(movie)){
        if(key == "Poster" && value == "N/A"){
            movie[key] = "./images/not-available.png"
        }
        else if(key != "Poster" && value == "N/A"){
            movie[key] = "Not Available"
        }
    }
    contentSearch += `
    <section class="movie" data-id="${movie.imdbID}">
        <div class="movie-img">
            <img src="${movie.Poster}" alt="${movie.Title}">
        </div>
        <div class="movie-info">
            <h2>${movie.Title}</h2>
            <span class="rating">⭐ ${movie.imdbRating}</span>
        </div>
        <div class="movie-type">
            <span class="runtime">${movie.Runtime}</span>
            <span class="genre">${movie.Genre}</span>
            <button id="save-btn" class="save-btn">
                <span class="circle-plus">
                    <i class="fas fa-plus"></i>
                </span>
                <span class="text">
                    Watchlist
                </span>
            </button>
        </div>
        <div class="overview">
            ${movie.Plot}
        </div>
    </section>
    `;
    moviesNum++

    if(moviesNum == listMoviesNum){
        stopLoading();
        results.innerHTML = contentSearch;
        results.classList.remove("hidden");
        empty.classList.add("hidden");
        document.querySelectorAll('.save-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                saveMovies(e.currentTarget.parentElement.parentElement.dataset.id)
                document.querySelector(".added").style.top = "3px"
                setTimeout(() => {
                    document.querySelector(".added").style.top = "-100%"
                },2500)
            })
        })
    }
    
}
function addToSavedMovies(movie) {
    if (!savedMovies.some(savedMovie => Object.keys(savedMovie).every(key => savedMovie[key] === movie[key]))) {
        savedMovies.push(movie);
    }
}
async function saveMovies(movieId) {
    const res = await fetch(`http://www.omdbapi.com/?apikey=3205b2c0&i=${movieId}`);
    const data = await res.json();  
    addToSavedMovies(data);
    localStorage.setItem("savedMovies", JSON.stringify(savedMovies));
}

