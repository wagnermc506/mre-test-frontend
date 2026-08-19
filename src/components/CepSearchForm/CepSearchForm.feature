Feature: Busca de endereço por CEP
  Como usuário do sistema
  Eu quero buscar um endereço a partir de um CEP
  Para não precisar digitar o endereço completo manualmente

  Background:
    Given que a tela de busca de CEP está visível

  Scenario: Busca de um CEP válido e existente
    When o usuário digita "01001000" no campo de CEP
    And clica no botão de buscar
    Then o endereço "Praça da Sé" deve ser exibido
    And a cidade "São Paulo" deve ser exibida

  Scenario: Busca de um CEP inexistente
    When o usuário digita "99999999" no campo de CEP
    And clica no botão de buscar
    Then uma mensagem informando que o CEP não foi encontrado deve ser exibida

  Scenario: Busca de um CEP com formato inválido
    When o usuário digita "123" no campo de CEP
    Then o botão de buscar deve permanecer desabilitado

  Scenario: Falha de conexão ao consultar o serviço de CEP
    Given que o serviço de CEP está indisponível
    When o usuário digita "01001000" no campo de CEP
    And clica no botão de buscar
    Then uma mensagem de erro de conexão deve ser exibida