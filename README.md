# ws-ardu

Starts a `simple-websocket-server` on port `9300` and logs data to app. You can export the whole data log via the `Export data` button.

Data payload schema

```ts
{
    "t":string, // The sensor "type" or "alias"
    "p":number  // The value to be plotted/logged
}
```

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn electron:serve
```

### Compiles and minifies for production
```
yarn electron:build
```
