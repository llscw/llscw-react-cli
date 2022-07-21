import Koa from "koa"
import Router from "koa-router"
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import AppMain from './app'
import StyleContext from 'isomorphic-style-loader/StyleContext'

const router = new Router()
const app = new Koa();

function getHtmlData(ctx) {
  const css = new Set() // CSS for all rendered React components
  const insertCss = (...styles) => styles.forEach(style => {
    return css.add(style._getCss())
  })

  const rendered = ReactDOMServer.renderToString(
    <StyleContext.Provider value={{ insertCss }}>
      <AppMain url={ctx.url} />
    </StyleContext.Provider>
  )

  const html = `
    <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <style>${[...css].join('')}</style>
      </head>
      <body>
        <div id="app">${rendered}</div>
        <script type="text/javascript" src="http://localhost:3059/client.js"></script>
      </body>
    </html>
  `;

  return html
}

router.get('/', ctx => {
  ctx.body = getHtmlData(ctx)
});

router.get('/test', ctx => {
  ctx.body = getHtmlData(ctx)
});

router.get('/client.js', ctx=>{

})

app.use(router.routes())
app.listen(3000, () => {
  console.log('[0] localhost:3000');
});