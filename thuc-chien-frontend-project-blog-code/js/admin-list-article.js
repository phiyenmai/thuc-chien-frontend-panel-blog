API.callWithToken()
  .get('/auth/me')
  .then((res) => {
    // todo
  })
  .catch((err) => {
    window.location.href = 'index.html';
  });

const elArticles = document.getElementById('articles');

elArticles.addEventListener('change', (e) => {
  const el = e.target;
  if (el.classList.contains('category')) {
    console.log(el);

    const categoryId = el.value;
    const articleId = el.dataset.id;
    API.callWithToken()
      .patch(`articles/${articleId}`, { category_id: categoryId })
      .then((res) => {
        showToastMessage('Thay đổi danh mục bài viết thành công!');
      });
  }
  if (el.classList.contains('chk-status')) {
    const status = el.checked ? 1 : 0;
    const articleId = el.dataset.id;
    API.callWithToken()
      .patch(`articles/${articleId}`, { status })
      .then((res) => {
        console.log(res);
        showToastMessage('Thay đổi trạng thái bài viết thành công!');
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

elArticles.addEventListener('click', (e) => {
  const el = e.target;
  if (el.classList.contains('delete-article')) {
    const result = confirm('Bạn có chắc muốn xóa bài viết này?');
    if (result) {
      const articleId = el.dataset.id;
      API.callWithToken()
        .delete(`articles/${articleId}`)
        .then((res) => {
          showToastMessage('Xóa bài viết thành công!');
          el.parentElement.parentElement.remove();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
});

API.callWithToken()
  .get('/articles/my-articles')
  .then((res) => {
    const articles = res.data.data;
    let html = '';

    articles.map((item, index) => {
      const checked = item.status === '1' ? 'checked' : '';
      html += /*html*/ `
        <tr>
    <td>${item.id}</td>
    <td>
        <img src="${item.thumb}" width="150px"/>
    </td>
    <td>${item.title}</td>
    <td>
        ${renderSlbCategory(item.category.id, item.id)}
    </div></td>
    <td>
        <div class="form-check form-switch">
        <input
            class="form-check-input chk-status"
            type="checkbox"
            id="mySwitch"
            name="darkmode"
            value="yes"
            data-id="${item.id}"
            ${checked}
        />
        <label class="form-check-label" for="mySwitch"
            >Kích hoạt</label
        >
        </div>
    </td>
    <td>
        <a class="btn btn-info" href="detail.html?id=${item.id}">View</a>
        <a class="btn btn-warning" href="admin-update-article.html?id=${item.id}">Edit</a>
        <a class="btn btn-danger delete-article" data-id="${item.id}">Delete</a>
    </td>
    </tr>
        `;
    });

    elArticles.innerHTML = html;
  });

function renderSlbCategory(id, categoryId) {
  let html = '';
  const categories = [
    { id: 1, name: 'Thế Giới' },
    { id: 2, name: 'Thời Sự' },
    { id: 3, name: 'Kinh Doanh' },
    { id: 5, name: 'Giải Trí' },
    { id: 6, name: 'Thể Thao' },
    { id: 7, name: 'Pháp Luật' },
    { id: 8, name: 'Giáo Dục' },
    { id: 9, name: 'Sức Khỏe' },
    { id: 10, name: 'Đời Sống' },
    { id: 11, name: 'Du Lịch' },
    { id: 12, name: 'Khoa Học' },
    { id: 13, name: 'Số Hóa' },
    { id: 14, name: 'Xe' },
  ];
  categories.map((item) => {
    const selected = item.id === id ? 'selected' : '';
    html += ` <option value="${item.id}" ${selected} >${item.name}</option>`;
  });
  return /*html */ ` 
    <select
    class="form-select category"
    id="category_id"
    name="category_id"
    data-id="${categoryId}"
  >
   ${html}
  </select>`;
}
