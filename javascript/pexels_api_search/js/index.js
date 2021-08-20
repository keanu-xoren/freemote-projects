/**********************
    API ENDPOINTS
 **********************/
const PEXELS_BASE_URL = 'https://api.pexels.com/v1/';
const PEXELS_BASE_VIDEO_URL = 'https://api.pexels.com/videos/';
const PEXELS_API_AUTH_KEY = '563492ad6f917000010000018ceb5b710f244d15813c638d99acc4cc';

/**********************
    RENDERING FNS
 **********************/
const displayPhotoResults = data => {
    $('.results-container').empty();

    data.photos.forEach(image => {
        $(`<img src="${image.src.medium}" class="result-img"/>`).appendTo('.results-container');
    });
}

const displayVideoResults = data => {
    $('.results-container').empty();

    data['videos'].forEach(video => {
        $(`<a target="_blank" href=${video.url}><img src="${video.image}" class="result-video"/></a>`).appendTo('.results-container');
    });
}

/**********************
    EVENT HANDLERS
 **********************/
// query input
$('#query-submit').on('click', event => {
    event.preventDefault();

    if ($('#query-text').val().trim() === ''){
        return;
    }

    // photo or video results, based on selected tab
    const getPhotoResults = ($('.results-tab-selected').attr('id') === 'photos');

    $.ajax({
        url: `${getPhotoResults ? PEXELS_BASE_URL : PEXELS_BASE_VIDEO_URL}/search?query=${$('#query-text').val()}&per_page=10`, 
        headers : { 'Authorization' : PEXELS_API_AUTH_KEY},
        success : getPhotoResults ? displayPhotoResults : displayVideoResults
    });
});

// tab selector
$('.results-tab').on('click', event => {
    if (event.currentTarget.classList.contains('results-tab-selected')) {
        return;
    }

    document.querySelector('.results-tab-selected').classList.remove('results-tab-selected');
    event.currentTarget.classList.add('results-tab-selected');

    // repopulate contents based on the newly selected tab, as necessary
    if ($('#query-text').val().trim() === ''){
        return;
    }

    const getPhotoResults = ($('.results-tab-selected').attr('id') === 'photos');

    $.ajax({
        url: `${getPhotoResults ? PEXELS_BASE_URL : PEXELS_BASE_VIDEO_URL}/search?query=${$('#query-text').val()}&per_page=10`, 
        headers : { 'Authorization' : PEXELS_API_AUTH_KEY},
        success : getPhotoResults ? displayPhotoResults : displayVideoResults
    });
});

// fetch('sample_response.json')
// .then(response => {
//     return response.json();
// })
// .then(data => {

//     data.photos.forEach(image => {
//         $(`<img src="${image.src.medium}" class="result-img"/>`).appendTo('.results-container');
//     });

// })

