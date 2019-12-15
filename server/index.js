import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter, matchPath, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import Koa from 'koa';
import serve from 'koa-static'
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import routes from '../src/App';
import axios from 'axios';
import { getServerStore } from '../src/Store/store';
import Header from '../src/Components/Header';

const app = new Koa();
const router = new Router();
const port = process.env.PORT || 9527;
const store = getServerStore();

app.use(bodyParser({
    enableTypes: ['json', 'form', 'text']
}));
// 这个地方不能使用__dirname，因为index文件在server里面，__dirname获取不到根路径
app.use(serve(process.cwd() + '/public'));

router.get('*', async (ctx) => {

    // 设置api反向代理
    if (ctx.url.startsWith('/api')) {
        // console.log('ctx.url', ctx.url);
        const { method, url } = ctx;
        const baseUrl = 'http://localhost:9093';

        const res = await axios({
            method,
            url: `${baseUrl}${url}`
        });

        return ctx.body = res.data;
    }

    // 存储网络请求
    const promises = [];
    routes.some(route => {
        const match = matchPath(ctx.path, route);
        if (match) {
            const { loadData } = route.component;
            if (loadData) {
                promises.push(loadData(store));
            }
        }
    });

    // 捕获错误，某个接口不正常时不影响其它接口
    try {
        await Promise.all(promises);
    } catch (error) {
        console.log('error', error);
        // 可以在这里记录错误日志
    }

    const content = renderToString(
        <Provider store={store}>
            <StaticRouter location={ctx.url}>
                <Header />
                {routes.map(route => (
                    <Route {...route} />
                ))}
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
        <script>
            window.__context=${JSON.stringify(store.getState())};
        </script>
        <script src="/bundle.js"></script>
    </body>
    </html>
    `;
});

// 挂载路由
app.use(router.routes()).use(router.allowedMethods());

app.listen(port, () => {
    console.log(`启动成功，端口: ${port}`);
});