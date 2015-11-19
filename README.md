# leaflet-wunderground-layer

[![npm](https://img.shields.io/npm/v/leaflet-wunderground.svg)](https://www.npmjs.com/package/leaflet-wunderground)

Leaflet map layer for showing radar and satellite data from Weather Underground

To use this add a reference to the `wunderground.layer.js` file then you can add it to your map

```js
L.Wunderground.radar(
  {
    appId: 'YOUR_APP_ID',
    apiRef: 'YOUR_REF_ID'
  }).addTo(map);
```

To get an app/ref Id you can go to http://www.wunderground.com/weather/api/ to sign up for a free account

[![Example image](https://github.com/davetimmins/leaflet-wunderground-layer/raw/master/example.png)](example)

#### Options

| Option  | Purpose |
| ------------- | ------------- |
| appId   | Required to identify your code to the wunderground API  |
| apiRef  | Used to identify your app for referrals  |
| opacity | Change opacity of layer, default is `0.35` |

### Get It

From here or install using npm

`npm install leaflet-wunderground`

### Can I help to improve it and/or fix bugs?

Absolutely! Please feel free to raise issues, fork the source code, send pull requests, etc.

No pull request is too small. Even whitespace fixes are appreciated.
