const API = axios.create({
    baseURL: 'https://apiforlearning.zendvn.com/api/v2/',
});

dayjs.extend(window.dayjs_plugin_relativeTime)
dayjs.locale('vi')

const elMainMenu = document.getElementById('mainMenu');
const elArticles = document.getElementById('articles');
const elCategoryTitle = document.getElementById('categoryTitle');


const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get('id');
console.log('id', id);


// RENDER MENUS
API.get('categories_news').then((response) => {
    const data = response.data;
    const categories = data.data;

    let htmlMenu = '';
    let htmlMenuOther = '';
    categories.forEach((item, index) => {
        if (index < 3) {
            htmlMenu += `<li><a href="category.html?id=${item.id}">${item.name}</a></li>`;
        } else {
            htmlMenuOther += `<li><a href="category.html?id=${item.id}">${item.name}</a></li>`;
        }
    });
    elMainMenu.innerHTML =
        htmlMenu /*html*/ +
        ` <li class="dropdown">
            <a href="#"><span>Danh mục khác </span> <i class="bi bi-chevron-down dropdown-indicator"></i></a>
            <ul>${htmlMenuOther}</ul>
          </li>`;
});

// categories_news/2/articles?limit=5
API.get(`categories_news/${id}/articles?limit=5`).then(res => {
    const articles = res.data.data;
    let categoryName = '';

    let html = '';
    articles.forEach(item => {
        const title = item.title;
        const thumb = item.thumb;
        const publishDate = dayjs(item.publish_date).fromNow();
        const description = item.description;
        const authorName = item.authorName;
        categoryName = item.category.name;

        html += /*html*/ ` 
        <div class="d-md-flex post-entry-2 half">
            <a href="single-post.html" class="me-4 thumbnail">
              <img src="${thumb}" alt="${title}" class="img-fluid">
            </a>
            <div>
              <div class="post-meta"><span>${publishDate}</span></div>
              <h3><a href="single-post.html">${title}</a> </h3>
              <p>${description}</p>
              <div class="d-flex align-items-center author">
                <div class="photo"><img src="assets/img/person-2.jpg" alt="" class="img-fluid"></div>
                <div class="name">
                  <h3 class="m-0 p-0">${authorName}</h3>
                </div>
              </div>
            </div>
        </div>`

    })
    elCategoryTitle.innerText = `Category : ${ categoryName }`;
    elArticles.innerHTML = html;

})