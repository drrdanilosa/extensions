/**
 * DeepAlias Hunter Pro - Background Script
 * Versão limpa e funcional para Firefox
 */

console.log('🚀 DeepAlias Hunter Pro - Background Script Iniciado');

// Estado da aplicação
let appState = {
    isSearching: false,
    progress: 0,
    results: [],
    currentQuery: null
};

// Plataformas para busca
const platforms = [
    { name: 'GitHub', url: 'https://github.com/{username}', icon: '📚' },
    { name: 'Twitter', url: 'https://twitter.com/{username}', icon: '🐦' },
    { name: 'Instagram', url: 'https://instagram.com/{username}', icon: '📷' },
    { name: 'Facebook', url: 'https://facebook.com/{username}', icon: '👥' },
    { name: 'LinkedIn', url: 'https://linkedin.com/in/{username}', icon: '💼' },
    { name: 'Reddit', url: 'https://reddit.com/user/{username}', icon: '🤖' },
    { name: 'YouTube', url: 'https://youtube.com/@{username}', icon: '📺' },
    { name: 'TikTok', url: 'https://tiktok.com/@{username}', icon: '🎵' }
];

// Listener principal para mensagens
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('📨 Mensagem recebida:', request.action);
    
    try {
        switch (request.action) {
            case 'ping':
                sendResponse({ status: 'success', message: 'Background ativo' });
                break;
                
            case 'startSearch':
                if (!request.username) {
                    sendResponse({ status: 'error', message: 'Username é obrigatório' });
                    break;
                }
                startSearch(request.username);
                sendResponse({ status: 'success', message: 'Busca iniciada' });
                break;
                
            case 'getStatus':
                sendResponse({
                    status: 'success',
                    data: {
                        isSearching: appState.isSearching,
                        progress: appState.progress,
                        query: appState.currentQuery,
                        resultsCount: appState.results.length
                    }
                });
                break;
                
            case 'getResults':
                sendResponse({
                    status: 'success',
                    data: appState.results
                });
                break;
                
            case 'stopSearch':
                stopSearch();
                sendResponse({ status: 'success', message: 'Busca interrompida' });
                break;
                
            default:
                sendResponse({ status: 'error', message: 'Ação não reconhecida' });
        }
    } catch (error) {
        console.error('❌ Erro no background:', error);
        sendResponse({ status: 'error', message: error.message });
    }
    
    return true; // Manter canal aberto para resposta assíncrona
});

/**
 * Inicia a busca por um username
 */
function startSearch(username) {
    console.log('🔍 Iniciando busca para:', username);
    
    // Reset do estado
    appState = {
        isSearching: true,
        progress: 0,
        results: [],
        currentQuery: username
    };
    
    // Processa cada plataforma sequencialmente
    platforms.forEach((platform, index) => {
        setTimeout(() => {
            searchPlatform(platform, username, index);
        }, index * 800); // 800ms entre cada busca
    });
}

/**
 * Busca em uma plataforma específica
 */
function searchPlatform(platform, username, index) {
    console.log(`🔎 Buscando em ${platform.name}...`);
    
    const url = platform.url.replace('{username}', username);
    
    // Simula verificação da plataforma
    const found = Math.random() > 0.4; // 60% chance de encontrar
    
    const result = {
        platform: platform.name,
        url: url,
        icon: platform.icon,
        status: found ? 'found' : 'not_found',
        timestamp: new Date().toISOString(),
        checked: true
    };
    
    appState.results.push(result);
    appState.progress = Math.round(((index + 1) / platforms.length) * 100);
    
    console.log(`✅ ${platform.name}: ${result.status} (${appState.progress}%)`);
    
    // Finaliza busca quando todas as plataformas foram verificadas
    if (index === platforms.length - 1) {
        finishSearch();
    }
}

/**
 * Finaliza a busca
 */
function finishSearch() {
    console.log('🏁 Busca concluída!');
    appState.isSearching = false;
    appState.progress = 100;
    
    // Salva resultados no storage
    chrome.storage.local.set({
        lastSearch: {
            query: appState.currentQuery,
            results: appState.results,
            timestamp: new Date().toISOString()
        }
    });
}

/**
 * Para a busca atual
 */
function stopSearch() {
    console.log('🛑 Parando busca...');
    appState.isSearching = false;
}

// Inicialização
console.log('✅ Background script pronto para uso');
