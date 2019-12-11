import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import Koa from 'koa';
import serve from 'koa-static'
import Router from 'koa-router';
import App from '../src/App';
import store from '../src/Store/store';

const app = new Koa();
const home = new Router();
const port = process.env.PORT || 9527;
// 这个地方不能使用__dirname，因为index文件在server里面，__dirname获取不到根路径
app.use(serve(process.cwd() + '/public'));

home.get('*', (ctx) => {
    const content = renderToString(
        <Provider store={store}>
            <StaticRouter location={ctx.url}>
                {App}
            </StaticRouter>
        </Provider>
    );
    ctx.body = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>React SSR</title>
    </head>
    <body>
        <div id="root">${content}</div>
        <script src="/bundle.js"></script>
    </body>
    </html>
    `;
});

// 挂载路由
app.use(home.routes()).use(home.allowedMethods());

app.listen(port, () => {
    console.log(`启动成功，端口: ${port}`);
});