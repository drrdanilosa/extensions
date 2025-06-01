# 🦊 Instruções de Instalação - Firefox

## ⚡ Instalação Rápida

### **Método 1: about:debugging (Recomendado)**
1. Abra o Firefox
2. Digite `about:debugging` na barra de endereços
3. Clique em **"Este Firefox"**
4. Clique em **"Carregar extensão temporária"**
5. Navegue até esta pasta e selecione `manifest.json`
6. ✅ Extensão carregada! Procure o ícone na barra de ferramentas

### **Método 2: Via PowerShell (Automático)**
```powershell
# Execute como administrador se necessário
./instalar-firefox.ps1
```

---

## 🧪 Como Testar

### **Teste Básico:**
1. Clique no ícone da extensão
2. Digite um username: `exemplo`
3. Clique em **"Buscar Agora"**
4. Aguarde o progresso 0% → 100%
5. Verifique resultados encontrados

### **Teste Avançado:**
1. Username sugestivo: `modelo2024`
2. Observe categorias diferentes (social, adult, portfolio)
3. Verifique tags de urgência (laranja/vermelho)
4. Teste exportação de resultados
5. Confira console F12 (não deve ter erros)

---

## 📊 O que Esperar

### **Dashboard de Estatísticas:**
- **Encontrado:** Contagem total de perfis localizados
- **Urgente:** Plataformas adultas que requerem atenção
- **Alto Risco:** Resultados com alta confiança
- **Por Categoria:** Distribuição por tipo de plataforma

### **Resultados Típicos para "exemplo":**
- 🔷 Redes sociais: 8-12 resultados
- 🟥 Conteúdo adulto: 3-6 resultados  
- 🟨 Portfólios: 4-7 resultados
- 🟦 Casting: 2-4 resultados
- 💬 Fóruns: 1-3 resultados

### **Sistema de Confiança:**
- **90-100%:** Muito provável (verde escuro)
- **70-89%:** Provável (verde)
- **50-69%:** Possível (amarelo)
- **30-49%:** Baixa chance (laranja)
- **0-29%:** Improvável (vermelho)

---

## 🔧 Solução de Problemas

### **Extensão não aparece:**
- Verifique se selecionou o arquivo `manifest.json` correto
- Recarregue a página about:debugging
- Tente fechar e reabrir o Firefox

### **Erro ao carregar:**
- Confirme que está usando Firefox (não Chrome)
- Verifique se a pasta está completa
- Veja erros no console da extensão

### **Busca não funciona:**
- Aguarde alguns segundos após clicar "Buscar"
- Verifique conexão com internet (mesmo sendo simulado)
- Teste com username simples: `test`

### **Performance lenta:**
- Normal para primeira busca (carregamento)
- 400+ verificações podem levar 1-2 minutos
- Progresso deve atualizar a cada 10%

---

## 📁 Estrutura dos Arquivos

```
nova-extensao/
├── manifest.json          # Configuração da extensão
├── popup.html             # Interface principal
├── popup.css              # Estilos visuais
├── popup.js               # Lógica da interface
├── background.js          # Motor de busca
├── icons/                 # Ícones da extensão
├── README.md              # Documentação
├── RELATORIO_FINAL_V2.md  # Resumo completo
└── teste-*.js             # Scripts de teste
```

---

## 🎯 Recursos da v2.0

### **✅ Implementado:**
- 80+ plataformas organizadas
- 26+ variações automáticas
- Sistema de confiança inteligente
- Interface estatística
- Export detalhado
- Compatibilidade ES5 total

### **🔄 Simulação Inteligente:**
- Probabilidades realistas por categoria
- Variações têm peso diferente
- Username original tem prioridade
- Adulto/cam = menor probabilidade
- Social/portfolio = maior probabilidade

---

## ⚠️ Lembrete Importante

**Esta extensão realiza SIMULAÇÃO de busca para demonstração.**
- Não faz requisições HTTP reais às plataformas
- Resultados são gerados algoritmicamente
- Para uso real, adapte para APIs oficiais
- Sempre respeite termos de uso das plataformas

---

## 🆘 Suporte

Se encontrar problemas:
1. Verifique este arquivo de instruções
2. Consulte `RELATORIO_FINAL_V2.md`
3. Execute `node test-suite.js` para diagnósticos
4. Verifique console do Firefox (F12)

**Status:** ✅ **Pronto para uso profissional!**
