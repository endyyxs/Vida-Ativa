*** Settings ***
Documentation    Suite de testes de interface para o T4 — Definição de Nível de Dificuldade no Cadastro de Exercícios.
...              Foco: Validar que o campo de dificuldade é obrigatório para salvar um exercício.
...              Responsável: Douglas S.
Library          SeleniumLibrary
Suite Setup      Dado que o profissional realiza o login e acessa o painel
Suite Teardown   E fecha o navegador

*** Variables ***
${URL_LOGIN}        http://localhost:5173/
${URL_CADASTRO}     http://localhost:5173/admin/exercicio/novo
${URL_LISTAGEM}     http://localhost:5173/admin/exercicios
${BROWSER}          chrome

# Elementos da Tela de Login
${INPUT_EMAIL}      id=email
${INPUT_SENHA}      id=senha
${BTN_LOGIN}        id=btnlogin

# Elementos da Tela de Cadastro de Exercício
${INPUT_NOME}       id=nome
${INPUT_DESC}       id=descricao
${SELECT_DIF}       id=dificuldade
${BTN_SALVAR}       id=btnSalvar
${LISTA_EXER}       id=listaExercicios

*** Test Cases ***
CT01 - T4: Deve cadastrar exercicio com dificuldade selecionada (FACIL)
    [Documentation]    Partição Válida (P2): Verifica que o cadastro é concluído quando
    ...                a dificuldade FACIL está selecionada.
    [Setup]    Acessar a pagina de cadastro de exercicios
    Dado que o profissional informa o nome do exercicio       Alongamento Cervical
    E informa a descricao do exercicio                        Movimento lento e suave do pescoço para ambos os lados.
    E seleciona o nivel de dificuldade                        FACIL
    Quando solicitar o salvamento
    Entao o sistema deve redirecionar para a listagem de exercicios

CT02 - T4: Deve cadastrar exercicio com dificuldade selecionada (MODERADO)
    [Documentation]    Partição Válida (P2): Verifica que o cadastro é concluído quando
    ...                a dificuldade MODERADO está selecionada.
    [Setup]    Acessar a pagina de cadastro de exercicios
    Dado que o profissional informa o nome do exercicio       Caminhada Rápida
    E informa a descricao do exercicio                        Caminhar em ritmo acelerado por 20 minutos.
    E seleciona o nivel de dificuldade                        MODERADO
    Quando solicitar o salvamento
    Entao o sistema deve redirecionar para a listagem de exercicios

CT03 - T4: Deve cadastrar exercicio com dificuldade selecionada (DIFICIL)
    [Documentation]    Partição Válida (P2): Verifica que o cadastro é concluído quando
    ...                a dificuldade DIFICIL está selecionada.
    [Setup]    Acessar a pagina de cadastro de exercicios
    Dado que o profissional informa o nome do exercicio       Agachamento com Peso
    E informa a descricao do exercicio                        Executar agachamento sumo com halteres leves de 2kg.
    E seleciona o nivel de dificuldade                        DIFICIL
    Quando solicitar o salvamento
    Entao o sistema deve redirecionar para a listagem de exercicios

CT04 - T4: Deve bloquear cadastro se nome estiver em branco com dificuldade definida
    [Documentation]    Partição Inválida (P1): O campo nome é obrigatório (HTML5 required).
    ...                O formulário deve ser retido mesmo com a dificuldade selecionada.
    [Setup]    Acessar a pagina de cadastro de exercicios
    Dado que o profissional informa o nome do exercicio       ${EMPTY}
    E informa a descricao do exercicio                        Instruções do movimento terapêutico.
    E seleciona o nivel de dificuldade                        FACIL
    Quando solicitar o salvamento
    Entao a interface deve reter o envio e permanecer na pagina de cadastro

CT05 - T4: Deve bloquear cadastro se descricao estiver em branco com dificuldade definida
    [Documentation]    Partição Inválida (P1): O campo descrição é obrigatório (HTML5 required).
    ...                O formulário deve ser retido mesmo com a dificuldade selecionada.
    [Setup]    Acessar a pagina de cadastro de exercicios
    Dado que o profissional informa o nome do exercicio       Exercício de Equilíbrio
    E informa a descricao do exercicio                        ${EMPTY}
    E seleciona o nivel de dificuldade                        MODERADO
    Quando solicitar o salvamento
    Entao a interface deve reter o envio e permanecer na pagina de cadastro

*** Keywords ***
Dado que o profissional realiza o login e acessa o painel
    Open Browser    ${URL_LOGIN}    ${BROWSER}    options=add_argument("--incognito")
    Maximize Browser Window
    Set Selenium Speed    0.5 seconds

    # Aguarda e preenche o formulário de login
    Wait Until Element Is Visible    ${INPUT_EMAIL}    timeout=5s
    Input Text        ${INPUT_EMAIL}    dsimoess@teste.com
    Input Password    ${INPUT_SENHA}    123456789

    # Clica no botão de login e aguarda o carregamento do painel admin
    Wait Until Element Is Visible    ${BTN_LOGIN}    timeout=10s
    Click Button    ${BTN_LOGIN}

    # Aguarda o elemento da navbar que confirma que o login foi realizado e a home admin carregou
    Wait Until Element Is Visible    id=nomeApp    timeout=10s

Acessar a pagina de cadastro de exercicios
    # Verifica se já está na URL de cadastro para evitar cliques duplicados
    ${URL_ATUAL}=    Get Location
    IF    '${URL_ATUAL}' != '${URL_CADASTRO}'
        # Clica em "Exercícios" no menu de navegação
        Wait Until Element Is Visible    id=exercicio    timeout=5s
        Click Element                    id=exercicio

        # Clica no botão "+ Novo Exercício" na tela de gerenciamento
        Wait Until Element Is Visible    id=btnExercicio    timeout=5s
        Click Element                    id=btnExercicio
    END

    # Aguarda o React renderizar o formulário de cadastro completamente
    Wait Until Location Is       ${URL_CADASTRO}    timeout=10s
    Sleep    1s
    Wait Until Element Is Visible    ${INPUT_NOME}    timeout=10s

Dado que o profissional informa o nome do exercicio
    [Arguments]    ${nome}
    Run Keyword If    '${nome}' == '${EMPTY}'    Clear Element Text    ${INPUT_NOME}
    Run Keyword If    '${nome}' != '${EMPTY}'    Input Text             ${INPUT_NOME}    ${nome}

E informa a descricao do exercicio
    [Arguments]    ${descricao}
    Run Keyword If    '${descricao}' == '${EMPTY}'    Clear Element Text    ${INPUT_DESC}
    Run Keyword If    '${descricao}' != '${EMPTY}'    Input Text             ${INPUT_DESC}    ${descricao}

E seleciona o nivel de dificuldade
    [Arguments]    ${dificuldade}
    # O <select> do React renderiza com id=dificuldade e os valores FACIL, MODERADO, DIFICIL
    Select From List By Value    ${SELECT_DIF}    ${dificuldade}

Quando solicitar o salvamento
    Click Button    ${BTN_SALVAR}

Entao o sistema deve redirecionar para a listagem de exercicios
    # Aguarda o React navegar para a listagem e o elemento da tabela aparecer
    Wait Until Element Is Visible    ${LISTA_EXER}    timeout=10s
    Location Should Contain          /admin/exercicios

Entao a interface deve reter o envio e permanecer na pagina de cadastro
    # Valida que o navegador manteve o usuário na tela de cadastro (validação HTML5 nativa)
    Location Should Be    ${URL_CADASTRO}

E fecha o navegador
    Close Browser
