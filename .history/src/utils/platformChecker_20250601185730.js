/**
 * Platform Checker - Verificador de plataformas
 * @version 3.0.0
 */

import { SearchPatternService } from '../services/searchPatternService.js';

export class PlatformChecker {
    constructor() {
        this.patternService = new SearchPatternService();
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
            'dev': 1.0,
            'escort': 0.8
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
            result.relatedKeywords = await this._generateRelatedKeywords(platform);
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
        // Categorias críticas sempre são alto risco
        const criticalCategories = ['adult', 'cam', 'escort', 'forum'];
        if (criticalCategories.includes(platform.category) || platform.priority === 'critical') {
            return 'high';
        }
        
        // Para outras categorias, basear no nível de confiança
        if (confidence > 0.8) return 'high';
        if (confidence > 0.5) return 'medium';
        return 'low';
    }

    /**
     * Calcular prioridade
     */
    _calculatePriority(platform) {
        const criticalCategories = ['adult', 'cam', 'escort', 'forum'];
        
        if (criticalCategories.includes(platform.category) || platform.priority === 'critical') {
            return 'urgent';
        }
        
        // Sites de imagens sensíveis e casting também podem ser urgentes dependendo do caso
        const sensitiveCategories = ['images', 'casting'];
        if (sensitiveCategories.includes(platform.category) && platform.priority === 'high') {
            return 'urgent';
        }
        
        return 'normal';
    }

    /**
     * Gerar palavras-chave relacionadas usando SearchPatternService
     */
    async _generateRelatedKeywords(platform) {
        // Obter padrões relacionados à categoria
        const patterns = this.patternService.getPatternsByCategory(platform.category);
        
        if (!patterns || patterns.length === 0) {
            return this._getDefaultKeywords(platform.category);
        }
        
        // Selecionar um padrão aleatório
        const randomPattern = patterns[Math.floor(Math.random() * patterns.length)];
        
        // Selecionar palavras-chave aleatórias do padrão
        const selectedKeywords = [];
        const keywords = randomPattern.keywords || [];
        
        // Pegar entre 3-5 palavras-chave aleatórias
        const keywordsToSelect = Math.floor(Math.random() * 3) + 3; // 3 a 5 palavras-chave
        
        for (let i = 0; i < keywordsToSelect && i < keywords.length; i++) {
            const randomIndex = Math.floor(Math.random() * keywords.length);
            const keyword = keywords[randomIndex];
            
            if (!selectedKeywords.includes(keyword)) {
                selectedKeywords.push(keyword);
            }
        }
        
        return selectedKeywords;
    }
    
    /**
     * Obter palavras-chave padrão caso não haja padrões na categoria
     */
    _getDefaultKeywords(category) {
        const keywordMap = {
            'adult': ['nsfw', 'explicit', 'content', 'premium'],
            'cam': ['live', 'streaming', 'cam', 'show'],
            'social': ['profile', 'account', 'social', 'public'],
            'portfolio': ['portfolio', 'art', 'creative', 'professional'],
            'forum': ['discussion', 'community', 'forum', 'leaked'],
            'escort': ['acompanhante', 'sigiloso', 'massagem', 'encontros'],
            'casting': ['modelo', 'agência', 'book', 'seleção'],
            'images': ['fotos', 'álbum', 'galeria', 'compartilhamento']
        };

        return keywordMap[category] || ['profile', 'account', 'search', 'find'];
    }
}
