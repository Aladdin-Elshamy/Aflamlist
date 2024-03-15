
const saves = document.getElementById("results-save");
const empty = document.querySelector(".empty");
let moviesNum2 = 0;
let listMoviesNum2 = 0;
let contentSave = '';
let savedMovies = [];



if(localStorage.getItem("savedMovies")){
    savedMovies = JSON.parse(localStorage.getItem("savedMovies"));
}
function clearSavedMovies(){
        saves.innerHTML = "";
        moviesNum2 = 0;
        
}
function passToDisplay(){
    contentSave="";
    savedMovies.forEach(movie => {
        displaySavedMovies(movie);
    })
}
if(localStorage.getItem("savedMovies")){
    clearSavedMovies()
    savedMovies = JSON.parse(localStorage.getItem("savedMovies"));
    listMoviesNum2 = savedMovies.length;
    passToDisplay()
}
else{
    clearSavedMovies()
    saves.style.display = "none";
    empty.style.display = "flex";
}
function displaySavedMovies(movie){
    for(const [key,value] of Object.entries(movie)){
        if(key == "Poster" && value == "N/A"){
            movie[key] = "./images/not-available.png"
        }
        else if(key != "Poster" && value == "N/A"){
            movie[key] = "Not Available"
        }
    }
    contentSave += `
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
            <button id="delete-btn" class="delete-btn">
                <span class="circle-plus">
                <i class="fa-solid fa-minus"></i>
                </span>
                <span class="text">
                    Remove
                </span>
            </button>
        </div>
        <div class="overview">
            ${movie.Plot}
        </div>
    </section>
    `
    moviesNum2++;
    if(moviesNum2 == listMoviesNum2){
        
        saves.innerHTML = contentSave;
        saves.classList.remove("hidden")
        empty.classList.add("hidden");
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => { 
                savedMovies = savedMovies.filter(movie => {
                    return movie.imdbID != e.currentTarget.parentElement.parentElement.dataset.id;
                });
                localStorage.setItem("savedMovies", JSON.stringify(savedMovies));
                listMoviesNum2 = savedMovies.length;

                
                clearSavedMovies();

                if(savedMovies.length == 0){
                    saves.style.display = "none";
                    empty.style.display = "flex";
                }else{
                    passToDisplay();
                }
            })
        })
    }
    
}

