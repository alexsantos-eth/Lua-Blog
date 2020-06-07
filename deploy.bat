XCOPY /S /Q .\build .\functions\build
REPLACE .\build\service-worker.js .\public
firebase deploy
