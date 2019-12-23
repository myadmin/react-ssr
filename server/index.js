import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter, matchPath, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { resolve } from 'path';
import { readFileSync } from 'fs';
import Koa from 'koa';
import serve from 'koa-static'
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import c2k from 'koa-connect';
import proxy from 'http-proxy-middleware';
import routes from '../src/App';
import { getServerStore } from '../src/Store/store';
import Header from '../src/Components/Header';

const app = new Koa();
const router = new Router();
const port = process.env.PORT || 9527;
const store = getServerStore();
const apiProxy = proxy({ target: 'http://localhost:9093', changeOrigin: true });

app.use(bodyParser({
    enableTypes: ['json', 'form', 'text']
}));
// 这个地方不能使用__dirname，因为index文件在server里面，__dirname获取不到根路径
app.use(serve(process.cwd() + '/public'));

function csrRender(ctx) {
    // 读取csr文件，返回
    const filename = resolve(process.cwd(), 'public/index.csr.html');
    const html = readFileSync(filename, 'utf-8');
    return ctx.body = html;
}

router.get('*', async (ctx, next) => {

    // 设置api反向代理
    if (ctx.url.startsWith('/api')) {
        app.use(c2k(apiProxy));
        await next();
    }

    if (ctx.query._mode === 'csr') {
        console.log('开启csr降级处理');
        return csrRender(ctx);
    }

    // 配置开关开启csr

    // 存储网络请求
    const promises = [];
    routes.some(route => {
        const match = matchPath(ctx.path, route);
        if (match) {
            const { loadData } = route.component;
            // console.log(route, loadData);
            if (loadData) {
                const promise = new Promise((resolve, reject) => {
                    loadData(store).then(resolve).catch(resolve);
                });
                promises.push(promise);
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

    const context = {
        css: []
    };

    const content = renderToString(
        <Provider store={store}>
            <StaticRouter location={ctx.url} context={context}>
                <Header />
                <Switch>
                    {routes.map(route => (
                        <Route {...route} />
                    ))}
                </Switch>
            </StaticRouter>
        </Provider>
    );

    if (context.statusCode) {
        ctx.status = context.statusCode;
    }

    if (context.action === 'REPLACE') {
        ctx.status = 301;
        ctx.redirect(context.url);
    }
    // console.log('context', context);
    // console.log(store.getState());
    const css = context.css.join('\n');
    ctx.body = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>React SSR</title>
        <style>
            ${css}
        </style>
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