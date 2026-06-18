*** Settings ***
Library         SeleniumLibrary
Library         String

Suite Setup     Abrir Navegador e Logar Admin
Suite Teardown  Close Browser

*** Variables ***
${URL_LOGIN}        http://localhost:5173/

*** Test Cases ***
CT08 - Deve realizar o cadastro de exercicio com todos os campos (T30)
    Dado que o admin acessa a tela de cadastro de exercicio
    E preenche o formulario de exercicio  Alongamento  Alongar bracos  FACIL
    Quando solicitar o salvamento
    Entao o sistema deve exibir "Exercício salvo com sucesso!"

*** Keywords ***
Abrir Navegador e Logar Admin
    Open Browser    ${URL_LOGIN}    chrome    options=add_argument("--incognito")
    Maximize Browser Window
    Wait Until Element Is Visible    id=email    timeout=10s
    # Credenciais do Admin
    Input Text       id=email    kend@gmail.com
    Input Password   id=senha    123456
    Click Button     id=btnlogin
    # Espera a navbar do Admin carregar
    Wait Until Element Is Visible    id=nomeApp    timeout=20s

Dado que o admin acessa a tela de cadastro de exercicio
    # 1. Clica no link "Exercícios" na navbar
    Wait Until Element Is Visible    id=exercicio    timeout=10s
    Click Element    id=exercicio
    
    # 2. Clica no botão "+ Novo Exercício" (id=btnExercicio)
    Wait Until Element Is Visible    id=btnExercicio    timeout=10s
    Click Element    id=btnExercicio
    
    # 3. Garante que estamos no formulário
    Wait Until Element Is Visible    id=nome    timeout=15s

E preenche o formulario de exercicio
    [Arguments]    ${nome}    ${desc}    ${dif}
    Input Text    id=nome         ${nome}
    Input Text    id=descricao    ${desc}
    # Seleciona a dificuldade (Opções: FACIL, MODERADO, DIFICIL)
    Select From List By Value     id=dificuldade    ${dif}

Quando solicitar o salvamento
    # O botão de salvar no seu CadastroExercicio.jsx tem o id=btnSalvar
    Click Button    id=btnSalvar

Entao o sistema deve exibir "${mensagem}"
    # Tira print caso precise debugar se a mensagem apareceu
    Capture Page Screenshot
    Wait Until Element Is Visible    xpath=//*[contains(text(), '${mensagem}')]    timeout=10s