require("dotenv").config();
const {
  leerInput,
  inquirerMenu,
  pausa,
  listarLugares,
} = require("./helpers/inquirer");
const Busquedas = require("./models/busqueda");
const main = async () => {
  const busquedas = new Busquedas();
  let opt;

  // console.log(process.env);
  do {
    opt = await inquirerMenu();
    console.log({ opt });
    switch (parseInt(opt)) {
      case 1:
        // Mostrar mensaje
        const termino = await leerInput("Ciudad: ");
        const lugares = await busquedas.ciudad(termino);
        const id = await listarLugares(lugares);
        if (id === "0") continue;

        const lugarSel = lugares.find((l) => l.id === id);

        //Guardar en DB
        busquedas.agregarHistorial(lugarSel.nombre);

        // clima
        const clima = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng);

        console.log("\n Informacion de la ciudad\n".green);
        console.log("Ciudad", lugarSel.nombre);
        console.log("Lat", lugarSel.lat);
        console.log("lng", lugarSel.lng);
        console.log("Temperatura", clima.temp);
        console.log("Minima", clima.min);
        console.log("Maxima", clima.max);
        console.log("Como esta el clima:", clima.desc);
        break;
      case 2:
        busquedas.historialCapitalizado.forEach((lugar, i) => {
          const idx = `${i + 1}`.green;
          console.log(`${idx} ${lugar}`);
        });

        break;
    }

    if (opt !== 0) await pausa();
  } while (opt != 0);
};

main();
