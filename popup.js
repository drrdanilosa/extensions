/**
 * DeepAlias Hunter Pro v2.0 - Popup Script Expandido
 * Interface de usuário para Firefox com busca profunda
 */

function DeepAliasHunter() {
    var self = this;
    this.isSearching = false;
    this.statusInterval = null;
    
    this.initElements();
    this.initEventListeners();
    this.checkConnection();
    
    console.log('🚀 DeepAlias Hunter Pro v2.0 - Popup Inicializado');
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
    // Botões
    this.elements.searchBtn.addEventListener('click', function() { self.startSearch(); });
    this.elements.stopBtn.addEventListener('click', function() { self.stopSearch(); });
    this.elements.clearBtn.addEventListener('click', function() { self.clearResults(); });
    this.elements.exportBtn.addEventListener('click', function() { self.exportResults(); });

    // Input
    this.elements.username.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !self.isSearching) {
            self.startSearch();
        }
    });

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
