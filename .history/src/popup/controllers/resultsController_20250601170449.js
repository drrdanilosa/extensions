/**
 * ResultsController - Controlador de Resultados
 * Gerencia exibição, exportação e manipulação dos resultados
 * @version 3.0.0
 */

export class ResultsController {
    constructor(uiManager) {
        this.uiManager = uiManager;
        this.currentResults = [];
        this.currentStats = {};
        this.filters = {
            category: 'all',
            status: 'all',
            confidence: 0
        };
        
        console.log('📊 ResultsController inicializado');
    }

    /**
     * Adicionar resultado individual (para atualizações em tempo real)
     */
    addResult(result) {
        if (!result) return;
        
        this.currentResults.push(result);
        this.updateResultsDisplay();
    }

    /**
     * Definir todos os resultados
     */
    setResults(results, stats = null) {
        this.currentResults = results || [];
        this.currentStats = stats || this.calculateStats(this.currentResults);
        this.updateResultsDisplay();
    }

    /**
     * Atualizar exibição dos resultados
     */
    updateResultsDisplay() {
        if (!this.currentResults.length) {
            this.clearResultsDisplay();
            return;
        }

        // Aplicar filtros
        const filteredResults = this.applyFilters(this.currentResults);
        
        // Ordenar resultados
        const sortedResults = this.sortResults(filteredResults);
        
        // Renderizar
        this.renderResults(sortedResults);
        this.renderStats();
        
        // Mostrar seção de resultados
        if (this.uiManager.elements.resultsSection) {
            this.uiManager.elements.resultsSection.style.display = 'block';
            this.uiManager.scrollToElement('resultsSection');
        }
    }

    /**
     * Renderizar resultados na interface
     */
    renderResults(results) {
        if (!this.uiManager.elements.results) return;
        
        if (!results.length) {
            this.uiManager.elements.results.innerHTML = `
                <div class="no-results">
                    <p>🔍 Nenhum resultado encontrado com os filtros atuais</p>
                </div>
            `;
            return;
        }

        const resultsHtml = results.map(result => this.createResultElement(result)).join('');
        this.uiManager.elements.results.innerHTML = resultsHtml;
        
        // Animar entrada dos resultados
        this.uiManager.animateElement(this.uiManager.elements.results, 'fadeInUp');
    }

    /**
     * Criar elemento HTML para um resultado
     */
    createResultElement(result) {
        const status = result.found || result.status === 'found';
        const confidence = result.confidence || 0;
        
        // Classes CSS baseadas no status e propriedades
        const classes = [
            'result-item',
            status ? 'found' : 'not-found',
            result.priority === 'urgent' ? 'urgent' : '',
            result.riskLevel === 'high' ? 'high-risk' : '',
            result.category === 'adult' || result.category === 'cam' ? 'adult-content' : ''
        ].filter(Boolean).join(' ');

        // Tags e badges
        const tags = this.createResultTags(result);
        
        // Informações de palavras-chave
        const keywordInfo = result.relatedKeywords && result.relatedKeywords.length > 0 
            ? `<div class="keyword-info">🔍 Palavras-chave: ${result.relatedKeywords.join(', ')}</div>`
            : '';

        // Informações adicionais
        const additionalInfo = this.createAdditionalInfo(result);

        // Status text
        const statusText = status 
            ? `✅ Encontrado${confidence ? ` (${confidence}% confiança)` : ''}`
            : '❌ Não encontrado';

        return `
            <div class="${classes}" data-category="${result.category}" data-confidence="${confidence}">
                <div class="result-header">
                    <div class="platform-info">
                        <span class="platform-icon">${result.icon || '🌐'}</span>
                        <span class="platform-name">${result.platform}</span>
                        <span class="platform-category">${this.getCategoryLabel(result.category)}</span>
                    </div>
                    <div class="result-status ${status ? 'found' : 'not-found'}">
                        ${statusText}
                    </div>
                </div>
                
                <div class="result-content">
                    <div class="result-url">
                        <a href="${result.url}" target="_blank" rel="noopener noreferrer" 
                           title="Abrir ${result.platform}">
                            ${this.truncateUrl(result.url)}
                        </a>
                    </div>
                    
                    ${tags}
                    ${keywordInfo}
                    ${additionalInfo}
                </div>
                
                <div class="result-footer">
                    <small class="result-meta">
                        Variação: <strong>${result.variation || result.originalQuery}</strong>
                        ${result.timestamp ? ` • ${this.formatTimestamp(result.timestamp)}` : ''}
                    </small>
                </div>
            </div>
        `;
    }

    /**
     * Criar tags para resultado
     */
    createResultTags(result) {
        const tags = [];

        if (result.priority === 'urgent') {
            tags.push('<span class="tag urgent-tag">🚨 URGENTE</span>');
        }

        if (result.category === 'adult' || result.category === 'cam') {
            tags.push('<span class="tag adult-tag">🔞 ADULTO</span>');
        }

        if (result.riskLevel === 'high') {
            tags.push('<span class="tag risk-tag">⚠️ ALTO RISCO</span>');
        }

        if (result.matchType === 'exact') {
            tags.push('<span class="tag match-tag">🎯 EXATO</span>');
        }

        if (result.confidence && result.confidence >= 90) {
            tags.push('<span class="tag confidence-tag">💎 ALTA CONFIANÇA</span>');
        }

        return tags.length > 0 ? `<div class="result-tags">${tags.join('')}</div>` : '';
    }

    /**
     * Criar informações adicionais do resultado
     */
    createAdditionalInfo(result) {
        const info = [];

        if (result.description) {
            info.push(`<div class="result-description">${result.description}</div>`);
        }

        if (result.lastSeen) {
            info.push(`<div class="result-lastseen">📅 Última atividade: ${result.lastSeen}</div>`);
        }

        if (result.socialMetrics) {
            const metrics = result.socialMetrics;
            const metricsHtml = Object.entries(metrics)
                .map(([key, value]) => `${key}: ${value}`)
                .join(' • ');
            info.push(`<div class="result-metrics">📈 ${metricsHtml}</div>`);
        }

        return info.join('');
    }

    /**
     * Renderizar estatísticas
     */
    renderStats() {
        if (!this.uiManager.elements.statsContainer) return;

        const stats = this.currentStats;
        
        const statsHtml = `
            <div class="stats-grid">
                <div class="stat-item total">
                    <div class="stat-number">${stats.total || 0}</div>
                    <div class="stat-label">Total</div>
                </div>
                
                <div class="stat-item found">
                    <div class="stat-number">${stats.found || 0}</div>
                    <div class="stat-label">Encontrados</div>
                </div>
                
                <div class="stat-item confidence">
                    <div class="stat-number">${stats.avgConfidence || 0}%</div>
                    <div class="stat-label">Confiança Média</div>
                </div>
                
                <div class="stat-item urgent">
                    <div class="stat-number">${stats.urgent || 0}</div>
                    <div class="stat-label">Urgentes</div>
                </div>
                
                <div class="stat-item high-risk">
                    <div class="stat-number">${stats.highRisk || 0}</div>
                    <div class="stat-label">Alto Risco</div>
                </div>
                
                <div class="stat-item adult">
                    <div class="stat-number">${stats.adult || 0}</div>
                    <div class="stat-label">Adulto</div>
                </div>
            </div>
            
            <div class="categories-breakdown">
                <h4>Por Categoria:</h4>
                <div class="categories-grid">
                    ${this.renderCategoriesBreakdown(stats.categories || {})}
                </div>
            </div>
        `;

        this.uiManager.elements.statsContainer.innerHTML = statsHtml;
        this.uiManager.animateElement(this.uiManager.elements.statsContainer, 'slideInDown');
    }

    /**
     * Renderizar breakdown por categorias
     */
    renderCategoriesBreakdown(categories) {
        return Object.entries(categories)
            .sort(([,a], [,b]) => b - a)
            .map(([category, count]) => `
                <div class="category-item" data-category="${category}">
                    <span class="category-label">${this.getCategoryLabel(category)}</span>
                    <span class="category-count">${count}</span>
                </div>
            `).join('');
    }

    /**
     * Aplicar filtros aos resultados
     */
    applyFilters(results) {
        return results.filter(result => {
            // Filtro por categoria
            if (this.filters.category !== 'all' && result.category !== this.filters.category) {
                return false;
            }

            // Filtro por status
            if (this.filters.status === 'found' && (!result.found && result.status !== 'found')) {
                return false;
            }
            if (this.filters.status === 'not-found' && (result.found || result.status === 'found')) {
                return false;
            }

            // Filtro por confiança
            if (this.filters.confidence > 0 && (result.confidence || 0) < this.filters.confidence) {
                return false;
            }

            return true;
        });
    }

    /**
     * Ordenar resultados
     */
    sortResults(results) {
        return [...results].sort((a, b) => {
            // Prioridade 1: Encontrados primeiro
            const aFound = a.found || a.status === 'found';
            const bFound = b.found || b.status === 'found';
            
            if (aFound !== bFound) {
                return bFound ? 1 : -1;
            }

            // Prioridade 2: Urgentes primeiro
            if (a.priority !== b.priority) {
                if (a.priority === 'urgent') return -1;
                if (b.priority === 'urgent') return 1;
            }

            // Prioridade 3: Maior confiança primeiro
            const aConf = a.confidence || 0;
            const bConf = b.confidence || 0;
            
            if (aConf !== bConf) {
                return bConf - aConf;
            }

            // Prioridade 4: Alfabético por plataforma
            return a.platform.localeCompare(b.platform);
        });
    }

    /**
     * Calcular estatísticas dos resultados
     */
    calculateStats(results) {
        if (!results.length) {
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
            const isFound = result.found || result.status === 'found';
            
            if (isFound) {
                stats.found++;
                if (result.confidence) {
                    stats.confidenceSum += result.confidence;
                }
            }

            if (result.priority === 'urgent') stats.urgent++;
            if (result.riskLevel === 'high') stats.highRisk++;
            if (result.category === 'adult' || result.category === 'cam') stats.adult++;

            // Contar por categoria
            const category = result.category || 'other';
            stats.categories[category] = (stats.categories[category] || 0) + 1;
        });

        // Calcular média de confiança
        if (stats.found > 0) {
            stats.avgConfidence = Math.round(stats.confidenceSum / stats.found);
        }

        return stats;
    }

    /**
     * Limpar resultados
     */
    async clearResults() {
        try {
            // Limpar no background também
            await this.sendMessage({ action: 'clearResults' });
            
            this.currentResults = [];
            this.currentStats = {};
            this.clearResultsDisplay();
            
            this.uiManager.setStatus('🗑️ Resultados limpos', 'info');
            this.uiManager.showNotification('Resultados removidos', 'info');
            
        } catch (error) {
            console.error('❌ Erro ao limpar resultados:', error);
            this.uiManager.showError('Erro ao limpar resultados');
        }
    }

    /**
     * Limpar display dos resultados
     */
    clearResultsDisplay() {
        this.uiManager.clearResults();
    }

    /**
     * Exportar resultados
     */
    async exportResults() {
        try {
            if (!this.currentResults.length) {
                this.uiManager.showError('Nenhum resultado para exportar');
                return;
            }

            const timestamp = new Date().toLocaleString('pt-BR');
            const username = this.uiManager.getUsername() || 'unknown';
            
            // Gerar relatório detalhado
            const report = this.generateDetailedReport(username, timestamp);
            
            // Criar e baixar arquivo
            const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `deepalias_report_${username}_${new Date().toISOString().slice(0, 10)}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            this.uiManager.setStatus('📄 Relatório exportado com sucesso!', 'success');
            this.uiManager.showNotification('Relatório exportado', 'success');

        } catch (error) {
            console.error('❌ Erro ao exportar:', error);
            this.uiManager.showError('Erro ao exportar resultados');
        }
    }

    /**
     * Gerar relatório detalhado
     */
    generateDetailedReport(username, timestamp) {
        const stats = this.currentStats;
        const foundResults = this.currentResults.filter(r => r.found || r.status === 'found');
        
        let report = `=== DEEPALIAS HUNTER PRO v3.0 - RELATÓRIO EXPANDIDO ===\n`;
        report += `Data/Hora: ${timestamp}\n`;
        report += `Usuário Pesquisado: ${username}\n`;
        report += `\n=== ESTATÍSTICAS GERAIS ===\n`;
        report += `Total de Verificações: ${stats.total}\n`;
        report += `Perfis Encontrados: ${stats.found}\n`;
        report += `Taxa de Sucesso: ${stats.total > 0 ? Math.round((stats.found / stats.total) * 100) : 0}%\n`;
        report += `Confiança Média: ${stats.avgConfidence}%\n`;
        report += `Resultados Urgentes: ${stats.urgent}\n`;
        report += `Alto Risco: ${stats.highRisk}\n`;
        report += `Conteúdo Adulto: ${stats.adult}\n`;

        // Breakdown por categoria
        report += `\n=== BREAKDOWN POR CATEGORIA ===\n`;
        Object.entries(stats.categories || {})
            .sort(([,a], [,b]) => b - a)
            .forEach(([category, count]) => {
                report += `${this.getCategoryLabel(category)}: ${count}\n`;
            });

        // Resultados encontrados
        if (foundResults.length > 0) {
            report += `\n=== PERFIS ENCONTRADOS (${foundResults.length}) ===\n`;
            foundResults.forEach((result, index) => {
                report += `\n${index + 1}. ${result.platform}\n`;
                report += `   URL: ${result.url}\n`;
                report += `   Categoria: ${this.getCategoryLabel(result.category)}\n`;
                report += `   Confiança: ${result.confidence || 0}%\n`;
                report += `   Variação: ${result.variation}\n`;
                
                if (result.priority === 'urgent') report += `   ⚠️ URGENTE\n`;
                if (result.riskLevel === 'high') report += `   🚨 ALTO RISCO\n`;
                if (result.category === 'adult') report += `   🔞 CONTEÚDO ADULTO\n`;
                
                if (result.relatedKeywords && result.relatedKeywords.length > 0) {
                    report += `   Palavras-chave: ${result.relatedKeywords.join(', ')}\n`;
                }
            });
        }

        // Resultados não encontrados (resumo)
        const notFoundResults = this.currentResults.filter(r => !r.found && r.status !== 'found');
        if (notFoundResults.length > 0) {
            report += `\n=== PLATAFORMAS VERIFICADAS SEM PERFIL (${notFoundResults.length}) ===\n`;
            notFoundResults.forEach(result => {
                report += `• ${result.platform} (${this.getCategoryLabel(result.category)})\n`;
            });
        }

        report += `\n=== DISCLAIMER ===\n`;
        report += `Este relatório foi gerado pela extensão DeepAlias Hunter Pro v3.0.\n`;
        report += `Os resultados são baseados em verificações automatizadas e devem ser validados manualmente.\n`;
        report += `Use esta ferramenta de forma responsável e ética.\n`;

        return report;
    }

    /**
     * Carregar resultados anteriores
     */
    async loadPreviousResults() {
        try {
            const response = await this.sendMessage({ action: 'getResults' });
            
            if (response && response.results && response.results.length > 0) {
                this.setResults(response.results, response.stats);
                console.log(`📊 Carregados ${response.results.length} resultados anteriores`);
            }
        } catch (error) {
            console.log('ℹ️ Nenhum resultado anterior encontrado:', error.message);
        }
    }

    /**
     * Definir filtros
     */
    setFilters(filters) {
        this.filters = { ...this.filters, ...filters };
        this.updateResultsDisplay();
    }

    /**
     * Utilitários
     */
    getCategoryLabel(category) {
        const labels = {
            'social': '📱 Social',
            'adult': '🔞 Adulto',
            'cam': '📹 Cam',
            'portfolio': '🎨 Portfolio',
            'casting': '🎭 Casting',
            'forum': '💬 Fórum',
            'archive': '📚 Arquivo',
            'linkinbio': '🔗 Link Bio',
            'images': '🖼️ Imagens',
            'dev': '👨‍💻 Dev',
            'other': '📌 Outros'
        };
        return labels[category] || '📌 Outros';
    }

    truncateUrl(url, maxLength = 60) {
        return url.length > maxLength ? url.substring(0, maxLength) + '...' : url;
    }

    formatTimestamp(timestamp) {
        try {
            return new Date(timestamp).toLocaleString('pt-BR');
        } catch {
            return timestamp;
        }
    }

    /**
     * Enviar mensagem para background
     */
    async sendMessage(message) {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage(message, (response) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                } else {
                    resolve(response);
                }
            });
        });
    }
}
