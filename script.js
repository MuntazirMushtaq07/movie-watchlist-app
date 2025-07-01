// 🟢 Load stored data from localStorage or initialize empty arrays
let watchedMovies = JSON.parse(localStorage.getItem("watchedMovies")) || []
let notWatchedMovies = JSON.parse(localStorage.getItem("notWatchedMovies")) || [];

// 🟢 Grab references to HTML elements
let watchedListDiv = document.getElementById("watched-list");
let notWatchedListDiv = document.getElementById("unwatched-list");
let input = document.getElementById("input");
let searchButton = document.getElementById("search-button");
let resultDiv = document.getElementById("searched-movie");

// 🔐 Your OMDb API key (copy and past below from config.js file)
let apiKey = 

// 🔍 When the search button is clicked, fetch movies from OMDb API
searchButton.addEventListener("click", async function () {
  let searchText = input.value.trim();

  // 📛 Validate input
  if (searchText === "") {
    alert("Please Enter A Movie Name");
    return;
  }

  // 🔗 Build OMDb API search URL
  let url = `https://www.omdbapi.com/?apikey=${apiKey}&s=${searchText}`;

  try {
    // 📦 Fetch API data
    let response = await fetch(url);
    let data = await response.json();

    // ✅ If movies found
    if (data.Response === "True") {
      resultDiv.innerHTML = ""; // Clear previous results

      data.Search.forEach(movie => {
        // 🎞️ Create movie card
        let card = document.createElement("div");
        card.className = "movie-card";

        // 🎥 Poster
        let img = document.createElement("img");
        img.src = movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/150";
        img.alt = movie.Title;

        // 🎬 Title & Year
        let title = document.createElement("h3");
        title.innerText = movie.Title;

        let year = document.createElement("p");
        year.innerText = `Year: ${movie.Year}`;

        // ✅ Watched Button
        let watchedBtn = document.createElement("button");
        watchedBtn.innerText = "Watched ✅";
        watchedBtn.style.background = "green";
        watchedBtn.style.color = "white";
        watchedBtn.style.marginRight = "10px";

        // ❌ Not Watched Button
        let notWatchedBtn = document.createElement("button");
        notWatchedBtn.innerText = "Not Watched ❌";
        notWatchedBtn.style.background = "red";
        notWatchedBtn.style.color = "white";

        // ☑️ Save to Watched list
        watchedBtn.onclick = function () {
          watchedMovies.push(movie);
          localStorage.setItem("watchedMovies", JSON.stringify(watchedMovies));
          renderWatchedMovies();
        };

        // ☒ Save to Not Watched list
        notWatchedBtn.onclick = function () {
          notWatchedMovies.push(movie);
          localStorage.setItem("notWatchedMovies", JSON.stringify(notWatchedMovies));
          renderUnwatchedMovies();
        };

        // 📦 Add all elements to card and display it
        card.appendChild(img);
        card.appendChild(title);
        card.appendChild(year);
        card.appendChild(watchedBtn);
        card.appendChild(notWatchedBtn);
        resultDiv.appendChild(card);
      });

    } else {
      // 🛑 No results found
      resultDiv.innerHTML = `<p>No Movie Found</p>`;
    }

  } catch (error) {
    console.error("Error fetching movie data:", error);
    resultDiv.innerHTML = `<p>Something went wrong. Try again.</p>`;
  }
});


// ✅ Show Watched Movies in the list
function renderWatchedMovies() {
  watchedListDiv.innerHTML = "";

  watchedMovies.forEach((movie, index) => {
    let div = document.createElement("div");
    div.innerText = `${movie.Title} (${movie.Year}) ✅`;

    // 🗑 Delete from list
    let delBtn = document.createElement("button");
    delBtn.innerText = "🗑";
    delBtn.style.marginLeft = "10px";
    delBtn.onclick = function () {
      watchedMovies.splice(index, 1);
      localStorage.setItem("watchedMovies", JSON.stringify(watchedMovies));
      renderWatchedMovies();
    };

    div.appendChild(delBtn);
    watchedListDiv.appendChild(div);
  });
}


// ❌ Show Not Watched Movies in the list
function renderUnwatchedMovies() {
  notWatchedListDiv.innerHTML = "";

  notWatchedMovies.forEach((movie, index) => {
    let div = document.createElement("div");
    div.innerText = `${movie.Title} (${movie.Year}) ❌`;

    // 🗑 Delete from list
    let delBtn = document.createElement("button");
    delBtn.innerText = "🗑";
    delBtn.style.marginLeft = "10px";
    delBtn.onclick = function () {
      notWatchedMovies.splice(index, 1);
      localStorage.setItem("notWatchedMovies", JSON.stringify(notWatchedMovies));
      renderUnwatchedMovies();
    };

    div.appendChild(delBtn);
    notWatchedListDiv.appendChild(div);
  });
}

// 🔁 On page load, show saved movies
renderWatchedMovies();
renderUnwatchedMovies();
