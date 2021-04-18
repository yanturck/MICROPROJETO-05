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
const menu = "\nBem-vido ao sFood!\n[V]Para Visualizar o Cardapio\n[P]Para Listar os Pedidos\n[A+IndiceProduto]Para Adicionar um Pedido\nExemplo: A4 (para add o BROTINHO)\n[B+IndiceProduto]Para Buscar Produto\n[E+IndicePedido]Para Excluir um Pedido\n[F]Para Finalizar\n[C]Para cancelar\n[X+Senha]Para Acessar o menu Administrativo (Senha: 123456)\nOu digite M a qualquer momento para ter acesso as opcões.\n"
const menuADM = "\nEstamos no menu do Administador,\nagora vc pode adicionar [A+NomeItem+Preco]\nExemplo: A+Pastel+3.0\nou deletar [D+IndiceItem] um item do cardapio.\n[V]Para visualizar o cardapio\n[S]Para Sair\nOu digite M a qualquer momento para ter acesso as opcões.\n";
// variavel responsavel para ver se é ADMIN
var admin = false;

client.on('connect', function(){
    console.log(menu);
    rl.addListener('line', line => {
        const aux = line.toUpperCase();
        const comando = aux[0];

        if (admin === false) {
            const indice = parseInt(aux.slice(1));
            switch (comando) {
                case 'M': // solicitando menu
                    console.log(menu);
                    break;
                case 'V': // solicitando cardapio
                    client.subscribe(resultListarCardapio, function(err){
                        if (!err) {
                            client.publish(listarCardapio, '');
                        }else {
                            console.log('\nAlgo deu errado! :\\\n');
                        }
                    });
                    break;
                case 'P': // solicitando a lista de pedidos
                    client.subscribe(resultListarPedido, function (err) {
                        if (!err) {
                            client.publish(listarPedidos, '');
                        }else {
                            console.log('\nAlgo deu errado! :\\\n');
                        }
                    });
                    break;
                case 'A': // solicitando pedido [A + Indice do Item]
                    if (isNaN(indice)) { // indice não númerico
                        console.log('\nDesculpa! :\\\nComando não aceito!\n');
                    }else {
                        client.subscribe(resultAddPedido, function (err) {
                            if (!err) {
                                client.publish(addPedido, indice.toString());
                            }else {
                                console.log('\nAlgo deu errado! :\\\n');
                            }
                        });
                    }
                    break;
                case 'E': // solicitando excluir pedido [E + Indice do Pedido]
                    if (isNaN(indice)) { // indice não númerico
                        console.log('\nDesculpa! :\\\nComando não aceito!\n');
                    }else {
                        client.subscribe(resultExcluirPedido, function (err) {
                            if (!err) {
                                client.publish(excluirPedido, indice.toString());
                            }else {
                                console.log('\nAlgo deu errado! :\\\n');
                            }
                        });
                    }
                    break;
                case 'B': // buscar item [B + Indice do Item]
                    if (isNaN(indice)) { // indice não númerico
                        console.log('\nDesculpa! :\\\nComando não aceito!\n');
                    }else {
                        client.subscribe(resultBuscarItem, function (err) {
                            if (!err) {
                                client.publish(buscarItem, indice.toString());
                            }else {
                                console.log('\nAlgo deu errado! :\\\n');
                            }
                        });
                    }
                    break;
                case 'F': // finalizar
                    client.subscribe(resultFinalizar, function (err) {
                        if (!err) {
                            client.publish(finalizar, '');
                        }else {
                            console.log('\nAlgo deu errado! :\\\n');
                        }
                    });
                    break;
                case 'C': // cancelar compra ou processo
                    client.subscribe(resultCancelar, function (err) {
                        if (!err) {
                            client.publish(cancelar, '');
                        }else {
                            console.log('\nAlgo deu errado! :\\\n');
                        }
                    });
                    break;
                case 'X': // tentando entrar no menu Administrador
                    var senha = aux.slice(1);
                    client.subscribe(resultAdmin, function (err) {
                        if (!err) {
                            client.publish(ADMIN, senha);
                        }else {
                            console.log('\nAlgo deu errado! :\\\n');
                        }
                    });
                    break;
                default: // caso não reconheça o comando
                    console.log('\nDesculpa! :\\\nComando não aceito!\n');
                    break;
            }
        }else if (admin === true) {
            switch (comando) {
                case 'M': // visualizar menu
                    console.log(menuADM);
                    break;
                case 'V': // visualizar cardapio
                    client.subscribe(resultListarCardapio, function(err){
                        if (!err) {
                            client.publish(listarCardapio, '');
                        }else {
                            console.log('\nAlgo deu errado! :\\\n');
                        }
                    });
                    break;
                case 'A': // adicionando item [A + Nome do Item + Preco]
                    var tmp = aux.split('+');
                    item = {nome: tmp[1], preco: parseInt(tmp[2])};
                    client.subscribe(resultAddItem, function (err) {
                        if (!err) {
                            client.publish(addItem, JSON.stringify(item));
                            console.log('\nItem Cadastrado! :D\n');
                        }else {
                            console.log('\nAlgo deu errado! :\\\n');
                        }
                    })
                    break;
                case 'D': // deletar item do cardapio [D + Indice do Item]
                    var posicao = parseInt(aux.slice(1));
                    if (isNaN(posicao)) { // indice não númerico
                        console.log('\nDesculpa! :\\\nComando não aceito!\n');
                    }else {
                        client.subscribe(resultExcluirItem, function (err) {
                            if (!err) {
                                client.publish(excluirItem, posicao.toString());
                            }else {
                                console.log('\nAlgo deu errado! :\\\n');
                            }
                        });
                    }
                    break;
                case 'S': // cancelar processo
                    admin = false;
                    console.log(menu);
                    break;
                default: // caso não reconheça o comando
                    console.log('\nDesculpa! :\\\nComando não aceito!\n');
                    break;
            }
        }
    });
});

    client.on('message', function (topic, message) {
        switch (topic) {
            case resultListarCardapio: // resposta do Servidor para o Cardapio
                var cardapio = '';
                var aux = JSON.parse(message.toString());
                for (var i = 0; i < aux.length; i++){
                    var item = (i+1) + '.' + aux[i].nome + ' - R$ ' + aux[i].preco + '\n';
                    cardapio = cardapio + item;
                }
                console.log("\n>>>> O cardapio do dia é:\n" + cardapio);
                break;
            case resultListarPedido: // resposta do Servidor para a Lista de Pedidos
                var pedidos = '';
                var total = 0;
                aux = JSON.parse(message.toString());
                for (var i = 0; i < aux.length; i++){
                    var item = (i+1) + '.' + aux[i].nome + ' - R$ ' + aux[i].preco + '\n';
                    pedidos = pedidos + item;
                    total = total + aux[i].preco;
                }
                console.log('\n>>>> Os seus pedidos são:\n' +  pedidos + '\nValor total: ' + total + '\n');
                break;
            case resultAddPedido: // resposta do Servidor para o Pedido Adicionado
                aux = message.toString();
                if (aux === 'error') {
                    console.log('\nDesculpe! :*(\nItem não existe!\n');
                }else {
                    var pedido = JSON.parse(aux);
                    console.log('\nPedido: ' + pedido.nome + ' no valor de R$ ' + pedido.preco + ' foi adicionado! :)\nMais alguma coisa? S2\n');
                }
                break;
            case resultExcluirPedido: // resposta do Servidor para o Pedido Excluido
                aux = message.toString();
                if (aux === 'error') {
                    console.log('\nDesculpe! :*(\nPedido não existe!\n');
                }else {
                    var excluido = JSON.parse(aux);
                    console.log('\nPedido: ' + excluido[0].nome + ' no valor de R$ ' + excluido[0].preco + ' foi excluido com sucesso! :\\\n');
                }
                break;
            case resultExcluirItem: // respostado do Servidor para o Item Excluido
                aux = message.toString();
                if (aux === 'error') {
                    console.log('\nDesculpe! :*(\nItem não existe!\n');
                }else {
                    excluido = JSON.parse(aux);
                    console.log('\nItem: ' + excluido[0].nome + ' no valor de R$ ' + excluido[0].preco + ' foi excluido com sucesso! :\\\n');
                }
                break;
            case resultBuscarItem: // resposta do Servidor para o Item Buscado
                aux = message.toString();
                if (aux === 'error') {
                    console.log('\nDesculpe! :*(\nItem não existe!\n');
                }else {
                    pedido = JSON.parse(aux);
                    console.log('\nItem encontrado: ' + pedido.nome + ' no valor de R$ ' + pedido.preco + '\n');
                }
                break;
            case resultFinalizar: // resposta do Servidor para Finalizar
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
            case resultCancelar: // resposta do Servidor para o metodo Cancelar
                console.log('\nCompra cancelada! :*(\n');
                client.end();
                rl.close();
                break;
            case resultAdmin: // resposta do Servidor para a senha
                aux = message.toString();
                if (aux === 'error') {
                    console.log('\nSenha Incorreta! :|\nTente novamente.');
                }else if (aux === 'true') {
                    console.log('\nSenha correta! :D\nRedirecionando para o menu ADMIN!\n');
                    console.log(menuADM);
                    admin = true;
                }
                break;
        }
    });