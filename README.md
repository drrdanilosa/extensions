# DeepAlias Hunter Pro v1.0.0

[![GitHub repo](https://img.shields.io/badge/GitHub-drrdanilosa%2Fextensions-blue)](https://github.com/drrdanilosa/extensions)
[![Version](https://img.shields.io/badge/version-1.0.0-green)](https://github.com/drrdanilosa/extensions/releases)
[![License](https://img.shields.io/badge/license-MIT-yellow)](LICENSE)
[![Firefox](https://img.shields.io/badge/Firefox-Compatible-orange)](https://www.mozilla.org/firefox/)

## 🎯 Descrição

Extensão OSINT (Open Source Intelligence) para Firefox que permite buscar aliases/usernames em múltiplas plataformas de redes sociais simultaneamente.

## ✨ Características

- **Interface moderna**: Design responsivo com gradientes e animações
- **Busca em 8 plataformas**: GitHub, Twitter, Instagram, Facebook, LinkedIn, Reddit, YouTube, TikTok
- **Progresso visual**: Barra de progresso em tempo real
- **Resultados organizados**: Perfis encontrados aparecem primeiro
- **Exportação**: Copia resultados para clipboard
- **Validação**: Verifica formato do username antes da busca
- **Status de conexão**: Indica se a extensão está funcionando corretamente

## 📁 Estrutura de Arquivos

```
nova-extensao/
├── manifest.json          # Configuração da extensão (Manifest V2)
├── background.js          # Script de background (lógica principal)
├── popup.html            # Interface do usuário
├── popup.css             # Estilos da interface
├── popup.js              # Lógica da interface
├── instalar-firefox.ps1  # Script de instalação e teste
├── README.md             # Este arquivo
└── icons/                # Ícones da extensão
    ├── icon16.png
    ├── icon32.png
    ├── icon48.png
    └── icon128.png
```

## 🚀 Instalação

### Opção 1: Script Automático
1. Execute o PowerShell como administrador
2. Navegue até o diretório da extensão:
   ```powershell
   cd "C:\Users\drdan\CURSOS_TESTE\CRIANDO\SCRIPTS\busca\nova-extensao"
   ```
3. Execute o script de instalação:
   ```powershell
   .\instalar-firefox.ps1
   ```

### Opção 2: Manual
1. Abra o Firefox
2. Digite na barra de endereços: `about:debugging`
3. Clique em "Este Firefox"
4. Clique em "Carregar extensão temporária..."
5. Navegue até o diretório da extensão
6. Selecione o arquivo `manifest.json`
7. Clique em "Abrir"

## 🧪 Como Usar

1. **Instalar a extensão** seguindo as instruções acima
2. **Clicar no ícone** da extensão na barra de ferramentas do Firefox
3. **Digite um username** no campo de busca (ex: "github", "microsoft")
4. **Clicar em "Buscar"** para iniciar a verificação
5. **Aguardar os resultados** aparecerem (cerca de 6-8 segundos)
6. **Clicar nos resultados** para abrir as páginas das plataformas
7. **Usar "Exportar"** para copiar resultados para clipboard

## 🔧 Funcionalidades

### Busca
- Validação automática do username
- Busca simultânea em 8 plataformas
- Simulação realística de verificação de perfis
- Progresso visual em tempo real

### Interface
- Design moderno com gradientes
- Responsiva e intuitiva
- Animações suaves
- Status de conexão em tempo real

### Resultados
- Classificação automática (encontrados primeiro)
- Ícones representativos para cada plataforma
- URLs clicáveis
- Exportação formatada

### Controles
- Botão de parar busca
- Limpeza de resultados
- Validação de entrada
- Tratamento de erros

## 🛠️ Tecnologias

- **Manifest V2**: Compatibilidade com Firefox
- **Vanilla JavaScript**: Sem dependências externas
- **CSS3**: Gradientes, animações, grid layout
- **Chrome Extensions API**: Comunicação entre scripts

## 🔍 Debug e Troubleshooting

### Console do Background Script
1. Vá para `about:debugging`
2. Encontre a extensão na lista
3. Clique em "Inspecionar"
4. Verifique a aba "Console"

### Console do Popup
1. Clique com botão direito no popup da extensão
2. Selecione "Inspecionar elemento"
3. Verifique a aba "Console"

### Problemas Comuns

| Problema | Solução |
|----------|---------|
| Extensão não carrega | Verificar erros no manifest.json |
| Popup não abre | Verificar popup.html e popup.js |
| Busca não funciona | Verificar background.js no console |
| Resultados não aparecem | Verificar comunicação entre scripts |

## 📊 Status do Projeto

- ✅ **Manifest V2**: Firefox compatível
- ✅ **Interface**: Completamente funcional
- ✅ **Background Script**: Operacional
- ✅ **Comunicação**: Scripts se comunicam corretamente
- ✅ **Busca**: Sistema de simulação funcionando
- ✅ **Resultados**: Exibição e exportação OK
- ✅ **Validação**: Entrada de dados validada
- ✅ **Tratamento de Erros**: Implementado

## 🔮 Próximas Versões

- [ ] Integração com APIs reais das plataformas
- [ ] Mais plataformas (Discord, Telegram, etc.)
- [ ] Histórico de buscas
- [ ] Configurações personalizáveis
- [ ] Exportação em diferentes formatos
- [ ] Modo escuro/claro
- [ ] Versão para Chrome (Manifest V3)

## 📝 Notas

- Esta versão usa **simulação** para demonstrar a funcionalidade
- A extensão é **temporária** e será removida quando o Firefox for fechado
- Para uso em produção, seria necessário implementar verificação real das APIs
- O código está documentado e é facilmente extensível

## 🎉 Sucesso!

Se você chegou até aqui e a extensão está funcionando, parabéns! 🎉
Você tem uma extensão OSINT funcional e moderna rodando no Firefox.

---

**Desenvolvido por**: DeepAlias Hunter Pro Team  
**Versão**: 1.0.0  
**Data**: Junho 2025  
**Compatibilidade**: Firefox (Manifest V2)
