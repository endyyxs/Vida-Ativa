*** Settings ***
Library         SeleniumLibrary

Suite Setup     Logar no Sistema como Idoso Ativo
Suite Teardown  Fechar o Navegador

*** Variables ***
${URL_LOGIN}        http://localhost:5173/
${URL_DASHBOARD}    http://localhost:5173/dashboard
${URL_HISTORICO}    http://localhost:5173/historico
${BROWSER}          chrome

# Elementos da Tela de Login
${INPUT_EMAIL}      id=email
${INPUT_SENHA}      id=senha
${BTN_LOGIN}        id=btnlogin

# Elementos da Tela de Histórico
${BTN_VOLTAR}       id=btn-voltar-inicio

# Usuário idoso com quiz já respondido e com rotina recomendada disponível no banco
# IMPORTANTE: Deve ter respondeu_quiz = true e perfil_clinico definido
${EMAIL_IDOSO}      t20.teste@vidaativa.com
${SENHA_IDOSO}      123456789

*** Test Cases ***
CT01 - T20 Visual: Deve exibir mensagem de historico vazio antes do primeiro treino
    [Documentation]    RN07 / RF13 — Estado Inicial: Usuário nunca treinou.
    ...                A tela de histórico deve mostrar mensagem informando que
    ...                nenhum treino foi realizado ainda (0 dias ativos).
    Go To                            ${URL_HISTORICO}
    Wait Until Element Is Visible    ${BTN_VOLTAR}    timeout=10s

    # Verifica o texto que aparece quando o array do histórico está vazio
    Page Should Contain    Você ainda não realizou nenhum treino

CT02 - T20 Visual: Deve exibir 1 entrada no historico apos completar o primeiro treino
    [Documentation]    RN07 / RF13 — Após Primeiro Treino: Contador passa de 0 para 1.
    ...                O idoso acessa uma rotina, executa o treino, preenche o feedback
    ...                e é redirecionado ao histórico. O sistema deve exibir 1 entrada.
    Go To    ${URL_DASHBOARD}
    Wait Until Element Is Visible    id=nomeApp    timeout=10s

    # Clica no primeiro botão "Ver Exercícios" da seção de recomendadas
    # O ID é dinâmico: btn-ver-exercicios-{uuid_da_rotina}
    # Usamos XPath para pegar o primeiro botão da seção recomendada
    ${btn_rotina}=    Get WebElement    xpath=(//section//button[contains(@id,'btn-ver-exercicios')])[1]
    Click Element    ${btn_rotina}

    # Na tela de detalhes da rotina, inicia o treino
    Wait Until Element Is Visible    xpath=//button[contains(text(),'Iniciar Treino') or contains(text(),'Começar')]    timeout=10s
    Click Element    xpath=//button[contains(text(),'Iniciar Treino') or contains(text(),'Começar')]

    # Na tela de execução, conclui o treino
    Wait Until Element Is Visible    id=btn-concluir-treino    timeout=10s
    Click Button    id=btn-concluir-treino

    # Na tela de feedback, seleciona o nível de esforço e finaliza
    Wait Until Element Is Visible    data-testid=feedback-submit-button    timeout=10s
    Select From List By Value    id=feedback    MODERADO
    Click Button    data-testid=feedback-submit-button

    # Aceita o alert de confirmação "Treino finalizado com sucesso!"
    Handle Alert    action=ACCEPT

    # Verifica redirecionamento ao histórico
    Wait Until Location Is    ${URL_HISTORICO}    timeout=10s

    # O histórico agora deve exibir exatamente 1 entrada (1 dia ativo)
    Wait Until Element Is Visible    ${BTN_VOLTAR}    timeout=10s
    ${entries}=    Get WebElements    xpath=//div[contains(@style,'border: 2px solid rgb(22, 163, 74)')]
    Length Should Be    ${entries}    1

*** Keywords ***
Logar no Sistema como Idoso Ativo
    Open Browser    ${URL_LOGIN}    ${BROWSER}    options=add_argument("--incognito")
    Maximize Browser Window
    Set Selenium Speed    0.3 seconds

    Wait Until Element Is Visible    ${INPUT_EMAIL}    timeout=5s
    Input Text        ${INPUT_EMAIL}    ${EMAIL_IDOSO}
    Input Password    ${INPUT_SENHA}    ${SENHA_IDOSO}

    Wait Until Element Is Visible    ${BTN_LOGIN}    timeout=10s
    Click Button    ${BTN_LOGIN}

    # Idoso com quiz respondido vai direto ao dashboard
    Wait Until Element Is Visible    id=nomeApp    timeout=10s

Fechar o Navegador
    Close Browser
