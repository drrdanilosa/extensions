/**
 * DeepAlias Hunter Pro - Background Script
 * Versão 3.0 - Arquitetura melhorada
 */

import { PlatformService } from './services/platformService.js';
import { SearchEngine } from './services/searchEngine.js';
import { StorageService } from './services/storageService.js';
import { MessageHandler } from './handlers/messageHandler.js';

console.log('🚀 DeepAlias Hunter Pro v3.0 - Background Script Iniciado');

// Estado da aplicação
let appState = {
    isSearching: false,
    progress: 0,
    results: [],
    currentQuery: null,
    version: '3.0.0'
};

// Inicialização dos serviços
const platformService = new PlatformService();
const searchEngine = new SearchEngine();
const storageService = new StorageService();
const messageHandler = new MessageHandler(appState, { platformService, searchEngine, storageService });

// Configurar listeners
chrome.runtime.onMessage.addListener(messageHandler.handleMessage.bind(messageHandler));

// Inicialização
console.log('✅ Background script v3.0 pronto para uso');
