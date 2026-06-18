*** Settings ***
Documentation   Suite de testes para a tela de aceite do aviso medico.
Library         SeleniumLibrary
Test Setup        Abrir Navegador Na Tela De Login
Test Teardown   Close Browser

*** Variables ***
#URLs
${URL_LOGIN}      http://localhost:5173
${URL_AVISO}      http://localhost:5173/quiz
${URL_TREINOS}    http://localhost:5173/dashboard
${NAVEGADOR}      edge

#Dados de login
${USUARIO1}   antonio0@yahoo.com
${USUARIO2}   antonio2@yahoo.com
${SENHA}      antonio

#Campos de login
${CAMPO_EMAIL}   id=email
${CAMPO_SENHA}   id=senha
${BOTAO_ENTRAR}  id=btnlogin
#campos questionario
${CHECKBOX_ACEITE}     css=[data-testid="quiz-termo-medico"]
${BOTAO_SALVAR}        css=[data-testid="quiz-submit-button"]
${MENSAGEM_ERRO}       css=[data-testid="quiz-error-message"]      
${TITULO_TELA_TREINO}  xpath=//h1[contains(text(), 'Painel Vida Ativa 👵👴')]

*** Test Cases ***
CT01: Validar Acesso Permitido com Aceite Valido
    [Documentation]    Testa a partição válida usando o primeiro usuário.
    Fazer Login No Sistema    ${USUARIO1}    ${SENHA}
    
    Select Checkbox    ${CHECKBOX_ACEITE}
    Click Button       ${BOTAO_SALVAR}
    
    Wait Until Location Is          ${URL_TREINOS}    timeout=5s
    Wait Until Element Is Visible   ${TITULO_TELA_TREINO}

CT02: Validar Acesso Bloqueado com Aceite Invalido
    [Documentation]    Testa a partição inválida usando o segundo usuário.
    Fazer Login No Sistema    ${USUARIO2}    ${SENHA}
    
    # Não clicamos no checkbox
    Click Button       ${BOTAO_SALVAR}
    
    Location Should Be              ${URL_AVISO}
    Wait Until Element Is Visible   ${MENSAGEM_ERRO}    timeout=5s
    Element Text Should Be          ${MENSAGEM_ERRO}    É obrigatório aceitar o aviso de responsabilidade médica para prosseguir.

*** Keywords ***
Abrir Navegador Na Tela De Login
    Open Browser    ${URL_LOGIN}    ${NAVEGADOR}
    Maximize Browser Window
    Wait Until Element Is Visible    ${CAMPO_EMAIL}    timeout=5s

Fazer Login No Sistema
    [Arguments]     ${email_usuario}    ${senha_usuario}
    Input Text      ${CAMPO_EMAIL}      ${email_usuario}
    Input Text      ${CAMPO_SENHA}      ${senha_usuario}
    Click Button    ${BOTAO_ENTRAR}
    
    # Espera o redirecionamento automático acontecer e a tela do aviso carregar
    Wait Until Location Is           ${URL_AVISO}          timeout=5s
    Wait Until Element Is Visible    ${CHECKBOX_ACEITE}    timeout=5s