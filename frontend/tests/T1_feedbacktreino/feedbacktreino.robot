*** Settings ***
Library    SeleniumLibrary

*** Variables ***
${URL}       http://localhost:5173
${BROWSER}   chrome

*** Test Cases ***
CT01 - Feedback válido

    Open Browser    ${URL}    ${BROWSER}
    Maximize Browser Window

    Input Text      id=email    analidia123@gmail.com
    Input Password  id=senha    12345678

    Click Button    Entrar

    Sleep    2s

    Go To    http://localhost:5173/feedback

    Select From List By Value
    ...    css:[data-testid="feedback-dificuldade-select"]
    ...    FACIL

    Click Button    css:[data-testid="feedback-submit-button"]

    Sleep    2s

    Close Browser