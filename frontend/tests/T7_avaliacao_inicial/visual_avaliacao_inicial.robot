*** Settings ***
Library         SeleniumLibrary

# Login feito uma única vez para toda a suite (evita login repetido)
Suite Setup     Logar no Sistema como Idoso Sem Quiz
Suite Teardown  Fechar o Navegador

*** Variables ***
${URL_LOGIN}        http://localhost:5173/
${URL_QUIZ}         http://localhost:5173/quiz
${BROWSER}          chrome

# Elementos da Tela de Login
${INPUT_EMAIL}      id=email
${INPUT_SENHA}      id=senha
${BTN_LOGIN}        id=btnlogin

# Elementos da Tela de Avaliação Inicial (/quiz)
${CHECK_TERMO}      data-testid=quiz-termo-medico
${SELECT_P1}        id=p1
${SELECT_P2}        id=p2
${BTN_SALVAR}       id=btn-salvar-avaliacao
${MSG_ERRO}         data-testid=quiz-error-message

# Usuário idoso que ainda NÃO respondeu o quiz (respondeu_quiz = false no banco)
# IMPORTANTE: Use um usuário criado especificamente para este teste
${EMAIL_IDOSO}      t7.teste@vidaativa.com
${SENHA_IDOSO}      123456789

*** Test Cases ***
CT01 - T7 Visual: Deve bloquear submissao sem aceitar o termo medico
    [Documentation]    RN01 / US01 — Entrada Inválida.
    ...                O formulário NÃO deve ser enviado e deve exibir mensagem de erro
    ...                quando o aviso médico não é aceito.
    # Garante que está na página do quiz antes de cada caso de teste
    Go To                            ${URL_QUIZ}
    Wait Until Element Is Visible    ${BTN_SALVAR}    timeout=10s

    # NÃO marca o termo, responde as perguntas normalmente
    Select From List By Value    ${SELECT_P1}    3
    Select From List By Value    ${SELECT_P2}    4

    # Tenta submeter sem aceitar o termo
    Click Button    ${BTN_SALVAR}

    # Verifica que a mensagem de erro apareceu na tela (formulário bloqueado)
    Wait Until Element Is Visible    ${MSG_ERRO}    timeout=5s
    Element Should Contain           ${MSG_ERRO}    obrigatório aceitar

CT02 - T7 Visual: Deve processar avaliacao com sucesso com todas as perguntas respondidas
    [Documentation]    RN01 / US01 — Entrada Válida.
    ...                O sistema deve aceitar o formulário completo, processar e redirecionar
    ...                o idoso para o dashboard após salvar o perfil clínico.
    Go To                            ${URL_QUIZ}
    Wait Until Element Is Visible    ${BTN_SALVAR}    timeout=10s

    # Aceita o termo médico
    Select Checkbox    ${CHECK_TERMO}

    # Responde as duas perguntas obrigatórias
    Select From List By Value    ${SELECT_P1}    3
    Select From List By Value    ${SELECT_P2}    4

    # Submete o formulário
    Click Button    ${BTN_SALVAR}

    # Após o sucesso, o App.jsx redireciona o idoso ao dashboard via onAvaliacaoSuccess
    # O navegador chama o alert(), precisamos aceitá-lo para prosseguir
    Handle Alert    action=ACCEPT

    # Verifica redirecionamento para o painel do idoso
    Wait Until Location Is    http://localhost:5173/dashboard    timeout=10s

*** Keywords ***
Logar no Sistema como Idoso Sem Quiz
    Open Browser    ${URL_LOGIN}    ${BROWSER}    options=add_argument("--incognito")
    Maximize Browser Window
    Set Selenium Speed    0.3 seconds

    Wait Until Element Is Visible    ${INPUT_EMAIL}    timeout=5s
    Input Text        ${INPUT_EMAIL}    ${EMAIL_IDOSO}
    Input Password    ${INPUT_SENHA}    ${SENHA_IDOSO}

    Wait Until Element Is Visible    ${BTN_LOGIN}    timeout=10s
    Click Button    ${BTN_LOGIN}

    # Um idoso sem quiz é redirecionado diretamente para /quiz pelo App.jsx
    Wait Until Location Is    ${URL_QUIZ}    timeout=10s

Fechar o Navegador
    Close Browser
