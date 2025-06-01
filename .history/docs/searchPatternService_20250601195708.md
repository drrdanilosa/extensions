## SearchPatternService (Model Layer)
**Localização:** `src/services/searchPatternService.js`

**Responsabilidades:**
- Gerenciamento de padrões de busca categorizados
- Análise de risco por categoria e palavras-chave
- Detecção de atividades por padrões linguísticos
- Fornecimento de palavras-chave contextuais
- Suporte a buscas regionais (Brasil)

**Estrutura de Padrões:**
```javascript
{
  category: 'adult',         // Categoria do padrão
  risk: 'high',              // Nível de risco (high, medium, low)
  keywords: [                // Palavras-chave relacionadas
    'onlyfans', 'ofans', 'fansly', 'privacy', 'nudes', 'leaked', ...
  ]
}
```

**Categorias de Padrões:**
- `adult` - Conteúdo adulto e plataformas como OnlyFans
- `escort` - Sites de acompanhantes e serviços relacionados
- `modeling` - Portfólios, casting e modelagem
- `social` - Redes sociais e links biográficos
- `images` - Compartilhamento de imagens sensíveis
- `forum` - Fóruns de discussão e comunidades de leak
- `regional` - Termos regionais brasileiros
- `osint` - Termos gerais de inteligência OSINT

**Principais Métodos:**
```javascript
// Acesso a padrões
getAllPatterns()            // Todos os padrões disponíveis
getPatternsByCategory(cat)  // Padrões de uma categoria específica
getRelatedPatterns(term)    // Padrões relacionados a um termo

// Inicialização
_initializePatterns()       // Carregar base de dados de padrões
```

**Integração:**
O SearchPatternService integra-se principalmente com:
1. SearchEngine - Para enriquecer resultados com palavras-chave e risco
2. PlatformChecker - Para avaliação de risco e relevância em resultados

**Exemplo de Uso:**
```javascript
// No SearchEngine
_enrichResultWithSearchPatterns(result) {
  const patterns = this.patternService.getPatternsByCategory(result.category);
  
  // Extrair palavras-chave relevantes para enriquecer resultado
  result.relatedKeywords = [];
  
  for (const pattern of patterns) {
    // Adicionar algumas palavras-chave do padrão
    const keywords = pattern.keywords || [];
    if (keywords.length > 0) {
      result.relatedKeywords.push(...keywords.slice(0, 3));
    }
    
    // Definir nível de risco baseado no padrão
    if (pattern.risk && pattern.risk === 'high') {
      result.riskLevel = 'high';
      result.priority = 'urgent';
    }
  }
}
```
