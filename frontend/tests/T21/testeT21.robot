*** Settings ***
Documentation     Suite de testes para validar a dashboard e a tela de progresso para novos usuários.
Library           SeleniumLibrary
Test Setup        Abrir Navegador Na Tela De Login
Test Teardown     Close Browser

*** Variables ***
${URL_LOGIN}             http://localhost:5173
${URL_DASHBOARD}         http://localhost:5173/dashboard
${URL_PROGRESSO}         http://localhost:5173/historico
${NAVEGADOR}             edge

${USER_NOVO}             antonio0@yahoo.com
${SENHA_NOVO}            antonio

${CAMPO_EMAIL}           id=email
${CAMPO_SENHA}           id=senha
${BOTAO_LOGIN}           id=btnlogin

${TITULO_DASHBOARD}      xpath=//h1[contains(text(), 'Painel Vida Ativa')]
${LINK_MEU_PROGRESSO}    xpath=//a[@href="/historico" and text()="Meu Progresso"]

${MENSAGEM_VAZIA}        xpath=//p[contains(text(), 'Você ainda não realizou nenhum treino')]
${BOTAO_VOLTAR_INICIO}   xpath=//*[contains(text(), 'Voltar para o Início')]

*** Test Cases ***
CT01: Validar Acesso a Dashboard Para Novo Usuario
    [Documentation]    Testa se o novo usuário faz login e acessa o painel com sucesso.
    Fazer Login No Sistema    ${USER_NOVO}    ${SENHA_NOVO}
    
    Wait Until Location Is          ${URL_DASHBOARD}       timeout=5s
    Wait Until Element Is Visible   ${TITULO_DASHBOARD}    timeout=5s

CT02: Validar Tela Meu Progresso Vazia Para Novo Usuario
    [Documentation]    Testa se a tela de histórico exibe a mensagem correta de estado vazio.
    Fazer Login No Sistema    ${USER_NOVO}    ${SENHA_NOVO}
    
    Wait Until Element Is Visible    ${TITULO_DASHBOARD}      timeout=5s
    Wait Until Element Is Visible    ${LINK_MEU_PROGRESSO}    timeout=5s
    Click Element                    ${LINK_MEU_PROGRESSO}
    
    Wait Until Location Is           ${URL_PROGRESSO}         timeout=5s
    Wait Until Element Is Visible    ${MENSAGEM_VAZIA}        timeout=5s
    Wait Until Element Is Visible    ${BOTAO_VOLTAR_INICIO}    timeout=5s

*** Keywords ***
Abrir Navegador Na Tela De Login
    Open Browser    ${URL_LOGIN}    ${NAVEGADOR}
    Maximize Browser Window
    Wait Until Element Is Visible    ${CAMPO_EMAIL}    timeout=5s

Fazer Login No Sistema
    [Arguments]     ${email_usuario}    ${senha_usuario}
    Input Text      ${CAMPO_EMAIL}      ${email_usuario}
    Input Text      ${CAMPO_SENHA}      ${senha_usuario}
    Click Button    ${BOTAO_LOGIN}