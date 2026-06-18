*** Settings ***
Library    SeleniumLibrary

*** Variables ***
${URL}       http://localhost:5173/rotinas
${BROWSER}   chrome

*** Test Cases ***
CT01 - Duração mínima válida

    Open Browser    ${URL}    ${BROWSER}
    Maximize Browser Window

    Input Text    id=duracao    10

    Click Button    Salvar

    Sleep    2s

    Close Browser