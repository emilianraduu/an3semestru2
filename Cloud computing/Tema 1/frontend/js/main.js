let duration = undefined;
let results = undefined;

init = () => {
    const main = document.getElementById('main');
    const header = document.createElement('div');
    header.className = 'header';
    const content = document.createElement('div');
    content.className = 'content';
    main.appendChild(header);
    main.appendChild(content);
    createSearch(header, content);
    createPlaceholder(content);
};

createSearch = (header, content) => {
    const search = document.createElement('input');
    search.placeholder = 'Search for a movie and a song🎬🎵';
    search.className = 'search';
    const searchButton = document.createElement('button');
    searchButton.innerText = '🕵🏻‍♂️';
    searchButton.className = 'searchButton';
    searchButton.addEventListener('click', () => callAPI(search.value, content));
    header.appendChild(search);
    header.appendChild(searchButton);
};

callAPI = async (query, content) => {
    duration = new Date().getTime();
    createLoader(content);
    const response = await fetch(`http://127.0.0.1:3001/${query}`, {
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    });
    duration = new Date().getTime() - duration;
    if (response && duration) {
        const jsonResponse = await response.json();
        removeLoader(content);
        createElements({response: jsonResponse, duration, content})
    }
};

createElements = ({response, duration, content}) => {
    results = response;
    if (!response) {
        createPlaceholder(content)
    } else {
        content.innerHTML = '';
        const statsWrapper = document.createElement('div');
        statsWrapper.className = 'statsWrapper';
        const moviesWrapper = document.createElement('div');
        moviesWrapper.className = 'moviesWrapper';

        const songsWrapper = document.createElement('div');
        songsWrapper.className = 'songsWrapper';

        content.appendChild(statsWrapper);
        content.appendChild(moviesWrapper);
        content.appendChild(songsWrapper);
        if (response[0]) {
            const stats = response[0];
            stats.duration = duration;
            createStats(stats, statsWrapper);
        }
        if (response[1]) {
            const movies = response[1];
            createMovies(movies, moviesWrapper);

        }
        if (response[2]) {
            const songs = response[2];
            createSongs(songs, songsWrapper);
        }
    }
};


createLoader = (content) => {
    content.innerHTML = '';

    const loader = document.createElement('img');
    loader.src = '../assets/loader.svg';
    loader.className = 'loader';
    loader.id = 'loader';

    const loaderWrapper = document.createElement('div');
    loaderWrapper.className = 'loaderWrapper';
    loaderWrapper.id = 'loaderWrapper';
    loaderWrapper.appendChild(loader);

    content.appendChild(loaderWrapper);
};

removeLoader = (content) => {
    const loaderWrapper = document.getElementById('loaderWrapper');
    const loader = document.getElementById('loader');
    loaderWrapper.removeChild(loader);
    content.removeChild(loaderWrapper);
};

createPlaceholder = (content) => {
    const placeholder = document.createElement('div');
    placeholder.innerText = '🤷🏻‍♂️ No results yet 🤷🏻‍♂️';
    placeholder.className = 'placeholder';
    content.appendChild(placeholder)
};

createMovies = (movies, moviesWrapper) => {
    if (movies.results && movies.results.length > 0) {
        movies.results.forEach(movie => {
            if (movie.poster_path) {
                const image = document.createElement('img');
                image.src = ' https://image.tmdb.org/t/p/w500' + movie.poster_path;
                moviesWrapper.appendChild(image)
            }
        })
    } else {
        const noMoviesMessage = document.createElement('div');
        noMoviesMessage.style = 'align-self: center';
        noMoviesMessage.innerText = '😞 No movies 😞';
        moviesWrapper.innerHTML = '';
        moviesWrapper.appendChild(noMoviesMessage);
    }
};

createSongs = (songs, songsWrapper) => {
    if (songs.data && songs.data.length > 0) {
        songs.data.forEach(song => {
            if (song.album && song.album.cover_big) {
                const image = document.createElement('img');
                image.src = song.album.cover_big;
                songsWrapper.appendChild(image);
                const text = document.createElement('h2');
                text.innerText = song.title + ' by ' + song.artist.name;
                text.style = 'align-self: center; text-align: center;'
                songsWrapper.appendChild(text);
            }
        })
    } else {
        const noSongsMessage = document.createElement('div');
        noSongsMessage.style = 'align-self: center';
        noSongsMessage.innerText = '😞 No songs 😞';
        songsWrapper.innerHTML = '';
        songsWrapper.appendChild(noSongsMessage);
    }
};
createStats = (stats, statsWrapper) => {
    const firstQuery = document.createElement('h2');
    firstQuery.innerText = `Time spent on getting the movies: ${stats.firstQuery}ms`;
    statsWrapper.appendChild(firstQuery);

    const secondQuery = document.createElement('h2');
    secondQuery.innerText = `Time spent on getting the songs: ${stats.secondQuery}ms`;
    statsWrapper.appendChild(secondQuery);

    const serverDuration = document.createElement('h2');
    serverDuration.innerText = `Time spent on getting the response from server: ${stats.duration - stats.firstQuery - stats.secondQuery}ms`;
    statsWrapper.appendChild(serverDuration);

    const duration = document.createElement('h2');
    duration.innerText = `Complete time of request: ${stats.duration}ms`;
    statsWrapper.appendChild(duration);
};

init();
