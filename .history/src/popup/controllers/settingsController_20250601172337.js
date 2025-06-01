/**
 * SettingsController - Controlador de Configurações
 * Gerencia configurações da aplicação, temas e preferências do usuário
 * @version 3.0.0
 */

export class SettingsController {
    constructor(uiManager) {
        this.uiManager = uiManager;
        this.settings = this.getDefaultSettings();
        this.isSettingsVisible = false;
        
        this.initializeSettings();
        console.log('⚙️ SettingsController inicializado');
    }

    /**
     * Inicializar configurações
     */
    async initializeSettings() {
        await this.loadSettings();
        this.setupSettingsPanel();
        this.applySettings();
    }

    /**
     * Configurações padrão
     */
    getDefaultSettings() {
        return {
            // Configurações de busca
            search: {
                maxVariations: 5,
                delayBetweenRequests: 300,
                includeAdultSites: false,
                priorityCategories: ['social', 'dev', 'portfolio'],
                confidenceThreshold: 30,
                autoSaveResults: true,
                maxResultsPerCategory: 10
            },
            
            // Configurações de interface
            ui: {
                theme: 'auto', // auto, light, dark
                language: 'pt-BR',
                animations: true,
                compactView: false,
                showTimestamps: true,
                autoScroll: true
            },
            
            // Configurações de segurança
            security: {
                confirmDangerousOperations: true,
                hideAdultContent: false,
                blurSensitiveResults: true,
                requireConfirmationForExport: false
            },
            
            // Configurações de notificações
            notifications: {
                showProgress: true,
                showCompletion: true,
                showErrors: true,
                playAudio: false,
                duration: 3000
            },
            
            // Configurações avançadas
            advanced: {
                enableDebugMode: false,
                logLevel: 'info', // debug, info, warn, error
                cacheResults: true,
                cacheExpiration: 24, // horas
                enableExperimentalFeatures: false
            }
        };
    }

    /**
     * Carregar configurações do storage
     */
    async loadSettings() {
        try {
            const stored = await new Promise((resolve) => {
                chrome.storage.local.get('userSettings', (result) => {
                    resolve(result.userSettings || {});
                });
            });

            // Merge com configurações padrão
            this.settings = this.mergeDeep(this.getDefaultSettings(), stored);
            console.log('⚙️ Configurações carregadas:', this.settings);
            
        } catch (error) {
            console.warn('⚠️ Erro ao carregar configurações, usando padrão:', error);
            this.settings = this.getDefaultSettings();
        }
    }

    /**
     * Salvar configurações no storage
     */
    async saveSettings() {
        try {
            await new Promise((resolve, reject) => {
                chrome.storage.local.set({ userSettings: this.settings }, () => {
                    if (chrome.runtime.lastError) {
                        reject(chrome.runtime.lastError);
                    } else {
                        resolve();
                    }
                });
            });

            console.log('💾 Configurações salvas');
            this.uiManager.showNotification('Configurações salvas', 'success');
            
        } catch (error) {
            console.error('❌ Erro ao salvar configurações:', error);
            this.uiManager.showError('Erro ao salvar configurações');
        }
    }

    /**
     * Configurar painel de configurações
     */
    setupSettingsPanel() {
        this.createSettingsPanel();
        this.setupSettingsEventListeners();
    }

    /**
     * Criar painel de configurações no HTML
     */
    createSettingsPanel() {
        // Verificar se já existe
        let settingsPanel = document.getElementById('settingsPanel');
        
        if (!settingsPanel) {
            settingsPanel = document.createElement('div');
            settingsPanel.id = 'settingsPanel';
            settingsPanel.className = 'settings-panel hidden';
            document.body.appendChild(settingsPanel);
        }

        settingsPanel.innerHTML = this.generateSettingsPanelHTML();
        
        // Atualizar referência no UIManager
        this.uiManager.elements.settingsPanel = settingsPanel;
    }

    /**
     * Gerar HTML do painel de configurações
     */
    generateSettingsPanelHTML() {
        return `
            <div class="settings-overlay" id="settingsOverlay">
                <div class="settings-container">
                    <div class="settings-header">
                        <h2>⚙️ Configurações</h2>
                        <button class="close-btn" id="closeSettings">✕</button>
                    </div>
                    
                    <div class="settings-content">
                        <div class="settings-tabs">
                            <button class="tab-btn active" data-tab="search">🔍 Busca</button>
                            <button class="tab-btn" data-tab="interface">🎨 Interface</button>
                            <button class="tab-btn" data-tab="security">🔒 Segurança</button>
                            <button class="tab-btn" data-tab="notifications">🔔 Notificações</button>
                            <button class="tab-btn" data-tab="advanced">⚡ Avançado</button>
                        </div>
                        
                        <div class="settings-panels">
                            ${this.generateSearchSettingsPanel()}
                            ${this.generateInterfaceSettingsPanel()}
                            ${this.generateSecuritySettingsPanel()}
                            ${this.generateNotificationsSettingsPanel()}
                            ${this.generateAdvancedSettingsPanel()}
                        </div>
                    </div>
                    
                    <div class="settings-footer">
                        <button class="btn btn-secondary" id="resetSettings">🔄 Restaurar Padrão</button>
                        <button class="btn btn-primary" id="saveSettings">💾 Salvar</button>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Gerar painel de configurações de busca
     */
    generateSearchSettingsPanel() {
        return `
            <div class="settings-panel-content active" data-panel="search">
                <div class="setting-group">
                    <h3>🎯 Parâmetros de Busca</h3>
                    
                    <div class="setting-item">
                        <label for="maxVariations">Máximo de Variações por Plataforma:</label>
                        <input type="range" id="maxVariations" min="1" max="10" 
                               value="${this.settings.search.maxVariations}">
                        <span class="range-value">${this.settings.search.maxVariations}</span>
                    </div>
                    
                    <div class="setting-item">
                        <label for="delayBetweenRequests">Delay entre Requisições (ms):</label>
                        <input type="range" id="delayBetweenRequests" min="100" max="1000" step="50"
                               value="${this.settings.search.delayBetweenRequests}">
                        <span class="range-value">${this.settings.search.delayBetweenRequests}</span>
                    </div>
                    
                    <div class="setting-item">
                        <label for="confidenceThreshold">Limite de Confiança (%):</label>
                        <input type="range" id="confidenceThreshold" min="0" max="100" step="5"
                               value="${this.settings.search.confidenceThreshold}">
                        <span class="range-value">${this.settings.search.confidenceThreshold}</span>
                    </div>
                </div>
                
                <div class="setting-group">
                    <h3>📂 Categorias e Filtros</h3>
                    
                    <div class="setting-item">
                        <label>
                            <input type="checkbox" id="includeAdultSites" 
                                   ${this.settings.search.includeAdultSites ? 'checked' : ''}>
                            Incluir Sites Adultos
                        </label>
                        <small>Verificar plataformas de conteúdo adulto</small>
                    </div>
                    
                    <div class="setting-item">
                        <label>
                            <input type="checkbox" id="autoSaveResults" 
                                   ${this.settings.search.autoSaveResults ? 'checked' : ''}>
                            Salvar Resultados Automaticamente
                        </label>
                    </div>
                    
                    <div class="setting-item">
                        <label for="priorityCategories">Categorias Prioritárias:</label>
                        <div class="checkbox-group">
                            ${this.generatePriorityCategoriesCheckboxes()}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Gerar painel de configurações de interface
     */
    generateInterfaceSettingsPanel() {
        return `
            <div class="settings-panel-content" data-panel="interface">
                <div class="setting-group">
                    <h3>🎨 Aparência</h3>
                    
                    <div class="setting-item">
                        <label for="theme">Tema:</label>
                        <select id="theme">
                            <option value="auto" ${this.settings.ui.theme === 'auto' ? 'selected' : ''}>Automático</option>
                            <option value="light" ${this.settings.ui.theme === 'light' ? 'selected' : ''}>Claro</option>
                            <option value="dark" ${this.settings.ui.theme === 'dark' ? 'selected' : ''}>Escuro</option>
                        </select>
                    </div>
                    
                    <div class="setting-item">
                        <label>
                            <input type="checkbox" id="animations" 
                                   ${this.settings.ui.animations ? 'checked' : ''}>
                            Habilitar Animações
                        </label>
                    </div>
                    
                    <div class="setting-item">
                        <label>
                            <input type="checkbox" id="compactView" 
                                   ${this.settings.ui.compactView ? 'checked' : ''}>
                            Visualização Compacta
                        </label>
                    </div>
                    
                    <div class="setting-item">
                        <label>
                            <input type="checkbox" id="autoScroll" 
                                   ${this.settings.ui.autoScroll ? 'checked' : ''}>
                            Scroll Automático para Resultados
                        </label>
                    </div>
                </div>
                
                <div class="setting-group">
                    <h3>📊 Exibição de Dados</h3>
                    
                    <div class="setting-item">
                        <label>
                            <input type="checkbox" id="showTimestamps" 
                                   ${this.settings.ui.showTimestamps ? 'checked' : ''}>
                            Mostrar Timestamps
                        </label>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Gerar painel de configurações de segurança
     */
    generateSecuritySettingsPanel() {
        return `
            <div class="settings-panel-content" data-panel="security">
                <div class="setting-group">
                    <h3>🔒 Segurança e Privacidade</h3>
                    
                    <div class="setting-item">
                        <label>
                            <input type="checkbox" id="confirmDangerousOperations" 
                                   ${this.settings.security.confirmDangerousOperations ? 'checked' : ''}>
                            Confirmar Operações Perigosas
                        </label>
                        <small>Solicitar confirmação para limpeza de dados</small>
                    </div>
                    
                    <div class="setting-item">
                        <label>
                            <input type="checkbox" id="hideAdultContent" 
                                   ${this.settings.security.hideAdultContent ? 'checked' : ''}>
                            Ocultar Conteúdo Adulto
                        </label>
                        <small>Não exibir resultados de sites adultos</small>
                    </div>
                    
                    <div class="setting-item">
                        <label>
                            <input type="checkbox" id="blurSensitiveResults" 
                                   ${this.settings.security.blurSensitiveResults ? 'checked' : ''}>
                            Desfocar Resultados Sensíveis
                        </label>
                    </div>
                    
                    <div class="setting-item">
                        <label>
                            <input type="checkbox" id="requireConfirmationForExport" 
                                   ${this.settings.security.requireConfirmationForExport ? 'checked' : ''}>
                            Confirmar Exportação de Dados
                        </label>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Gerar painel de configurações de notificações
     */
    generateNotificationsSettingsPanel() {
        return `
            <div class="settings-panel-content" data-panel="notifications">
                <div class="setting-group">
                    <h3>🔔 Notificações</h3>
                    
                    <div class="setting-item">
                        <label>
                            <input type="checkbox" id="showProgress" 
                                   ${this.settings.notifications.showProgress ? 'checked' : ''}>
                            Mostrar Progresso da Busca
                        </label>
                    </div>
                    
                    <div class="setting-item">
                        <label>
                            <input type="checkbox" id="showCompletion" 
                                   ${this.settings.notifications.showCompletion ? 'checked' : ''}>
                            Notificar Conclusão da Busca
                        </label>
                    </div>
                    
                    <div class="setting-item">
                        <label>
                            <input type="checkbox" id="showErrors" 
                                   ${this.settings.notifications.showErrors ? 'checked' : ''}>
                            Mostrar Notificações de Erro
                        </label>
                    </div>
                    
                    <div class="setting-item">
                        <label>
                            <input type="checkbox" id="playAudio" 
                                   ${this.settings.notifications.playAudio ? 'checked' : ''}>
                            Reproduzir Sons
                        </label>
                        <small>Sons para conclusão e erros</small>
                    </div>
                    
                    <div class="setting-item">
                        <label for="notificationDuration">Duração das Notificações (ms):</label>
                        <input type="range" id="notificationDuration" min="1000" max="10000" step="500"
                               value="${this.settings.notifications.duration}">
                        <span class="range-value">${this.settings.notifications.duration}</span>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Gerar painel de configurações avançadas
     */
    generateAdvancedSettingsPanel() {
        return `
            <div class="settings-panel-content" data-panel="advanced">
                <div class="setting-group">
                    <h3>⚡ Configurações Avançadas</h3>
                    
                    <div class="setting-item">
                        <label>
                            <input type="checkbox" id="enableDebugMode" 
                                   ${this.settings.advanced.enableDebugMode ? 'checked' : ''}>
                            Modo Debug
                        </label>
                        <small>Logs detalhados no console</small>
                    </div>
                    
                    <div class="setting-item">
                        <label for="logLevel">Nível de Log:</label>
                        <select id="logLevel">
                            <option value="debug" ${this.settings.advanced.logLevel === 'debug' ? 'selected' : ''}>Debug</option>
                            <option value="info" ${this.settings.advanced.logLevel === 'info' ? 'selected' : ''}>Info</option>
                            <option value="warn" ${this.settings.advanced.logLevel === 'warn' ? 'selected' : ''}>Warning</option>
                            <option value="error" ${this.settings.advanced.logLevel === 'error' ? 'selected' : ''}>Error</option>
                        </select>
                    </div>
                    
                    <div class="setting-item">
                        <label>
                            <input type="checkbox" id="cacheResults" 
                                   ${this.settings.advanced.cacheResults ? 'checked' : ''}>
                            Cache de Resultados
                        </label>
                    </div>
                    
                    <div class="setting-item">
                        <label for="cacheExpiration">Expiração do Cache (horas):</label>
                        <input type="range" id="cacheExpiration" min="1" max="168" 
                               value="${this.settings.advanced.cacheExpiration}">
                        <span class="range-value">${this.settings.advanced.cacheExpiration}</span>
                    </div>
                    
                    <div class="setting-item">
                        <label>
                            <input type="checkbox" id="enableExperimentalFeatures" 
                                   ${this.settings.advanced.enableExperimentalFeatures ? 'checked' : ''}>
                            Recursos Experimentais
                        </label>
                        <small>⚠️ Pode ser instável</small>
                    </div>
                </div>
                
                <div class="setting-group">
                    <h3>🧹 Manutenção</h3>
                    
                    <div class="setting-item">
                        <button class="btn btn-secondary" id="clearCache">🗑️ Limpar Cache</button>
                        <small>Remove dados temporários</small>
                    </div>
                    
                    <div class="setting-item">
                        <button class="btn btn-secondary" id="exportSettings">📤 Exportar Configurações</button>
                        <button class="btn btn-secondary" id="importSettings">📥 Importar Configurações</button>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Gerar checkboxes para categorias prioritárias
     */
    generatePriorityCategoriesCheckboxes() {
        const categories = [
            { id: 'social', label: '📱 Social Media' },
            { id: 'dev', label: '👨‍💻 Desenvolvimento' },
            { id: 'portfolio', label: '🎨 Portfolio' },
            { id: 'adult', label: '🔞 Adulto' },
            { id: 'cam', label: '📹 Cam Sites' },
            { id: 'forum', label: '💬 Fóruns' }
        ];

        return categories.map(cat => {
            const checked = this.settings.search.priorityCategories.includes(cat.id) ? 'checked' : '';
            return `
                <label class="checkbox-item">
                    <input type="checkbox" value="${cat.id}" ${checked} 
                           data-setting="priorityCategories">
                    ${cat.label}
                </label>
            `;
        }).join('');
    }

    /**
     * Configurar event listeners do painel
     */
    setupSettingsEventListeners() {
        // Abrir/fechar painel
        document.addEventListener('click', (e) => {
            if (e.target.id === 'closeSettings' || e.target.id === 'settingsOverlay') {
                this.hideSettings();
            }
        });

        // Tabs
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('tab-btn')) {
                this.switchTab(e.target.dataset.tab);
            }
        });

        // Salvar configurações
        document.addEventListener('click', (e) => {
            if (e.target.id === 'saveSettings') {
                this.saveCurrentSettings();
            }
        });

        // Restaurar padrão
        document.addEventListener('click', (e) => {
            if (e.target.id === 'resetSettings') {
                this.resetToDefault();
            }
        });

        // Range inputs
        document.addEventListener('input', (e) => {
            if (e.target.type === 'range') {
                const valueSpan = e.target.nextElementSibling;
                if (valueSpan && valueSpan.classList.contains('range-value')) {
                    valueSpan.textContent = e.target.value;
                }
            }
        });

        // Manutenção
        document.addEventListener('click', (e) => {
            if (e.target.id === 'clearCache') this.clearCache();
            if (e.target.id === 'exportSettings') this.exportSettings();
            if (e.target.id === 'importSettings') this.importSettings();
        });
    }

    /**
     * Mostrar painel de configurações
     */
    toggleSettings() {
        this.isSettingsVisible = !this.isSettingsVisible;
        
        if (this.isSettingsVisible) {
            this.showSettings();
        } else {
            this.hideSettings();
        }
    }

    showSettings() {
        const panel = document.getElementById('settingsPanel');
        if (panel) {
            panel.classList.remove('hidden');
            this.isSettingsVisible = true;
            this.updateSettingsValues();
        }
    }

    hideSettings() {
        const panel = document.getElementById('settingsPanel');
        if (panel) {
            panel.classList.add('hidden');
            this.isSettingsVisible = false;
        }
    }

    /**
     * Trocar aba ativa
     */
    switchTab(tabName) {
        // Atualizar botões
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });

        // Atualizar painéis
        document.querySelectorAll('.settings-panel-content').forEach(panel => {
            panel.classList.toggle('active', panel.dataset.panel === tabName);
        });
    }

    /**
     * Aplicar configurações atuais
     */
    applySettings() {
        // Aplicar tema
        this.uiManager.setTheme(this.settings.ui.theme);
        
        // Aplicar outras configurações visuais
        document.body.setAttribute('data-animations', this.settings.ui.animations);
        document.body.setAttribute('data-compact', this.settings.ui.compactView);
        
        console.log('✅ Configurações aplicadas');
    }

    /**
     * Salvar configurações atuais do formulário
     */
    async saveCurrentSettings() {
        try {
            // Coletar valores do formulário
            this.collectSettingsFromForm();
            
            // Salvar no storage
            await this.saveSettings();
            
            // Aplicar mudanças
            this.applySettings();
            
            // Fechar painel
            this.hideSettings();
            
        } catch (error) {
            console.error('❌ Erro ao salvar configurações:', error);
            this.uiManager.showError('Erro ao salvar configurações');
        }
    }

    /**
     * Coletar configurações do formulário
     */
    collectSettingsFromForm() {
        // Busca
        this.settings.search.maxVariations = parseInt(document.getElementById('maxVariations')?.value || 5);
        this.settings.search.delayBetweenRequests = parseInt(document.getElementById('delayBetweenRequests')?.value || 300);
        this.settings.search.confidenceThreshold = parseInt(document.getElementById('confidenceThreshold')?.value || 30);
        this.settings.search.includeAdultSites = document.getElementById('includeAdultSites')?.checked || false;
        this.settings.search.autoSaveResults = document.getElementById('autoSaveResults')?.checked || true;

        // Coletar categorias prioritárias
        const priorityCheckboxes = document.querySelectorAll('[data-setting="priorityCategories"]:checked');
        this.settings.search.priorityCategories = Array.from(priorityCheckboxes).map(cb => cb.value);

        // Interface
        this.settings.ui.theme = document.getElementById('theme')?.value || 'auto';
        this.settings.ui.animations = document.getElementById('animations')?.checked || true;
        this.settings.ui.compactView = document.getElementById('compactView')?.checked || false;
        this.settings.ui.autoScroll = document.getElementById('autoScroll')?.checked || true;
        this.settings.ui.showTimestamps = document.getElementById('showTimestamps')?.checked || true;

        // Segurança
        this.settings.security.confirmDangerousOperations = document.getElementById('confirmDangerousOperations')?.checked || true;
        this.settings.security.hideAdultContent = document.getElementById('hideAdultContent')?.checked || false;
        this.settings.security.blurSensitiveResults = document.getElementById('blurSensitiveResults')?.checked || true;
        this.settings.security.requireConfirmationForExport = document.getElementById('requireConfirmationForExport')?.checked || false;

        // Notificações
        this.settings.notifications.showProgress = document.getElementById('showProgress')?.checked || true;
        this.settings.notifications.showCompletion = document.getElementById('showCompletion')?.checked || true;
        this.settings.notifications.showErrors = document.getElementById('showErrors')?.checked || true;
        this.settings.notifications.playAudio = document.getElementById('playAudio')?.checked || false;
        this.settings.notifications.duration = parseInt(document.getElementById('notificationDuration')?.value || 3000);

        // Avançado
        this.settings.advanced.enableDebugMode = document.getElementById('enableDebugMode')?.checked || false;
        this.settings.advanced.logLevel = document.getElementById('logLevel')?.value || 'info';
        this.settings.advanced.cacheResults = document.getElementById('cacheResults')?.checked || true;
        this.settings.advanced.cacheExpiration = parseInt(document.getElementById('cacheExpiration')?.value || 24);
        this.settings.advanced.enableExperimentalFeatures = document.getElementById('enableExperimentalFeatures')?.checked || false;
    }

    /**
     * Atualizar valores no formulário
     */
    updateSettingsValues() {
        // Range values
        document.querySelectorAll('input[type="range"]').forEach(range => {
            const valueSpan = range.nextElementSibling;
            if (valueSpan && valueSpan.classList.contains('range-value')) {
                valueSpan.textContent = range.value;
            }
        });
    }

    /**
     * Restaurar configurações padrão
     */
    async resetToDefault() {
        if (this.settings.security.confirmDangerousOperations) {
            if (!confirm('Tem certeza que deseja restaurar todas as configurações para o padrão?')) {
                return;
            }
        }

        this.settings = this.getDefaultSettings();
        await this.saveSettings();
        this.setupSettingsPanel();
        this.applySettings();
        
        this.uiManager.showNotification('Configurações restauradas para o padrão', 'info');
    }

    /**
     * Limpar cache
     */
    async clearCache() {
        try {
            await new Promise((resolve, reject) => {
                chrome.storage.local.remove(['searchCache', 'resultCache'], () => {
                    if (chrome.runtime.lastError) {
                        reject(chrome.runtime.lastError);
                    } else {
                        resolve();
                    }
                });
            });

            this.uiManager.showNotification('Cache limpo com sucesso', 'success');
        } catch (error) {
            console.error('❌ Erro ao limpar cache:', error);
            this.uiManager.showError('Erro ao limpar cache');
        }
    }

    /**
     * Exportar configurações
     */
    async exportSettings() {
        try {
            const exportData = {
                settings: this.settings,
                exportDate: new Date().toISOString(),
                version: '3.0.0'
            };

            const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
                type: 'application/json' 
            });
            
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `deepalias_settings_${new Date().toISOString().slice(0, 10)}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            this.uiManager.showNotification('Configurações exportadas', 'success');
        } catch (error) {
            console.error('❌ Erro ao exportar configurações:', error);
            this.uiManager.showError('Erro ao exportar configurações');
        }
    }

    /**
     * Importar configurações
     */
    importSettings() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = async (e) => {
            try {
                const file = e.target.files[0];
                if (!file) return;

                const text = await file.text();
                const data = JSON.parse(text);
                
                if (data.settings) {
                    this.settings = this.mergeDeep(this.getDefaultSettings(), data.settings);
                    await this.saveSettings();
                    this.setupSettingsPanel();
                    this.applySettings();
                    
                    this.uiManager.showNotification('Configurações importadas com sucesso', 'success');
                } else {
                    throw new Error('Arquivo de configuração inválido');
                }
            } catch (error) {
                console.error('❌ Erro ao importar configurações:', error);
                this.uiManager.showError('Erro ao importar configurações');
            }
        };

        input.click();
    }

    /**
     * Obter configuração específica
     */
    getSetting(path) {
        return path.split('.').reduce((obj, key) => obj?.[key], this.settings);
    }

    /**
     * Definir configuração específica
     */
    setSetting(path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        const target = keys.reduce((obj, key) => obj[key] = obj[key] || {}, this.settings);
        target[lastKey] = value;
    }

    /**
     * Merge profundo de objetos
     */
    mergeDeep(target, source) {
        const output = Object.assign({}, target);
        
        if (this.isObject(target) && this.isObject(source)) {
            Object.keys(source).forEach(key => {
                if (this.isObject(source[key])) {
                    if (!(key in target)) {
                        Object.assign(output, { [key]: source[key] });
                    } else {
                        output[key] = this.mergeDeep(target[key], source[key]);
                    }
                } else {
                    Object.assign(output, { [key]: source[key] });
                }
            });
        }
        
        return output;
    }

    /**
     * Verificar se é objeto
     */
    isObject(item) {
        return item && typeof item === 'object' && !Array.isArray(item);
    }

    /**
     * Obter todas as configurações
     */
    getAllSettings() {
        return { ...this.settings };
    }
}
