const fs = require("fs");

const axios = require("axios");

require("colors");
class Busquedas {
  constructor() {
    //TODO leer DB si existe
    this.historial = [];
    this.dbPath = "./db/database.json";
    this.leerDb();
  }

  get historialCapitalizado() {
    return this.historial.map((lugar) => {
      let palabras = lugar.split(" ");
      palabras = palabras.map((p) => p[0].toUpperCase() + p.substring(1));
      return palabras.join(" ");
    });
  }
  async ciudad(lugar = "") {
    // peticion http

    try {
      const intance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
        params: {
          access_token: process.env.MAPBOX_KEY,
          cachebuster: 1632279108957,
          autocomplete: true,
          limit: 5,
          language: "es",
        },
      });
      const resp = await intance.get();
      return resp.data.features.map((lugar) => ({
        id: lugar.id,
        nombre: lugar.place_name,
        lng: lugar.center[0],
        lat: lugar.center[1],
      }));
    } catch (error) {
      return [];
    }
  }

  async climaLugar(lat, lng) {
    console.log("Se inicio".red);
    try {
      const instance2 = axios.create({
        baseURL: `https://api.openweathermap.org/data/2.5/weather`,
        params: {
          lat,
          lon: lng,
          appid: process.env.OPENWEATHER_KEY,
          units: "metric",
          language: "es",
        },
      });
      const resp = await instance2.get();
      const { weather, main } = resp.data;
      // console.log(resp.data);
      // Instanciar axios .create()
      // Respuesta data
      //

      return {
        desc: weather[0].description,
        min: main.temp_min,
        max: main.temp_max,
        temp: main.temp,
      };
    } catch (error) {
      console.log(error);
    }
  }

  agregarHistorial(lugar = "") {
    // Prevenir duplicados

    if (this.historial.includes(lugar.toLocaleLowerCase())) {
      return;
    }
    this.historial = this.historial.splice(0, 5);
    this.historial.unshift(lugar.toLocaleLowerCase());
    this.guardarDB();
  }
  guardarDB() {
    const payload = {
      historial: this.historial,
    };
    fs.writeFileSync(this.dbPath, JSON.stringify(payload));
  }
  leerDb() {
    if (!fs.existsSync(this.dbPath)) {
      return;
    }
    const info = fs.readFileSync(this.dbPath, { encoding: "utf-8" });
    const data = JSON.parse(info);

    this.historial = data.historial;
  }
}

module.exports = Busquedas;
