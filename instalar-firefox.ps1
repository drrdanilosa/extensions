# DeepAlias Hunter Pro - Nova Extensão
# Script de instalação e teste para Firefox

Write-Host "🚀 DEEPALIAS HUNTER PRO - NOVA EXTENSÃO" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

$extensionPath = "C:\Users\drdan\CURSOS_TESTE\CRIANDO\SCRIPTS\busca\nova-extensao"

# 1. Verificar arquivos essenciais
Write-Host "`n📋 VERIFICANDO ARQUIVOS..." -ForegroundColor Yellow

$requiredFiles = @(
    "manifest.json",
    "background.js",
    "popup.html",
    "popup.css",
    "popup.js"
)

$allFilesExist = $true
foreach ($file in $requiredFiles) {
    $filePath = Join-Path $extensionPath $file
    if (Test-Path $filePath) {
        $size = (Get-Item $filePath).Length
        Write-Host "✅ $file ($size bytes)" -ForegroundColor Green
    } else {
        Write-Host "❌ $file - AUSENTE!" -ForegroundColor Red
        $allFilesExist = $false
    }
}

# Verificar ícones
$iconCount = (Get-ChildItem "$extensionPath\icons\*.png" | Measure-Object).Count
if ($iconCount -eq 4) {
    Write-Host "✅ Ícones (4 arquivos)" -ForegroundColor Green
} else {
    Write-Host "⚠️ Ícones incompletos ($iconCount/4 arquivos)" -ForegroundColor Yellow
}

if (-not $allFilesExist) {
    Write-Host "`n❌ ERRO: Arquivos essenciais ausentes!" -ForegroundColor Red
    exit 1
}

# 2. Validar manifest.json
Write-Host "`n🔍 VALIDANDO MANIFEST..." -ForegroundColor Yellow

try {
    $manifestContent = Get-Content (Join-Path $extensionPath "manifest.json") -Raw
    $manifest = $manifestContent | ConvertFrom-Json
    
    Write-Host "✅ Nome: $($manifest.name)" -ForegroundColor Green
    Write-Host "✅ Versão: $($manifest.version)" -ForegroundColor Green
    Write-Host "✅ Manifest Version: $($manifest.manifest_version)" -ForegroundColor Green
    
    if ($manifest.manifest_version -eq 2) {
        Write-Host "✅ Manifest V2 (Firefox compatível)" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Manifest V$($manifest.manifest_version) - verifique compatibilidade" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "❌ Erro ao validar manifest: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 3. Instruções de instalação
Write-Host "`n🦊 INSTALAÇÃO NO FIREFOX:" -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan

# Abrir pasta da extensão
Write-Host "📂 Abrindo pasta da extensão..." -ForegroundColor Yellow
Start-Process "explorer.exe" -ArgumentList $extensionPath

Write-Host "`n📋 PASSOS PARA INSTALAR:" -ForegroundColor White
Write-Host "1. Abra o Firefox" -ForegroundColor White
Write-Host "2. Digite: about:debugging" -ForegroundColor White
Write-Host "3. Clique em 'Este Firefox'" -ForegroundColor White
Write-Host "4. Clique em 'Carregar extensão temporária...'" -ForegroundColor White
Write-Host "5. Selecione o arquivo 'manifest.json' na pasta que abriu" -ForegroundColor White
Write-Host "6. Clique em 'Abrir'" -ForegroundColor White

Write-Host "`n🧪 COMO TESTAR:" -ForegroundColor Cyan
Write-Host "================" -ForegroundColor Cyan
Write-Host "1. Verifique se a extensão aparece na lista sem erros" -ForegroundColor White
Write-Host "2. Clique no ícone da extensão na barra de ferramentas" -ForegroundColor White
Write-Host "3. Digite um username de teste (ex: 'github')" -ForegroundColor White
Write-Host "4. Clique em 'Buscar'" -ForegroundColor White
Write-Host "5. Observe o progresso e os resultados" -ForegroundColor White
Write-Host "6. Teste as funções de parar e limpar" -ForegroundColor White
Write-Host "7. Teste a exportação dos resultados" -ForegroundColor White

Write-Host "`n💡 RECURSOS DA EXTENSÃO:" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan
Write-Host "✅ Interface moderna e responsiva" -ForegroundColor Green
Write-Host "✅ Busca em 8 plataformas principais" -ForegroundColor Green
Write-Host "✅ Progresso visual em tempo real" -ForegroundColor Green
Write-Host "✅ Resultados organizados (encontrados primeiro)" -ForegroundColor Green
Write-Host "✅ Exportação para clipboard" -ForegroundColor Green
Write-Host "✅ Abertura de URLs com clique" -ForegroundColor Green
Write-Host "✅ Validação de entrada" -ForegroundColor Green
Write-Host "✅ Status de conexão" -ForegroundColor Green

Write-Host "`n⚠️ IMPORTANTE:" -ForegroundColor Yellow
Write-Host "- Esta é uma extensão TEMPORÁRIA" -ForegroundColor White
Write-Host "- Será removida quando o Firefox for fechado" -ForegroundColor White
Write-Host "- Os resultados são simulados para demonstração" -ForegroundColor White

Write-Host "`n🔧 DEBUGGING:" -ForegroundColor Cyan
Write-Host "===============" -ForegroundColor Cyan
Write-Host "Se houver problemas:" -ForegroundColor White
Write-Host "1. Abra o Console do Desenvolvedor (F12)" -ForegroundColor White
Write-Host "2. Vá para a aba 'Console'" -ForegroundColor White
Write-Host "3. Verifique mensagens de erro" -ForegroundColor White
Write-Host "4. Na página about:debugging, clique em 'Inspecionar' na extensão" -ForegroundColor White

# 4. Aguardar instalação
Write-Host "`n⏳ AGUARDANDO INSTALAÇÃO..." -ForegroundColor Yellow
Write-Host "Pressione qualquer tecla após instalar a extensão..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# 5. Feedback
Write-Host "`n📝 TESTE REALIZADO:" -ForegroundColor Cyan
Write-Host "A extensão foi instalada com sucesso? (S/N): " -NoNewline -ForegroundColor Yellow
$installSuccess = Read-Host

if ($installSuccess -eq "S") {
    Write-Host "O popup abriu corretamente? (S/N): " -NoNewline -ForegroundColor Yellow
    $popupSuccess = Read-Host
    
    Write-Host "A busca funcionou? (S/N): " -NoNewline -ForegroundColor Yellow
    $searchSuccess = Read-Host
    
    Write-Host "Os resultados apareceram? (S/N): " -NoNewline -ForegroundColor Yellow
    $resultsSuccess = Read-Host
}

# 6. Análise final
Write-Host "`n📊 RESULTADO FINAL:" -ForegroundColor Cyan
Write-Host "=====================" -ForegroundColor Cyan

if ($installSuccess -eq "S") {
    Write-Host "✅ Instalação bem-sucedida" -ForegroundColor Green
    
    if ($popupSuccess -eq "S") {
        Write-Host "✅ Interface funcionando" -ForegroundColor Green
    } else {
        Write-Host "❌ Problema na interface" -ForegroundColor Red
    }
    
    if ($searchSuccess -eq "S") {
        Write-Host "✅ Busca funcionando" -ForegroundColor Green
    } else {
        Write-Host "❌ Problema na busca" -ForegroundColor Red
    }
    
    if ($resultsSuccess -eq "S") {
        Write-Host "✅ Resultados funcionando" -ForegroundColor Green
    } else {
        Write-Host "❌ Problema nos resultados" -ForegroundColor Red
    }
    
    if ($popupSuccess -eq "S" -and $searchSuccess -eq "S" -and $resultsSuccess -eq "S") {
        Write-Host "`n🎉 SUCESSO TOTAL!" -ForegroundColor Green
        Write-Host "A extensão está 100% funcional!" -ForegroundColor Green
    } else {
        Write-Host "`n⚠️ Sucesso parcial" -ForegroundColor Yellow
        Write-Host "Algumas funções precisam de ajustes" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ Falha na instalação" -ForegroundColor Red
    Write-Host "Verifique erros no console do Firefox" -ForegroundColor Yellow
}

Write-Host "`n🏁 TESTE CONCLUÍDO!" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
