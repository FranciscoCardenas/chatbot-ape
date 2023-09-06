const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')
const MetaProvider = require('@bot-whatsapp/provider/meta')
const JsonFileAdapter = require('@bot-whatsapp/database/json')

function log(numero,mensaje,msg_bot,accion,opcion){
  const url = 'https://nuevo.apexdeape.com.mx/ords/apeppdb1/xxschema_contratos/ar1/v1/mensajes-chatbot';
  const headerslog = new Headers();
  headerslog.append('NUMERO', numero);
  headerslog.append('MENSAJE', mensaje);
  headerslog.append('MSG_BOT', msg_bot);
  headerslog.append('ACCION', accion);
  headerslog.append('OPCION', opcion);
  
  fetch(url, {
    method: 'POST', // Cambia a 'GET' si necesitas una solicitud GET
    headers: headerslog,
    body: JSON.stringify({}),
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

// Opcion 1
const RespuestaNO= addKeyword(['NO, GRACIAS', ]).addAnswer(['Que tengas un excelente dia'])
const NumeroCliente = addKeyword(['1',  ]).addAnswer(
    [
        'Por favor ingresa tu Rfc',   
    ],
    {capture:true},
    ((ctx,{flowDynamic,fallBack}) =>{

      log(ctx.from,ctx.body,'Por favor ingresa tu Rfc','CONSULTA DEL NUMERO DEL CLIENTE','1')

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
        //log(ctx.from,ctx.body,'No se encontraron datos del RFC *'+ ctx.body+'*','CONSULTA DEL NUMERO DEL CLIENTE','1')

      }else{ 
        flowDynamic([{body:'Tu numero de cliente es *'+data.items[0].cliente_id+'*, ¿Algo mas en lo que podemos ayudarte?', buttons: [{ body: 'SI, POR FAVOR' }, { body: 'NO, GRACIAS' }]}],null,null,[RespuestaNO])
        //log(ctx.from,ctx.body,'Tu numero de cliente es *'+data.items[0].cliente_id+'*','CONSULTA DEL NUMERO DEL CLIENTE','1')      
      
      }

          })
          .catch(error => {
          console.log(error.name)
          if(error.name='SyntaxError'){
            flowDynamic([{body:'Formato no valido,¿Algo mas en lo que podemos ayudarte?', buttons: [{ body: 'SI, POR FAVOR' }, { body: 'NO, GRACIAS' } ],}],null,null,[RespuestaNO])
         //   log(ctx.from,ctx.body,'Formato no valido','CONSULTA DEL NUMERO DEL CLIENTE','1')   
          }
          });
        }), [RespuestaNO]
)




//Opcion 2

const InformacionContrato = addKeyword(['2']).addAnswer(
    [
        'Ingresa tu numero de Cliente', 
    ],
{capture:true},
       
((ctx,{flowDynamic,fallBack}) =>{

 
    log(ctx.from,ctx.body,'Ingresa tu numero de Cliente','CONSULTA INFORMACION DE TUS CONTRATOS','2')

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
    //log(ctx.from,ctx.body,'No se encontraron datos del numero de cliente *'+ ctx.body+'*','CONSULTA INFORMACION DE TUS CONTRATOS','2')
  }else{ 

//console.log(data.items[0]);
    for(i=0;i<data.items.length;i++){
      
       
       flowDynamic([{body: 'Contrato : *'+data.items[i]['numero de contrato']+'* Saldo *'+data.items[i].suma.split(/\s+/).join('')+
       '* \nTermino Vigencia: *'+data.items[i].vigencia_final.split(/\s+/).join(' ')+
       '*  \nRenovación: *'+data.items[i].vigencia_inicial.split(/\s+/).join(' ')+'*' }])

   
       if (i === data.items.length - 1) {
        setTimeout(() => {
            flowDynamic([{body:'¿Algo mas en lo que podemos ayudarte?', buttons: [{ body: 'SI, POR FAVOR' }, { body: 'NO, GRACIAS' }]}]) 
          //  log(ctx.from,ctx.body,'Se le dio correctamente la informacion','CONSULTA INFORMACION DE TUS CONTRATOS','2')
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
        //log(ctx.from,ctx.body,'Formato no valido','CONSULTA INFORMACION DE TUS CONTRATOS','2')
      }
      });
}),
    [RespuestaNO]
)


//Opcion 3
const RespuestaSaldo = addKeyword(['saldo', 'siguiente']).addAnswer(['En este momento tu saldo actual es de :'])
const SaldoContrato = addKeyword(['3']).addAnswer(
    [
        'Por favor Ingresa tu numero de contrato',
    ],
    {capture:true},
    ((ctx,{flowDynamic,fallBack}) =>{
      log(ctx.from,ctx.body,'Por favor Ingresa tu numero de contrato','CONSULTAR EL SALDO DE TU CONTRATO','3')
     
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
        //log(ctx.from,ctx.body,'Por favor Ingresa tu numero de contrato','No se encontraron datos del contrato *'+ NUMERO_CONTRATO+'* . Algo mas en lo que podemos ayudarte?','CONSULTAR EL SALDO DE TU CONTRATO','3') 
      }else{ 
        flowDynamic([{body:'El saldo actual del contrato *'+NUMERO_CONTRATO+'* es de *'+data.items[0].suma.split(/\s+/).join('')+'*, ¿Algo mas en lo que podemos ayudarte?', buttons: [{ body: 'SI, POR FAVOR' }, { body: 'NO, GRACIAS' }]}],null,null,[RespuestaNO])
      //  log(ctx.from,ctx.body,'El saldo actual del contrato *'+NUMERO_CONTRATO+'* es de *'+data.items[0].suma.split(/\s+/).join('')+'*','CONSULTAR EL SALDO DE TU CONTRATO','3')    
      }

          })
          .catch(error => {
          console.log(error.name)
          if(error.name='SyntaxError'){
            flowDynamic([{body:'No se encontraron datos del contrato '+NUMERO_CONTRATO+',¿Algo mas en lo que podemos ayudarte?', buttons: [{ body: 'SI, POR FAVOR' }, { body: 'NO, GRACIAS' } ],}],null,null,[RespuestaNO])
           // log(ctx.from,ctx.body,'No se encontraron datos del contrato '+NUMERO_CONTRATO+'','CONSULTAR EL SALDO DE TU CONTRATO','3')    
          }
          });
        }), 
    [RespuestaNO]
)


//Opcion 4
const pagar = addKeyword(['pagar', 'siguiente']).addAnswer(['ficha'])
const PagarContrato = addKeyword(['4']).addAnswer(
    ['Por favor ingresa el numero de tu contrato'],
    {capture:true
      },
    ((ctx,{flowDynamic,fallBack}) =>{
      log(ctx.from,ctx.body,'Por favor ingresa el numero de tu contrato','VISUALIZAR LA FICHA DE PAGO','4')  
      


      var today = new Date();
      var day = today.getDate();
      console.log(day)
if (day >5 ){
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
   //log(ctx.from,ctx.body,'No se encontraron datos del contrato '+ NUMERO_CONTRATO+'','VISUALIZAR LA FICHA DE PAGO','4')  
      
  }else{ 
    //log(ctx.from,ctx.body,'Se le dio correctamente la informacion del '+ NUMERO_CONTRATO+'','VISUALIZAR LA FICHA DE PAGO','4')  
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
   ,buttons: [{ body: 'SI, POR FAVOR' }, { body: 'NO, GRACIAS' }]
  
  }],null,null,[RespuestaNO])}})
    .catch(error => {
    console.log(error.name)
    if(error.name='SyntaxError'){
      flowDynamic([{body:'No se encontraron datos del contrato '+NUMERO_CONTRATO+',¿Algo mas en lo que podemos ayudarte?',  buttons: [{ body: 'SI, POR FAVOR' }, { body: 'NO, GRACIAS' } ],}],null,null,[RespuestaNO])
    
      //log(ctx.from,ctx.body,'No se encontraron datos del contrato '+NUMERO_CONTRATO+'','VISUALIZAR LA FICHA DE PAGO','4')  
    }
    });

}else{
  flowDynamic([{body:'⚠️ Te recordamos que la información de tu(s) contrato(s) estará disponible para consulta a partir del día 6 de cada mes. ¡Gracias por tu comprensión!',  buttons: [{ body: 'SI, POR FAVOR' }, { body: 'NO, GRACIAS' } ],}],null,null,[RespuestaNO])

}


       
        }), 
    [RespuestaNO]
)

//OPCION 5 
const contactoplaza = addKeyword(['5']).addAnswer(
  [
      'Por favor Ingresa tu numero de contrato',
  ],
  {capture:true},
  ((ctx,{flowDynamic,fallBack}) =>{
    log(ctx.from,ctx.body,'Por favor Ingresa tu numero de contratos','HABLAR CON UN ASESOR','5')  
    

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
      //log(ctx.from,ctx.body,'No se encontraron datos del contrato','HABLAR CON UN ASESOR','5')  
    
    
    }else{ 
      flowDynamic([{body:'Para aclacion de dudas comunicate con '+data.items[0].nombre+' al numero '+data.items[0].numero_telefono+' o un correo a la siguiente direccion *'+data.items[0].correo +'*, ¿Algo mas en lo que podemos ayudarte?', buttons: [{ body: 'SI, POR FAVOR' }, { body: 'NO, GRACIAS' }]}],null,null,[RespuestaNO])
      //log(ctx.from,ctx.body,'Para aclacion de dudas comunicate con '+data.items[0].nombre+' al numero '+data.items[0].numero_telefono+' o un correo a la siguiente direccion '+data.items[0].correo +'','HABLAR CON UN ASESOR','5')        
    }

        })
        .catch(error => {
        console.log(error.name)
        if(error.name='SyntaxError'){
          flowDynamic([{body:'No se encontraron datos del contrato '+NUMERO_CONTRATO+',¿Algo mas en lo que podemos ayudarte?', buttons: [{ body: 'SI, POR FAVOR',  }, { body: 'NO, GRACIAS' } ],}],null,null,[RespuestaNO])
         // log(ctx.from,ctx.body,'No se encontraron datos del contrato ','HABLAR CON UN ASESOR','5')        
  
        }
        });
      }), 
  [RespuestaNO]
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
        [NumeroCliente, InformacionContrato, SaldoContrato, PagarContrato,contactoplaza,RespuestaNO]
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

/*
// pruebas
const adapterProvider = createProvider(MetaProvider, {
  jwtToken: 'EAALnj1ahRWsBO5qq7mtLo59R7SUuXgqTWFEVtfEtcU1pyHPlvXQE0dsjQqkDk6jivgkAUKFV9c72XW2h3AkoZBkhPXMlodT5AOY7rekGZBlBZBlZA8lBt5ZBFHenwmQAkTnIZAKV78PpIUW0O5H8jqtoMGN6GSExU7z1S0cuRImX4YqQcc5m3wtEqvMZBZAqKfaYUKJ5BVCFGQyCInJM4iXBPLH1CSehXEMRKHBcIf0ZCgT8ZD',
  numberId: '102089836052786',
  verifyToken: 'LO_QUE_SEA',
  version: 'v17.0',
})*/


    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })
}
main()

 
