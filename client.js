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

// mensagens de menus
const menu = "Bem-vido ao sFood!\n[V]Para Visualizar o Cardapio\n[P]Para Listar os Pedidos\n[A+IndiceProduto]Para Adicionar um Pedido\nExemplo: A4 (para add o BROTINHO)\n[B+IndiceProduto]Para Buscar Produto\n[E+IndicePedido]Para Excluir um Pedido\n[F]Para Finalizar\n[C]Para cancelar\n[X+Senha]Para Acessar o menu Administrativo (Senha: 123456)\nOu digite M a qualquer momento para ter acesso as opcões.\n"
const menuADM = "Estamos no menu do Administador,\nagora vc pode adicionar [A+NomeItem+Preco]\nExemplo: A+Pastel+3.0\nou deletar [D+IndiceItem] um item do cardapio.\n[V]Para visualizar o cardapio\n[C]Para Sair\nOu digite M a qualquer momento para ter acesso as opcões.\n";
// variavel responsavel para ver se é ADMIN
var admin = false;

console.log(menu);
rl.addListener('line', line => {
    const aux = line.toUpperCase();
    const comando = aux[0];

    client.on('connect', function(){
        if (admin === false) {
            switch (comando) {
                case 'M': // visualizar menu
                    console.log(menu);
                    break;
                case 'V': // visualizar cardapio
                    client.publish(listarCardapio, '');
                    break;
                case 'P': // visualizar pedidos
                    break;
                case 'A': // realizar pedido [A + Indice do Item]
                    break;
                case 'E': // excluir pedido [E + Indice do Pedido]
                    break;
                case 'B': // busca item [B + Indice do Item]
                    break;
                case 'F': // finalizar
                    break;
                case 'C': // cancelar compra ou processo
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

    client.on('message', function (topic, message) {
        switch (topic) {
            case resultListarCardapio:
                const cardapio = JSON.parse(message.toString());
                console.log(cardapio);
                break;
        }
    });
});