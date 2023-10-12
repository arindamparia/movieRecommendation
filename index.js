const genresEle=document.getElementById('genres'),searchBtnEle=document.getElementById('playBtn')
const genreRequest=new XMLHttpRequest()
const apiKey='5d3798c7cb18ed0ae769fc0e4e5fd90f'
genreRequest.open('GET',`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`)
genreRequest.send()
genreRequest.onload=()=> {
    const genreList=JSON.parse(genreRequest.responseText)
    genreList.genres.forEach(val=>{
        const opt=document.createElement('option')
        opt.textContent=val.name;
        genresEle.append(opt)
    })
    searchBtnEle.onclick=()=>{
        const selectedGenre=document.getElementById('genres').value
        const selectedGenreID=genreList.genres.find(val=>val.name===selectedGenre).id
        const movieRequest=new XMLHttpRequest()
        movieRequest.open('GET',`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${selectedGenreID}`)
        movieRequest.send()
        movieRequest.onload=movieLoad
        function movieLoad(){
            const movieListPageCnt=JSON.parse(movieRequest.responseText).total_pages;
            const movieListPage=Math.floor(Math.random()*Math.min(movieListPageCnt,500))+1
            const movieRequestWithPage=new XMLHttpRequest()
            movieRequestWithPage.open('GET',`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${selectedGenreID}&page=${movieListPage}`)
            movieRequestWithPage.send()
            movieRequestWithPage.onload=()=>{
                const movieList=JSON.parse(movieRequestWithPage.responseText).results
                const movieID=movieList[Math.floor(Math.random()*movieList.length)].id
                const movieDetailsRequest=new XMLHttpRequest()
                movieDetailsRequest.open('GET',`https://api.themoviedb.org/3/movie/${movieID}?api_key=${apiKey}`)
                movieDetailsRequest.send()
                movieDetailsRequest.onload=()=>{
                    const movieDetails=JSON.parse(movieDetailsRequest.responseText)
                    if(movieDetails.poster_path) {
                        const moviePosterImgEle = document.createElement('img')
                        moviePosterImgEle.src = `https://image.tmdb.org/t/p/original/${movieDetails.poster_path}`
                        const moviePostEle = document.getElementById('moviePoster')
                        moviePostEle.innerHTML = ''
                        moviePostEle.append(moviePosterImgEle)
                    }
                    else{
                        moviePostEle.textContent = `Image not found`
                    }
                    const movieTitleEle=document.createElement('div')
                    movieTitleEle.id='movieTitle';
                    movieTitleEle.textContent=movieDetails.title
                    const movieOverviewEle=document.createElement('div')
                    movieOverviewEle.id='movieOverview';
                    movieOverviewEle.textContent=movieDetails.overview
                    const movieTextEle=document.getElementById('movieText')
                    movieTextEle.innerHTML=''
                    movieTextEle.append(movieTitleEle,movieOverviewEle)
                    document.getElementById('likeOrDislikeBtns').hidden=false
                    document.getElementById('likeBtn').onclick=movieLoad
                }
            }
        }
    }
}

