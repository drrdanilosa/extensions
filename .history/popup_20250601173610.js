/**
 * DeepAlias Hunter Pro v3.0 - Popup Script Principal
 * Interface moderna com arquitetura modular MVC
 */

// Função principal de inicialização
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 DeepAlias Hunter Pro v3.0 - Inicializando...');
    
    try {
        // Tentar carregar a nova arquitetura modular
        if (typeof window.importModule === 'function') {
            await initializeModularApp();
        } else {
            // Fallback para versão compatível
            initializeFallbackApp();
        }
    } catch (error) {
        console.warn('⚠️ Erro ao carregar módulos, usando versão de fallback:', error);
        initializeFallbackApp();
    }
});

// Versão de fallback (compatível) - SEMPRE USAR
function initializeFallbackApp() {
    console.log('🔄 Inicializando versão de fallback...');
    
    // Classe principal da aplicação
    function DeepAliasHunter() {
        this.isSearching = false;
        this.statusInterval = null;
        this.results = [];
        
        this.initElements();
        this.initEventListeners();
        this.checkConnection();
        
        console.log('✅ DeepAlias Hunter Pro v3.0 - Fallback Inicializado');
    }

    // Inicializar elementos DOM
    DeepAliasHunter.prototype.initElements = function() {
        this.elements = {
            username: document.getElementById('username'),
            searchBtn: document.getElementById('searchBtn'),
            stopBtn: document.getElementById('stopBtn'),
            clearBtn: document.getElementById('clearBtn'),
            exportBtn: document.getElementById('exportBtn'),
            settingsBtn: document.getElementById('settingsBtn'),
            status: document.getElementById('status'),
            progressContainer: document.getElementById('progressContainer'),
            progressFill: document.getElementById('progressFill'),
            progressText: document.getElementById('progressText'),
            error: document.getElementById('error'),
            resultsSection: document.getElementById('resultsSection'),
            results: document.getElementById('results'),
            connectionStatus: document.getElementById('connectionStatus'),
            settingsModal: document.getElementById('settingsModal'),
            // Estatísticas
            totalCount: document.getElementById('totalCount'),
            foundCount: document.getElementById('foundCount'),
            urgentCount: document.getElementById('urgentCount'),
            highRiskCount: document.getElementById('highRiskCount'),
            adultCount: document.getElementById('adultCount')
        };

        // Auto-focus no input
        if (this.elements.username) {
            this.elements.username.focus();
        }
    };

    // Configurar event listeners
    DeepAliasHunter.prototype.initEventListeners = function() {
        var self = this;
        
        // Botões principais
        if (this.elements.searchBtn) {
            this.elements.searchBtn.addEventListener('click', function() { 
                self.startSearch(); 
            });
        }
        
        if (this.elements.stopBtn) {
            this.elements.stopBtn.addEventListener('click', function() { 
                self.stopSearch(); 
            });
        }
        
        if (this.elements.clearBtn) {
            this.elements.clearBtn.addEventListener('click', function() { 
                self.clearResults(); 
            });
        }
        
        if (this.elements.exportBtn) {
            this.elements.exportBtn.addEventListener('click', function() { 
                self.exportResults(); 
            });
        }

        if (this.elements.settingsBtn) {
            this.elements.settingsBtn.addEventListener('click', function() {
                self.openSettings();
            });
        }

        // Input com Enter
        if (this.elements.username) {
            this.elements.username.addEventListener('keypress', function(e) {
                if (e.key === 'Enter' && !self.isSearching) {
                    self.startSearch();
                }
            });

            // Validação em tempo real
            this.elements.username.addEventListener('input', function() {
                self.validateInput();
            });
        }

        // Modal de configurações
        if (this.elements.settingsModal) {
            // Fechar modal clicando fora
            this.elements.settingsModal.addEventListener('click', function(e) {
                if (e.target === self.elements.settingsModal) {
                    self.closeSettings();
                }
            });

            // Botão fechar
            const closeBtn = this.elements.settingsModal.querySelector('.close');
            if (closeBtn) {
                closeBtn.addEventListener('click', function() {
                    self.closeSettings();
                });
            }
        }

        // Mensagens do background script
        this.setupMessageHandler();
    };

    // Configurar handler de mensagens
    DeepAliasHunter.prototype.setupMessageHandler = function() {
        var self = this;
        
        try {
            if (typeof browser !== 'undefined' && browser.runtime && browser.runtime.onMessage) {
                browser.runtime.onMessage.addListener(function(message, sender, sendResponse) {
                    self.handleMessage(message);
                    return true; // Manter canal aberto para resposta assíncrona
                });
            }
        } catch (error) {
            console.error('Erro ao configurar handler de mensagens:', error);
        }
    };

    // Verificar conexão com background script
    DeepAliasHunter.prototype.checkConnection = function() {
        var self = this;
        
        try {
            if (typeof browser !== 'undefined' && browser.runtime) {
                browser.runtime.sendMessage({type: 'ping'})
                    .then(function(response) {
                        if (response && response.status === 'ok') {
                            self.updateConnectionStatus(true);
                            self.updateStatus('Pronto para busca profunda');
                        } else {
                            self.updateConnectionStatus(false);
                        }
                    })
                    .catch(function(error) {
                        console.error('Erro ao verificar conexão:', error);
                        self.updateConnectionStatus(false);
                    });
            } else {
                this.updateConnectionStatus(false);
            }
        } catch (error) {
            console.error('Erro ao verificar conexão:', error);
            this.updateConnectionStatus(false);
        }
    };

    // Atualizar status de conexão
    DeepAliasHunter.prototype.updateConnectionStatus = function(connected) {
        if (this.elements.connectionStatus) {
            this.elements.connectionStatus.textContent = connected ? '🟢 Conectado' : '🔴 Desconectado';
            this.elements.connectionStatus.className = connected ? 'status-connected' : 'status-disconnected';
        }
    };

    // Validar entrada
    DeepAliasHunter.prototype.validateInput = function() {
        var username = this.elements.username ? this.elements.username.value.trim() : '';
        var isValid = this.validateUsername(username, false);
        
        if (this.elements.username) {
            this.elements.username.classList.toggle('invalid', !isValid && username.length > 0);
        }
        
        return isValid;
    };

    // Validar username
    DeepAliasHunter.prototype.validateUsername = function(username, showError) {
        showError = showError !== false; // Default true
        
        if (!username) {
            if (showError) this.showError('Por favor, digite um username');
            return false;
        }
        
        if (username.length < 2) {
            if (showError) this.showError('Username deve ter pelo menos 2 caracteres');
            return false;
        }
        
        if (username.length > 50) {
            if (showError) this.showError('Username muito longo (máximo 50 caracteres)');
            return false;
        }
        
        var validPattern = /^[a-zA-Z0-9._-]+$/;
        if (!validPattern.test(username)) {
            if (showError) this.showError('Username contém caracteres inválidos (apenas letras, números, ., _, -)');
            return false;
        }
        
        if (showError) this.hideError();
        return true;
    };

    // Iniciar busca
    DeepAliasHunter.prototype.startSearch = function() {
        var username = this.elements.username ? this.elements.username.value.trim() : '';
        
        if (!this.validateUsername(username)) {
            return;
        }

        this.isSearching = true;
        this.results = [];
        this.updateUI();
        this.clearResults();
        this.showProgress(0, 'Iniciando busca profunda...');
        this.updateStatistics();
        
        // Enviar mensagem para background script
        try {
            if (typeof browser !== 'undefined' && browser.runtime) {
                browser.runtime.sendMessage({
                    type: 'startSearch',
                    username: username,
                    timestamp: Date.now()
                }).catch(function(error) {
                    console.error('Erro ao enviar mensagem:', error);
                });
            } else {
                throw new Error('Browser runtime não disponível');
            }
        } catch (error) {
            console.error('Erro ao iniciar busca:', error);
            this.showError('Erro ao conectar com o background script');
            this.isSearching = false;
            this.updateUI();
        }
    };

    // Parar busca
    DeepAliasHunter.prototype.stopSearch = function() {
        try {
            if (typeof browser !== 'undefined' && browser.runtime) {
                browser.runtime.sendMessage({type: 'stopSearch'});
            }
        } catch (error) {
            console.error('Erro ao parar busca:', error);
        }
        
        this.isSearching = false;
        this.updateUI();
        this.hideProgress();
        this.updateStatus('Busca interrompida pelo usuário');
    };

    // Limpar resultados
    DeepAliasHunter.prototype.clearResults = function() {
        this.results = [];
        
        if (this.elements.results) {
            this.elements.results.innerHTML = '';
        }
        if (this.elements.resultsSection) {
            this.elements.resultsSection.style.display = 'none';
        }
        
        this.hideError();
        this.hideProgress();
        this.updateStatus('Pronto para buscar');
        this.updateStatistics();
    };

    // Exportar resultados
    DeepAliasHunter.prototype.exportResults = function() {
        if (this.results.length === 0) {
            this.showError('Nenhum resultado para exportar');
            return;
        }

        var username = this.elements.username ? this.elements.username.value.trim() : 'unknown';
        var exportData = {
            username: username,
            timestamp: new Date().toISOString(),
            version: '3.0.0',
            totalSearched: this.results.length,
            found: this.results.filter(r => r.found).length,
            results: this.results
        };

        var exportText = `DeepAlias Hunter Pro v3.0 - Relatório de Busca\n`;
        exportText += `=============================================\n\n`;
        exportText += `Username: ${username}\n`;
        exportText += `Data/Hora: ${new Date().toLocaleString('pt-BR')}\n`;
        exportText += `Total de plataformas: ${exportData.totalSearched}\n`;
        exportText += `Perfis encontrados: ${exportData.found}\n\n`;
        exportText += `RESULTADOS:\n`;
        exportText += `===========\n\n`;
        
        this.results.forEach(function(result, index) {
            exportText += `${index + 1}. ${result.platform}\n`;
            exportText += `   Status: ${result.found ? '✅ ENCONTRADO' : '❌ Não encontrado'}\n`;
            if (result.found) {
                exportText += `   URL: ${result.url}\n`;
                exportText += `   Risco: ${result.risk || 'Low'}\n`;
                exportText += `   Categoria: ${result.category || 'Unknown'}\n`;
            }
            exportText += `\n`;
        });

        // Copiar para clipboard
        navigator.clipboard.writeText(exportText).then(function() {
            console.log('✅ Relatório copiado para clipboard');
        }).catch(function(error) {
            console.error('❌ Erro ao copiar:', error);
        });
    };

    // Abrir configurações
    DeepAliasHunter.prototype.openSettings = function() {
        if (this.elements.settingsModal) {
            this.elements.settingsModal.style.display = 'block';
        }
    };

    // Fechar configurações
    DeepAliasHunter.prototype.closeSettings = function() {
        if (this.elements.settingsModal) {
            this.elements.settingsModal.style.display = 'none';
        }
    };

    // Manipular mensagens do background
    DeepAliasHunter.prototype.handleMessage = function(message) {
        switch (message.type) {
            case 'searchProgress':
                this.showProgress(message.progress, message.message);
                break;
                
            case 'searchResult':
                this.addResult(message.result);
                break;
                
            case 'searchComplete':
                this.handleSearchComplete(message.summary);
                break;
                
            case 'searchError':
                this.showError(message.error);
                this.isSearching = false;
                this.updateUI();
                break;
                
            case 'pong':
                this.updateConnectionStatus(true);
                break;
                
            default:
                console.log('Mensagem não reconhecida:', message);
        }
    };

    // Mostrar progresso
    DeepAliasHunter.prototype.showProgress = function(progress, message) {
        if (this.elements.progressContainer) {
            this.elements.progressContainer.style.display = 'block';
        }
        if (this.elements.progressFill) {
            this.elements.progressFill.style.width = Math.min(100, Math.max(0, progress)) + '%';
        }
        if (this.elements.progressText) {
            this.elements.progressText.textContent = message || 'Processando...';
        }
        this.updateStatus(message || 'Processando...');
    };

    // Esconder progresso
    DeepAliasHunter.prototype.hideProgress = function() {
        if (this.elements.progressContainer) {
            this.elements.progressContainer.style.display = 'none';
        }
    };

    // Adicionar resultado
    DeepAliasHunter.prototype.addResult = function(result) {
        if (!result || !this.elements.results) return;
        
        this.results.push(result);
        
        if (this.elements.resultsSection) {
            this.elements.resultsSection.style.display = 'block';
        }

        var resultDiv = document.createElement('div');
        resultDiv.className = 'result-item ' + (result.found ? 'found' : 'not-found');
        if (result.urgent) resultDiv.classList.add('urgent');
        if (result.adult) resultDiv.classList.add('adult');
        
        var riskClass = 'risk-' + (result.risk || 'low').toLowerCase();
        resultDiv.classList.add(riskClass);
        
        var platformIcon = this.getPlatformIcon(result.platform);
        var riskBadge = this.getRiskBadge(result.risk);
        var categoryBadge = this.getCategoryBadge(result.category);
        
        resultDiv.innerHTML = `
            <div class="result-header">
                <div class="platform-info">
                    <span class="platform-icon">${platformIcon}</span>
                    <span class="platform-name">${result.platform}</span>
                    ${result.found ? '<span class="status found">✅ Encontrado</span>' : '<span class="status not-found">❌ Não encontrado</span>'}
                </div>
                <div class="result-badges">
                    ${categoryBadge}
                    ${riskBadge}
                    ${result.urgent ? '<span class="badge urgent">🚨 Urgente</span>' : ''}
                    ${result.adult ? '<span class="badge adult">🔞 Adulto</span>' : ''}
                </div>
            </div>
            ${result.found ? `
                <div class="result-details">
                    <a href="${result.url}" target="_blank" class="result-url" title="Abrir ${result.platform}">
                        ${result.url}
                    </a>
                    ${result.confidence ? `<span class="confidence">Confiança: ${result.confidence}%</span>` : ''}
                </div>
            ` : ''}
        `;
        
        // Inserir resultados encontrados primeiro
        if (result.found) {
            var firstNotFound = this.elements.results.querySelector('.result-item.not-found');
            if (firstNotFound) {
                this.elements.results.insertBefore(resultDiv, firstNotFound);
            } else {
                this.elements.results.appendChild(resultDiv);
            }
        } else {
            this.elements.results.appendChild(resultDiv);
        }
        
        this.updateStatistics();
    };

    // Obter ícone da plataforma
    DeepAliasHunter.prototype.getPlatformIcon = function(platform) {
        var icons = {
            'Instagram': '📷',
            'Facebook': '📘',
            'Twitter': '🐦',
            'TikTok': '🎵',
            'YouTube': '📺',
            'LinkedIn': '💼',
            'GitHub': '👨‍💻',
            'Reddit': '🤖',
            'OnlyFans': '🔞',
            'Chaturbate': '📹',
            'Discord': '💬'
        };
        return icons[platform] || '🌐';
    };

    // Obter badge de risco
    DeepAliasHunter.prototype.getRiskBadge = function(risk) {
        var badges = {
            'low': '<span class="badge risk-low">🟢 Baixo</span>',
            'medium': '<span class="badge risk-medium">🟡 Médio</span>',
            'high': '<span class="badge risk-high">🔴 Alto</span>'
        };
        return badges[risk] || badges.low;
    };

    // Obter badge de categoria
    DeepAliasHunter.prototype.getCategoryBadge = function(category) {
        var badges = {
            'social': '<span class="badge category-social">🔷 Social</span>',
            'adult': '<span class="badge category-adult">🟥 Adulto</span>',
            'portfolio': '<span class="badge category-portfolio">🟨 Portfolio</span>',
            'forum': '<span class="badge category-forum">💬 Fórum</span>',
            'cam': '<span class="badge category-cam">📹 Cam</span>',
            'casting': '<span class="badge category-casting">🎭 Casting</span>'
        };
        return badges[category] || '<span class="badge category-other">⚪ Outro</span>';
    };

    // Manipular conclusão da busca
    DeepAliasHunter.prototype.handleSearchComplete = function(summary) {
        this.isSearching = false;
        this.updateUI();
        this.hideProgress();
        
        var foundCount = summary.found || this.results.filter(r => r.found).length;
        var totalCount = summary.total || this.results.length;
        
        this.updateStatus(`Busca concluída: ${foundCount}/${totalCount} perfis encontrados`);
        this.updateStatistics();
        
        // Scroll para os resultados
        if (this.elements.resultsSection && foundCount > 0) {
            this.elements.resultsSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Atualizar estatísticas
    DeepAliasHunter.prototype.updateStatistics = function() {
        var total = this.results.length;
        var found = this.results.filter(r => r.found).length;
        var urgent = this.results.filter(r => r.urgent).length;
        var highRisk = this.results.filter(r => r.risk === 'high').length;
        var adult = this.results.filter(r => r.adult).length;
        
        if (this.elements.totalCount) this.elements.totalCount.textContent = total;
        if (this.elements.foundCount) this.elements.foundCount.textContent = found;
        if (this.elements.urgentCount) this.elements.urgentCount.textContent = urgent;
        if (this.elements.highRiskCount) this.elements.highRiskCount.textContent = highRisk;
        if (this.elements.adultCount) this.elements.adultCount.textContent = adult;
    };

    // Atualizar interface
    DeepAliasHunter.prototype.updateUI = function() {
        if (this.elements.searchBtn) {
            this.elements.searchBtn.disabled = this.isSearching;
            this.elements.searchBtn.textContent = this.isSearching ? 'Buscando...' : 'Buscar';
            this.elements.searchBtn.classList.toggle('searching', this.isSearching);
        }
        
        if (this.elements.stopBtn) {
            this.elements.stopBtn.style.display = this.isSearching ? 'inline-block' : 'none';
        }
        
        if (this.elements.username) {
            this.elements.username.disabled = this.isSearching;
        }
        
        if (this.elements.clearBtn) {
            this.elements.clearBtn.disabled = this.isSearching;
        }
        
        if (this.elements.exportBtn) {
            this.elements.exportBtn.disabled = this.isSearching || this.results.length === 0;
        }
    };

    // Atualizar status
    DeepAliasHunter.prototype.updateStatus = function(message) {
        if (this.elements.status) {
            this.elements.status.textContent = message;
        }
    };

    // Mostrar erro
    DeepAliasHunter.prototype.showError = function(message) {
        if (this.elements.error) {
            this.elements.error.textContent = message;
            this.elements.error.style.display = 'block';
            
            // Auto-hide após 5 segundos
            setTimeout(() => {
                this.hideError();
            }, 5000);
        }
    };

    // Esconder erro
    DeepAliasHunter.prototype.hideError = function() {
        if (this.elements.error) {
            this.elements.error.style.display = 'none';
        }
    };

    // Inicializar aplicação
    try {
        window.app = new DeepAliasHunter();
        console.log('✅ DeepAlias Hunter Pro v3.0 - Pronto para uso!');
    } catch (error) {
        console.error('❌ Erro crítico ao inicializar:', error);
    }
}
