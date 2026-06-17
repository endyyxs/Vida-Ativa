*** Settings ***
Library         SeleniumLibrary
Suite Setup     Dado que o administrador realiza o login e acessa a tela de cadastro
Suite Teardown  E fecha o navegador

*** Variables ***
${URL_LOGIN}        http://localhost:5173/
${URL_CADASTRO}     http://localhost:5173/admin/exercicio/novo
${BROWSER}          chrome

# Elementos da Tela de Login
${INPUT_EMAIL}      id=email
${INPUT_SENHA}      id=senha
${BTN_LOGIN}        id=btnlogin

# Elementos da Tela de Cadastro
${INPUT_NOME}       id=nome
${INPUT_DESC}       id=descricao
${SELECT_DIF}       id=dificuldade
${BTN_SALVAR}       id=btnSalvar
${LISTA_EXER}       id=listaExercicios

*** Test Cases ***
CT01 - Deve realizar o cadastro de um exercicio com dados validos
    [Setup]    Acessar a pagina de cadastro de exercicios
    Dado que o administrador informa o nome do exercicio       Agachamento Livre teste
    E informa a descricao do exercicio                         Mantenha os pés alinhados e desça o quadril.
    E seleciona a dificuldade                                  FACIL
    Quando solicitar o salvamento
    Entao o sistema deve redirecionar para a listagem de exercicios

CT02 - Deve reter o envio do formulario se o nome estiver em branco
    [Setup]    Acessar a pagina de cadastro de exercicios
    Dado que o administrador informa o nome do exercicio       ${EMPTY}
    E informa a descricao do exercicio                         Executar o movimento com halteres leves.
    E seleciona a dificuldade                                  MODERADO
    Quando solicitar o salvamento
    Entao a interface deve reter o envio impedindo o redirecionamento

CT03 - Deve reter o envio do formulario se a descricao estiver em branco
    [Setup]    Acessar a pagina de cadastro de exercicios
    Dado que o administrador informa o nome do exercicio       Triceps Testa
    E informa a descricao do exercicio                         ${EMPTY}
    E seleciona a dificuldade                                  FACIL
    Quando solicitar o salvamento
    Entao a interface deve reter o envio impedindo o redirecionamento

*** Keywords ***
Dado que o administrador realiza o login e acessa a tela de cadastro
    Open Browser    ${URL_LOGIN}    ${BROWSER}    options=add_argument("--incognito")
    Maximize Browser Window
    Set Selenium Speed    0.5 seconds  
    
    # Preenche o Login
    Wait Until Element Is Visible    ${INPUT_EMAIL}    timeout=5s
    Input Text     ${INPUT_EMAIL}    dsimoess@teste.com
    Input Password    ${INPUT_SENHA}    123456789
    
    # Clica no Login
    Wait Until Element Is Visible    ${BTN_LOGIN}    timeout=10s
    Click Button    ${BTN_LOGIN}
    
    #  Aguarda a Dashboard/Home carregar 100% na tela
    Wait Until Element Is Visible    id=nomeApp    timeout=10s

Acessar a pagina de cadastro de exercicios
    # Se já estiver na página de cadastro , não  clica de novo
    ${PAST_URL}=    Get Location
    IF    '${PAST_URL}' != '${URL_CADASTRO}'
        Wait Until Element Is Visible    id=exercicio    timeout=5s
        Click Element                    id=exercicio
        Wait Until Element Is Visible    id=btnExercicio    timeout=5s
        Click Element                    id=btnExercicio
    END
    
    # Aguarda o input principal da tela aparecer
    Wait Until Element Is Visible    ${INPUT_NOME}    timeout=10s
    
    # Aguarda  a URL mudar para a do cadastro para garantir a navegação
    Wait Until Location Is    ${URL_CADASTRO}    timeout=10s
    
    # Espera React renderizar os inputs 
    Sleep    1s
    Wait Until Element Is Visible    ${INPUT_NOME}    timeout=10s

Dado que o administrador informa o nome do exercicio
    [Arguments]    ${nome}
    Run Keyword If    '${nome}' == '${EMPTY}'    Clear Element Text    ${INPUT_NOME}
    Run Keyword If    '${nome}' != '${EMPTY}'    Input Text             ${INPUT_NOME}    ${nome}

E informa a descricao do exercicio
    [Arguments]    ${descricao}
    Run Keyword If    '${descricao}' == '${EMPTY}'    Clear Element Text    ${INPUT_DESC}
    Run Keyword If    '${descricao}' != '${EMPTY}'    Input Text             ${INPUT_DESC}    ${descricao}

E seleciona a dificuldade
    [Arguments]    ${dificuldade}
    Select From List By Value    ${SELECT_DIF}    ${dificuldade}

Quando solicitar o salvamento
    Click Button    ${BTN_SALVAR}

Entao o sistema deve redirecionar para a listagem de exercicios
    Wait Until Element Is Visible    ${LISTA_EXER}    timeout=10s

Entao a interface deve reter o envio impedindo o redirecionamento
    Location Should Be    ${URL_CADASTRO}

E fecha o navegador
    Close Browser