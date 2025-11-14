@echo off
REM Windows batch script to run webpage validation
REM Usage: validate.bat [url]

setlocal

if "%~1"=="" (
    echo Running validation with default URL...
    node "%~dp0validate-webpage.js"
) else (
    echo Running validation for %1
    set TARGET_URL=%1
    node "%~dp0validate-webpage.js"
)

endlocal
