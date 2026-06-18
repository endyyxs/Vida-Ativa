*** Settings ***
Library         SeleniumLibrary
Library         String

Suite Setup     Abrir Navegador e Logar Idoso
Suite Teardown  Close Browser

*** Variables ***
${URL_LOGIN}        http://localhost:5173/

*** Test Cases ***
CT07 - Deve validar feedback de treino finalizado (T29)
    Dado que o idoso acessa a dashboard
    E inicia e conclui um treino
    E seleciona o nivel de esforco      MODERADO
    Quando solicitar o salvamento do feedback
    Entao o sistema deve redirecionar para o historico

*** Keywords ***
Abrir Navegador e Logar Idoso
    Open Browser    ${URL_LOGIN}    chrome    options=add_argument("--incognito")
    Maximize Browser Window
    Wait Until Element Is Visible    id=email    timeout=10s
    Input Text       id=email    eminem@gmail.com
    Input Password   id=senha    123456
    Click Button     id=btnlogin
    # Espera o painel carregar (identificado pelo nomeApp no seu App.jsx)
    Wait Until Element Is Visible    id=nomeApp    timeout=20s

Dado que o idoso acessa a dashboard
    Wait Until Page Contains    Painel Vida Ativa    timeout=10s

E inicia e conclui um treino
    # 1. Clica no botão Ver Exercícios
    Wait Until Keyword Succeeds    10x    1s    Click Element    xpath=//*[contains(text(), 'Ver Exercícios')]
    
    # 2. Clica no botão Iniciar Este Treino Agora
    Wait Until Keyword Succeeds    10x    1s    Click Element    xpath=//*[contains(text(), 'Iniciar Este Treino Agora')]
    
    # 3. Clica no botão Concluir Treino (Ajustado para o texto visível na imagem que você enviou)
    # Usando o XPath de texto, que é muito mais estável
    Wait Until Keyword Succeeds    10x    1s    Click Element    xpath=//button[contains(text(), 'Concluir Treino')]

E seleciona o nivel de esforco
    [Arguments]    ${esforco}
    Wait Until Element Is Visible    id=feedback    timeout=10s
    Select From List By Value    id=feedback    ${esforco}

Quando solicitar o salvamento do feedback
    # Clica no botão que tem o texto de conclusão
    Click Element    xpath=//*[contains(text(), 'Salvar e Finalizar Treino')]
    Handle Alert     ACCEPT

Entao o sistema deve redirecionar para o historico
    Wait Until Location Contains    /historico    timeout=10s