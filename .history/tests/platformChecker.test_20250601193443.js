/**
 * Testes para PlatformChecker
 * @version 3.0.0
 */

import { PlatformChecker } from '../src/utils/platformChecker.js';

describe('PlatformChecker', () => {
    let checker;
    
    beforeEach(() => {
        checker = new PlatformChecker();
    });
    
    test('deve verificar uma plataforma e retornar resultado estruturado', async () => {
        const platform = {
            name: 'TestPlatform', 
            url: 'https://test.com/{username}', 
            icon: '🧪',
            category: 'social',
            priority: 'medium'
        };
        
        const result = await checker.checkPlatform(platform, 'testuser', 'testuser');
        
        expect(result).toBeDefined();
        expect(result.platform).toBe('TestPlatform');
        expect(result.url).toBe('https://test.com/testuser');
        expect(result.icon).toBe('🧪');
        expect(result.category).toBe('social');
        expect(result.platformPriority).toBe('medium');
        expect(typeof result.found).toBe('boolean');
        expect(typeof result.confidence).toBe('number');
        expect(result.variation).toBe('testuser');
        expect(result.originalQuery).toBe('testuser');
        expect(result.timestamp).toBeDefined();
        expect(result.matchType).toBe('exact');
        
        if (result.found) {
            expect(result.riskLevel).toBeDefined();
            expect(result.priority).toBeDefined();
            expect(Array.isArray(result.relatedKeywords)).toBe(true);
        }
    });
    
    test('deve calcular nível de risco para categorias críticas', () => {
        const criticalCategories = ['adult', 'cam', 'escort', 'forum'];
        
        criticalCategories.forEach(category => {
            const platform = { category };
            const riskLevel = checker._calculateRiskLevel(platform, 0.5);
            expect(riskLevel).toBe('high');
        });
    });
    
    test('deve calcular nível de risco para categorias normais', () => {
        const normalCategories = ['social', 'portfolio', 'dev'];
        
        normalCategories.forEach(category => {
            const platform = { category };
            const highRisk = checker._calculateRiskLevel(platform, 0.9);
            const mediumRisk = checker._calculateRiskLevel(platform, 0.7);
            const lowRisk = checker._calculateRiskLevel(platform, 0.3);
            
            expect(highRisk).toBe('high');
            expect(mediumRisk).toBe('medium');
            expect(lowRisk).toBe('low');
        });
    });
    
    test('deve calcular prioridade como urgente para categorias críticas', () => {
        const criticalCategories = ['adult', 'cam', 'escort', 'forum'];
        
        criticalCategories.forEach(category => {
            const platform = { category };
            const priority = checker._calculatePriority(platform);
            expect(priority).toBe('urgent');
        });
    });
    
    test('deve calcular prioridade como normal para categorias regulares', () => {
        const normalCategories = ['social', 'dev', 'blog'];
        
        normalCategories.forEach(category => {
            const platform = { category };
            const priority = checker._calculatePriority(platform);
            expect(priority).toBe('normal');
        });
    });
    
    test('deve gerar palavras-chave com base no SearchPatternService', async () => {
        // Testar com categoria que existe no SearchPatternService
        const adultPlatform = { category: 'adult' };
        const adultKeywords = await checker._generateRelatedKeywords(adultPlatform);
        
        expect(adultKeywords).toBeDefined();
        expect(Array.isArray(adultKeywords)).toBe(true);
        
        // Se não existir pattern para uma categoria específica, deve usar os defaults
        const randomPlatform = { category: 'randomcategory' };
        const randomKeywords = await checker._generateRelatedKeywords(randomPlatform);
        
        expect(randomKeywords).toBeDefined();
        expect(Array.isArray(randomKeywords)).toBe(true);
        expect(randomKeywords.length).toBeGreaterThan(0);
    });
});
