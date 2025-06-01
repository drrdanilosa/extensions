/**
 * Testes para SearchPatternService
 * @version 3.0.0
 */

import { SearchPatternService } from '../src/services/searchPatternService.js';

describe('SearchPatternService', () => {
    let service;
    
    beforeEach(() => {
        service = new SearchPatternService();
    });
    
    test('deve retornar todos os padrões', () => {
        const patterns = service.getAllPatterns();
        expect(patterns).toBeDefined();
        expect(Array.isArray(patterns)).toBe(true);
        expect(patterns.length).toBeGreaterThan(0);
    });
    
    test('deve retornar padrões por categoria', () => {
        const adultPatterns = service.getPatternsByCategory('adult');
        expect(adultPatterns).toBeDefined();
        expect(Array.isArray(adultPatterns)).toBe(true);
        expect(adultPatterns.length).toBeGreaterThan(0);
        expect(adultPatterns[0].category).toBe('adult');
        
        const forumPatterns = service.getPatternsByCategory('forum');
        expect(forumPatterns).toBeDefined();
        expect(Array.isArray(forumPatterns)).toBe(true);
        expect(forumPatterns.length).toBeGreaterThan(0);
        expect(forumPatterns[0].category).toBe('forum');
    });
    
    test('deve retornar padrões relacionados a um termo', () => {
        // Termo relacionado a adulto
        const onlyfansPatterns = service.getRelatedPatterns('onlyfans');
        expect(onlyfansPatterns).toBeDefined();
        expect(Array.isArray(onlyfansPatterns)).toBe(true);
        expect(onlyfansPatterns.length).toBeGreaterThan(0);
        expect(onlyfansPatterns[0].category).toBe('adult');
        
        // Termo relacionado a escort
        const escortPatterns = service.getRelatedPatterns('escort');
        expect(escortPatterns).toBeDefined();
        expect(Array.isArray(escortPatterns)).toBe(true);
        expect(escortPatterns.length).toBeGreaterThan(0);
        expect(escortPatterns[0].category).toBe('escort');
        
        // Termo relacionado a modelagem
        const modelPatterns = service.getRelatedPatterns('portfolio');
        expect(modelPatterns).toBeDefined();
        expect(Array.isArray(modelPatterns)).toBe(true);
        expect(modelPatterns.length).toBeGreaterThan(0);
        expect(modelPatterns[0].category).toBe('modeling');
    });
    
    test('deve retornar array vazio para termos não relacionados', () => {
        const randomPatterns = service.getRelatedPatterns('dsafhkjasfhkasjfhaskjf');
        expect(randomPatterns).toBeDefined();
        expect(Array.isArray(randomPatterns)).toBe(true);
        expect(randomPatterns.length).toBe(0);
    });
    
    test('cada padrão deve ter estrutura correta', () => {
        const patterns = service.getAllPatterns();
        
        patterns.forEach(pattern => {
            expect(pattern).toHaveProperty('category');
            expect(pattern).toHaveProperty('risk');
            expect(pattern).toHaveProperty('keywords');
            expect(Array.isArray(pattern.keywords)).toBe(true);
            expect(pattern.keywords.length).toBeGreaterThan(0);
        });
    });
});
