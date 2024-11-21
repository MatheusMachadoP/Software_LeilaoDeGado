// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract LeilaoDeGado {
    address public leiloeiro;
    string public nomeAtivo;
    uint public precoInicial;
    uint public duracaoLeilao;
    uint private horarioInicio;
    uint private horarioFim;
    bool public leilaoAberto;
    uint public maiorLance;
    address public licitanteVencedor;
    string public data;
    bool private pagamentoRealizado;

    struct Licitante {
        address conta;
        string nome;
        string cpf;
    }

    Licitante[] public licitantes;

    event LeilaoIniciado(
        string ativo,
        uint precoInicial,
        uint duracaoLeilao
    );

    event NovoLance(address indexed licitante, uint valor);

    event LeilaoEncerrado(
        address licitanteVencedor,
        uint valor,
        string nomeVencedor,
        string cpfVencedor
    );

    event PagamentoRealizado(address remetente, uint valor);

    constructor(
        string memory _nomeAtivo,
        uint _precoInicial,
        uint _duracaoLeilao,
        string memory _data
    ) {
        leiloeiro = msg.sender;
        nomeAtivo = _nomeAtivo;
        precoInicial = _precoInicial;
        duracaoLeilao = _duracaoLeilao;
        data = _data;
        leilaoAberto = false;
        maiorLance = 0;
        licitanteVencedor = address(0);
        pagamentoRealizado = false;
    }

    modifier somenteLeiloeiro() {
        require(msg.sender == leiloeiro, "Somente o leiloeiro pode executar.");
        _;
    }

    modifier somenteVencedor() {
        require(msg.sender == licitanteVencedor, "Somente o vencedor pode executar.");
        _;
    }

    function iniciarLeilao() public somenteLeiloeiro {
        require(!leilaoAberto, "O leilao ja foi iniciado.");
        horarioInicio = block.timestamp;
        horarioFim = horarioInicio + duracaoLeilao;
        leilaoAberto = true;
        emit LeilaoIniciado(nomeAtivo, precoInicial, duracaoLeilao);
    }

    function darLance(uint _valor, string memory _nome, string memory _cpf) public {
        require(leilaoAberto, "O leilao esta fechado.");
        require(block.timestamp <= horarioFim, "O leilao encerrou.");
        require(_valor > maiorLance, "O valor nao supera o maior lance.");
        require(_valor >= precoInicial, "O valor nao atende o preco inicial.");

        maiorLance = _valor;
        licitanteVencedor = msg.sender;

        Licitante memory novoLicitante = Licitante({
            conta: msg.sender,
            nome: _nome,
            cpf: _cpf
        });

        licitantes.push(novoLicitante);
        emit NovoLance(msg.sender, _valor);
    }

    function verificarEncerramentoLeilao() public {
        require(leilaoAberto, "O leilao esta fechado.");
        if (block.timestamp > horarioFim) {
            leilaoAberto = false;

            if (licitanteVencedor != address(0)) {
                string memory nomeVencedor;
                string memory cpfVencedor;

                for (uint i = 0; i < licitantes.length; i++) {
                    if (licitantes[i].conta == licitanteVencedor) {
                        nomeVencedor = licitantes[i].nome;
                        cpfVencedor = licitantes[i].cpf;
                        break;
                    }
                }

                emit LeilaoEncerrado(
                    licitanteVencedor,
                    maiorLance,
                    nomeVencedor,
                    cpfVencedor
                );
            }
        }
    }

    function realizarPagamento() public payable somenteVencedor {
        require(!leilaoAberto, "O leilao ainda esta aberto.");
        require(!pagamentoRealizado, "Pagamento ja realizado.");
        require(msg.value >= maiorLance, "Valor insuficiente para pagamento.");

        pagamentoRealizado = true;
        payable(leiloeiro).transfer(msg.value);
        emit PagamentoRealizado(msg.sender, msg.value);
    }

    function tempoRestante() public view returns (uint) {
        require(leilaoAberto, "O leilao esta fechado.");
        if (block.timestamp >= horarioFim) {
            return 0;
        }
        return horarioFim - block.timestamp;
    }

    function cancelarLeilao() public somenteLeiloeiro {
        require(leilaoAberto, "O leilao ja esta fechado.");
        leilaoAberto = false;
    }
}