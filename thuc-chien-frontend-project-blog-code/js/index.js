const elTrendingPosts = document.getElementById('trendingPosts');
const elNewArticles = document.getElementById('articlesNew');
const elNewArticlesLarge = document.getElementById('articleNewLarge');
const elCategoryArticles = document.getElementById('categoryArticles');
const elCategoriesFeaturedTab = document.getElementById('myTab');
const elCategoriesFeaturedTabContent = document.getElementById('myTabContent');
const elArticlesSlider = document.getElementById('articleSlider');

//============================================RENDER ARTICLES TRENDING=======================================
API.call()
  .get('articles/popular?limit=5')
  .then(function (response) {
    const data = response.data.data;
    let htmlTrendingPosts = '';
    data.map((item, index) => {
      htmlTrendingPosts += renderArticlesTrending(item, index);
    });
    elTrendingPosts.innerHTML = htmlTrendingPosts;
  });

//===========================================RENDER NEW ARTICLES=============================================
API.call()
  .get('articles?limit=7')
  .then(function (response) {
    const articles = response.data.data;
    let htmlNewArticles = '';
    articles.map((item, index) => {
      if (index == 0) {
        elNewArticlesLarge.innerHTML = renderNewArticlesLarge(item);
      } else {
        htmlNewArticles += renderNewArticles(item);
      }
    });
    elNewArticles.innerHTML = htmlNewArticles;
  });

//===========================================RENDER ARTICLES BY ITS CATEGORY=======================================
API.call()
  .get('categories_news/articles?limit_cate=2&limit=9')
  .then(function (response) {
    const data = response.data.data;
    let html = '';

    data.map((item, index) => {
      const categoryName = item.name;
      const articles = item.articles;
      html += /*html */ `
    <section class="category-section">
        <div class="container" data-aos="fade-up">
            ${renderCategoryArticlesTitle(categoryName, item)}

            ${renderCategoryArticlesLeftRight(articles, categoryName, index, item)}
        <!-- End .row -->
        </div>
    </section>
    `;
    });
    elCategoryArticles.innerHTML = html;
  });

//===========================================CATEGORY FEATURED========================================
API.call()
  .get('categories_news/articles?limit_cate=4&limit=4')
  .then((res) => {
    const data = res.data.data;

    let htmlTab = '';
    let htmlTabContent = '';

    data.forEach((item, index) => {
      const categoryName = item.name;
      const articles = item.articles;
      const slug = item.slug;
      const active = index === 0 ? 'active' : '';
      const activeShow = index === 0 ? 'show active' : '';

      let htmlArticles = '';

      articles.forEach((articleItem) => {
        const publishDate = dayjs(articleItem.publish_date).fromNow();
        htmlArticles += /* html */ `
        <div class="col-md-6 col-lg-3">
          <div class="post-entry-1">
            <a href="detail.html?id=${articleItem.id}"
              ><img src="${articleItem.thumb}" alt="${articleItem.title}" class="img-fluid"
            /></a>
            <div class="post-meta">
                <span class="date">${categoryName}</span>
                <span class="mx-1">&bullet;</span>
                <span>${publishDate}</span>
            </div>
            <h2><a href="detail.html?id=${articleItem.id}">${articleItem.title}</a></h2>
          </div>
        </div>`;
      });

      htmlTab += /* html */ `
      <li class="nav-item" role="presentation">
        <button
          class="nav-link ${active}"
          id="${slug}-tab"
          data-bs-toggle="tab"
          data-bs-target="#${slug}-tab-pane"
          type="button"
          role="tab"
          aria-controls="${slug}-tab-pane"
          aria-selected="false"
        >
          ${categoryName}
        </button>
      </li>`;

      htmlTabContent += /* html */ `
      <div class="tab-pane fade ${activeShow}" id="${slug}-tab-pane" role="tabpanel" aria-labelledby="${slug}-tab" tabindex="0">
        <div class="row g-5">${htmlArticles}</div>
      </div>`;
    });

    elCategoriesFeaturedTab.innerHTML = htmlTab;
    elCategoriesFeaturedTabContent.innerHTML = htmlTabContent;
  });

//============================================ARTICLE SLIDERS================================================
API.call()
  .get('articles/popular?limit=5')
  .then(function (response) {
    const data = response.data.data;
    let htmlSlider = '';
    data.map((item) => {
      htmlSlider += /*html*/ `
    <div class="swiper-slide">
        <a
            href="detail.html?id=${item.id}"
            class="img-bg d-flex align-items-end"
            style="
            background-image: url('${item.thumb}');
            "
        >
            <div class="img-bg-inner">
            <h2>
                ${item.title}
            </h2>
            <p>
                ${item.description}
            </p>
            </div>
        </a>
    </div>`;
    });
    elArticlesSlider.innerHTML = htmlSlider;
  });

// =================================================FUNC============================================================
function renderArticlesTrending(item, index) {
  return /*html */ `
    <li>
        <a href="detail.html?id=${item.id}">
            <span class="number">${index + 1}</span>
            <h3>${item.title}</h3>
            <span class="author">${item.author}</span>
        </a>
    </li>`;
}

function renderNewArticlesLarge(item) {
  const publishDate = dayjs(item.publish_date).fromNow();
  return /*html */ `
    <div class="post-entry-1 lg">
        <a href="detail.html?id=${item.id}">
            <img
                src="${item.thumb}"
                alt="${item.title}"
                class="img-fluid"
            />
        </a>
        <div class="post-meta">
            <span class="date">${item.category.name}</span>
            <span class="mx-1">&bullet;</span> <span>${publishDate}</span>
        </div>
        <h2>
        <a href="detail.html?id=${item.id}"
            >${item.title}</a
        >
            </h2>
            <p class="mb-4 d-block">
            ${item.description}
            </p>

        <div class="d-flex align-items-center author">
        <div class="photo">
            <img
            src="assets/img/person-1.jpg"
            alt=""
            class="img-fluid"
            />
        </div>
        <div class="name">
            <h3 class="m-0 p-0">${item.author}</h3>
        </div>
        </div>
    </div>
`;
}

function renderNewArticles(item) {
  const publishDate = dayjs(item.publish_date).fromNow();
  return /*html */ `
    <div class="col-lg-6">
      <div class="post-entry-1">
        <a href="detail.html?id=${item.id}"
          ><img
            src="${item.thumb}"
            alt="${item.title}"
            class="img-fluid"
        /></a>
        <div class="post-meta">
          <span class="date">${item.category.name}</span>
          <span class="mx-1">&bullet;</span>
          <span>${publishDate}</span>
        </div>
        <h2>
          <a href="detail.html?id=${item.id}"
            >${item.title}</a
          >
        </h2>
      </div>
    </div>`;
}

function renderCategoryArticlesTitle(name, item) {
  return /*html */ `
    <div
    class="section-header d-flex justify-content-between align-items-center mb-5">
        <h2>${name}</h2>
        <div>
            <a href="category.html?id=${item.id}" class="more">See All ${name}</a>
        </div>
    </div>`;
}

function renderCategoryArticlesLeftRight(articles, categoryName, idx, item) {
  const publishDate = dayjs(item.publish_date).fromNow();
  let htmlArticlesLeft = '';
  let htmlArticlesRight = '';
  articles.map((article, index) => {
    const thumb = article.thumb;
    const title = article.title;
    const date = article.publish_date;
    const author = article.author;
    if (index < 4) {
      htmlArticlesLeft += /*html */ `
          <div class="col-lg-6">
                <div class="post-entry-1">
                    <a href="detail.html?id=${article.id}"
                    ><img
                        src="${thumb}"
                        alt="${title}"
                        class="img-fluid"
                    /></a>
                    <div class="post-meta">
                    <span class="date">${categoryName}</span>
                    <span class="mx-1">&bullet;</span>
                    <span>${publishDate}</span>
                    </div>
                    <h2>
                    <a href="detail.html?id=${article.id}"
                        >${title}</a
                    >
                    </h2>
                </div>
            </div>`;
    } else {
      htmlArticlesRight +=
        /*html*/
        `<div class="post-entry-1 border-bottom">
                <div class="post-meta">
                <span class="date">${categoryName}</span>
                <span class="mx-1">&bullet;</span> <span>${publishDate}</span>
                </div>
                <h2 class="mb-2">
                <a href="detail.html?id=${article.id}"
                    >${title}</a
                >
                </h2>
                <span class="author mb-3 d-block">${author}</span>
            </div>`;
    }
  });
  let rowClass = 'flex-row-reverse';
  let borderClass = '';
  if (idx % 2 === 0) {
    rowClass = '';
    borderClass = 'border-start custom-border';
  }
  return /*html*/ `
    <div class="row g-5 ${rowClass}">
        <div class="col-lg-8">
            <div class="row g-5">
                ${htmlArticlesLeft}    
            </div>
        </div>
        <div class="col-lg-4 ${borderClass}">
            ${htmlArticlesRight}
        </div>
    </div>`;
}
