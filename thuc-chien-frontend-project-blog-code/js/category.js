const elArticles = document.getElementById('articles');
const elBtnLoadMore = document.getElementById('btnLoadMore');
const elCategoryName = document.getElementById('categoryName');

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = parseInt(urlParams.get('id'));
let currentPage = parseInt(urlParams.get('page'));

getArticles(currentPage);

elBtnLoadMore.addEventListener('click', () => {
  elBtnLoadMore.innerText = 'Đang tải thêm...';
  elBtnLoadMore.disabled = true;
  currentPage++;
  getArticles(currentPage);
});

function getArticles(page = 1) {
  API.call()
    .get(`categories_news/${id}/articles?limit=5&page=${page}`)
    .then(function (response) {
      const data = response.data.data;
      console.log(data);

      let html = '';

      data.map((item) => {
        const title = item.title;
        const thumb = item.thumb;
        const publishDate = dayjs(item.publish_date).fromNow();
        const description = item.description;
        const authorName = item.author;
        /*html */
        html += `
       <div class="d-md-flex post-entry-2 half">
        <a href="detail.html?id=${item.id}" class="me-4 thumbnail">
          <img
            src="${thumb}"
            alt=""
            class="img-fluid"
          />
        </a>
        <div>
          <div class="post-meta">
            <span class="date">${item.category.name}</span>
            <span class="mx-1">&bullet;</span> <span>${publishDate}</span>
          </div>
          <h3>
            <a href="single-post.html"
              >${title}</a
            >
          </h3>
          <p>
            ${description}
          </p>
          <div class="d-flex align-items-center author">
            <div class="photo">
              <img
                src="assets/img/person-2.jpg"
                alt=""
                class="img-fluid"
              />
            </div>
            <div class="name">
              <h3 class="m-0 p-0">${authorName}</h3>
            </div>
          </div>
        </div>
      </div>`;
      });
      elArticles.innerHTML += html;
      elCategoryName.innerText = `Category: ${data[0].category.name}`;
      elBtnLoadMore.innerText = 'Tải thêm';
      elBtnLoadMore.disabled = false;
    })
    .catch(function (error) {
      window.location.href = 'index.html';
    });
}
