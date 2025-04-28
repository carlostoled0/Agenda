/* eslint-disable no-unused-vars */
const API_KEYS = [
  'AIzaSyD4woIcajNG3LGviPdtjOhoiv8Xq6JosQk',
  'AIzaSyAI-dZaaHSu0wrSWcnviG8wiSDXzaRLxkQ',
  'AIzaSyD7P8uH0cqNS9JptsjGEnWMsNZJ8ICGlC8',
  'AIzaSyDSihIxGbSuWn_8FPp0nCEKWCJCK1kVO98',
  'AIzaSyADIfN-fROrA3lSPfsw0JcDghrT6hAvKZU',
  'AIzaSyArwAbrCcgJe85EgbV86NHjyrygdLATnio',
  'AIzaSyB42pMDI3PUosE8g_1NIA4HDiB-qGYBBeo',
  'AIzaSyCGo2P4YJa7Zoj1_DExFrdFRZrIQmINmvo',
  'AIzaSyA227p4mXn5kG5D7WJu9UFiNhDmSOm7ASY',
  'AIzaSyBLqLiasWEdKNwQSHFHb6Sa7VBGdoAKCtI',
  'AIzaSyB_CIsutc2phv75_IgyUbP6U_KlBlQJBug',
  'AIzaSyAaNzEB2zHYeIyZ8GMwbzNRky1bLSITUf4',
  'AIzaSyDMRF-zTfcYOt4qHVmAbGH5DnhhA8EHif4',
  'AIzaSyBEVTBmnRZDYy08Wub0YkX-dGcuoQhwy2o',
  'AIzaSyA1xNwVW7qdpQoaJMZ_bF9iR0kMlB-5hqo',
  'AIzaSyCsZ_JQilWFeUoPyCWmsjHZShX1LuXGZd8',
  'AIzaSyDuSxe6uw301g_1etuIl5WGvUtj9YknZSI',
  'AIzaSyB453F6OOTIcM70Oh7cHWUwU8p-56H4Z8E',
  'AIzaSyBcDOod-5pTBenuVRWa2l_QBU4NFmPSEU8',
  'AIzaSyCkK9cufeRChwUQ_QL48ekEafHqBaoZeAY'
];
let currentKeyIndex = 0;
function getApiKey() {
  const key = API_KEYS[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
  return key;
}