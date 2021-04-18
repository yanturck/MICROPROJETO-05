var mqtt = require('mqtt');
var client  = mqtt.connect('mqtt://test.mosquitto.org');

const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// constantes definidas com os nomes dos tópicos utilizados pelo processo
const addItem = 'add-item';
const listarCardapio = 'listar-cardapio';
const excluirItem = 'excluir-item';
const buscarItem = 'buscar-item';
// topicos de resultados dos anteriores
const resultAddItem = 'result-add-item';
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
const resultFinalizar = 'result-finalizar'

const ADMIN = 'admin';
const resultAdmin = 'result-admin';

const cancelar = 'cancelar';
const resultCancelar = 'result-cancelar';

// mensagens de menus
const menu = "Bem-vido ao sFood!\n[V]Para Visualizar o Cardapio\n[P]Para Listar os Pedidos\n[A+IndiceProduto]Para Adicionar um Pedido\nExemplo: A4 (para add o BROTINHO)\n[B+IndiceProduto]Para Buscar Produto\n[E+IndicePedido]Para Excluir um Pedido\n[F]Para Finalizar\n[C]Para cancelar\n[X+Senha]Para Acessar o menu Administrativo (Senha: 123456)\nOu digite M a qualquer momento para ter acesso as opcões.\n"
const menuADM = "Estamos no menu do Administador,\nagora vc pode adicionar [A+NomeItem+Preco]\nExemplo: A+Pastel+3.0\nou deletar [D+IndiceItem] um item do cardapio.\n[V]Para visualizar o cardapio\n[C]Para Sair\nOu digite M a qualquer momento para ter acesso as opcões.\n";
// variavel responsavel para ver se é ADMIN
var admin = false;

client.on('connect', function(){
    console.log(menu);
    rl.addListener('line', line => {
        const aux = line.toUpperCase();
        const comando = aux[0];

        if (admin === false) {
            switch (comando) {
                case 'M': // visualizar menu
                    console.log(menu);
                    break;
                case 'V': // visualizar cardapio
                    client.subscribe(resultListarCardapio, function(err){
                        if (!err) {
                            //console.log('Subscrito no tópico "' + resultListarCardapio + '" com sucesso!');
                            client.publish(listarCardapio, '');
                        }
                    });
                    break;
                case 'P': // visualizar pedidos
                    client.subscribe(resultListarPedido, function (err) {
                        if (!err) {
                            //console.log('Subscrito no tópico "' + resultListarCardapio + '" com sucesso!');
                            client.publish(listarPedidos, '');
                        }
                    });
                    break;
                case 'A': // realizar pedido [A + Indice do Item]
                    var indice = aux.slice(1);
                    client.subscribe(resultAddPedido, function (err) {
                        if (!err) {
                            client.publish(addPedido, indice);
                        }
                    });
                    break;
                case 'E': // excluir pedido [E + Indice do Pedido]
                    indice = aux.slice(1);
                    client.subscribe(resultExcluirPedido, function (err) {
                        if (!err) {
                            client.publish(excluirPedido, indice);
                        }
                    });
                    break;
                case 'B': // busca item [B + Indice do Item]
                    indice = aux.slice(1);
                    client.subscribe(resultBuscarItem, function (err) {
                        if (!err) {
                            client.publish(buscarItem, indice);
                        }
                    });
                    break;
                case 'F': // finalizar
                    client.subscribe(resultFinalizar, function (err) {
                        if (!err) {
                            client.publish(finalizar, '');
                        }
                    });
                    break;
                case 'C': // cancelar compra ou processo
                    client.subscribe(resultCancelar, function (err) {
                        if (!err) {
                            client.publish(cancelar, '');
                        }
                    });
                    break;
                case 'X': // tentando entrar no menu Administrador
                    break;
            }
        }else if (admin === true) {
            const tmp = aux.slice(0,3);

            switch (comando) {
                case 'M': // visualizar menu
                    console.log(menu);
                    break;
                case 'V': // visualizar cardapio
                    break;
                case 'A': // realizar pedido [A + Indice do Item]
                    break;
                case 'D': // deletar item do cardapio [D + Indice do Item]
                    break;
                case 'C': // cancelar processo
                    break;
            }
        }
    });
});

    client.on('message', function (topic, message) {
        switch (topic) {
            case resultListarCardapio:
                var cardapio = '';
                var aux = JSON.parse(message.toString());
                for (var i = 0; i < aux.length; i++){
                    var item = (i+1) + '.' + aux[i].nome + ' - R$ ' + aux[i].preco + '\n';
                    cardapio = cardapio + item;
                }
                console.log("\n>>>> O cardapio do dia é:\n" + cardapio + '\n');
                break;
            case resultListarPedido:
                var pedidos = '';
                var total = 0;
                var aux = JSON.parse(message.toString());
                for (var i = 0; i < aux.length; i++){
                    var item = (i+1) + '.' + aux[i].nome + ' - R$ ' + aux[i].preco + '\n';
                    pedidos = pedidos + item;
                    total = total + aux[i].preco;
                }
                console.log('\n>>>> Os seus pedidos são:\n' +  pedidos + '\nValor total: ' + total + '\n');
                break;
            case resultAddPedido:
                aux = message.toString();
                
                if (aux === 'error') {
                    console.log('\nDesculpe! :*(\nItem não existe!\n');
                }else {
                    var pedido = JSON.parse(aux);
                    console.log('\nPedido: ' + pedido.nome + ' no valor de R$ ' + pedido.preco + ' foi adicionado! :)\nMais alguma coisa? S2\n');
                }
                break;
            case resultExcluirPedido:
                aux = message.toString();

                if (aux === 'error') {
                    console.log('\nDesculpe! :*(\nPedido não existe!\n');
                }else {
                    var excluido = JSON.parse(aux);
                    console.log('\nPedido: ' + excluido[0].nome + ' no valor de R$ ' + excluido[0].preco + ' foi excluido com sucesso! :\\\n');
                }
                break;
            case resultBuscarItem:
                aux = message.toString();

                if (aux === 'error') {
                    console.log('\nDesculpe! :*(\nItem não existe!\n');
                }else {
                    pedido = JSON.parse(aux);
                    console.log('\nItem encontrado: ' + pedido.nome + ' no valor de R$ ' + pedido.preco + '\n');
                }
                break;
            case resultFinalizar:
                pedidos = '';
                total = 0;
                aux = JSON.parse(message.toString());
                for (var i = 0; i < aux.length; i++){
                    var item = (i+1) + '.' + aux[i].nome + ' - R$ ' + aux[i].preco + '\n';
                    pedidos = pedidos + item;
                    total = total + aux[i].preco;
                }
                console.log('\nOK! Compra finalizada! B)\n');
                console.log('\n>>>> Os seus pedidos são:\n' +  pedidos + '\nValor total: ' + total + '\n');
                client.end();
                rl.close();
                break;
            case resultCancelar:
                console.log('\nCompra cancelada! :*(\n');
                client.end();
                rl.close();
                break;
        }
    });