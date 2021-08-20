/***************************** 
        USER (MOCK) DB
 *****************************/
const allUsers = {
    'user1' : {
        userName: '@elonmusk',
        displayName: 'Elon Musk',
        joinedDate: 'June 2009',
        followingCount: 103,
        followerCount: 47900000,
        avatarURL: 'assets/elonmusk.jpg',
        coverPhotoURL: 'assets/elonmusk-cover.jpeg',
        tweets: [
            {
                text: 'I admit to judging books by their cover',
                timestamp: '2/10/2021 00:01:20'
            },
            {
                text: 'Starship to the moon',
                timestamp: '2/09/2021 18:37:12'
            },
            {
                text: 'Out on launch pad, engine swap underway',
                timestamp: '2/09/2021 12:11:51'
            }
        ]
    },
    'user2' : {
        userName: '@BillGates',
        displayName: 'Bill Gates',
        joinedDate: 'June 2009',
        followingCount: 274,
        followerCount: 53800000,
        avatarURL: 'assets/billgates.jpg',
        coverPhotoURL: 'assets/billgates-cover.jpeg',
        tweets: [
            {
                text: 'Everybody asks, how is the next Windows coming along? But nobody asks how is Bill? :/',
                timestamp: '2/10/2021 00:01:20'
            },
            {
                text: 'Should I start tweeting memes? Let me know in a comment.',
                timestamp: '2/09/2021 18:37:12'
            },
            {
                text: 'In 2020, I read a book every hour.',
                timestamp: '2/09/2021 12:11:51'
            }
        ]
    }
};

/***************************** 
        FORMATTING FNS
 *****************************/
function formatLargeNum(num) {

    if (num > 1000000) {
        return (num/1000000).toFixed(1) + "M";
    }
    else if (num > 10000) {
        return (num/1000).toFixed(1) + "K";
    }

    return num;
}

const currentDatetime = new Date();
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function formatTimeStamp(timestamp) {
    let date = (timestamp.split(' ')[0].split('/')).map(el => Number(el)); // [M, D, Y]
    let time = timestamp.split(' ')[1].split(':'); // [hh, mm, ss]

    let formatted = '';

    if((date[0] - 1) === currentDatetime.getMonth() && date[1] === currentDatetime.getDate()) {
        console.log(`
        Hour:    ${currentDatetime.getHours()} 
        Minutes:  ${currentDatetime.getMinutes()}
        Seconds:   ${currentDatetime.getSeconds()}
        `);

        // TODO: update math for differences less than a full minute/hour/etc..
        if (time[0] < currentDatetime.getHours()) {
            formatted += `${currentDatetime.getHours() - time[0]}h`;
        }
        else if (time[1] < currentDatetime.getMinutes()) {
            formatted += `${currentDatetime.getMinutes() - time[1]}m`;
        }
        else {
            formatted += `${currentDatetime.getSeconds() - time[2]}s`;
        }
    }
    else  {
        formatted += `${months[date[0] - 1]} ${date[1]}`;

        if (timestamp[2] > currentDatetime.getFullYear()) {
            formatted += `, ${timestamp[2]}`;
        }
    }

    if (timestamp[2] > currentDatetime.getFullYear()) {
        console.log('tweet from a previous year');
    }

    return formatted;
}


/***************************** 
        LOAD PROFILE
 *****************************/
function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

let profileData = allUsers[getParameterByName('user')];
if (!profileData) {
    profileData = allUsers['user1'];
}

/***************************** 
        PAGE CONTENT
 *****************************/

// header container
const headerContainer = document.getElementsByClassName('header-container')[0];
const headerInfo = document.createElement('div');
headerInfo.innerHTML = `
    <h1>${profileData.displayName}</h1>
    <p>${formatLargeNum(profileData.tweets.length)} Tweets</p>
`;
headerContainer.appendChild(headerInfo);

// cover container
const coverContainer = document.getElementsByClassName('cover-container')[0];
coverContainer.style.background = `center / 100% url(\'${profileData.coverPhotoURL}\')`;

const avatar = document.createElement('img');
let avatarSize = 130;
avatar.src = profileData.avatarURL;
avatar.style.length = avatar.style.height = avatarSize + "px";
avatar.style["border-radius"] = "50%";
avatar.style.border = "5px solid #ffffff";
avatar.style.position = 'absolute';
avatar.style['margin-left'] = '20px';
avatar.style.bottom = Math.floor(avatarSize/-2) + "px";

coverContainer.appendChild(avatar);

// details container
const detailsContainer = document.getElementsByClassName('details-container')[0];
detailsContainer.innerHTML += `
    <h1>${profileData.displayName}</h1>
    <p>${profileData.userName}</p>
    <p>Joined ${profileData.joinedDate}</p>
    <div id=\"follower-numbers\"">
        <p><span>${formatLargeNum(profileData.followingCount)}</span> Following</p>
        <p><span>${formatLargeNum(profileData.followerCount)}</span> Followers</p>
    </div>
`;

// tweet display container
const tweetTabs = document.querySelectorAll('.tweet-tab');
const tweetContainer = document.getElementsByClassName('tweet-display-container')[0];

// load default display
updateTweetDisplay(document.querySelector('.tweet-tab-selected'));

// dummy fn
function doesTweetHaveMedia(tweet) {
    return false;
}

// dummy fn
function getLikedTweets(user) {
    return [];
}

function updateTweetDisplay(selectedTab) {

    document.querySelectorAll('.tweet').forEach(tweet => tweetContainer.removeChild(tweet));

    let tweetsToDisplay = null;

    if (selectedTab.id === 'tweets' || selectedTab.id === 'replies') {
        tweetsToDisplay = profileData.tweets;
    }
    else if (selectedTab.id === 'media') {
        tweetsToDisplay = profileData.tweets.filter(tweet => {
            return doesTweetHaveMedia(tweet);
        })
    }
    else if (selectedTab.id === 'likes') {
        tweetsToDisplay = getLikedTweets(profileData);
    }

    if (tweetsToDisplay.length === 0) {
        const emptyTweetDiv = document.createElement('div');
        emptyTweetDiv.classList.add('tweet');

        emptyTweetDiv.textContent = 'Nothing to see here... yet. :)';
        tweetContainer.appendChild(emptyTweetDiv);      

        return;
    }

    tweetsToDisplay.forEach(tweet => {
        const tweetDiv = document.createElement('div');
        tweetDiv.classList.add('tweet');

        tweetDiv.innerHTML = `
            <img src='${profileData.avatarURL}'/>
            <div class="tweet-content">
                <div class="tweet-header">
                    <h2>${profileData.displayName}</h2>
                    <p>${profileData.userName} · ${formatTimeStamp(tweet.timestamp)}</p>
                </div>
                <p class="tweet-content">${tweet.text}</p>
            </div>
        `;

        tweetContainer.appendChild(tweetDiv);
    });
}


/***************************** 
        EVENT HANDLERS
 *****************************/
// Back button
const backButton = document.querySelector('.back-button');
backButton.addEventListener('click', event => {
    alert('Pretend I went to the previous page :)');
});

// Follow Button
const followButton = document.querySelector('.follow-button');

followButton.addEventListener('click', event => {
    

    if (!followButton.classList.contains('currently-following')) {
        followButton.textContent = 'Unfollow';
        followButton.classList.add('currently-following');

        return;
    }

    followButton.classList.remove('currently-following');
    followButton.textContent = 'Follow';

});

followButton.addEventListener('mouseover', event => {

    if (followButton.classList.contains('currently-following')) {
        followButton.textContent = 'Unfollow';
    }
});

followButton.addEventListener('mouseout', event => {

    if (followButton.classList.contains('currently-following')) {
        followButton.textContent = 'Following';
    }
});

// tweet display tab selector
tweetTabs.forEach(clickedTweetTab => {
    clickedTweetTab.addEventListener('click', event => {

        if (event.currentTarget.classList.contains('tweet-tab-selected')) {
            return;
        }

        tweetTabs.forEach(tweet => {
            tweet.classList.remove('tweet-tab-selected');
        });

        updateTweetDisplay(event.currentTarget);
        event.currentTarget.classList.add('tweet-tab-selected');
    })
});