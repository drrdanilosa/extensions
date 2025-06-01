#!/usr/bin/env pwsh

# Script para executar testes do projeto DeepAlias Hunter Pro
# Execute este script no PowerShell para testar a aplicação

Write-Host "🚀 DeepAlias Hunter Pro - Test Runner" -ForegroundColor Blue

# Verificar se os testes existem
$testFiles = Get-ChildItem -Path "tests" -Filter "*.test.js" -Recurse
if ($testFiles.Count -eq 0) {
    Write-Host "❌ Nenhum arquivo de teste encontrado na pasta 'tests'!" -ForegroundColor Red
    exit 1
}

# Mostrar arquivos de teste encontrados
Write-Host "`n📋 Arquivos de teste encontrados:" -ForegroundColor Cyan
foreach ($file in $testFiles) {
    Write-Host "  - $($file.Name)" -ForegroundColor Gray
}

# Executar testes com Jest
Write-Host "`n🧪 Executando testes..." -ForegroundColor Yellow

# Verificar se Jest está instalado
try {
    npm list jest | Out-Null
} catch {
    Write-Host "`n❓ Jest não parece estar instalado. Deseja instalá-lo agora? (S/N)" -ForegroundColor Yellow
    $resposta = Read-Host
    if ($resposta -eq "S" -or $resposta -eq "s") {
        Write-Host "`n📦 Instalando Jest..." -ForegroundColor Cyan
        npm install --save-dev jest
    } else {
        Write-Host "❌ Abortando execução dos testes." -ForegroundColor Red
        exit 1
    }
}

# Executar os testes
Write-Host "`n🧪 Executando testes com Jest..." -ForegroundColor Yellow

# Verificar se há um script de teste no package.json
$packageJson = Get-Content "package.json" -ErrorAction SilentlyContinue | ConvertFrom-Json -ErrorAction SilentlyContinue
if ($packageJson -and $packageJson.scripts -and $packageJson.scripts.test) {
    npm test
} else {
    # Executar Jest diretamente
    npx jest --verbose
}

# Verificar resultado
if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Todos os testes passaram com sucesso!" -ForegroundColor Green
} else {
    Write-Host "`n❌ Alguns testes falharam. Verifique os erros acima." -ForegroundColor Red
}

Write-Host "`n📊 Resumo de cobertura disponível em 'coverage/lcov-report/index.html'" -ForegroundColor Cyan
Write-Host "🔍 DeepAlias Hunter Pro - Fim dos testes" -ForegroundColor Blue
