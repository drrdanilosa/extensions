/**
 * Platform Checker - Verificador de plataformas
 * @version 3.0.0
 */

export class PlatformChecker {
    constructor() {
        this.categoryMultipliers = {
            'social': 1.2,
            'adult': 0.8,
            'cam': 0.7,
            'portfolio': 1.0,
            'casting': 0.9,
            'forum': 0.4,
            'archive': 0.3,
            'linkinbio': 1.1,
            'images': 0.6,
            'dev': 1.0
        };
    }

    /**
     * Verificar uma plataforma específica
     */
    async checkPlatform(platform, variation, originalUsername) {
        console.log(`🔎 Verificando ${platform.name} com variação: ${variation}`);
        
        const url = platform.url.replace('{username}', variation);
        
        // Simular verificação inteligente
        const { found, confidence } = this._simulateCheck(platform, variation, originalUsername);
        
        const result = {
            platform: platform.name,
            url: url,
            icon: platform.icon,
            category: platform.category || 'other',
            platformPriority: platform.priority || 'medium',
            found: found,
            confidence: Math.round(confidence * 100),
            variation: variation,
            originalQuery: originalUsername,
            timestamp: new Date().toISOString(),
            matchType: variation === originalUsername ? 'exact' : 'variation'
        };

        // Adicionar informações extras para resultados encontrados
        if (found) {
            result.riskLevel = this._calculateRiskLevel(platform, confidence);
            result.priority = this._calculatePriority(platform);
            result.relatedKeywords = this._generateRelatedKeywords(platform);
        }

        return result;
    }

    /**
     * Simular verificação de plataforma
     */
    _simulateCheck(platform, variation, originalUsername) {
        let found = false;
        let confidence = 0;

        // Diferentes probabilidades baseadas na variação
        if (variation === originalUsername) {
            // Username original tem maior chance
            found = Math.random() > 0.3; // 70% chance
            confidence = found ? Math.random() * 0.3 + 0.7 : Math.random() * 0.3;
        } else if (variation.includes(originalUsername)) {
            // Variações que contêm o username original
            found = Math.random() > 0.5; // 50% chance
            confidence = found ? Math.random() * 0.3 + 0.5 : Math.random() * 0.4;
        } else {
            // Outras variações
            found = Math.random() > 0.7; // 30% chance
            confidence = found ? Math.random() * 0.3 + 0.3 : Math.random() * 0.3;
        }

        // Aplicar multiplicador de categoria
        const multiplier = this.categoryMultipliers[platform.category] || 1.0;
        confidence = Math.min(confidence * multiplier, 1.0);

        // Ajustar pela prioridade da plataforma
        const priorityMultipliers = {
            'critical': 1.3,
            'high': 1.1,
            'medium': 1.0,
            'low': 0.8
        };
        
        const priorityMultiplier = priorityMultipliers[platform.priority] || 1.0;
        confidence = Math.min(confidence * priorityMultiplier, 1.0);

        return { found, confidence };
    }

    /**
     * Calcular nível de risco
     */
    _calculateRiskLevel(platform, confidence) {
        if (confidence > 0.8) return 'high';
        if (confidence > 0.5) return 'medium';
        return 'low';
    }

    /**
     * Calcular prioridade
     */
    _calculatePriority(platform) {
        const criticalCategories = ['adult', 'cam', 'forum'];
        
        if (criticalCategories.includes(platform.category) || platform.priority === 'critical') {
            return 'urgent';
        }
        
        return 'normal';
    }

    /**
     * Gerar palavras-chave relacionadas
     */
    _generateRelatedKeywords(platform) {
        const keywordMap = {
            'adult': ['nsfw', 'explicit', 'content', 'premium'],
            'cam': ['live', 'streaming', 'cam', 'show'],
            'social': ['profile', 'account', 'social', 'public'],
            'portfolio': ['portfolio', 'art', 'creative', 'professional'],
            'forum': ['discussion', 'community', 'forum', 'leaked']
        };

        const categoryKeywords = keywordMap[platform.category] || [];
        
        // Retornar algumas palavras-chave aleatórias
        const selected = [];
        for (let i = 0; i < Math.min(3, categoryKeywords.length); i++) {
            if (Math.random() > 0.5) {
                selected.push(categoryKeywords[i]);
            }
        }
        
        return selected;
    }
}
