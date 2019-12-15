const Koa = require('koa');
const Router = require('koa-router');
const cors = require('@koa/cors');

const app = new Koa();
const router = new Router();
const port = process.env.PORT || 9093;

// app.use(cors());

router.get('/api/course/list', async ctx => {
    ctx.body = {
        code: 0,
        list: [
            { name: 'web全栈工程师', id: 1 },
            { name: 'js高级工程师', id: 2 },
            { name: 'web初级工程师', id: 3 },
            { name: 'Java架构工程师', id: 4 },
        ]
    }
});

router.get('/api/user/info', async ctx => {
    ctx.body = {
        code: 0,
        userinfo: {
            name: 'react',
            best: 'wechat'
        }
    }
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(port, () => {
    console.dir(`mock 启动在${port}`);
});
