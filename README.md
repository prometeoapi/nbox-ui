# Welcome to Remix!

- 📖 [Remix docs](https://remix.run/docs)

## Development

Run the dev server:

```shellscript
npm run dev
```

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying Node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `npm run build`

- `build/server`
- `build/client`

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever css framework you prefer. See the [Vite docs on css](https://vitejs.dev/guide/features.html#css) for more information.

## reference
- [radix-ui](https://www.radix-ui.com)
- [remix js](https://remix.run/docs/en/main)
- [shadcn ui](https://ui.shadcn.com/docs)
- [tailwindcss](https://tailwindcss.com/docs/installation)
- [Remix Guide](https://remix.guide)

## ToDo
- [ ] entry search component
- [ ] alert to add / update / delete
- [ ] variables usadas
- [ ] enable delete. mostrar todos los servicios q usan la variable 


## run on docker
```shell
docker build -f Dockerfile -t nbox-ui:runner --target runner .
docker run --network host -e COOKIE_SECRET=1234567890plmnhytgvfredcxswqaz -e BASE_URL=http://127.0.0.1:7337 -p 3000:3000 -it nbox-ui:runner
```
