/**
 * UIManager - Gerenciador de Interface
 * Responsável por todas as manipulações do DOM e eventos da UI
 * @version 3.0.0
 */

export class UIManager {
    constructor() {
        this.elements = {};
        this.eventEmitter = new EventTarget();
        this.initializeElements();
        this.setupEventListeners();
        console.log('🎨 UIManager inicializado');
    }

    /**
     * Inicializar elementos DOM
     */
    initializeElements() {
        this.elements = {
            // Inputs e controles
            username: document.getElementById('username'),
            searchBtn: document.getElementById('searchBtn'),
            stopBtn: document.getElementById('stopBtn'),
            clearBtn: document.getElementById('clearBtn'),
            exportBtn: document.getElementById('exportBtn'),
            settingsBtn: document.getElementById('settingsBtn'),
            
            // Status e progresso
            status: document.getElementById('status'),
            connectionStatus: document.getElementById('connectionStatus'),
            progressContainer: document.getElementById('progressContainer'),
            progressFill: document.getElementById('progressFill'),
            progressText: document.getElementById('progressText'),
            
            // Resultados
            resultsSection: document.getElementById('resultsSection'),
            results: document.getElementById('results'),
            statsContainer: document.getElementById('statsContainer'),
            
            // Erros e notificações
            error: document.getElementById('error'),
            notification: document.getElementById('notification'),
            
            // Configurações
            settingsPanel: document.getElementById('settingsPanel'),
            themeSelector: document.getElementById('themeSelector'),
            
            // Modais e overlays
            loadingOverlay: document.getElementById('loadingOverlay')
        };

        // Verificar se elementos obrigatórios existem
        const required = ['username', 'searchBtn', 'results'];
        required.forEach(id => {
            if (!this.elements[id]) {
                console.warn(`⚠️ Elemento obrigatório não encontrado: ${id}`);
            }
        });
    }

    /**
     * Configurar event listeners básicos
     */
    setupEventListeners() {
        // Botão de busca
        if (this.elements.searchBtn) {
            this.elements.searchBtn.addEventListener('click', () => {
                this.emit('search');
            });
        }

        // Botão de parar
        if (this.elements.stopBtn) {
            this.elements.stopBtn.addEventListener('click', () => {
                this.emit('stop');
            });
        }

        // Botão de limpar
        if (this.elements.clearBtn) {
            this.elements.clearBtn.addEventListener('click', () => {
                this.emit('clear');
            });
        }

        // Botão de exportar
        if (this.elements.exportBtn) {
            this.elements.exportBtn.addEventListener('click', () => {
                this.emit('export');
            });
        }

        // Botão de configurações
        if (this.elements.settingsBtn) {
            this.elements.settingsBtn.addEventListener('click', () => {
                this.emit('settings');
            });
        }

        // Enter no campo de username
        if (this.elements.username) {
            this.elements.username.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.emit('search');
                }
            });

            // Auto-focus
            this.elements.username.focus();
        }
    }

    /**
     * Sistema de eventos personalizado
     */
    on(event, callback) {
        this.eventEmitter.addEventListener(event, callback);
    }

    emit(event, data = null) {
        this.eventEmitter.dispatchEvent(new CustomEvent(event, { detail: data }));
    }

    onEnterKey(callback) {
        if (this.elements.username) {
            this.elements.username.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    callback();
                }
            });
        }
    }

    /**
     * Gerenciamento de status de conexão
     */
    setConnectionStatus(connected, version = null) {
        if (!this.elements.connectionStatus) return;
        
        if (connected) {
            this.elements.connectionStatus.innerHTML = `🟢 Conectado ${version ? `v${version}` : ''}`;
            this.elements.connectionStatus.style.color = '#4CAF50';
        } else {
            this.elements.connectionStatus.innerHTML = '🔴 Desconectado';
            this.elements.connectionStatus.style.color = '#f44336';
        }
    }

    /**
     * Gerenciamento de status geral
     */
    setStatus(message, type = 'info') {
        if (!this.elements.status) return;
        
        this.elements.status.textContent = message;
        this.elements.status.className = `status-${type}`;
    }

    /**
     * Gerenciamento de estados da busca
     */
    setSearchingState(searching) {
        // Atualizar botões
        if (this.elements.searchBtn) {
            this.elements.searchBtn.disabled = searching;
            this.elements.searchBtn.innerHTML = searching ? 
                '<span class="btn-icon">🔄</span><span class="btn-text">Buscando...</span>' :
                '<span class="btn-icon">🚀</span><span class="btn-text">Buscar</span>';
        }

        if (this.elements.stopBtn) {
            this.elements.stopBtn.disabled = !searching;
        }

        if (this.elements.username) {
            this.elements.username.disabled = searching;
        }

        // Controlar progresso
        if (!searching && this.elements.progressContainer) {
            this.elements.progressContainer.style.display = 'none';
        }
    }

    /**
     * Atualizar progresso da busca
     */
    updateProgress(progress) {
        if (!this.elements.progressContainer) return;
        
        const percentage = Math.round(progress.percentage || 0);
        
        if (this.elements.progressFill) {
            this.elements.progressFill.style.width = `${percentage}%`;
        }
        
        if (this.elements.progressText) {
            this.elements.progressText.textContent = 
                `${progress.current || 0}/${progress.total || 0} (${percentage}%)`;
        }
        
        this.elements.progressContainer.style.display = 'block';
    }

    /**
     * Gerenciamento de erros
     */
    showError(message) {
        if (!this.elements.error) {
            console.error('❌ Erro:', message);
            return;
        }
        
        this.elements.error.textContent = message;
        this.elements.error.style.display = 'block';
        
        // Auto-hide após 5 segundos
        setTimeout(() => this.hideError(), 5000);
    }

    hideError() {
        if (this.elements.error) {
            this.elements.error.style.display = 'none';
        }
    }

    /**
     * Sistema de notificações
     */
    showNotification(message, type = 'info', duration = 3000) {
        if (!this.elements.notification) {
            console.log(`📢 ${message}`);
            return;
        }
        
        this.elements.notification.textContent = message;
        this.elements.notification.className = `notification notification-${type}`;
        this.elements.notification.style.display = 'block';
        
        setTimeout(() => {
            this.elements.notification.style.display = 'none';
        }, duration);
    }

    /**
     * Gerenciamento do painel de configurações
     */
    toggleSettingsPanel() {
        if (!this.elements.settingsPanel) return;
        
        const isVisible = this.elements.settingsPanel.style.display !== 'none';
        this.elements.settingsPanel.style.display = isVisible ? 'none' : 'block';
    }

    /**
     * Limpar resultados da interface
     */
    clearResults() {
        if (this.elements.results) {
            this.elements.results.innerHTML = '';
        }
        
        if (this.elements.resultsSection) {
            this.elements.resultsSection.style.display = 'none';
        }
        
        if (this.elements.statsContainer) {
            this.elements.statsContainer.innerHTML = '';
        }
    }

    /**
     * Obter valor do username
     */
    getUsername() {
        return this.elements.username ? this.elements.username.value.trim() : '';
    }

    /**
     * Validar entrada do usuário
     */
    validateInput() {
        const username = this.getUsername();
        
        if (!username) {
            this.showError('Por favor, insira um nome de usuário');
            return false;
        }
        
        if (username.length < 2) {
            this.showError('Username deve ter pelo menos 2 caracteres');
            return false;
        }
        
        if (username.length > 50) {
            this.showError('Username muito longo (máximo 50 caracteres)');
            return false;
        }
        
        // Verificar caracteres válidos
        if (!/^[a-zA-Z0-9._-]+$/.test(username)) {
            this.showError('Username contém caracteres inválidos');
            return false;
        }
        
        return true;
    }

    /**
     * Aplicar tema
     */
    setTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        
        if (this.elements.themeSelector) {
            this.elements.themeSelector.value = theme;
        }
        
        // Salvar preferência
        chrome.storage.local.set({ theme: theme });
    }

    /**
     * Toggle loading overlay
     */
    showLoading(show = true) {
        if (this.elements.loadingOverlay) {
            this.elements.loadingOverlay.style.display = show ? 'flex' : 'none';
        }
    }

    /**
     * Animar elemento
     */
    animateElement(element, animation = 'fadeIn') {
        if (!element) return;
        
        element.style.animation = `${animation} 0.3s ease-in-out`;
        
        setTimeout(() => {
            element.style.animation = '';
        }, 300);
    }

    /**
     * Scroll para elemento
     */
    scrollToElement(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }
}
