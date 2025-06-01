/**
 * Search Engine - Motor de busca inteligente
 * @version 3.0.0
 */

import { UsernameVariator } from '../utils/usernameVariator.js';
import { PlatformChecker } from '../utils/platformChecker.js';
import { SearchPatternService } from './searchPatternService.js';

export class SearchEngine {
    constructor() {
        this.variator = new UsernameVariator();
        this.checker = new PlatformChecker();
        this.patternService = new SearchPatternService();
        this.isSearching = false;
        this.currentResults = [];
    }

    /**
     * Iniciar busca
     */
    async startSearch(username, platforms, onProgress, onResult) {
        console.log('🔍 Iniciando busca para:', username);
        
        this.isSearching = true;
        this.currentResults = [];
        
        // Gerar variações do username
        const variations = this.variator.generateVariations(username);
        console.log(`📝 Geradas ${variations.length} variações`);

        // Calcular total de verificações
        const totalChecks = platforms.length * Math.min(variations.length, 5);
        let currentCheck = 0;

        // Processar cada plataforma
        for (const platform of platforms) {
            if (!this.isSearching) break;

            // Usar as 5 variações mais relevantes
            const mainVariations = variations.slice(0, 5);
            
            for (const variation of mainVariations) {
                if (!this.isSearching) break;

                // Verificar plataforma
                const result = await this.checker.checkPlatform(platform, variation, username);
                this.currentResults.push(result);

                // Atualizar progresso
                currentCheck++;
                const progress = {
                    current: currentCheck,
                    total: totalChecks,
                    percentage: Math.round((currentCheck / totalChecks) * 100)
                };

                if (onProgress) onProgress(progress);
                if (onResult) onResult(result);

                // Delay entre verificações
                await this._delay(300);
            }
        }

        // Organizar resultados
        this._sortResults();
        
        console.log('✅ Busca concluída');
        this.isSearching = false;
        
        return this.currentResults;
    }

    /**
     * Parar busca
     */
    stopSearch() {
        console.log('🛑 Parando busca...');
        this.isSearching = false;
    }

    /**
     * Obter resultados atuais
     */
    getResults() {
        return this.currentResults;
    }

    /**
     * Limpar resultados
     */
    clearResults() {
        this.currentResults = [];
    }

    /**
     * Organizar resultados por prioridade
     */
    _sortResults() {
        this.currentResults.sort((a, b) => {
            // Priorizar encontrados
            if (a.found && !b.found) return -1;
            if (!a.found && b.found) return 1;
            
            if (a.found && b.found) {
                // Por prioridade da plataforma
                const priorityOrder = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
                const aPriority = priorityOrder[a.platformPriority] || 0;
                const bPriority = priorityOrder[b.platformPriority] || 0;
                
                if (aPriority !== bPriority) return bPriority - aPriority;
                
                // Por confiança
                return (b.confidence || 0) - (a.confidence || 0);
            }
            
            return 0;
        });
    }

    /**
     * Delay entre verificações
     */
    _delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
