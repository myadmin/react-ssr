const Koa = require('koa');
const Router = require('koa-router');
const puppeteer = require('puppeteer');

const app = new Koa();
const router = new Router();
const port = process.env.PORT || 9001;

async function test() {
    console.log('截图');
    const browser = await puppeteer.launch();
    const page = await browser.newPage()
    await page.goto('https://www.neat-reader.cn');
    await page.screenshot({path: 'neat.png'});
    await browser.close();
}
// test();

const urlCache = {};
router.get('*', async (ctx, next) => {
    console.log(ctx.url);
    const url = 'http://localhost:9527' + ctx.url;
    if (urlCache[url]) {
        return ctx.body = urlCache;
    }
    const browser = await puppeteer.launch();
    const page = await browser.newPage()
    await page.goto(url, {
        waitUntil: ['networkidle0']
    });
    
    const html = await page.content();
    urlCache[url] = url;
    console.log(html);
    ctx.body = html;
});

// 挂载路由
app.use(router.routes()).use(router.allowedMethods());

app.listen(port, () => {
    console.log(`ssr server start: ${port}`);
});