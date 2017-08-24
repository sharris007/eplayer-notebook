@For /F "tokens=2,3,4 delims=/ " %%A in ('Date /t') do @(
    set Month=%%A
    set Day=%%B
    set Year=%%C
    set MYDATE=%%B-%%A-%%C
) 
./node_modules/.bin/allure generate --clean allure-results_%MYDATE%