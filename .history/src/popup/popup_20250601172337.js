/**
 * DeepAlias Hunter Pro - UI Controller
 * @version 3.0.0
 */

import { SearchController } from './controllers/searchController.js';
import { ResultsController } from './controllers/resultsController.js';
import { SettingsController } from './controllers/settingsController.js';
import { UIManager } from './managers/uiManager.js';

class DeepAliasHunterApp {
    constructor() {
        this.version = '3.0.0';
        this.isSearching = false;
        
        this.initializeApp();
    }

    /**
     * Inicializar aplicação
     */    async initializeApp() {
        console.log(`🚀 DeepAlias Hunter Pro v${this.version} - Popup Inicializado`);
        
        try {
            // Inicializar gerenciadores
            this.uiManager = new UIManager();
            
            // Inicializar controladores
            this.searchController = new SearchController(this.uiManager);
            this.resultsController = new ResultsController(this.uiManager);
            this.settingsController = new SettingsController(this.uiManager);
            
            // Configurar eventos
            this.setupEventListeners();
            
            // Verificar conexão com background
            await this.checkConnection();
            
            // Carregar configurações
            await this.settingsController.loadSettings();
            
            // Carregar resultados anteriores se existirem
            await this.resultsController.loadPreviousResults();
        } catch (error) {
            console.error('❌ Erro na inicialização:', error);
            
            // Tentar inicialização básica se houver erro
            try {
                this.uiManager = new UIManager();
                this.uiManager.showError('Erro na inicialização. Tentando modo básico...');
            } catch (fallbackError) {
                console.error('❌ Erro crítico:', fallbackError);
            }
        }
    }

    /**
     * Configurar event listeners
     */
    setupEventListeners() {
        // Botões principais
        this.uiManager.on('search', () => this.searchController.startSearch());
        this.uiManager.on('stop', () => this.searchController.stopSearch());
        this.uiManager.on('clear', () => this.resultsController.clearResults());
        this.uiManager.on('export', () => this.resultsController.exportResults());
        this.uiManager.on('settings', () => this.settingsController.toggleSettings());
        
        // Enter no input
        this.uiManager.onEnterKey(() => {
            if (!this.isSearching) {
                this.searchController.startSearch();
            }
        });
        
        // Eventos de busca
        this.searchController.on('searchStart', () => {
            this.isSearching = true;
            this.uiManager.setSearchingState(true);
        });
        
        this.searchController.on('searchEnd', () => {
            this.isSearching = false;
            this.uiManager.setSearchingState(false);
        });
        
        this.searchController.on('progress', (progress) => {
            this.uiManager.updateProgress(progress);
        });
        
        this.searchController.on('result', (result) => {
            this.resultsController.addResult(result);
        });
    }

    /**
     * Verificar conexão com background script
     */
    async checkConnection() {
        try {
            const response = await this.sendMessage({ action: 'ping' });
            
            if (response && response.status === 'success') {
                this.uiManager.setConnectionStatus(true, response.version || this.version);
                this.uiManager.setStatus('Pronto para busca profunda', 'ready');
            } else {
                this.uiManager.setConnectionStatus(false);
                this.uiManager.setStatus('Erro de conexão', 'error');
            }
        } catch (error) {
            console.error('❌ Erro de conexão:', error);
            this.uiManager.setConnectionStatus(false);
            this.uiManager.showError('Erro de conexão com background script');
        }
    }

    /**
     * Enviar mensagem para background script
     */
    sendMessage(message) {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage(message, (response) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve(response);
                }
            });
        });
    }
}

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new DeepAliasHunterApp();
});
