const elArticles = document.getElementById('articles');
const elCategoryTitle = document.getElementById('categoryTitle');
const elBtnLoadMore = document.getElementById('btnLoadMore');
// const elMyPagination = document.getElementById('myPagination');

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const keyword = urlParams.get('keyword');
let currentPage = parseInt(urlParams.get('page'));
if (isNaN(currentPage)) currentPage = 1;

getArticles(currentPage);

elBtnLoadMore.addEventListener('click', () => {
  elBtnLoadMore.innerText = 'Đang tải thêm...';
  elBtnLoadMore.disabled = true;
  currentPage++;
  getArticles(currentPage);
});

function getArticles(page = 1) {
  API.call()
    .get(`articles/search?q=${keyword}&limit=5&page=${page}`)
    .then((res) => {
      const articles = res.data.data;
      const totalPages = res.data.meta.last_page;
      const total = res.data.meta.total;

      let html = '';
      articles.forEach((item) => {
        const regex = new RegExp(keyword, 'gi');
        const title = item.title.replace(
          regex,
          (match) => `<mark>${match}</mark>`
        );
        const thumb = item.thumb;
        const publishDate = dayjs(item.publish_date).fromNow();
        const description = item.description.replace(
          regex,
          (match) => `<mark>${match}</mark>`
        );
        const authorName = item.author;

        // <mark>Neymar</mark> bị đuổi vì ăn vạ

        html += /* html */ `
        <div class="d-md-flex post-entry-2 half">
          <a href="detail.html?id=${item.id}" class="me-4 thumbnail">
            <img src="${thumb}" alt="${title}" class="img-fluid" />
          </a>
          <div>
            <div class="post-meta"><span>${publishDate}</span></div>
            <h3><a href="detail.html?id=${item.id}">${title}</a></h3>
            <p>${description}</p>
            <div class="d-flex align-items-center author">
              <div class="photo"><img src="assets/img/person-2.jpg" alt="" class="img-fluid" /></div>
              <div class="name">
                <h3 class="m-0 p-0">${authorName}</h3>
              </div>
            </div>
          </div>
        </div>`;
      });

      elCategoryTitle.innerText = `Tìm thấy ${total} bài viết với từ khóa "${keyword}"`;
      elArticles.innerHTML += html;
      elBtnLoadMore.innerText = 'Tải thêm';
      elBtnLoadMore.disabled = false;
    })
    .catch(function (error) {
      window.location.href = 'index.html';
    });
}
