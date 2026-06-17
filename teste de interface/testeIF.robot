*** Settings ***
Documentation   Suite de testes para a tela de aceite do aviso medico.
Library         SeleniumLibrary
Test Setup      Abrir Navegador e realizar login
Test Teardown   Close Browser

*** Variables ***
#URLs
${URL_LOGIN}      http://localhost:5173
${URL_AVISO}      http://localhost:5173/quiz
${URL_TREINOS}    http://localhost:5173/dashboard
${NAVEGADOR}      firefox

#Dados de login
${USUARIO1}   antonio1@yahoo.com
${USUARIO2}   antonio2@yahoo.com
${SENHA}      antonio

#Campos de login
${CAMPO_EMAIL}   id=email
${CAMPO_SENHA}   id=senha
${BOTAO_ENTRAR}  id=bnt-success

#campos questionario
${CHECKBOX_ACEITE}
${BOTAO_SALVAR}
${MENSAGEM_ERRO}
${TITULO_TELA_}

*** Test Cases ***
CT01: Validar acesso permitido com aceite valido
    [Documentation]   Testa a particao de equivalencia valida (Checkbox Marcada).
    Select Checkbox   ${}
    Click Button      ${}

    #validacao (resultado esperado): deve redirecionar para a tela de treinos
    Wait Until Location Is         ${}
    Wait Until Element Is Visible  ${}

*** Keywords *** 