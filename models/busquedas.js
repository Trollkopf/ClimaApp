const fs = require('fs');
const axios = require('axios');

class Busquedas{

    historial = [];
    dbPath= './db/database.json';

    constructor(){
        this.leerDB();
    }

    get historialCapitalizado(){

        return this.historial.map(lugar=>{

            let palabras = lugar.split(' ');
            palabras = palabras.map(p =>p[0].toUpperCase() + p.substring(1));

            return palabras.join(' ');
        });
    }

    get paramsMapbox() {

        return{
            'limit': 5,
            'language': 'es',
            'access_token': process.env.MAPBOX_KEY           
        }
    }

    async ciudad (lugar = ''){

        try {
            
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
                params: this.paramsMapbox
            });

            console.log('Cargando...'.rainbow);
            console.clear();

            const resp = await instance.get();
            
            return resp.data.features.map(lugar =>({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
                

            }))

        } catch (error) {
            return [];      
        }
    }

    get paramsOpenweather() {

        return{
            'units': 'metric',
            'lang': 'es',
            'appid': process.env.OPENWEATHER_KEY
        }
    }

    async climaLugar(lat, long){

        try {
            
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather?lat=${ lat }&lon=${ long }`,
                params: this.paramsOpenweather
            });

            const resp = await instance.get();

            const {weather, main} = resp.data;
                
            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            }

        } catch (error) {
            console.log(error);
        }
    }

    agregarHistorial (lugar =''){
        
        //EVITAMOS DUPLICIDADES
        if (this.historial.includes(lugar.toLocaleLowerCase())){
            return;
        }

        //MANTENEMOS HISTORIAL CON 5 ULTIMAS BÚSQUEDAS
        this.historial = this.historial.splice(0, 5);

        //AÑADIMOS LAS NUEVAS BÚSQUEDAS ARRIBA DE LA LISTA
        this.historial.unshift(lugar.toLocaleLowerCase());

        //grabar en la BD
        this.guardarDB();
    }

    guardarDB(){

        const payload ={
            historial: this.historial
        };

        fs.writeFileSync(this.dbPath, JSON.stringify(payload));

    }

    leerDB(){

        if(!fs.existsSync(this.dbPath)) return;
        
        const info = fs.readFileSync(this.dbPath, {encoding: 'utf-8'});
        const data = JSON.parse(info);

        this.historial = data.historial;

    }

}



module.exports = Busquedas;