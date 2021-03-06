var mqtt = require('mqtt');
var server  = mqtt.connect('mqtt://test.mosquitto.org');

// constantes definidas com os nomes dos tópicos utilizados pelo processo
const addItem = 'add-item';
const listarCardapio = 'listar-cardapio';
const excluirItem = 'excluir-item';
const buscarItem = 'buscar-item';
// topicos de resultados dos anteriores
const resultListarCardapio = 'result-listar-cardapio';
const resultExcluirItem = 'result-excluir-item';
const resultBuscarItem = 'result-buscar-item';

const addPedido = 'add-pedido';
const listarPedidos = 'listar-pedidos';
const excluirPedido = 'excluir-pedido';
const finalizar = 'finalizar';
// topicos de resultados dos anteriores
const resultAddPedido = 'result-add-pedido';
const resultListarPedido = 'result-listar-pedido';
const resultExcluirPedido = 'result-excluir-pedido';
const resultFinalizar = 'result-finalizar';

const ADMIN = 'admin';
const resultAdmin = 'result-admin';

const cancelar = 'cancelar';
const resultCancelar = 'result-cancelar';

var itensCardapio = [{nome: 'PIZZA', preco: 25.00},
                    {nome: 'BROTINHO', preco: 10.00},
                    {nome: 'COXINHA', preco: 4.50},
                    {nome: 'HAMBURGUER', preco: 8.00},
                    {nome: 'LASANHA', preco: 6.00},
                    {nome: 'PASTEL', preco: 3.00},
                    {nome: 'MISTO', preco: 4.00},
                    {nome: 'BOLO DE CHOCOLATE', preco: 19.00},
                    {nome: 'PIZZA DE BRIGADEIRO', preco: 20.00},
                    {nome: 'PUDIM', preco: 15.00},
                    {nome: 'SORVETE', preco: 5.00},
                    {nome: 'AGUA', preco: 1.00},
                    {nome: 'Refrigerante 1L', preco: 2.00}];
var itensPedidos = [];
const senha = '123456';

server.on('connect', function(){
    /* =========================== FUNCOES PARA O CARDAPIO =========================== */
    // o processo subscreve em um tópico e, caso não ocorram erros, imprime uma mensagem na tela
    server.subscribe(addItem, function (err) {
        if (!err) {
            console.log('Subscrito no tópico "' + addItem + '" com sucesso!');
        }
    });
    server.subscribe(listarCardapio, function (err) {
        if (!err) {
            console.log('Subscrito no tópico "' + listarCardapio + '" com sucesso!');
        }
    });
    server.subscribe(excluirItem, function (err) {
        if (!err) {
            console.log('Subscrito no tópico "' + excluirItem + '" com sucesso!');
        }
    });
    server.subscribe(buscarItem, function (err) {
        if (!err) {
            console.log('Subscrito no tópico "' + buscarItem + '" com sucesso!');
        }
    });
    /* =========================== FUNCOES PARA OS PEDIDOS =========================== */
    // o processo subscreve em um tópico e, caso não ocorram erros, imprime uma mensagem na tela
    server.subscribe(addPedido, function (err) {
        if (!err) {
            console.log('Subscrito no tópico "' + addPedido + '" com sucesso!');
        }
    });
    server.subscribe(listarPedidos, function (err) {
        if (!err) {
            console.log('Subscrito no tópico "' + listarPedidos + '" com sucesso!');
        }
    });
    server.subscribe(excluirPedido, function (err) {
        if (!err) {
            console.log('Subscrito no tópico "' + excluirPedido + '" com sucesso!');
        }
    });
    server.subscribe(finalizar, function (err) {
        if (!err) {
            console.log('Subscrito no tópico "' + finalizar + '" com sucesso!');
        }
    });
    /* =========================== CONTROLE DO ADIMINISTRATIVO =========================== */
    // o processo subscreve em um tópico e, caso não ocorram erros, imprime uma mensagem na tela
    server.subscribe(ADMIN, function (err) {
        if (!err) {
            console.log('Subscrito no tópico "' + ADMIN + '" com sucesso!');
        }
    });
    /* ================================= FUNCAO GERAL ==================================== */
    server.subscribe(cancelar, function (err) {
        if (!err) {
            console.log('Subscrito no tópico "' + cancelar + '" com sucesso!');
        }
    });
});

server.on('message', function(topic, message) {
    switch(topic){
        // tópicos do cardapio
        case addItem: // adicionando um Item ao Cardapio
            var item = JSON.parse(message);
            itensCardapio.push(item);
            break;
        case listarCardapio: // mostrando o Cardapio
            server.publish(resultListarCardapio, JSON.stringify(itensCardapio));
            break;
        case buscarItem: // buscando um Item do Cradapio
            var indice = parseInt(message)-1;
            if (indice >= itensCardapio.length || indice === -1) {
                server.publish(resultBuscarItem, 'error');
            }else {
                item = itensCardapio[indice];
                server.publish(resultBuscarItem, JSON.stringify(item));
            }
            break;
        case excluirItem: // excluindo um Item do Cardapio
            indice = parseInt(message)-1;
            if (indice >= itensCardapio.length || indice === -1) {
                server.publish(resultExcluirItem, 'error');
            }else {
                var excluido = itensCardapio.splice(indice,1);
                server.publish(resultExcluirItem, JSON.stringify(excluido))
            }
            break;
        // tópicos dos pedidos
        case addPedido: // adicionando um Pedido
            indice = parseInt(message)-1;
            if (indice >= itensCardapio.length || indice === -1) {
                server.publish(resultAddPedido, 'error');
            }else {
                var pedido = itensCardapio[indice];
                itensPedidos.push(pedido);
                server.publish(resultAddPedido, JSON.stringify(pedido));
            }
            break;
        case listarPedidos: // mostrando os Pedidos
            server.publish(resultListarPedido, JSON.stringify(itensPedidos));
            break;
        case excluirPedido: // excluindo um Pedido
            indice = parseInt(message)-1;
            if (indice >= itensPedidos.length || indice === -1) {
                server.publish(resultExcluirPedido, 'error');
            }else {
                excluido = itensPedidos.splice(indice,1);
                server.publish(resultExcluirPedido, JSON.stringify(excluido));
            }
            break;
        case finalizar: // finalizando
            server.publish(resultFinalizar, JSON.stringify(itensPedidos));
            itensPedidos = [];
            break;
        case cancelar: // cancelando, serve para o Cliente e o Administrador
            server.publish(resultCancelar, '');
            itensPedidos = [];
            break;
        case ADMIN: // verificando Senha
            tmp = message.toString();
            if (tmp === senha) {
                server.publish(resultAdmin, 'true');
            }else {
                server.publish(resultAdmin, 'error');
            }
            break;
    }
});