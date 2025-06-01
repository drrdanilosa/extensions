/**
 * Storage Service - Gerenciamento de armazenamento
 * @version 3.0.0
 */

export class StorageService {
    constructor() {
        this.storageKey = 'deepAlias_v3';
    }

    /**
     * Salvar resultados da busca
     */
    async saveSearchResults(query, results, stats) {
        const searchData = {
            query,
            results,
            stats,
            timestamp: new Date().toISOString(),
            version: '3.0.0'
        };

        try {
            await chrome.storage.local.set({
                [this.storageKey]: searchData,
                lastSearch: searchData
            });
            console.log('💾 Resultados salvos no storage');
        } catch (error) {
            console.error('❌ Erro ao salvar no storage:', error);
        }
    }

    /**
     * Carregar última busca
     */
    async loadLastSearch() {
        try {
            const result = await chrome.storage.local.get(['lastSearch']);
            return result.lastSearch || null;
        } catch (error) {
            console.error('❌ Erro ao carregar do storage:', error);
            return null;
        }
    }

    /**
     * Salvar configurações do usuário
     */
    async saveSettings(settings) {
        try {
            await chrome.storage.local.set({ settings });
            console.log('⚙️ Configurações salvas');
        } catch (error) {
            console.error('❌ Erro ao salvar configurações:', error);
        }
    }

    /**
     * Carregar configurações
     */
    async loadSettings() {
        try {
            const result = await chrome.storage.local.get(['settings']);
            return result.settings || this._getDefaultSettings();
        } catch (error) {
            console.error('❌ Erro ao carregar configurações:', error);
            return this._getDefaultSettings();
        }
    }

    /**
     * Limpar dados
     */
    async clearAll() {
        try {
            await chrome.storage.local.clear();
            console.log('🗑️ Storage limpo');
        } catch (error) {
            console.error('❌ Erro ao limpar storage:', error);
        }
    }

    /**
     * Configurações padrão
     */
    _getDefaultSettings() {
        return {
            maxVariations: 5,
            delayBetweenChecks: 300,
            enableAdultCategories: true,
            showConfidenceScores: true,
            exportFormat: 'txt',
            theme: 'dark'
        };
    }
}
