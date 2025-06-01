/**
 * Message Handler - Gerenciamento de mensagens entre scripts
 * @version 3.0.0
 */

export class MessageHandler {
    constructor(appState, services) {
        this.appState = appState;
        this.services = services;
        this.currentSearchPromise = null;
    }

    /**
     * Manipular mensagens recebidas
     */
    async handleMessage(request, sender, sendResponse) {
        console.log('📨 Mensagem recebida:', request.action);

        try {
            switch (request.action) {
                case 'ping':
                    sendResponse({ 
                        status: 'success', 
                        message: 'Background ativo',
                        version: this.appState.version 
                    });
                    break;

                case 'startSearch':
                    await this._handleStartSearch(request, sendResponse);
                    break;

                case 'stopSearch':
                    await this._handleStopSearch(sendResponse);
                    break;

                case 'getStatus':
                    this._handleGetStatus(sendResponse);
                    break;

                case 'getResults':
                    this._handleGetResults(sendResponse);
                    break;

                case 'clearResults':
                    await this._handleClearResults(sendResponse);
                    break;

                case 'exportResults':
                    await this._handleExportResults(sendResponse);
                    break;

                case 'getSettings':
                    await this._handleGetSettings(sendResponse);
                    break;

                case 'saveSettings':
                    await this._handleSaveSettings(request, sendResponse);
                    break;

                default:
                    sendResponse({ 
                        status: 'error', 
                        message: `Ação não reconhecida: ${request.action}` 
                    });
            }
        } catch (error) {
            console.error('❌ Erro ao processar mensagem:', error);
            sendResponse({ 
                status: 'error', 
                message: error.message || 'Erro interno' 
            });
        }

        return true; // Indica resposta assíncrona
    }

    /**
     * Iniciar busca
     */
    async _handleStartSearch(request, sendResponse) {
        if (!request.username) {
            sendResponse({ status: 'error', message: 'Username é obrigatório' });
            return;
        }

        if (this.appState.isSearching) {
            sendResponse({ status: 'error', message: 'Busca já em andamento' });
            return;
        }

        this.appState.isSearching = true;
        this.appState.currentQuery = request.username;
        this.appState.progress = 0;

        const platforms = this.services.platformService.getAllPlatforms();
        
        // Iniciar busca assíncrona
        this.currentSearchPromise = this.services.searchEngine.startSearch(
            request.username,
            platforms,
            (progress) => this._onSearchProgress(progress),
            (result) => this._onSearchResult(result)
        );

        sendResponse({ status: 'success', message: 'Busca iniciada' });

        // Aguardar conclusão
        try {
            const results = await this.currentSearchPromise;
            await this._onSearchComplete(results);
        } catch (error) {
            console.error('❌ Erro na busca:', error);
            this.appState.isSearching = false;
        }
    }

    /**
     * Parar busca
     */
    async _handleStopSearch(sendResponse) {
        this.services.searchEngine.stopSearch();
        this.appState.isSearching = false;
        sendResponse({ status: 'success', message: 'Busca interrompida' });
    }

    /**
     * Obter status
     */
    _handleGetStatus(sendResponse) {
        sendResponse({
            status: 'success',
            data: {
                isSearching: this.appState.isSearching,
                progress: this.appState.progress,
                currentQuery: this.appState.currentQuery,
                version: this.appState.version
            }
        });
    }

    /**
     * Obter resultados
     */
    _handleGetResults(sendResponse) {
        const results = this.services.searchEngine.getResults();
        sendResponse({
            status: 'success',
            results,
            stats: this._generateStats(results)
        });
    }

    /**
     * Limpar resultados
     */
    async _handleClearResults(sendResponse) {
        this.services.searchEngine.clearResults();
        this.appState.results = [];
        sendResponse({ status: 'success', message: 'Resultados limpos' });
    }

    /**
     * Exportar resultados
     */
    async _handleExportResults(sendResponse) {
        const results = this.services.searchEngine.getResults();
        const exportData = this._formatExportData(results);
        sendResponse({ status: 'success', data: exportData });
    }

    /**
     * Obter configurações
     */
    async _handleGetSettings(sendResponse) {
        const settings = await this.services.storageService.loadSettings();
        sendResponse({ status: 'success', settings });
    }

    /**
     * Salvar configurações
     */
    async _handleSaveSettings(request, sendResponse) {
        await this.services.storageService.saveSettings(request.settings);
        sendResponse({ status: 'success', message: 'Configurações salvas' });
    }

    /**
     * Callback de progresso da busca
     */
    _onSearchProgress(progress) {
        this.appState.progress = progress.percentage;
        // Enviar notificação para popup se necessário
    }

    /**
     * Callback de resultado individual
     */
    _onSearchResult(result) {
        this.appState.results.push(result);
    }

    /**
     * Busca concluída
     */
    async _onSearchComplete(results) {
        this.appState.isSearching = false;
        this.appState.progress = 100;
        this.appState.results = results;

        const stats = this._generateStats(results);
        
        // Salvar no storage
        await this.services.storageService.saveSearchResults(
            this.appState.currentQuery,
            results,
            stats
        );

        console.log('🏁 Busca finalizada:', stats);
    }

    /**
     * Gerar estatísticas
     */
    _generateStats(results) {
        const stats = {
            total: results.length,
            found: results.filter(r => r.found).length,
            categories: {},
            priorities: {},
            avgConfidence: 0
        };

        let totalConfidence = 0;
        let foundWithConfidence = 0;

        results.forEach(result => {
            // Por categoria
            const cat = result.category || 'other';
            stats.categories[cat] = (stats.categories[cat] || 0) + 1;

            // Por prioridade
            const priority = result.platformPriority || 'medium';
            stats.priorities[priority] = (stats.priorities[priority] || 0) + 1;

            // Confiança média
            if (result.found && result.confidence) {
                totalConfidence += result.confidence;
                foundWithConfidence++;
            }
        });

        if (foundWithConfidence > 0) {
            stats.avgConfidence = Math.round(totalConfidence / foundWithConfidence);
        }

        return stats;
    }

    /**
     * Formatar dados para exportação
     */
    _formatExportData(results) {
        const timestamp = new Date().toLocaleString('pt-BR');
        
        let exportText = '=== DEEPALIAS HUNTER PRO v3.0 - RELATÓRIO ===\n';
        exportText += `Data/Hora: ${timestamp}\n`;
        exportText += `Usuário: ${this.appState.currentQuery}\n\n`;

        const stats = this._generateStats(results);
        exportText += '=== ESTATÍSTICAS ===\n';
        exportText += `Total verificado: ${stats.total}\n`;
        exportText += `Encontrados: ${stats.found}\n\n`;

        exportText += '=== RESULTADOS ENCONTRADOS ===\n';
        results.filter(r => r.found).forEach(result => {
            exportText += `\n🔍 ${result.platform}\n`;
            exportText += `📍 ${result.url}\n`;
            exportText += `✅ Encontrado (${result.confidence}% confiança)\n`;
            exportText += `📂 Categoria: ${result.category}\n`;
            if (result.platformPriority === 'critical') {
                exportText += `🚨 PRIORIDADE CRÍTICA\n`;
            }
            exportText += '---\n';
        });

        return exportText;
    }
}
