import * as VueGoogleMaps from 'vue2-google-maps';
import config from '../config';

// "async" is optional
export default async ({ /* app, router, Vue, ... */ Vue }) => {
  Vue.use(VueGoogleMaps, {
    load: {
      key: config.googleMapsApiKey,
      libraries: 'places',
    },
  });
}
