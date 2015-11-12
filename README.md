# leaflet-wunderground-layer
Leaflet map layer for showing radar and satellite data from Weather Underground

To use this add a reference to the `wunderground.layer.js` file then you can add it to your map

```js
L.Wunderground.radar(
  {
    appId: 'YOUR_APP_ID',
    apiRef: '*YOUR_REF_ID'
  }).addTo(map);
```

To get an app/ref Id you can go to http://www.wunderground.com/weather/api/ to sign up for a free account

![Example image](example.png)

#### Options

| Option  | Purpose |
| ------------- | ------------- |
| appId  | Required to identify your code to the wunderground API  |
| refId  | Used to identify your app for referrals  |
| opacity| Change opacity of layer, default is `0.35` |
