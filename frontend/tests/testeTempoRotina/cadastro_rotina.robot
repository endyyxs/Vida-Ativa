*** Settings ***
Library         SeleniumLibrary
Library         String
# Abre o navegador e faz login uma única vez
Suite Setup     Logar no Sistema com Sucesso
# Fecha o navegador apenas quando os testes finalizarem
Suite Teardown  E fecha o navegador
# Antes de cada teste, apenas navega até a tela de cadastro através dos cliques
Test Setup      Acessar a pagina de cadastro de rotinas

*** Variables ***
${URL_LOGIN}        http://localhost:5173/
${URL_ROTINA}       http://localhost:5173/admin/rotina/nova
${BROWSER}          chrome

# Elementos da Tela de Login
${INPUT_EMAIL}      id=email
${INPUT_SENHA}      id=senha
${BTN_LOGIN}        id=btnlogin

# Elementos da Tela de Cadastro de Rotina
${INPUT_NOME}       id=nomeRotina
${INPUT_DURACAO}    id=duracao
${SELECT_PERFIL}    id=perfilClinico
${BTN_SALVAR}       id=btnSalvar
${LISTA_ROTINAS}    id=listaRotinas

${XPATH_CHECKBOX}   xpath=(//input[@type="checkbox" or @name="arrayExercicio"])[{INDEX}]

*** Test Cases ***
CT01 - Deve realizar o cadastro da rotina com tempo de duracao valido no limite maximo
    Dado que o administrador informa o nome da rotina           Alongamento Idoso Ativo
    E informa a duracao total da rotina                         30
    E seleciona o exercicio de numero                           1
    E seleciona o exercicio de numero                           2
    Quando solicitar o salvamento da rotina
    Entao o sistema deve redirecionar para a listagem de rotinas

CT02 - Deve realizar o cadastro da rotina com tempo de duracao valido no limite minimo
    Dado que o administrador informa o nome da rotina           Alongamento Idoso Ativo
    E informa a duracao total da rotina                         10
    E seleciona o exercicio de numero                           1
    E seleciona o exercicio de numero                           2
    Quando solicitar o salvamento da rotina
    Entao o sistema deve redirecionar para a listagem de rotinas    

CT03 - Deve reter o envio do formulario se a duracao for menor que o limite minimo
    Dado que o administrador informa o nome da rotina           Alongamento Rapido Demais
    E informa a duracao total da rotina                         9
    Quando solicitar o salvamento da rotina
    Entao a interface deve reter o envio da rotina impedindo o redirecionamento

CT04 - Deve reter o envio do formulario se a duracao ultrapassar o limite maximo
    Dado que o administrador informa o nome da rotina           Alongamento Exaustivo Invalido
    E informa a duracao total da rotina                         31
    Quando solicitar o salvamento da rotina
    Entao a interface deve reter o envio da rotina impedindo o redirecionamento

*** Keywords ***
Logar no Sistema com Sucesso
    Open Browser    ${URL_LOGIN}    ${BROWSER}    options=add_argument("--incognito")
    Maximize Browser Window
    Set Selenium Speed    0.3 seconds  
    
    # Preenche o Login
    Wait Until Element Is Visible    ${INPUT_EMAIL}    timeout=5s
    Input Text     ${INPUT_EMAIL}    dsimoess@teste.com
    Input Password    ${INPUT_SENHA}    123456789
    
    # Clica no Login
    Wait Until Element Is Visible    ${BTN_LOGIN}    timeout=10s
    Click Button    ${BTN_LOGIN}
    
    # Aguarda a Dashboard/Home carregar 
    Wait Until Element Is Visible    id=nomeApp    timeout=10s

Acessar a pagina de cadastro de rotinas
    ${PAST_URL}=    Get Location
    
    # Se o teste anterior terminou em sucesso, ele estará na tela de listagem.
    IF    '${PAST_URL}' != '${URL_ROTINA}'
        Wait Until Element Is Visible    id=rotina    timeout=5s
        Click Element                    id=rotina
        Wait Until Element Is Visible    id=btnRotina    timeout=5s
        Click Element                    id=btnRotina
    END
    
    # Aguarda o input principal da tela aparecer no DOM pelo React
    Wait Until Element Is Visible    ${INPUT_NOME}    timeout=10s

Dado que o administrador informa o nome da rotina
    [Arguments]    ${nome}
    Wait Until Element Is Visible    ${INPUT_NOME}    timeout=5s
    Clear Element Text               ${INPUT_NOME}
    Input Text                       ${INPUT_NOME}    ${nome}

E informa a duracao total da rotina
    [Arguments]    ${duracao}
    Wait Until Element Is Visible    ${INPUT_DURACAO}    timeout=5s
    Clear Element Text               ${INPUT_DURACAO}
    Input Text                       ${INPUT_DURACAO}    ${duracao}

E seleciona o exercicio de numero
    [Arguments]    ${posicao}
    ${REAL_LOCATOR}=    Replace String    ${XPATH_CHECKBOX}    {INDEX}    ${posicao}
    Wait Until Element Is Visible    ${REAL_LOCATOR}    timeout=5s
    # Garante o clique no elemento específico do array
    Click Element                    ${REAL_LOCATOR}

Quando solicitar o salvamento da rotina
    Wait Until Element Is Visible    ${BTN_SALVAR}    timeout=5s
    Click Button                     ${BTN_SALVAR}

Entao o sistema deve redirecionar para a listagem de rotinas
    Wait Until Element Is Visible    ${LISTA_ROTINAS}    timeout=10s

Entao a interface deve reter o envio da rotina impedindo o redirecionamento
    Location Should Be               ${URL_ROTINA}

E fecha o navegador
    Close Browser