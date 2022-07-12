require('dotenv').config();

const { leerInput, inquirerMenu, pausa, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");

const main =async()=>{

    const busquedas = new Busquedas();
    let opt;

    do {
        opt = await inquirerMenu();

        switch(opt){
            case 1: 
                    // Mostrar Mensaje
                    const termino = await leerInput('Ciudad: ');
                    // Buscar Lugares
                    const lugares = await busquedas.ciudad(termino);
                    // Seleccionar lugar
                    const idSeleccionado = await listarLugares(lugares);
                    if( idSeleccionado === '0') continue;
                    const lugarSeleccionado = lugares.find( l => l.id === idSeleccionado);
                    //Agregar a DB
                    busquedas.agregarHistorial(lugarSeleccionado.nombre);
                    // Clima
                    const clima = await busquedas.climaLugar(lugarSeleccionado.lat, lugarSeleccionado.lng);
                    // Mostrar resultados
                    console.clear();
                    console.log(`\nInformación de la ciudad\n`.green.underline);
                    console.log('Ciudad:',  lugarSeleccionado.nombre);
                    console.log('Lat:', lugarSeleccionado.lat);
                    console.log('Lng:', lugarSeleccionado.lng);
                    console.log('Estado del cielo:', (clima.desc).green)
                    console.log('Temperatura:', clima.temp );
                    console.log('Mínima:', clima.min);
                    console.log('Máxima:', clima.max);
                ; break;
            case 2: 
                busquedas.historialCapitalizado.forEach((lugar, i)=>{

                        const idx = `${i + 1}.`.green;
                        console.log(`${idx} ${lugar}`);

                })
            
            ; break;     
        }

        if(opt !== 0) await pausa();

    } while (opt !== 0);    
        
}

main();