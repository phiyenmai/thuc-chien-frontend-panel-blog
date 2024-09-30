const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = parseInt(urlParams.get('id'));

const elCategoryName = document.getElementById('categoryName');
const elPublishDate = document.getElementById('publishDate');
const elArticleTitle = document.getElementById('articleTitle');
const elArticleContent = document.getElementById('articleContent');
const elArticleThumb = document.getElementById('articleThumb');
const elCommentForm = document.getElementById('commentForm');
const elCommentNotice = document.getElementById('commentNotice');
const elCommentContent = document.getElementById('commentContent');
const elListCommnets = document.getElementById('listCommnets');
const elTotalComments = document.getElementById('totalComments');
const elBtnCommentCancel = document.getElementById('btnCommentCancel');
let email = '';
let COMMENTS = JSON.parse(localStorage.getItem('COMMENTS')) || [];
let commentsByArtcile = COMMENTS.filter((item) => item.articleId === id);
let parentId = null;

API.callWithToken()
  .get('/auth/me')
  .then((res) => {
    email = res.data.data.email;
    elCommentForm.classList.remove('d-none');
    elCommentNotice.classList.add('d-none');
  })
  .catch((err) => {
    elCommentNotice.classList.remove('d-none');
    elCommentForm.classList.add('d-none');
  })
  .finally(() => {
    renderComments(commentsByArtcile);
  });

elCommentForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const content = elCommentContent.value.trim();

  if (content) {
    const newComment = {
      id: self.crypto.randomUUID(),
      email,
      content,
      dateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      articleId: id,
      childItems: [],
    };

    if (parentId) {
      const idxParent = COMMENTS.findIndex((item) => item.id === parentId);

      // Ensure childItems is an array before pushing new comments
      if (!COMMENTS[idxParent].childItems) {
        COMMENTS[idxParent].childItems = []; // Initialize if undefined
      }

      COMMENTS[idxParent].childItems.push(newComment);
      localStorage.setItem('COMMENTS', JSON.stringify(COMMENTS));
      parentId = null;
      elCommentContent.placeholder = 'Enter your comment';
    } else {
      COMMENTS.unshift(newComment);
    }

    localStorage.setItem('COMMENTS', JSON.stringify(COMMENTS));
    commentsByArtcile = COMMENTS.filter((item) => item.articleId === id);
    renderComments(commentsByArtcile);
    elCommentContent.value = '';
  } else {
    alert('Vui lòng nhập nội dung!');
  }
});

API.call()
  .get(`articles/${id}`)
  .then((res) => {
    const article = res.data.data;
    elCategoryName.innerText = article.category.name;
    elPublishDate.innerText = article.publish_date;
    elArticleTitle.innerText = article.title;
    elArticleContent.innerHTML = article.content;
    elArticleThumb.src = article.thumb;

    if (!RECENT_POSTS.includes(id)) {
      if (RECENT_POSTS.length === 4) RECENT_POSTS.shift();

      RECENT_POSTS.push(id);
      localStorage.setItem('RECENT_POSTS', JSON.stringify(RECENT_POSTS));
    }
  })
  .catch(function (error) {
    window.location.href = 'index.html';
    console.log(error);
  });

function renderComments(COMMENTS) {
  let html = '';
  COMMENTS.map((item) => {
    const publishDate = dayjs(item.dateTime).fromNow();
    console.log(item.childItems);

    let htmlChildren = '';
    console.log(item);

    if (item.childItems && item.childItems.length > 0) {
      htmlChildren += '<div class="comment-replies bg-light p-3 mt-3 rounded">';
      htmlChildren += `<h6 class="comment-replies-title mb-4 text-muted text-uppercase">${item.childItems.length} replies</h6>`;

      item.childItems.map((itemChild) => {
        const publishDateChild = dayjs(itemChild.dateTime).fromNow();
        const btnReply = email
          ? `<button type="button" class="btn btn-sm btn-primary ms-auto btn-reply-comment" data-id="${item.id}">Trả lời</button>`
          : '';
        htmlChildren += /*html*/ `

        <div class="reply d-flex mb-4">
          <div class="flex-shrink-0">
            <div class="avatar avatar-sm rounded-circle">
              <img class="avatar-img" src="assets/img/person-4.jpg" alt="" class="img-fluid">
            </div>
          </div>
          <div class="flex-grow-1 ms-2 ms-sm-3">
            <div class="reply-meta d-flex align-items-baseline">
              <h6 class="mb-0 me-2">${itemChild.email}</h6>
              <span class="text-muted">${publishDateChild}</span>
              ${btnReply}
            </div>
            <div class="reply-body">
            ${itemChild.content}
            </div>
          </div>
        </div>
      `;
      });

      htmlChildren += '</div>';
    }
    const btnReply = email
      ? `<button type="button" class="btn btn-sm btn-primary ms-auto btn-reply-comment" data-id="${item.id}">Trả lời</button>`
      : '';
    html += /*html */ `
  <div class="comment d-flex mb-4">
    <div class="flex-shrink-0">
      <div class="avatar avatar-sm rounded-circle">
        <img
          class="avatar-img"
          src="assets/img/person-2.jpg"
          alt=""
          class="img-fluid"
        />
      </div>
    </div>
    <div class="flex-shrink-1 ms-2 ms-sm-3 flex-grow-1">
      <div class="comment-meta d-flex">
        <h6 class="me-2">${item.email}</h6>
        <span class="text-muted">${publishDate}</span>
        ${btnReply}
      </div>
      <div class="comment-body">
        ${item.content}
      </div>
      ${htmlChildren}
    </div>
  </div>`;
  });
  elListCommnets.innerHTML = html;
  elTotalComments.innerText = COMMENTS.length + ' Bình luận';
}

elListCommnets.addEventListener('click', (e) => {
  const el = e.target;
  if (el.classList.contains('btn-reply-comment')) {
    parentId = el.dataset.id;
    elCommentContent.placeholder = `Trả lời ${email}: `;
  }
});

elBtnCommentCancel.addEventListener('click', () => {
  parentId = null;
  elCommentContent.value = '';
  elCommentContent.placeholder = 'Enter your comment';
});
