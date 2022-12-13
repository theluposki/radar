import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'
import { config } from "./js/config.js";

const { publishableKey, userId, metadata, description } = config

Radar.initialize(publishableKey);
Radar.setUserId(userId);
Radar.setMetadata(metadata);
Radar.setDescription(description);



createApp({
  data() {
    return {
      message: 'Hello Vue!',
      dataLocation: {}
    }
  },
  mounted() {
    this.initializeRadar()
  },
  methods: {
    initializeRadar() {
        const vm = this
        
        Radar.trackOnce(function(err, result) {
            if (!err) {
                const latitude = result.location.latitude
                const longitude = result.location.longitude

                const logLat = [latitude, longitude]

                vm.getCurrencyLocation()

                vm.dataLocation = {
                  id: result.user.userId,
                  ip: result.user.ip,
                  location: logLat,
                  deviceType: result.user.deviceType
                }
            } else {
              console.log(err)
            }
        
        });
    },
    getCurrencyLocation() {
      const vm = this
      const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      };
      
      function success(pos) {
        const crd = pos.coords;
      
        console.log('Sua posição atual é:');
        console.log('Latitude : ' + crd.latitude);
        console.log('Longitude: ' + crd.longitude);
        console.log('Mais ou menos ' + crd.accuracy + ' metros.');

        const logLat = [crd.latitude, crd.longitude]
        vm.generateMap(logLat)
      };
      
      function error(err) {
        console.warn('ERROR(' + err.code + '): ' + err.message);
      };
      
      navigator.geolocation.getCurrentPosition(success, error, options);
    },
    generateMap(logLat) {
      const map = L.map('map').setView(logLat, 13);

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);

      L.marker(logLat).addTo(map)
              .bindPopup('Voçê está aqui. <br> 😁😁😁😁😁😁')
              .openPopup();
    },
    formatDate(date) {
      return new Intl.DateTimeFormat('pt-br', { 
        dateStyle: 'full', 
        timeStyle: 'long', 
        timeZone: 'America/Sao_Paulo' }).format(date)
    }
  }
}).mount('#app')