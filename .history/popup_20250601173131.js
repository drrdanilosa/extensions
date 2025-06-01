/**
 * DeepAlias Hunter Pro v3.0 - Popup Script Principal
 * Interface moderna com arquitetura modular MVC
 */

// Importar módulos da nova arquitetura
import('./src/popup/popup.js')
    .then(module => {
        // Inicializar a aplicação quando o módulo for carregado
        document.addEventListener('DOMContentLoaded', async () => {
            try {
                await module.initializeApp();
                console.log('🚀 DeepAlias Hunter Pro v3.0 - Inicializado com sucesso');
            } catch (error) {
                console.error('❌ Erro ao inicializar a aplicação:', error);
                
                // Fallback para versão original se houver erro
                initializeFallbackApp();
            }
        });
    })
    .catch(error => {
        console.warn('⚠️ Erro ao carregar módulos ES6, usando versão de fallback:', error);
        document.addEventListener('DOMContentLoaded', initializeFallbackApp);
    });

// Versão de fallback para compatibilidade
function initializeFallbackApp() {
    console.log('🔄 Inicializando versão de fallback...');
    
    // Classe principal da aplicação (versão simplificada)
    function DeepAliasHunter() {
        this.isSearching = false;
        this.statusInterval = null;
        
        this.initElements();
        this.initEventListeners();
        this.checkConnection();
        
        console.log('🚀 DeepAlias Hunter Pro v3.0 - Fallback Inicializado');
    }

    // Inicializar elementos DOM
    DeepAliasHunter.prototype.initElements = function() {
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
    };

    // Configurar event listeners
    DeepAliasHunter.prototype.initEventListeners = function() {
        var self = this;
        
        // Botões principais
        if (this.elements.searchBtn) {
            this.elements.searchBtn.addEventListener('click', function() { self.startSearch(); });
        }
        if (this.elements.stopBtn) {
            this.elements.stopBtn.addEventListener('click', function() { self.stopSearch(); });
        }
        if (this.elements.clearBtn) {
            this.elements.clearBtn.addEventListener('click', function() { self.clearResults(); });
        }
        if (this.elements.exportBtn) {
            this.elements.exportBtn.addEventListener('click', function() { self.exportResults(); });
        }

        // Input com Enter
        if (this.elements.username) {
            this.elements.username.addEventListener('keypress', function(e) {
                if (e.key === 'Enter' && !self.isSearching) {
                    self.startSearch();
                }
            });
        }

        // Botão de configurações
        const settingsBtn = document.getElementById('settingsBtn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', function() {
                self.openSettings();
            });
        }

        // Mensagens do background script
        if (typeof browser !== 'undefined' && browser.runtime) {
            browser.runtime.onMessage.addListener(function(message) {
                self.handleMessage(message);
            });
        }
    };

    // Verificar conexão com background script
    DeepAliasHunter.prototype.checkConnection = function() {
        var self = this;
        
        try {
            if (typeof browser !== 'undefined' && browser.runtime) {
                browser.runtime.sendMessage({type: 'ping'}, function(response) {
                    if (response && response.status === 'ok') {
                        self.updateConnectionStatus(true);
                    } else {
                        self.updateConnectionStatus(false);
                    }
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

    // Iniciar busca
    DeepAliasHunter.prototype.startSearch = function() {
        var username = this.elements.username ? this.elements.username.value.trim() : '';
        
        if (!this.validateUsername(username)) {
            return;
        }

        this.isSearching = true;
        this.updateUI();
        this.showProgress(0, 'Iniciando busca...');
        
        // Enviar mensagem para background script
        try {
            if (typeof browser !== 'undefined' && browser.runtime) {
                browser.runtime.sendMessage({
                    type: 'startSearch',
                    username: username
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

    // Validar username
    DeepAliasHunter.prototype.validateUsername = function(username) {
        if (!username) {
            this.showError('Por favor, digite um username');
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
        
        var validPattern = /^[a-zA-Z0-9._-]+$/;
        if (!validPattern.test(username)) {
            this.showError('Username contém caracteres inválidos');
            return false;
        }
        
        this.hideError();
        return true;
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
        this.updateStatus('Busca interrompida');
    };

    // Limpar resultados
    DeepAliasHunter.prototype.clearResults = function() {
        if (this.elements.results) {
            this.elements.results.innerHTML = '';
        }
        if (this.elements.resultsSection) {
            this.elements.resultsSection.style.display = 'none';
        }
        this.hideError();
        this.hideProgress();
        this.updateStatus('Pronto para buscar');
    };

    // Exportar resultados
    DeepAliasHunter.prototype.exportResults = function() {
        var results = this.elements.results ? this.elements.results.querySelectorAll('.result-item') : [];
        
        if (results.length === 0) {
            this.showError('Nenhum resultado para exportar');
            return;
        }

        var exportData = [];
        results.forEach(function(result) {
            var platform = result.querySelector('.platform-name')?.textContent || '';
            var status = result.classList.contains('found') ? 'Encontrado' : 'Não encontrado';
            var url = result.dataset.url || '';
            
            exportData.push({
                plataforma: platform,
                status: status,
                url: url
            });
        });

        var exportText = 'DeepAlias Hunter Pro - Resultados da Busca\n';
        exportText += '=====================================\n\n';
        
        exportData.forEach(function(item) {
            exportText += `Plataforma: ${item.plataforma}\n`;
            exportText += `Status: ${item.status}\n`;
            exportText += `URL: ${item.url}\n\n`;
        });

        // Copiar para clipboard
        navigator.clipboard.writeText(exportText).then(function() {
            console.log('Resultados copiados para clipboard');
        }).catch(function(error) {
            console.error('Erro ao copiar:', error);
        });
    };

    // Abrir configurações
    DeepAliasHunter.prototype.openSettings = function() {
        const modal = document.getElementById('settingsModal');
        if (modal) {
            modal.style.display = 'block';
        }
    };

    // Manipular mensagens do background
    DeepAliasHunter.prototype.handleMessage = function(message) {
        switch (message.type) {
            case 'searchProgress':
                this.showProgress(message.progress, message.message);
                break;
            case 'searchResult':
                this.addResult(message.platform, message.found, message.url);
                break;
            case 'searchComplete':
                this.handleSearchComplete(message.results);
                break;
            case 'searchError':
                this.showError(message.error);
                this.isSearching = false;
                this.updateUI();
                break;
        }
    };

    // Mostrar progresso
    DeepAliasHunter.prototype.showProgress = function(progress, message) {
        if (this.elements.progressContainer) {
            this.elements.progressContainer.style.display = 'block';
        }
        if (this.elements.progressFill) {
            this.elements.progressFill.style.width = progress + '%';
        }
        if (this.elements.progressText) {
            this.elements.progressText.textContent = message;
        }
    };

    // Esconder progresso
    DeepAliasHunter.prototype.hideProgress = function() {
        if (this.elements.progressContainer) {
            this.elements.progressContainer.style.display = 'none';
        }
    };

    // Adicionar resultado
    DeepAliasHunter.prototype.addResult = function(platform, found, url) {
        if (!this.elements.results) return;
        
        if (this.elements.resultsSection) {
            this.elements.resultsSection.style.display = 'block';
        }

        var resultDiv = document.createElement('div');
        resultDiv.className = 'result-item ' + (found ? 'found' : 'not-found');
        resultDiv.dataset.url = url;
        
        resultDiv.innerHTML = `
            <div class="platform-info">
                <span class="platform-name">${platform}</span>
                <span class="status">${found ? '✅ Encontrado' : '❌ Não encontrado'}</span>
            </div>
            ${found ? `<a href="${url}" target="_blank" class="result-url">${url}</a>` : ''}
        `;
        
        // Inserir encontrados primeiro
        if (found) {
            this.elements.results.insertBefore(resultDiv, this.elements.results.firstChild);
        } else {
            this.elements.results.appendChild(resultDiv);
        }
    };

    // Manipular conclusão da busca
    DeepAliasHunter.prototype.handleSearchComplete = function(results) {
        this.isSearching = false;
        this.updateUI();
        this.hideProgress();
        
        var foundCount = results.filter(r => r.found).length;
        this.updateStatus(`Busca concluída: ${foundCount} perfis encontrados`);
    };

    // Atualizar interface
    DeepAliasHunter.prototype.updateUI = function() {
        if (this.elements.searchBtn) {
            this.elements.searchBtn.disabled = this.isSearching;
            this.elements.searchBtn.textContent = this.isSearching ? 'Buscando...' : 'Buscar';
        }
        if (this.elements.stopBtn) {
            this.elements.stopBtn.style.display = this.isSearching ? 'inline-block' : 'none';
        }
        if (this.elements.username) {
            this.elements.username.disabled = this.isSearching;
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
    } catch (error) {
        console.error('❌ Erro ao inicializar DeepAlias Hunter Pro:', error);
    }
}

    // Auto-focus no input
    this.elements.username.focus();
};

// Verificar conexão com background script
DeepAliasHunter.prototype.checkConnection = function() {
    var self = this;
    this.sendMessage({ action: 'ping' }).then(function(response) {
        if (response && response.status === 'success') {
            self.updateConnectionStatus(true);
            self.setStatus('Pronto para busca profunda', 'ready');
        } else {
            self.updateConnectionStatus(false);
        }
    }).catch(function(error) {
        console.error('❌ Erro de conexão:', error);
        self.updateConnectionStatus(false);
        self.showError('Erro de conexão com background script');
    });
};

// Atualizar status da conexão
DeepAliasHunter.prototype.updateConnectionStatus = function(connected) {
    var status = this.elements.connectionStatus;
    if (connected) {
        status.innerHTML = '🟢 Conectado';
        status.style.color = '#4CAF50';
    } else {
        status.innerHTML = '🔴 Desconectado';
        status.style.color = '#f44336';
    }
};

// Enviar mensagem para background script
DeepAliasHunter.prototype.sendMessage = function(message) {
    return new Promise(function(resolve, reject) {
        try {
            chrome.runtime.sendMessage(message, function(response) {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve(response);
                }
            });
        } catch (error) {
            reject(error);
        }
    });
};

// Iniciar busca
DeepAliasHunter.prototype.startSearch = function() {
    var self = this;
    var username = this.elements.username.value.trim();
    
    if (!username) {
        this.showError('Por favor, insira um nome de usuário');
        return;
    }

    this.hideError();
    this.isSearching = true;
    this.setSearchingState(true);
    this.setStatus('🔍 Iniciando busca profunda...', 'searching');
    
    this.sendMessage({
        action: 'startSearch',
        username: username
    }).then(function(response) {
        if (response && response.status === 'success') {
            self.setStatus('🔍 Busca em andamento...', 'searching');
            self.startStatusMonitoring();
        } else {
            self.showError('Erro ao iniciar busca');
            self.setSearchingState(false);
        }
    }).catch(function(error) {
        console.error('❌ Erro ao iniciar busca:', error);
        self.showError('Erro ao iniciar busca');
        self.setSearchingState(false);
    });
};

// Parar busca
DeepAliasHunter.prototype.stopSearch = function() {
    var self = this;
    this.sendMessage({ action: 'stopSearch' }).then(function(response) {
        self.isSearching = false;
        self.setSearchingState(false);
        self.stopStatusMonitoring();
        self.setStatus('⏹️ Busca interrompida', 'stopped');
        self.loadResults();
    }).catch(function(error) {
        console.error('❌ Erro ao parar busca:', error);
        self.showError('Erro ao parar busca');
    });
};

// Monitorar status da busca
DeepAliasHunter.prototype.startStatusMonitoring = function() {
    var self = this;
    this.statusInterval = setInterval(function() {
        if (!self.isSearching) return;
        
        self.sendMessage({ action: 'getStatus' }).then(function(response) {
            if (response) {
                if (response.progress !== undefined) {
                    self.updateProgress(response.progress);
                }
                
                if (response.isComplete) {
                    self.isSearching = false;
                    self.setSearchingState(false);
                    self.stopStatusMonitoring();
                    self.setStatus('✅ Busca concluída!', 'success');
                    self.loadResults();
                }
            }
        }).catch(function(error) {
            console.error('❌ Erro ao obter status:', error);
        });
    }, 1000);
};

// Parar monitoramento
DeepAliasHunter.prototype.stopStatusMonitoring = function() {
    if (this.statusInterval) {
        clearInterval(this.statusInterval);
        this.statusInterval = null;
    }
};

// Carregar resultados
DeepAliasHunter.prototype.loadResults = function() {
    var self = this;
    this.sendMessage({ action: 'getResults' }).then(function(response) {
        if (response && response.results) {
            self.displayResults(response.results);
        }
    }).catch(function(error) {
        console.error('❌ Erro ao carregar resultados:', error);
        self.showError('Erro ao carregar resultados');
    });
};

// Exibir resultados
DeepAliasHunter.prototype.displayResults = function(results) {
    if (!results || results.length === 0) {
        this.elements.resultsSection.style.display = 'none';
        return;
    }

    // Estatísticas
    var stats = {
        total: results.length,
        found: results.filter(function(r) { return r.found; }).length,
        urgent: results.filter(function(r) { return r.priority === 'urgent'; }).length,
        highRisk: results.filter(function(r) { return r.riskLevel === 'high'; }).length,
        adult: results.filter(function(r) { return r.category === 'adult'; }).length
    };

    // Dashboard estatístico
    var statsHtml = '<div class="stats-dashboard">' +
        '<div class="stat-item"><span class="stat-number">' + stats.total + '</span><span class="stat-label">Total</span></div>' +
        '<div class="stat-item found"><span class="stat-number">' + stats.found + '</span><span class="stat-label">Encontrados</span></div>' +
        '<div class="stat-item urgent"><span class="stat-number">' + stats.urgent + '</span><span class="stat-label">Urgentes</span></div>' +
        '<div class="stat-item high-risk"><span class="stat-number">' + stats.highRisk + '</span><span class="stat-label">Alto Risco</span></div>' +
        '<div class="stat-item adult"><span class="stat-number">' + stats.adult + '</span><span class="stat-label">Adulto</span></div>' +
        '</div>';

    // Ordenar por prioridade: urgentes primeiro, depois por confiança
    results.sort(function(a, b) {
        if (a.priority === 'urgent' && b.priority !== 'urgent') return -1;
        if (b.priority === 'urgent' && a.priority !== 'urgent') return 1;
        return (b.confidence || 0) - (a.confidence || 0);
    });

    var resultsHtml = results.map(function(result) {
        return this.createResultItem(result);
    }, this).join('');

    this.elements.results.innerHTML = statsHtml + resultsHtml;
    this.elements.resultsSection.style.display = 'block';
};

// Criar item de resultado
DeepAliasHunter.prototype.createResultItem = function(result) {
    var classes = 'result-item';
    if (result.found) classes += ' found';
    if (result.priority === 'urgent') classes += ' urgent-result';
    if (result.riskLevel === 'high') classes += ' high-risk';

    var tags = '';
    if (result.priority === 'urgent') tags += '<span class="urgent-tag">URGENTE</span>';
    if (result.category === 'adult') tags += '<span class="adult-tag">🔞 ADULTO</span>';
    if (result.riskLevel === 'high') tags += '<span class="risk-tag">⚠️ ALTO RISCO</span>';

    var confidence = result.confidence ? ' (' + result.confidence + '% confiança)' : '';
    var statusText = result.found ? '✅ Encontrado' + confidence : '❌ Não encontrado';
    
    var keywordInfo = '';
    if (result.relatedKeywords && result.relatedKeywords.length > 0) {
        keywordInfo = '<div class="keyword-info">🔍 Palavras-chave: ' + result.relatedKeywords.join(', ') + '</div>';
    }

    return '<div class="' + classes + '">' +
        '<div class="result-header">' +
        '<span class="platform-info">' + result.icon + ' ' + result.platform + '</span>' +
        '<span class="result-status ' + (result.found ? 'found' : 'not-found') + '">' + statusText + '</span>' +
        '</div>' +
        '<div class="result-url"><a href="' + result.url + '" target="_blank">' + result.url + '</a></div>' +
        tags +
        keywordInfo +
        '</div>';
};

// Limpar resultados
DeepAliasHunter.prototype.clearResults = function() {
    var self = this;
    this.sendMessage({ action: 'clearResults' }).then(function() {
        self.elements.results.innerHTML = '';
        self.elements.resultsSection.style.display = 'none';
        self.setStatus('🗑️ Resultados limpos', 'info');
    }).catch(function(error) {
        console.error('❌ Erro ao limpar resultados:', error);
        self.showError('Erro ao limpar resultados');
    });
};

// Exportar resultados
DeepAliasHunter.prototype.exportResults = function() {
    var self = this;
    this.sendMessage({ action: 'getResults' }).then(function(response) {
        if (response && response.results) {
            var results = response.results;
            var timestamp = new Date().toLocaleString('pt-BR');
            var username = self.elements.username.value.trim() || 'unknown';
            
            // Estatísticas detalhadas
            var stats = {
                total: results.length,
                found: results.filter(function(r) { return r.found; }).length,
                urgent: results.filter(function(r) { return r.priority === 'urgent'; }).length,
                highRisk: results.filter(function(r) { return r.riskLevel === 'high'; }).length,
                byCategory: {}
            };
            
            results.forEach(function(r) {
                if (r.category) {
                    stats.byCategory[r.category] = (stats.byCategory[r.category] || 0) + 1;
                }
            });

            var exportText = '=== DEEPALIAS HUNTER PRO v2.0 - RELATÓRIO EXPANDIDO ===\n';
            exportText += 'Data/Hora: ' + timestamp + '\n';
            exportText += 'Usuário Pesquisado: ' + username + '\n';
            exportText += 'Total de Plataformas: ' + stats.total + '\n';
            exportText += 'Encontrados: ' + stats.found + '\n';
            exportText += 'Resultados Urgentes: ' + stats.urgent + '\n';
            exportText += 'Alto Risco: ' + stats.highRisk + '\n\n';
            
            exportText += '=== ESTATÍSTICAS POR CATEGORIA ===\n';
            Object.keys(stats.byCategory).forEach(function(cat) {
                exportText += cat.toUpperCase() + ': ' + stats.byCategory[cat] + '\n';
            });
            exportText += '\n';

            exportText += '=== RESULTADOS ENCONTRADOS ===\n';
            results.filter(function(r) { return r.found; }).forEach(function(result) {
                exportText += '\n🔍 PLATAFORMA: ' + result.platform + '\n';
                exportText += '📍 URL: ' + result.url + '\n';
                exportText += '✅ STATUS: Encontrado\n';
                if (result.confidence) exportText += '📊 CONFIANÇA: ' + result.confidence + '%\n';
                if (result.category) exportText += '📂 CATEGORIA: ' + result.category.toUpperCase() + '\n';
                if (result.riskLevel) exportText += '⚠️ RISCO: ' + result.riskLevel.toUpperCase() + '\n';
                if (result.priority === 'urgent') exportText += '🚨 PRIORIDADE: URGENTE\n';
                if (result.relatedKeywords && result.relatedKeywords.length > 0) {
                    exportText += '🔍 PALAVRAS-CHAVE: ' + result.relatedKeywords.join(', ') + '\n';
                }
                exportText += '---\n';
            });

            // Download do arquivo
            var blob = new Blob([exportText], { type: 'text/plain;charset=utf-8' });
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = 'deepalias_report_' + username + '_' + new Date().toISOString().slice(0, 10) + '.txt';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            self.setStatus('📄 Relatório exportado com sucesso!', 'success');
        } else {
            self.showError('Nenhum resultado para exportar');
        }
    }).catch(function(error) {
        console.error('❌ Erro ao exportar:', error);
        self.showError('Erro ao exportar resultados');
    });
};

// Atualizar progresso
DeepAliasHunter.prototype.updateProgress = function(progress) {
    var percentage = Math.round(progress.percentage || 0);
    this.elements.progressFill.style.width = percentage + '%';
    this.elements.progressText.textContent = 
        (progress.current || 0) + '/' + (progress.total || 0) + ' (' + percentage + '%)';
    this.elements.progressContainer.style.display = 'block';
};

// Definir estado de busca
DeepAliasHunter.prototype.setSearchingState = function(searching) {
    this.isSearching = searching;
    this.elements.searchBtn.disabled = searching;
    this.elements.stopBtn.disabled = !searching;
    this.elements.username.disabled = searching;
    
    if (!searching) {
        this.elements.progressContainer.style.display = 'none';
        this.stopStatusMonitoring();
    }
};

// Definir status
DeepAliasHunter.prototype.setStatus = function(message, type) {
    type = type || 'info';
    this.elements.status.textContent = message;
    this.elements.status.className = 'status-' + type;
};

// Mostrar erro
DeepAliasHunter.prototype.showError = function(message) {
    this.elements.error.textContent = message;
    this.elements.error.style.display = 'block';
};

// Esconder erro
DeepAliasHunter.prototype.hideError = function() {
    this.elements.error.style.display = 'none';
};

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    new DeepAliasHunter();
});
