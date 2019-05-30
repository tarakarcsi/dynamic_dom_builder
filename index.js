const BASE_URL = 'https://jsonplaceholder.typicode.com';

let usersDivEl;
let postsDivEl;
let commentDivEl;
let loadButtonEl;
let albumsDivEl;

function createUsersTableHeader() {
    const idTdEl = document.createElement('td');
    idTdEl.textContent = 'Id';

    const nameTdEl = document.createElement('td');
    nameTdEl.textContent = 'Name';

    const trEl = document.createElement('tr');
    trEl.appendChild(idTdEl);
    trEl.appendChild(nameTdEl);

    const buttonAlbumsTdEl = document.createElement('td');
    buttonAlbumsTdEl.textContent = 'Albums';

    const theadEl = document.createElement('thead');
    theadEl.appendChild(trEl);
    return theadEl;
}

function createUsersTableBody(users) {
    const tbodyEl = document.createElement('tbody');

    for (let i = 0; i < users.length; i++) {
        const user = users[i];

        // creating id cell
        const idTdEl = document.createElement('td');
        idTdEl.textContent = user.id;

        // creating name cell
        const dataUserIdAttr = document.createAttribute('data-user-id');
        dataUserIdAttr.value = user.id;

        const dataUserAlbumIdAttr = document.createAttribute('data-user-id');
        dataUserAlbumIdAttr.value = user.id;

        const buttonEl = document.createElement('button');
        buttonEl.textContent = user.name;
        buttonEl.setAttributeNode(dataUserIdAttr);
        buttonEl.addEventListener('click', onLoadPosts);

        const buttonAlbumsEl = document.createElement('button');
        buttonAlbumsEl.textContent = 'Albums';
        buttonAlbumsEl.setAttributeNode(dataUserAlbumIdAttr);
        buttonAlbumsEl.addEventListener('click', onLoadAlbums);

        const nameTdEl = document.createElement('td');
        nameTdEl.appendChild(buttonEl);

        const buttonAlbumsTdEl = document.createElement('td');
        buttonAlbumsTdEl.appendChild(buttonAlbumsEl);

        // creating row
        const trEl = document.createElement('tr');
        trEl.appendChild(idTdEl);
        trEl.appendChild(nameTdEl);
        trEl.appendChild(buttonAlbumsTdEl);


        tbodyEl.appendChild(trEl);
    }

    return tbodyEl;
}

function createUsersTable(users) {
    const tableEl = document.createElement('table');
    tableEl.appendChild(createUsersTableHeader());
    tableEl.appendChild(createUsersTableBody(users));
    return tableEl;
}

function onUsersReceived() {
    loadButtonEl.remove();

    const text = this.responseText;
    const users = JSON.parse(text);

    const divEl = document.getElementById('users-content');
    divEl.appendChild(createUsersTable(users));
}

function onLoadUsers() {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onUsersReceived);
    xhr.open('GET', BASE_URL + '/users');
    xhr.send();
}

function createPostsList(posts) {
    const ulEl = document.createElement('ul');

    for (let i = 0; i < posts.length; i++) {
        const post = posts[i];

        // creating paragraph
        const strongEl = document.createElement('strong');
        strongEl.textContent = post.title;

        const pEl = document.createElement('p');
        pEl.appendChild(strongEl);
        pEl.appendChild(document.createTextNode(`: ${post.body}`));

        const postIdAttribute = post.id;
        strongEl.setAttribute('post-id', postIdAttribute);
        strongEl.addEventListener('click', onLoadComments);

        // creating list item
        const liEl = document.createElement('li');
        liEl.appendChild(pEl);

        ulEl.appendChild(liEl);
    }

    return ulEl;
}

function onPostsReceived() {
    postsDivEl.style.display = 'block';

    const text = this.responseText;
    const posts = JSON.parse(text);

    const divEl = document.getElementById('posts-content');
    while (divEl.firstChild) {
        divEl.removeChild(divEl.firstChild);
    }
    divEl.appendChild(createPostsList(posts));
}

function onLoadPosts() {
    const el = this;
    const userId = el.getAttribute('data-user-id');

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onPostsReceived);
    xhr.open('GET', BASE_URL + '/posts?userId=' + userId);
    xhr.send();
}

function createCommentsList(comments) {
    const ulEl = document.createElement('ul');

    for (let i = 0; i < comments.length; i++) {
        const comment = comments[i];

        // creating paragraph
        const strongEl = document.createElement('strong');
        strongEl.textContent = comment.name;

        const pEl = document.createElement('p');
        pEl.appendChild(strongEl);
        pEl.appendChild(document.createTextNode(`: ${comment.body}`));

        const commentIdAttribute = comment.id;
        strongEl.setAttribute('comment-id', commentIdAttribute);
        strongEl.addEventListener('click', onLoadComments);

        // creating list item
        const liEl = document.createElement('li');
        liEl.appendChild(pEl);
        ulEl.appendChild(liEl);
    }

    return ulEl;
}

function onLoadComments() {
    const el = this;
    const postId = el.getAttribute('post-id');

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onCommentsReceived);
    xhr.open('GET', BASE_URL + '/comments?postId=' + postId);
    xhr.send();
}

function onCommentsReceived() {
    commentDivEl.style.display = 'block';

    const text = this.responseText;
    const comments = JSON.parse(text);
    const divEl = document.getElementById('comments-content');
    while (divEl.firstChild) {
        divEl.removeChild(divEl.firstChild);
    }
    divEl.appendChild(createCommentsList(comments));
}

function createAlbumsList(albums) {
    const ulEl = document.createElement('ul');
  
    for (let i = 0; i < albums.length; i++) {
      const album = albums[i];
  
      const strongEl = document.createElement('strong');
      strongEl.textContent = album.title;
  
      const pEl = document.createElement('p');
      pEl.appendChild(strongEl);
  
      const albumIdAttr = album.id;
      strongEl.setAttribute('id', albumIdAttr);
      strongEl.addEventListener('click', onLoadAlbums);
  
      const liEl = document.createElement('li');
      liEl.appendChild(pEl);
  
      ulEl.appendChild(liEl);
    }
  
    return ulEl;
  }


function onAlbumsReceived() {
    postsDivEl.style.display = 'none';
    albumsDivEl.style.display = 'block';

    const text = this.responseText;
    const albums = JSON.parse(text);

    const divEl = document.getElementById('albums-content');
    while (divEl.firstChild) {
        divEl.removeChild(divEl.firstChild);
    }
    divEl.appendChild(createAlbumsList(albums));
}

function onLoadAlbums() {
    const el = this;
    const userId = el.getAttribute('data-user-id');
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onAlbumsReceived);
    xhr.open('GET', BASE_URL + '/albums?userId=' + userId);
    xhr.send();
}

document.addEventListener('DOMContentLoaded', (event) => {
    usersDivEl = document.getElementById('users');
    postsDivEl = document.getElementById('posts');
    loadButtonEl = document.getElementById('load-users');
    commentDivEl = document.getElementById('comments');
    albumsDivEl = document.getElementById('albums');
    loadButtonEl.addEventListener('click', onLoadUsers);
});
