API.callWithToken()
  .get('/auth/me')
  .then((res) => {
    // todo
  })
  .catch((err) => {
    window.location.href = 'index.html';
  });

let editor;

ClassicEditor.create(document.querySelector('#content'))
  .then((newEditor) => {
    editor = newEditor;
  })
  .catch((error) => {
    console.log();
  });

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = parseInt(urlParams.get('id'));

const elAuthForm = document.getElementById('auth-form');
const elFormMessage = document.getElementById('formMessage');
const elBtnRandomThumb = document.getElementById('btnRandomThumb');
const elThumb = document.getElementById('thumb');
const elThumbPreview = document.getElementById('thumbPreview');
const elTitle = document.getElementById('title');
const elCategoryId = document.getElementById('category_id');
const elDescription = document.getElementById('description');
const elContent = document.getElementById('content');

elThumb.addEventListener('change', () => {
  if (elThumb.value) elThumbPreview.src = elThumb.value;
});

elAuthForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const formData = new FormData(elAuthForm);
  const data = Object.fromEntries(formData);

  API.callWithToken()
    .put(`/articles/${id}`, data)
    .then((res) => {
      showToastMessage('Cập nhật bài viết thành công');
      setTimeout(() => {
        window.location.href = 'admin-list-article.html';
      }, 2000);
    })
    .catch((err) => {
      const errors = err.response.data.errors;
      showFormErrorsMessage(errors, elFormMessage);
    });
});

console.log(id);

API.call()
  .get(`articles/${id}`)
  .then((res) => {
    console.log(res);

    const article = res.data.data;
    elThumb.value = article.thumb;
    elThumbPreview.src = article.thumb;
    elTitle.value = article.title;
    elCategoryId.value = article.category_id;
    elDescription.value = article.description;
    elContent.value = article.content;
    editor.setData(article.content);
  })
  .catch(function (error) {
    window.location.href = 'index.html';
    console.log(error);
  });

elBtnRandomThumb.addEventListener('click', () => {
  API.call()
    .get(
      'https://api.unsplash.com/photos/random/?client_id=3MHK_KoovsoBoHptbssrwMWXaGtkYQVwrf9ZJDKVwIM&orientation=landscape'
    )
    .then((res) => {
      const urlThumb = res.data.urls.regular;
      elThumb.value = urlThumb;
      elThumbPreview.src = urlThumb;
    });
});
