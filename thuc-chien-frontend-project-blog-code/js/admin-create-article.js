// access key: 3MHK_KoovsoBoHptbssrwMWXaGtkYQVwrf9ZJDKVwIM
// secret key: DlEuDBfg1FV528O7Y2siby2U6bTv8A-tfU-KsxQravQ

// https://api.unsplash.com/photos/random/?client_id=3MHK_KoovsoBoHptbssrwMWXaGtkYQVwrf9ZJDKVwIM&orientation=landscape
API.callWithToken()
  .get('/auth/me')
  .then((res) => {
    // todo
  })
  .catch((err) => {
    window.location.href = 'index.html';
  });

const elAuthForm = document.getElementById('auth-form');
const elFormMessage = document.getElementById('formMessage');
const elBtnRandomThumb = document.getElementById('btnRandomThumb');
const elThumb = document.getElementById('thumb');
const elThumbPreview = document.getElementById('thumbPreview');

// import {
//   ClassicEditor,
//   Essentials,
//   Bold,
//   Italic,
//   Font,
//   Paragraph,
// } from 'ckeditor5';

ClassicEditor.create(document.querySelector('#content')).catch((error) => {
  console.log();
});

elAuthForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const formData = new FormData(elAuthForm);
  const data = Object.fromEntries(formData);

  API.callWithToken()
    .post('/articles/create', data)
    .then((res) => {
      elFormMessage.innerHTML = '';
      elAuthForm.reset();
      elThumbPreview.src = './assets/img/default.png';
      showToastMessage('Thêm bài viết thành công!');
    })
    .catch((err) => {
      const errors = err.response.data.errors;
      showFormErrorsMessage(errors, elFormMessage);
    });
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

elThumb.addEventListener('change', () => {
  if (elThumb.value) elThumbPreview.src = elThumb.value;
});
