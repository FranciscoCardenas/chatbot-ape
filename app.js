const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')
const MetaProvider = require('@bot-whatsapp/provider/meta')
const JsonFileAdapter = require('@bot-whatsapp/database/json')

// Opcion 1
const RespuestaNO= addKeyword(['NO, GRACIAS', ]).addAnswer(['Que tengas un excelente dia'])
const NumeroCliente = addKeyword(['1',  ]).addAnswer(
    [
        'Por favor ingresa tu Rfc',   
    ],
    {capture:true},
    ((ctx,{flowDynamic,fallBack}) =>{
        const RFC =String(ctx.body).toUpperCase();  
        const apiUrl = 'https://nuevo.apexdeape.com.mx/ords/apeppdb1/xxschema_contratos/ar1/v1/RFC';
        // Configurar los headers
        const headers = new Headers();
        headers.append('RFC', RFC);
        // Configurar la solicitud
        const requestOptions = {
          method: 'GET',
          headers: headers,
        };
        // Hacer la solicitud
        fetch(apiUrl, requestOptions)
          .then(response => response.json())
          .then(data => { 
       if(data.items.length==0){
        flowDynamic([{body:'No se encontraron datos del RFC *'+ ctx.body+'* . Algo mas en lo que podemos ayudarte?', buttons: [{ body: 'SI, POR FAVOR' }, { body: 'NO, GRACIAS' } ]}],null,null,[RespuestaNO])
       }else{ 
        flowDynamic([{body:'Tu numero de cliente es *'+data.items[0].cliente_id+'*, ¿Algo mas en lo que podemos ayudarte?', buttons: [{ body: 'SI, POR FAVOR' }, { body: 'NO, GRACIAS' }]}],null,null,[RespuestaNO])
            }

          })
          .catch(error => {
          console.log(error.name)
          if(error.name='SyntaxError'){
            flowDynamic([{body:'Formato no valido,¿Algo mas en lo que podemos ayudarte?', buttons: [{ body: 'SI, POR FAVOR' }, { body: 'NO, GRACIAS' } ],}],null,null,[RespuestaNO])
          }
          });
        }), 
)




//Opcion 2

const InformacionContrato = addKeyword(['2']).addAnswer(
    [
        'Ingresa tu numero de Cliente', 
    ],
{capture:true},
       
((ctx,{flowDynamic,fallBack}) =>{
    const CLIENTE_ID =parseInt(ctx.body, 10);  
    const apiUrl = 'https://nuevo.apexdeape.com.mx/ords/apeppdb1/xxschema_contratos/ar1/v1/Ficha_Pago_w';
    // Configurar los headers
    const headers = new Headers();
    headers.append('CLIENTE_ID', CLIENTE_ID);
    // Configurar la solicitud
    const requestOptions = {
      method: 'GET',
      headers: headers,
    };
    // Hacer la solicitud
    fetch(apiUrl, requestOptions)
      .then(response => response.json())
      .then(data => {
   if(data.items.length==0){
    flowDynamic([{body:'No se encontraron datos del numero de cliente *'+ ctx.body+'* . Algo mas en lo que podemos ayudarte?', buttons: [{ body: 'SI, POR FAVOR' }, { body: 'NO, GRACIAS' } ]}])
   }else{ 

//console.log(data.items[0]);
    for(i=0;i<data.items.length;i++){
      
       
       flowDynamic([{body: 'Contrato : *'+data.items[i]['numero de contrato']+'* Saldo *'+data.items[i].suma.split(/\s+/).join('')+
       '* \nTermino Vigencia: *'+data.items[i].vigencia_final.split(/\s+/).join(' ')+
       '*  \nRenovación: *'+data.items[i].vigencia_inicial.split(/\s+/).join(' ')+'*' }])
      
       if (i === data.items.length - 1) {
        setTimeout(() => {
            flowDynamic([{body:'¿Algo mas en lo que podemos ayudarte?', buttons: [{ body: 'SI, POR FAVOR' }, { body: 'NO, GRACIAS' }]}]) 
        }, 3000);
      
    } else {
    }
    }
}
      })
      .catch(error => {
      console.log(error)
      if(error.name='SyntaxError'){
        flowDynamic([{body:'Formato no valido,¿Algo mas en lo que podemos ayudarte?', buttons: [{ body: 'SI, POR FAVOR' }, { body: 'NO, GRACIAS' } ],}])
      }
      });
}),
    
)


//Opcion 3
const RespuestaSaldo = addKeyword(['saldo', 'siguiente']).addAnswer(['En este momento tu saldo actual es de :'])
const SaldoContrato = addKeyword(['3']).addAnswer(
    [
        'Por favor Ingresa tu numero de contrato',
    ],
    {capture:true},
    ((ctx,{flowDynamic,fallBack}) =>{
        const NUMERO_CONTRATO =String(ctx.body).toUpperCase();  
        const apiUrl = 'https://nuevo.apexdeape.com.mx/ords/apeppdb1/xxschema_contratos/ar1/v1//Ficha_Pago_Numero_Contrato';
        // Configurar los headers
        const headers = new Headers();
        headers.append('NUMERO_CONTRATO', NUMERO_CONTRATO);
        // Configurar la solicitud
        const requestOptions = {
          method: 'GET',
          headers: headers,
        };
        // Hacer la solicitud
        fetch(apiUrl, requestOptions)
          .then(response => response.json())
          .then(data => {
           console.log(data.items[0])
       if(data.items.length==0){
        flowDynamic([{body:'No se encontraron datos del contrato *'+ NUMERO_CONTRATO+'* . Algo mas en lo que podemos ayudarte?', buttons: [{ body: 'SI, POR FAVOR' }, { body: 'NO, GRACIAS' } ]}],null,null,[RespuestaNO])
       }else{ 
        flowDynamic([{body:'El saldo actual del contrato *'+NUMERO_CONTRATO+'* es de *'+data.items[0].suma.split(/\s+/).join('')+'*, ¿Algo mas en lo que podemos ayudarte?', buttons: [{ body: 'SI, POR FAVOR' }, { body: 'NO, GRACIAS' }]}],null,null,[RespuestaNO])
            }

          })
          .catch(error => {
          console.log(error.name)
          if(error.name='SyntaxError'){
            flowDynamic([{body:'No se encontraron datos del contrato '+NUMERO_CONTRATO+',¿Algo mas en lo que podemos ayudarte?', buttons: [{ body: 'SI, POR FAVOR' }, { body: 'NO, GRACIAS' } ],}],null,null,[RespuestaNO])
          }
          });
        }), 
    [RespuestaSaldo]
)


//Opcion 4
const pagar = addKeyword(['pagar', 'siguiente']).addAnswer(['ficha'])
const PagarContrato = addKeyword(['4']).addAnswer(
    ['Por favor ingresa el numero de tu contrato'],
    {capture:true
      },
    ((ctx,{flowDynamic,fallBack}) =>{
        const NUMERO_CONTRATO =String(ctx.body).toUpperCase();  
        const apiUrl = 'https://nuevo.apexdeape.com.mx/ords/apeppdb1/xxschema_contratos/ar1/v1//Ficha_Pago_Numero_Contrato';
        
        // Configurar los headers
        const headers = new Headers();
        headers.append('NUMERO_CONTRATO', NUMERO_CONTRATO);
        
        // Configurar la solicitud
        const requestOptions = {
          method: 'GET',
          headers: headers,
        };
        
        // Hacer la solicitud
        fetch(apiUrl, requestOptions)
          .then(response => response.json())
          .then(data => {
            //console.log(data.items[0].cliente_id)
       if(data.items.length==0){
        flowDynamic([{
         body:'No se encontraron datos del contrato *'+ NUMERO_CONTRATO+'* . Algo mas en lo que podemos ayudarte?', buttons: [{ body: 'SI, POR FAVOR' }, { body: 'NO, GRACIAS' } ]}],null,null,[RespuestaNO])
       }else{ 
        flowDynamic([{body:'El saldo actual de tu contrato *'+NUMERO_CONTRATO+'* locales ('+ data.items[0].locales +') es *'+data.items[0].suma.split(/\s+/).join('')+'*. \n \n'
        + 'Para realizar tu pago por *transferencia* \n'
        +'*Banco:* ' + data.items[0].banco.split(/\s+/).join('')+' \n'
        +'*Referencia bancaria :* ' + data.items[0].referencia_bancaria+' \n'
        +'*Clave interbancaria :* ' + data.items[0]['clave interbancaria']+' \n\n'
       
        + 'Para realizar tu pago por *ventanilla* \n'
        +'*Banco:* ' + data.items[0].banco.split(/\s+/).join('')+' \n'
        +'*Referencia bancaria:* ' + data.items[0].ref+' \n'
        +'*Clave servicio:* ' + data.items[0]['clave de servicio']+' \n \n'

       
        +'*Cantidad a pagar :* ' + data.items[0].saldo.split(/\s+/).join('')+' \n'
        +'*Complementos :* ' + data.items[0].total.split(/\s+/).join('')+' \n'
        +'*Total :* ' + data.items[0].suma.split(/\s+/).join('')+' \n \n'+
        '¿Algo mas en lo que te podemos ayudar?'
         ,buttons: [{ body: 'SI, POR FAVOR' }, { body: 'NO, GRACIAS' }]}],null,null,[RespuestaNO])}})
          .catch(error => {
          console.log(error.name)
          if(error.name='SyntaxError'){
            flowDynamic([{body:'No se encontraron datos del contrato '+NUMERO_CONTRATO+',¿Algo mas en lo que podemos ayudarte?',  buttons: [{ body: 'SI, POR FAVOR' }, { body: 'NO, GRACIAS' } ],}],null,null,[RespuestaNO])
          }
          });
        }), 
    [pagar]
)

//OPCION 5 
const contactoplaza = addKeyword(['5']).addAnswer(
  [
      'Por favor Ingresa tu numero de contrato',
  ],
  {capture:true},
  ((ctx,{flowDynamic,fallBack}) =>{
      const NUMERO_CONTRATO =String(ctx.body).toUpperCase();  
      const apiUrl = 'https://nuevo.apexdeape.com.mx/ords/apeppdb1/xxschema_contratos/ar1/v1/contacto_plaza';
      // Configurar los headers
      const headers = new Headers();
      headers.append('NUMERO_CONTRATO', NUMERO_CONTRATO);
      // Configurar la solicitud
      const requestOptions = {
        method: 'GET',
        headers: headers,
      };
      // Hacer la solicitud
      fetch(apiUrl, requestOptions)
        .then(response => response.json())
        .then(data => {
         console.log(data.items[0])
     if(data.items.length==0){
      flowDynamic([{body:'No se encontraron datos del contrato *'+ NUMERO_CONTRATO+'* . Algo mas en lo que podemos ayudarte?', buttons: [{ body: 'SI, POR FAVOR' }, { body: 'NO, GRACIAS' } ]}],null,null,[RespuestaNO])
     }else{ 
      flowDynamic([{body:'Para aclacion de dudas comunicate con '+data.items[0].nombre+' al numero '+data.items[0].numero_telefono+' o un correo a la siguiente direccion *'+data.items[0].correo +'*, ¿Algo mas en lo que podemos ayudarte?', buttons: [{ body: 'SI, POR FAVOR' }, { body: 'NO, GRACIAS' }]}],null,null,[RespuestaNO])
          }

        })
        .catch(error => {
        console.log(error.name)
        if(error.name='SyntaxError'){
          flowDynamic([{body:'No se encontraron datos del contrato '+NUMERO_CONTRATO+',¿Algo mas en lo que podemos ayudarte?', buttons: [{ body: 'SI, POR FAVOR',  }, { body: 'NO, GRACIAS' } ],}],null,null,[RespuestaNO])
        }
        });
      }), 
  
)


const flowPrincipal = addKeyword(['Hola','SI, POR FAVOR','Buen dia','Buenos dias','buenos días','buenas noches','buenas tardes'])
   
    .addAnswer(
        [
            '¡Buen día! Aquí tienes nuestro menú de opciones, Envía el número de la opción que deseas consultar. ',
            '👉 *1* Conocer tu numero de cliente',
            '👉 *2* Consulta la informacion de tus contratos',
            '👉 *3* Consultar el Saldo de tu contrato',
            '👉 *4* Pagar contrato',
            '👉 *5* Hablar con un asesor',
            
        ],{capture:true},
      null 
      ,
        [NumeroCliente, InformacionContrato, SaldoContrato, PagarContrato,contactoplaza]
    ) 

const main = async () => {
    const adapterDB = new JsonFileAdapter()
    const adapterFlow = createFlow([flowPrincipal])

    //Produccion
    const adapterProvider = createProvider(MetaProvider, {
        jwtToken: 'EAAVZCOTzwHAcBO5LjxXJhaQhTiUL3mT56wJo5vsYAmVrgpyeXDC2ooicdJH8iZBGhHU7pHj5Jzg5pqOr3UuEsZCxAyHoxJ65T7ATn4u4SH8akYvowOphVJhTKuHZBN5JPX0rHpWnr9qpnLgNoMYGkPCDn2NNHNkhqDMxJ9rTEtlQQceHDxHvZCfCpLrVL',
        numberId: '119447597909937',
        verifyToken: 'LO_QUE_SEA',
        version: 'v17.0',
    })


// pruebas
/*const adapterProvider = createProvider(MetaProvider, {
  jwtToken: 'EAAMtNDakSugBAHZBWnT2MEyZCb8SZAmkuEOzic6Km0ZBUzX1pts7JQeMOd4gskpSJRehgWgDxF5HAqU6EBFz7lmO9bWWlQzfUv2esZBAFcuUfU3iJsh4CFq26CA9rkHpfWjeiRqOkp4sIPkmPXs6sCGniYhkgmq2eVAlA8NuWHfsxFagKgLVz',
  numberId: '102089836052786',
  verifyToken: 'LO_QUE_SEA',
  version: 'v17.0',
})
*/
    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })
}
main()

 
