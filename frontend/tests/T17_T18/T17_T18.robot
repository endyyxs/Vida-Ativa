*** Settings ***
Library         SeleniumLibrary
Library         String

Suite Setup     Abrir Navegador e Logar
Suite Teardown  Close Browser

*** Variables ***
${URL_LOGIN}        http://localhost:5173/
${URL_ROTINA}       http://localhost:5173/admin/rotina/nova
${BTN_SALVAR}       id=btnSalvar
${INPUT_NOME}       id=nomeRotina
${INPUT_DURACAO}    id=duracao

*** Test Cases ***
CT05 - Deve permitir salvar rotina com pelo menos um exercicio (T17)
    Dado que o administrador acessa a tela de nova rotina
    E informa o nome da rotina            Treino Minimo
    E informa a duracao total da rotina   15
    E seleciona o primeiro exercicio da lista
    Quando solicitar o salvamento da rotina
    Entao o sistema deve redirecionar para a listagem

CT06 - Deve reter o salvamento se nenhum exercicio for selecionado (T18)
    Dado que o administrador acessa a tela de nova rotina
    E informa o nome da rotina            Treino Vazio
    E informa a duracao total da rotina   15
    # Não selecionamos nenhum checkbox
    Quando solicitar o salvamento da rotina
    Entao a interface deve mostrar o alerta de erro "Uma rotina precisa ter pelo menos um exercício vinculado"

*** Keywords ***
Abrir Navegador e Logar
    Open Browser    ${URL_LOGIN}    chrome    options=add_argument("--incognito")
    Maximize Browser Window
    Wait Until Element Is Visible    id=email    timeout=10s
    Input Text       id=email    dsimoess@teste.com
    Input Password   id=senha    123456789
    Click Button     id=btnlogin
    # Aguarda o redirecionamento (o React precisa processar a entrada)
    Wait Until Element Is Visible    id=nomeApp    timeout=10s

Dado que o administrador acessa a tela de nova rotina
    # Em vez de Go To, vamos clicar nos elementos do menu (como um usuário real faria)
    Wait Until Element Is Visible    id=rotina    timeout=10s
    Click Element                    id=rotina
    Wait Until Element Is Visible    id=btnRotina    timeout=10s
    Click Element                    id=btnRotina
    # Agora que clicamos e navegamos internamente, verificamos se carregou
    Wait Until Element Is Visible    ${INPUT_NOME}    timeout=10s

E informa o nome da rotina
    [Arguments]    ${nome}
    Input Text     ${INPUT_NOME}    ${nome}

E informa a duracao total da rotina
    [Arguments]    ${duracao}
    Input Text     ${INPUT_DURACAO}    ${duracao}

E seleciona o primeiro exercicio da lista
    Wait Until Element Is Visible    id=ArrayExercicio    timeout=10s
    Click Element                    xpath=(//input[@id='ArrayExercicio'])[1]

Quando solicitar o salvamento da rotina
    Click Button    ${BTN_SALVAR}

Entao o sistema deve redirecionar para a listagem
    # Aumentei o timeout para garantir que a transição ocorra
    Wait Until Location Is    http://localhost:5173/admin/rotinas    timeout=10s

Entao a interface deve mostrar o alerta de erro "${mensagem}"
    # Verifica se a mensagem aparece na tela
    Wait Until Element Is Visible    xpath=//*[contains(text(), '${mensagem}')]    timeout=10s
    Location Should Be        ${URL_ROTINA}

