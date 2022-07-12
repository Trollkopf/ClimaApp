const inquirer = require('inquirer');
const colors = require('colors/safe');
require('colors');

const preguntas = [
    {
        type: 'list',
        name: 'opcion',
        pageSize: 4,
        message: '¿Que desea hacer?',
        choices: [
            {
                value: 1,
                name: `${colors.red.bold('1.')} Buscar ciudad `
            },
            {
                value: 2,
                name: `${colors.red.bold('2.')} Historial `
            },
            {
                value: 0,
                name: `${colors.red.bold('0.')} Salir \n`
            },
        ]
    }
];


const inquirerMenu = async()=>{

    console.clear();
        
        console.log(colors.green(" ======================= "));
        console.log(colors.white("  Seleccione una opción  "));
        console.log(colors.green(" ======================= \n"));

        const {opcion} = await inquirer.prompt(preguntas);

        return opcion;
}

const pausa = async()=>{

    const pausaInput = [
        {
            type: 'input',
            name: 'pausa',
            message: `Presione ${colors.blue.bold('Enter')} para continuar`
        }
    ]

    console.log('\n');
    await inquirer.prompt(pausaInput);

}

const leerInput = async(message)=>{

    const question = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate(value){
                if(value.length === 0){
                    return 'Por favor, ingrese un valor.';
                }
                return true;
            }
        }
    ];

    const {desc} = await inquirer.prompt(question);
    return desc;
}

const listarLugares = async( lugares = [])=>{

    const choices = lugares.map( (lugar, i) =>{

        const idx = `${i+1}.`.green;

        return {
            value: lugar.id,
            name: `${idx} ${lugar.nombre}`
        }
    });

    choices.unshift({
        value: '0',
        name: '0.'.green + 'Cancelar'
    })

    const preguntas = [
        {
            type: 'list',
            pageSize: 6,
            name: 'id',
            message: 'Seleccione lugar:',
            choices
        }
    ]

    const { id } = await inquirer.prompt(preguntas);
    return id;

}

module.exports={
    inquirerMenu,
    pausa,
    leerInput,
    listarLugares,    

}