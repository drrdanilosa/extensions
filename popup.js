/**
 * DeepAlias Hunter Pro - Popup Script
 * Interface de usuário para Firefox
 */

class DeepAliasHunter {
    constructor() {
        this.isSearching = false;
        this.statusInterval = null;
        
        this.initElements();
        this.initEventListeners();
        this.checkConnection();
        
        console.log('🚀 DeepAlias Hunter Pro - Popup Inicializado');
    }

    // Inicializar elementos DOM
    initElements() {
        this.elements = {
            username: document.getElementById('username'),
            searchBtn: document.getElementById('searchBtn'),
            stopBtn: document.getElementById('stopBtn'),
            clearBtn: document.getElementById('clearBtn'),
            exportBtn: document.getElementById('exportBtn'),
            status: document.getElementById('status'),
            progressContainer: document.getElementById('progressContainer'),
            progressFill: document.getElementById('progressFill'),
            progressText: document.getElementById('progressText'),
            error: document.getElementById('error'),
            resultsSection: document.getElementById('resultsSection'),
            results: document.getElementById('results'),
            connectionStatus: document.getElementById('connectionStatus')
        };
    }

    // Configurar event listeners
    initEventListeners() {
        // Botões
        this.elements.searchBtn.addEventListener('click', () => this.startSearch());
        this.elements.stopBtn.addEventListener('click', () => this.stopSearch());
        this.elements.clearBtn.addEventListener('click', () => this.clearResults());
        this.elements.exportBtn.addEventListener('click', () => this.exportResults());

        // Input
        this.elements.username.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !this.isSearching) {
                this.startSearch();
            }
        });

        // Auto-focus no input
        this.elements.username.focus();
    }

    // Verificar conexão com background script
    async checkConnection() {
        try {
            const response = await this.sendMessage({ action: 'ping' });
            if (response.status === 'success') {
                this.updateConnectionStatus(true);
                this.setStatus('Pronto para buscar', 'ready');
            } else {
                this.updateConnectionStatus(false);
            }
        } catch (error) {
            console.error('❌ Erro de conexão:', error);
            this.updateConnectionStatus(false);
            this.showError('Erro de conexão com background script');
        }
    }

    // Atualizar status da conexão
    updateConnectionStatus(connected) {
        const status = this.elements.connectionStatus;
        if (connected) {
            status.innerHTML = '🟢 Conectado';
            status.style.color = '#4CAF50';
        } else {
            status.innerHTML = '🔴 Desconectado';
            status.style.color = '#f44336';
        }
    }

    // Enviar mensagem para background script
    sendMessage(message) {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage(message, (response) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                } else {
                    resolve(response || {});
                }
            });
        });
    }

    // Iniciar busca
    async startSearch() {
        const username = this.elements.username.value.trim();

        // Validações
        if (!username) {
            this.showError('Por favor, digite um nome de usuário');
            this.elements.username.focus();
            return;
        }

        if (username.length < 2) {
            this.showError('Nome de usuário deve ter pelo menos 2 caracteres');
            this.elements.username.focus();
            return;
        }

        if (!/^[a-zA-Z0-9_.-]+$/.test(username)) {
            this.showError('Nome de usuário contém caracteres inválidos');
            this.elements.username.focus();
            return;
        }

        try {
            this.hideError();
            this.setSearchingState(true);
            this.clearResults();
            this.setStatus('Iniciando busca...', 'searching');

            // Enviar comando de busca
            const response = await this.sendMessage({
                action: 'startSearch',
                username: username
            });

            if (response.status === 'success') {
                this.setStatus(`Buscando por "${username}"...`, 'searching');
                this.startStatusMonitoring();
            } else {
                throw new Error(response.message || 'Erro ao iniciar busca');
            }

        } catch (error) {
            console.error('❌ Erro na busca:', error);
            this.showError(`Erro ao iniciar busca: ${error.message}`);
            this.setSearchingState(false);
        }
    }

    // Parar busca
    async stopSearch() {
        try {
            await this.sendMessage({ action: 'stopSearch' });
            this.stopStatusMonitoring();
            this.setSearchingState(false);
            this.setStatus('Busca interrompida', 'stopped');
        } catch (error) {
            console.error('❌ Erro ao parar busca:', error);
            this.showError('Erro ao parar busca');
        }
    }

    // Monitorar status da busca
    startStatusMonitoring() {
        this.statusInterval = setInterval(async () => {
            try {
                const response = await this.sendMessage({ action: 'getStatus' });
                
                if (response.status === 'success') {
                    const data = response.data;
                    this.updateProgress(data.progress);
                    
                    if (!data.isSearching) {
                        // Busca concluída
                        this.stopStatusMonitoring();
                        this.setSearchingState(false);
                        this.setStatus('Busca concluída! Carregando resultados...', 'completed');
                        this.loadResults();
                    }
                }
            } catch (error) {
                console.error('❌ Erro ao obter status:', error);
                this.stopStatusMonitoring();
                this.setSearchingState(false);
                this.showError('Erro ao obter status da busca');
            }
        }, 500);
    }

    // Parar monitoramento
    stopStatusMonitoring() {
        if (this.statusInterval) {
            clearInterval(this.statusInterval);
            this.statusInterval = null;
        }
    }

    // Carregar resultados
    async loadResults() {
        try {
            const response = await this.sendMessage({ action: 'getResults' });
            
            if (response.status === 'success') {
                this.displayResults(response.data || []);
                const count = response.data ? response.data.length : 0;
                this.setStatus(`Busca concluída! ${count} plataformas verificadas`, 'completed');
            } else {
                throw new Error(response.message || 'Erro ao carregar resultados');
            }
        } catch (error) {
            console.error('❌ Erro ao carregar resultados:', error);
            this.showError('Erro ao carregar resultados');
        }
    }

    // Exibir resultados
    displayResults(results) {
        const container = this.elements.results;
        container.innerHTML = '';

        if (!results || results.length === 0) {
            container.innerHTML = '<div class="result-item">Nenhum resultado encontrado</div>';
            this.elements.resultsSection.style.display = 'block';
            return;
        }

        // Ordenar: encontrados primeiro
        const sortedResults = results.sort((a, b) => {
            if (a.status === 'found' && b.status !== 'found') return -1;
            if (a.status !== 'found' && b.status === 'found') return 1;
            return a.platform.localeCompare(b.platform);
        });

        sortedResults.forEach(result => {
            const item = this.createResultItem(result);
            container.appendChild(item);
        });

        this.elements.resultsSection.style.display = 'block';
    }

    // Criar item de resultado
    createResultItem(result) {
        const div = document.createElement('div');
        div.className = `result-item ${result.status === 'found' ? 'result-found' : 'result-not-found'}`;
        
        const statusText = result.status === 'found' ? 'Encontrado' : 'Não encontrado';
        const statusColor = result.status === 'found' ? '#4CAF50' : '#FF9800';
        
        div.innerHTML = `
            <div class="result-icon">${result.icon}</div>
            <div class="result-content">
                <div class="result-platform">${result.platform}</div>
                <div class="result-status" style="color: ${statusColor}">${statusText}</div>
                <div class="result-url">${result.url}</div>
            </div>
        `;

        // Clicar para abrir URL
        div.addEventListener('click', () => {
            chrome.tabs.create({ url: result.url });
        });

        return div;
    }

    // Limpar resultados
    clearResults() {
        this.elements.results.innerHTML = '';
        this.elements.resultsSection.style.display = 'none';
        this.elements.username.value = '';
        this.updateProgress(0);
        this.hideError();
        this.setStatus('Pronto para buscar', 'ready');
    }

    // Exportar resultados
    async exportResults() {
        try {
            const response = await this.sendMessage({ action: 'getResults' });
            
            if (response.status === 'success' && response.data) {
                const results = response.data;
                const found = results.filter(r => r.status === 'found');
                
                let exportText = `DeepAlias Hunter Pro - Resultados\n`;
                exportText += `Data: ${new Date().toLocaleString()}\n`;
                exportText += `Busca: ${this.elements.username.value}\n`;
                exportText += `Total verificado: ${results.length} plataformas\n`;
                exportText += `Encontrados: ${found.length}\n\n`;
                
                exportText += `RESULTADOS ENCONTRADOS:\n`;
                exportText += `${'='.repeat(40)}\n`;
                
                found.forEach(result => {
                    exportText += `${result.platform}: ${result.url}\n`;
                });
                
                exportText += `\nTODOS OS RESULTADOS:\n`;
                exportText += `${'='.repeat(40)}\n`;
                
                results.forEach(result => {
                    const status = result.status === 'found' ? '[✓]' : '[✗]';
                    exportText += `${status} ${result.platform}: ${result.url}\n`;
                });

                // Copiar para clipboard
                navigator.clipboard.writeText(exportText).then(() => {
                    this.setStatus('Resultados copiados para clipboard!', 'success');
                    setTimeout(() => {
                        this.setStatus('Busca concluída!', 'completed');
                    }, 2000);
                });
            }
        } catch (error) {
            console.error('❌ Erro ao exportar:', error);
            this.showError('Erro ao exportar resultados');
        }
    }

    // Atualizar progresso
    updateProgress(progress) {
        const fill = this.elements.progressFill;
        const text = this.elements.progressText;
        
        fill.style.width = `${progress}%`;
        text.textContent = `${progress}%`;
        
        if (progress > 0) {
            this.elements.progressContainer.style.display = 'block';
        }
    }

    // Definir estado de busca
    setSearchingState(searching) {
        this.isSearching = searching;
        
        this.elements.searchBtn.disabled = searching;
        this.elements.searchBtn.style.display = searching ? 'none' : 'flex';
        this.elements.stopBtn.style.display = searching ? 'flex' : 'none';
        this.elements.username.disabled = searching;
        
        if (!searching) {
            this.elements.progressContainer.style.display = 'none';
            this.updateProgress(0);
        }
    }

    // Definir status
    setStatus(message, type = 'info') {
        const status = this.elements.status;
        status.textContent = message;
        
        // Remover classes anteriores
        status.className = 'status';
        
        // Adicionar classe baseada no tipo
        switch (type) {
            case 'ready':
                status.style.borderLeftColor = '#4CAF50';
                break;
            case 'searching':
                status.style.borderLeftColor = '#2196F3';
                break;
            case 'completed':
                status.style.borderLeftColor = '#4CAF50';
                break;
            case 'stopped':
                status.style.borderLeftColor = '#FF9800';
                break;
            case 'error':
                status.style.borderLeftColor = '#f44336';
                break;
            default:
                status.style.borderLeftColor = '#4CAF50';
        }
    }

    // Mostrar erro
    showError(message) {
        this.elements.error.textContent = message;
        this.elements.error.style.display = 'block';
        console.error('🚨 Erro:', message);
    }

    // Esconder erro
    hideError() {
        this.elements.error.style.display = 'none';
    }
}

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new DeepAliasHunter();
});

console.log('📝 Script do popup carregado');
