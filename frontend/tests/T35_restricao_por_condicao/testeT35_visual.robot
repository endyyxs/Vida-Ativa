*** Settings ***
Documentation    Suite de testes de interface para o T35 — Exibição de Restrição por Condição (RN01 e RN03).
...              Foco: Validar que o Dashboard do Idoso exibe apenas rotinas compatíveis com as limitações físicas do usuário.
...              Responsável: Henrique Medeiros
...
...              Regras de Negócio testadas:
...              RN01: O sistema deve filtrar exercícios com base no perfil clínico do usuário.
...              RN03: Se o usuário possui uma limitação física que coincide com a contraindicação
...                    de qualquer exercício em uma rotina, essa rotina deve ser OCULTADA.
Library          SeleniumLibrary
Suite Setup      Abrir Navegador
Suite Teardown   Fechar Navegador

*** Variables ***
${URL_LOGIN}          http://localhost:5173/
${URL_DASHBOARD}      http://localhost:5173/dashboard
${BROWSER}            chrome

# Elementos de Login
${INPUT_EMAIL}        id=email
${INPUT_SENHA}        id=senha
${BTN_LOGIN}          id=btnlogin
${ELEM_NAVBAR}        id=nomeApp

# Elementos do Dashboard do Idoso — Título da seção de rotinas recomendadas
${TITULO_RECOMENDADAS}    xpath=//h3[contains(text(), 'Recomendados Especialmente para')]

# Credenciais reais do banco Neon (antonio0 = ATIVO_LEVE sem restricoes / antonio2 = SEDENTARIO com restricao costas)
${EMAIL_ATIVO}         antonio0@yahoo.com
${SENHA_ATIVO}         antonio
${EMAIL_SEDENTARIO}    antonio2@yahoo.com
${SENHA_SEDENTARIO}    antonio

*** Test Cases ***
CT01 - T35: Idoso com restricao ve apenas rotinas sem conflito de contraindicacao
    [Documentation]    RN01 + RN03 — Usuário antonio2 tem limitacao_fisica 'antonio nas costas'.
    ...                Rotinas SEDENTARIO no banco possuem exercicios com contraindicacoes = null (sem risco).
    ...                Resultado Esperado: Rotinas EXIBIDAS pois nao ha conflito entre 'costas' e null.
    [Setup]    Realizar Login Como Idoso    ${EMAIL_SEDENTARIO}    ${SENHA_SEDENTARIO}

    Wait Until Element Is Visible    ${TITULO_RECOMENDADAS}    timeout=15s

    ${rotinas_visiveis}=    Get Element Count    css=section div button[id^='btn-ver-exercicios']
    Log    Rotinas exibidas para usuario com limitacao costas (perfil SEDENTARIO): ${rotinas_visiveis}

    Should Be True    ${rotinas_visiveis} >= 1
    ...    msg=FALHA RN03: Esperava ao menos 1 rotina segura — nenhuma contraindicacao conflita com 'costas'.

CT02 - T35: Idoso ATIVO_LEVE sem restricao real ve rotinas do perfil
    [Documentation]    RN01 — Usuário antonio0 tem perfil ATIVO_LEVE e limitacoes_fisicas = '{}'.
    ...                Resultado Esperado: Rotinas do perfil ATIVO_LEVE sao exibidas normalmente.
    [Setup]    Realizar Login Como Idoso    ${EMAIL_ATIVO}    ${SENHA_ATIVO}

    Wait Until Element Is Visible    ${TITULO_RECOMENDADAS}    timeout=15s

    ${rotinas_visiveis}=    Get Element Count    css=section div button[id^='btn-ver-exercicios']
    Log    Rotinas visiveis para antonio0 (ATIVO_LEVE): ${rotinas_visiveis}

    Should Be True    ${rotinas_visiveis} >= 1
    ...    msg=FALHA RN01: Esperava rotinas do perfil ATIVO_LEVE para usuario sem restricoes conflitantes.

CT03 - T35: Secao Recomendados e renderizada corretamente no Dashboard
    [Documentation]    Teste de Sanidade — Verifica que a estrutura do Dashboard do Idoso
    ...                esta correta e a secao Recomendados e exibida apos o login.
    [Setup]    Realizar Login Como Idoso    ${EMAIL_ATIVO}    ${SENHA_ATIVO}

    Wait Until Element Is Visible    ${TITULO_RECOMENDADAS}    timeout=15s
    Element Should Be Visible    ${TITULO_RECOMENDADAS}
    Log    VALIDADO: Secao de recomendados renderizou corretamente no Dashboard do Idoso.

*** Keywords ***
Abrir Navegador
    Open Browser    ${URL_LOGIN}    ${BROWSER}    options=add_argument("--incognito")
    Maximize Browser Window
    Set Selenium Speed    0.5 seconds

Realizar Login Como Idoso
    [Arguments]    ${email}    ${senha}
    Go To    ${URL_LOGIN}
    Wait Until Element Is Visible    ${INPUT_EMAIL}    timeout=5s
    Clear Element Text    ${INPUT_EMAIL}
    Input Text        ${INPUT_EMAIL}    ${email}
    Input Password    ${INPUT_SENHA}    ${senha}
    Wait Until Element Is Visible    ${BTN_LOGIN}    timeout=5s
    Click Button    ${BTN_LOGIN}
    Wait Until Element Is Visible    ${ELEM_NAVBAR}    timeout=15s
    Wait Until Location Contains     /dashboard    timeout=15s

Fechar Navegador
    Close Browser
