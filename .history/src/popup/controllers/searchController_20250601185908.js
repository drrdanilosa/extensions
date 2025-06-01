/**
 * SearchController - Controlador de Busca
 * Gerencia todo o fluxo de busca e comunicação com background
 * @version 3.0.0
 */

export class SearchController {
    constructor(uiManager) {
        this.uiManager = uiManager;
        this.isSearching = false;
        this.statusMonitoringInterval = null;
        this.eventEmitter = new EventTarget();
        
        console.log('🔍 SearchController inicializado');
    }

    /**
     * Sistema de eventos
     */
    on(event, callback) {
        this.eventEmitter.addEventListener(event, callback);
    }

    emit(event, data = null) {
        this.eventEmitter.dispatchEvent(new CustomEvent(event, { detail: data }));
    }

    /**
     * Iniciar busca
     */
    async startSearch() {
        try {
            // Validar entrada
            if (!this.uiManager.validateInput()) {
                return;
            }

            const username = this.uiManager.getUsername();
            
            // Verificar se já está buscando
            if (this.isSearching) {
                this.uiManager.showError('Busca já em andamento');
                return;
            }

            console.log(`🔍 Iniciando busca para: ${username}`);
            
            // Atualizar estado
            this.isSearching = true;
            this.uiManager.hideError();
            this.uiManager.setSearchingState(true);
            this.uiManager.setStatus('🔍 Iniciando busca profunda...', 'searching');
            
            // Emitir evento de início
            this.emit('searchStart', { username });

            // Enviar comando para background
            const response = await this.sendMessage({
                action: 'startSearch',
                username: username,
                settings: await this.getSearchSettings()
            });

            if (response && response.status === 'success') {
                this.uiManager.setStatus('🔍 Busca em andamento...', 'searching');
                this.startStatusMonitoring();
                this.uiManager.showNotification(`Busca iniciada para "${username}"`, 'success');
            } else {
                throw new Error(response?.message || 'Erro ao iniciar busca');
            }

        } catch (error) {
            console.error('❌ Erro ao iniciar busca:', error);
            this.handleSearchError(error);
        }
    }

    /**
     * Parar busca atual
     */
    async stopSearch() {
        try {
            console.log('🛑 Parando busca...');
            
            const response = await this.sendMessage({ action: 'stopSearch' });
            
            if (response && response.status === 'success') {
                this.finishSearch('⏹️ Busca interrompida pelo usuário', 'stopped');
                this.uiManager.showNotification('Busca interrompida', 'info');
            } else {
                throw new Error('Erro ao parar busca');
            }

        } catch (error) {
            console.error('❌ Erro ao parar busca:', error);
            this.uiManager.showError('Erro ao parar busca');
        }
    }

    /**
     * Obter configurações de busca
     */    async getSearchSettings() {
        try {
            const settings = await new Promise((resolve) => {
                chrome.storage.local.get({
                    searchSettings: {
                        maxVariations: 10,
                        delayBetweenRequests: 300,
                        includeAdultSites: true,
                        includeForumSites: true,
                        includeEscortSites: true,
                        includeImageSharingSites: true,
                        useBrazilianVariations: true,
                        priorityCategories: ['social', 'dev', 'portfolio', 'adult', 'cam', 'forum', 'escort'],
                        confidenceThreshold: 20
                    }
                }, (result) => {
                    resolve(result.searchSettings);
                });
            });

            return settings;
        } catch (error) {
            console.warn('⚠️ Erro ao carregar configurações, usando padrão:', error);
            return {
                maxVariations: 10,
                delayBetweenRequests: 300,
                includeAdultSites: true, 
                includeForumSites: true,
                includeEscortSites: true,
                includeImageSharingSites: true,
                useBrazilianVariations: true,
                priorityCategories: ['social', 'dev', 'portfolio', 'adult', 'cam', 'forum', 'escort'],
                confidenceThreshold: 20
            };
        }
    }

    /**
     * Monitorar status da busca
     */
    startStatusMonitoring() {
        if (this.statusMonitoringInterval) {
            this.stopStatusMonitoring();
        }

        this.statusMonitoringInterval = setInterval(async () => {
            if (!this.isSearching) {
                this.stopStatusMonitoring();
                return;
            }

            try {
                const response = await this.sendMessage({ action: 'getStatus' });
                
                if (response && response.status === 'success') {
                    // Atualizar progresso
                    if (response.progress) {
                        this.uiManager.updateProgress(response.progress);
                        this.emit('progress', response.progress);
                    }

                    // Verificar se concluído
                    if (response.isComplete) {
                        await this.handleSearchComplete();
                        return;
                    }

                    // Atualizar status específico se disponível
                    if (response.currentStatus) {
                        this.uiManager.setStatus(response.currentStatus, 'searching');
                    }
                }
            } catch (error) {
                console.error('❌ Erro no monitoramento:', error);
                // Não parar o monitoramento por um erro pontual
            }
        }, 1000); // Verificar a cada segundo
    }

    /**
     * Parar monitoramento de status
     */
    stopStatusMonitoring() {
        if (this.statusMonitoringInterval) {
            clearInterval(this.statusMonitoringInterval);
            this.statusMonitoringInterval = null;
        }
    }

    /**
     * Tratar conclusão da busca
     */
    async handleSearchComplete() {
        try {
            // Obter resultados finais
            const response = await this.sendMessage({ action: 'getResults' });
            
            if (response && response.results) {
                const results = response.results;
                const stats = this.calculateSearchStats(results);
                
                this.finishSearch(
                    `✅ Busca concluída! ${stats.found}/${stats.total} encontrados`, 
                    'success'
                );
                
                this.emit('searchComplete', { results, stats });
                this.uiManager.showNotification(
                    `Busca concluída: ${stats.found} perfis encontrados`, 
                    'success'
                );
            } else {
                this.finishSearch('⚠️ Busca concluída sem resultados', 'warning');
            }

        } catch (error) {
            console.error('❌ Erro ao finalizar busca:', error);
            this.handleSearchError(error);
        }
    }

    /**
     * Finalizar busca (comum para sucesso, erro ou parada)
     */
    finishSearch(message, type) {
        this.isSearching = false;
        this.uiManager.setSearchingState(false);
        this.stopStatusMonitoring();
        this.uiManager.setStatus(message, type);
        this.emit('searchEnd');
    }

    /**
     * Tratar erros de busca
     */
    handleSearchError(error) {
        const errorMessage = error.message || 'Erro desconhecido na busca';
        this.finishSearch(`❌ ${errorMessage}`, 'error');
        this.uiManager.showError(errorMessage);
        this.emit('searchError', error);
    }

    /**
     * Calcular estatísticas da busca
     */
    calculateSearchStats(results) {
        if (!results || !Array.isArray(results)) {
            return { total: 0, found: 0, categories: {}, avgConfidence: 0 };
        }

        const stats = {
            total: results.length,
            found: 0,
            urgent: 0,
            highRisk: 0,
            adult: 0,
            categories: {},
            avgConfidence: 0,
            confidenceSum: 0
        };

        results.forEach(result => {
            if (result.found || result.status === 'found') {
                stats.found++;
                
                if (result.confidence) {
                    stats.confidenceSum += result.confidence;
                }
            }

            if (result.priority === 'urgent') {
                stats.urgent++;
            }

            if (result.riskLevel === 'high') {
                stats.highRisk++;
            }

            if (result.category === 'adult' || result.category === 'cam') {
                stats.adult++;
            }

            // Contar por categoria
            const category = result.category || 'other';
            stats.categories[category] = (stats.categories[category] || 0) + 1;
        });

        // Calcular confiança média
        if (stats.found > 0) {
            stats.avgConfidence = Math.round(stats.confidenceSum / stats.found);
        }

        return stats;
    }

    /**
     * Enviar mensagem para background script
     */
    async sendMessage(message) {
        return new Promise((resolve, reject) => {
            try {
                chrome.runtime.sendMessage(message, (response) => {
                    if (chrome.runtime.lastError) {
                        reject(new Error(chrome.runtime.lastError.message));
                    } else {
                        resolve(response);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Verificar se busca está ativa
     */
    getSearchState() {
        return {
            isSearching: this.isSearching,
            hasMonitoring: !!this.statusMonitoringInterval
        };
    }

    /**
     * Limpar estado da busca
     */
    reset() {
        this.stopStatusMonitoring();
        this.isSearching = false;
        this.uiManager.setSearchingState(false);
        this.uiManager.setStatus('Pronto para nova busca', 'ready');
    }

    /**
     * Pausar busca (futuro)
     */
    async pauseSearch() {
        // Implementação futura para pausar busca
        console.log('⏸️ Pausa de busca - funcionalidade futura');
    }

    /**
     * Retomar busca (futuro)
     */
    async resumeSearch() {
        // Implementação futura para retomar busca
        console.log('▶️ Retomar busca - funcionalidade futura');
    }
}
