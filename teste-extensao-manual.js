/**
 * Teste Manual da Extensão DeepAlias Hunter Pro v2.0
 * 
 * Este script testa as funcionalidades principais da extensão
 * simulando a interação do usuário.
 */

console.log('🚀 DeepAlias Hunter Pro v2.0 - Teste Manual');
console.log('===============================================');

// Simula o ambiente da extensão
if (typeof chrome === 'undefined') {
    console.log('⚠️ Ambiente de teste - simulando Chrome APIs');
    
    // Mock das APIs do Chrome
    global.chrome = {
        runtime: {
            onMessage: {
                addListener: function(callback) {
                    console.log('🎧 Listener de mensagens registrado');
                    // Simula mensagens de teste
                    setTimeout(() => {
                        console.log('📨 Testando mensagem ping...');
                        const response = {};
                        callback({ action: 'ping' }, {}, (res) => {
                            Object.assign(response, res);
                            console.log('✅ Resposta ping:', res);
                        });
                    }, 100);
                    
                    setTimeout(() => {
                        console.log('📨 Testando busca...');
                        const response = {};
                        callback({ action: 'startSearch', username: 'teste_usuario' }, {}, (res) => {
                            Object.assign(response, res);
                            console.log('✅ Resposta startSearch:', res);
                        });
                    }, 200);
                }
            }
        },
        storage: {
            local: {
                set: function(data) {
                    console.log('💾 Dados salvos no storage:', Object.keys(data));
                },
                get: function(key, callback) {
                    console.log('📖 Lendo storage:', key);
                    callback({});
                }
            }
        }
    };
}

// Carrega o background script
console.log('📂 Carregando background script...');
try {
    require('./background.js');
    console.log('✅ Background script carregado com sucesso');
} catch (error) {
    console.error('❌ Erro ao carregar background:', error.message);
    process.exit(1);
}

// Testa funcionalidades específicas
setTimeout(() => {
    console.log('\n🔧 Testando funcionalidades específicas...');
    
    // Teste 1: Geração de variações
    if (typeof generateUsernameVariations === 'function') {
        const testUser = 'exemplo';
        const variations = generateUsernameVariations(testUser);
        console.log(`✅ Variações geradas para "${testUser}": ${variations.length} variações`);
        console.log(`   Primeiras 5: ${variations.slice(0, 5).join(', ')}`);
    } else {
        console.log('⚠️ Função generateUsernameVariations não disponível');
    }
    
    // Teste 2: Verificação de plataformas
    if (typeof platforms !== 'undefined') {
        console.log(`✅ Plataformas carregadas: ${platforms.length} plataformas`);
        const categorias = [...new Set(platforms.map(p => p.category))];
        console.log(`   Categorias: ${categorias.join(', ')}`);
    } else {
        console.log('⚠️ Lista de plataformas não disponível');
    }
    
    // Teste 3: Estado da aplicação
    if (typeof appState !== 'undefined') {
        console.log('✅ Estado da aplicação inicializado:', {
            isSearching: appState.isSearching,
            progress: appState.progress,
            resultsCount: appState.results.length
        });
    } else {
        console.log('⚠️ Estado da aplicação não disponível');
    }
    
    console.log('\n🎯 Teste manual concluído!');
    console.log('📋 Próximos passos:');
    console.log('   1. Carregar extensão no Firefox');
    console.log('   2. Testar interface popup');
    console.log('   3. Realizar busca real');
    console.log('   4. Verificar resultados e export');
    
}, 1000);
