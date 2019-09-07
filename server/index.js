const express = require('express');
const path = require('path');

const app = new express();

app.set('view engine', 'pug');
app.set('views', path.resolve(__dirname, './views'));

if (process.env.NODE_ENV === 'development') {
  app.use(
    async (req, res, next) => {
      if (/hot-update/.test(req.url)) {
        // 重定向到webpack dev server
        console.log('redirect: ', `http://localhost:4000${req.url}`);
        res.redirect(301, `http://localhost:4000${req.url}`);
      } else {
        next();
      }
    }
  )
}

app.use('/static', express.static('./dist/static'));

app.get('*', (req, res) => {
  res.render('index', {
    title: 'Hey', message: 'Hello there!'
  });
})

app.listen('3001', () => {
  console.log('监听3001端口');
})