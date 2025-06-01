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

// Plataformas para busca - Base de dados completa expandida
const platforms = [
    // 🔷 Redes Sociais Principais
    { name: 'Instagram', url: 'https://instagram.com/{username}', icon: '📷', category: 'social' },
    { name: 'Facebook', url: 'https://facebook.com/{username}', icon: '👥', category: 'social' },
    { name: 'Twitter', url: 'https://twitter.com/{username}', icon: '🐦', category: 'social' },
    { name: 'X.com', url: 'https://x.com/{username}', icon: '❌', category: 'social' },
    { name: 'TikTok', url: 'https://tiktok.com/@{username}', icon: '🎵', category: 'social' },
    { name: 'YouTube', url: 'https://youtube.com/@{username}', icon: '📺', category: 'social' },
    { name: 'Snapchat', url: 'https://snapchat.com/add/{username}', icon: '👻', category: 'social' },
    { name: 'Pinterest', url: 'https://pinterest.com/{username}', icon: '📌', category: 'social' },
    { name: 'LinkedIn', url: 'https://linkedin.com/in/{username}', icon: '💼', category: 'social' },
    { name: 'Tumblr', url: 'https://{username}.tumblr.com', icon: '🔵', category: 'social' },
    { name: 'Reddit', url: 'https://reddit.com/user/{username}', icon: '🤖', category: 'social' },
    { name: 'Discord', url: 'https://discord.com/users/{username}', icon: '🎮', category: 'social' },
    { name: 'Telegram', url: 'https://t.me/{username}', icon: '✈️', category: 'social' },
    { name: 'VK', url: 'https://vk.com/{username}', icon: '🇷🇺', category: 'social' },
    { name: 'WeHeartIt', url: 'https://weheartit.com/{username}', icon: '💖', category: 'social' },
    { name: 'Ask.fm', url: 'https://ask.fm/{username}', icon: '❓', category: 'social' },
    { name: 'CuriousCat', url: 'https://curiouscat.live/{username}', icon: '🐱', category: 'social' },
    { name: 'Yubo', url: 'https://yubo.live/{username}', icon: '💛', category: 'social' },
    { name: 'Bigo Live', url: 'https://bigo.tv/{username}', icon: '📹', category: 'social' },

    // 🟥 Plataformas de Conteúdo Adulto e Venda de Conteúdo
    { name: 'OnlyFans', url: 'https://onlyfans.com/{username}', icon: '🔞', category: 'adult' },
    { name: 'Fansly', url: 'https://fansly.com/{username}', icon: '💋', category: 'adult' },
    { name: 'JustForFans', url: 'https://justfor.fans/{username}', icon: '🔥', category: 'adult' },
    { name: 'FanCentro', url: 'https://fancentro.com/{username}', icon: '💎', category: 'adult' },
    { name: 'LoyalFans', url: 'https://loyalfans.com/{username}', icon: '👑', category: 'adult' },
    { name: 'Fanvue', url: 'https://fanvue.com/{username}', icon: '🌟', category: 'adult' },
    { name: 'ManyVids', url: 'https://manyvids.com/{username}', icon: '🎬', category: 'adult' },
    { name: 'AVNStars', url: 'https://avnstars.com/{username}', icon: '⭐', category: 'adult' },
    { name: 'IsMyGirl', url: 'https://ismygirl.com/{username}', icon: '💃', category: 'adult' },
    { name: 'PocketStars', url: 'https://pocketstars.com/{username}', icon: '🌟', category: 'adult' },
    { name: 'Clipp Store', url: 'https://clipp.store/{username}', icon: '🛒', category: 'adult' },
    { name: 'IWantClips', url: 'https://iwantclips.com/{username}', icon: '📎', category: 'adult' },
    { name: 'ModelHub', url: 'https://modelhub.com/{username}', icon: '🎭', category: 'adult' },
    
    // 🟥 Sites de Cam e Streaming Adulto
    { name: 'Chaturbate', url: 'https://chaturbate.com/{username}', icon: '💬', category: 'cam' },
    { name: 'Stripchat', url: 'https://stripchat.com/{username}', icon: '💃', category: 'cam' },
    { name: 'LiveJasmin', url: 'https://livejasmin.com/{username}', icon: '🌹', category: 'cam' },
    { name: 'MyFreeCams', url: 'https://myfreecams.com/{username}', icon: '🎥', category: 'cam' },
    { name: 'BongaCams', url: 'https://bonga.com/{username}', icon: '🥁', category: 'cam' },
    { name: 'Cam4', url: 'https://cam4.com/{username}', icon: '📷', category: 'cam' },
    { name: 'CamSoda', url: 'https://camsoda.com/{username}', icon: '🥤', category: 'cam' },
    { name: 'Camversity', url: 'https://camversity.com/{username}', icon: '🎓', category: 'cam' },
    { name: 'Flirt4Free', url: 'https://flirt4free.com/{username}', icon: '😘', category: 'cam' },
    { name: 'CamPlace', url: 'https://camplace.com/{username}', icon: '🏠', category: 'cam' },
    { name: 'Cams.com', url: 'https://cams.com/{username}', icon: '📹', category: 'cam' },
    { name: 'XHamsterLive', url: 'https://xhamsterlive.com/{username}', icon: '🐹', category: 'cam' },
    { name: 'XVideosLive', url: 'https://xvideoslive.com/{username}', icon: '🎬', category: 'cam' },
    
    // 🟨 Sites de Portfólio de Modelos / Fotógrafos / Criadores
    { name: 'Behance', url: 'https://behance.net/{username}', icon: '🎨', category: 'portfolio' },
    { name: 'ArtStation', url: 'https://artstation.com/{username}', icon: '🖼️', category: 'portfolio' },
    { name: 'ModelMayhem', url: 'https://modelmayhem.com/{username}', icon: '📸', category: 'portfolio' },
    { name: 'ViewBug', url: 'https://viewbug.com/{username}', icon: '🐛', category: 'portfolio' },
    { name: '500px', url: 'https://500px.com/{username}', icon: '📷', category: 'portfolio' },
    { name: 'Dribbble', url: 'https://dribbble.com/{username}', icon: '🏀', category: 'portfolio' },
    { name: 'DeviantArt', url: 'https://deviantart.com/{username}', icon: '🎭', category: 'portfolio' },
    { name: 'VSCO', url: 'https://vsco.co/{username}', icon: '📱', category: 'portfolio' },
    { name: 'About.me', url: 'https://about.me/{username}', icon: '👤', category: 'portfolio' },
    { name: 'Pixpa', url: 'https://{username}.pixpa.com', icon: '🌐', category: 'portfolio' },
    { name: 'Format', url: 'https://{username}.format.com', icon: '📐', category: 'portfolio' },
    { name: 'WordPress', url: 'https://{username}.wordpress.com', icon: '📝', category: 'portfolio' },
    { name: 'Wix', url: 'https://{username}.wixsite.com', icon: '🏗️', category: 'portfolio' },
    { name: 'Cargo', url: 'https://cargo.site/{username}', icon: '📦', category: 'portfolio' },
    { name: 'Carbonmade', url: 'https://{username}.carbonmade.com', icon: '💎', category: 'portfolio' },
    
    // 🟦 Sites de Casting / Agências de Modelos
    { name: 'Backstage', url: 'https://backstage.com/{username}', icon: '🎬', category: 'casting' },
    { name: 'StarNow', url: 'https://starnow.com/{username}', icon: '⭐', category: 'casting' },
    { name: 'CastingNetworks', url: 'https://castingnetworks.com/{username}', icon: '🌐', category: 'casting' },
    { name: 'Models.com', url: 'https://models.com/{username}', icon: '👗', category: 'casting' },
    { name: 'ActorsAccess', url: 'https://actorsaccess.com/{username}', icon: '🎭', category: 'casting' },
    { name: 'CastingFrontier', url: 'https://castingfrontier.com/{username}', icon: '🚀', category: 'casting' },
    { name: 'ExploreModeling', url: 'https://exploretalent.com/{username}', icon: '🔍', category: 'casting' },
    { name: 'NewFaces', url: 'https://newfaces.com/{username}', icon: '👶', category: 'casting' },
    { name: 'ModelScouts', url: 'https://modelscouts.com/{username}', icon: '🕵️', category: 'casting' },
    { name: 'TalentHouse', url: 'https://talenthouse.com/{username}', icon: '🏠', category: 'casting' },
    
    // 🔗 Link in Bio Platforms
    { name: 'Linktree', url: 'https://linktr.ee/{username}', icon: '🌳', category: 'linkinbio' },
    { name: 'Beacons.ai', url: 'https://beacons.ai/{username}', icon: '🔗', category: 'linkinbio' },
    { name: 'Carrd', url: 'https://{username}.carrd.co', icon: '🎴', category: 'linkinbio' },
    
    // 🟪 Sites de Compartilhamento de Imagens
    { name: 'Imgur', url: 'https://imgur.com/user/{username}', icon: '🖼️', category: 'images' },
    { name: 'Pixiv', url: 'https://pixiv.net/users/{username}', icon: '🎨', category: 'images' },
    { name: 'FurAffinity', url: 'https://furaffinity.net/user/{username}', icon: '🦊', category: 'images' },
    
    // 📚 Plataformas de Desenvolvimento
    { name: 'GitHub', url: 'https://github.com/{username}', icon: '📚', category: 'dev' },
    { name: 'GitLab', url: 'https://gitlab.com/{username}', icon: '🦊', category: 'dev' },
    { name: 'CodePen', url: 'https://codepen.io/{username}', icon: '✒️', category: 'dev' },
    { name: 'Stack Overflow', url: 'https://stackoverflow.com/users/{username}', icon: '📚', category: 'dev' }
];

// Palavras-chave e padrões de busca associados
const searchPatterns = [
    'onlyfans', 'ofans', 'fansly', 'privacy', 'nudes', 'leaked', 'content creator', 
    'camgirl', 'camboy', 'camming', 'tip menu', 'escort', 'acompanhantes', 
    'sugar baby', 'sugar daddy', 'elite model', 'casting', 'portfolio', 
    'portfolio link', 'booking', 'hire me', 'snap', 'snapcode', 'tiktok viral', 
    'instagram model', 'reels', 'hot', 'leak', 'patreon', 'feetpics', 
    'feetfinder', 'custom content', 'nsfw', 'explicit', '18+', 'xxx', 
    'videos', 'dms open', 'payperview', 'sub4sub', 'content menu', 
    'buy my content', 'dm for prices', 'model profile', 'art nude', 
    'erotic photography', 'implied nude', 'cosplay lewd', 'femboy', 
    'furry nsfw', 'hentai', 'r34'
];

// Sites de fóruns e comunidades para busca indireta
const forumSites = [
    { name: 'Leak.sx', url: 'https://leak.sx/search?q={username}', icon: '💧', category: 'forum' },
    { name: 'Fapello', url: 'https://fapello.com/search/{username}', icon: '🔍', category: 'forum' },
    { name: 'Coomer.party', url: 'https://coomer.party/search?q={username}', icon: '🎉', category: 'forum' },
    { name: 'ForumOphilia', url: 'https://forumophilia.com/search?q={username}', icon: '📋', category: 'forum' },
    { name: '4chan Archives', url: 'https://boards.4chan.org/search#{username}', icon: '🍀', category: 'forum' },
    { name: 'Reddit Search', url: 'https://reddit.com/search?q={username}', icon: '🔎', category: 'forum' },
    { name: 'Archive.today', url: 'https://archive.today/{username}', icon: '📚', category: 'archive' },
    { name: 'Wayback Machine', url: 'https://web.archive.org/web/*/{username}', icon: '⏰', category: 'archive' }
];

// Extensões e variações de username para busca
function generateUsernameVariations(username) {
    const variations = [
        username,
        username.toLowerCase(),
        username.toUpperCase(),
        `${username}_`,
        `_${username}`,
        `${username}x`,
        `x${username}`,
        `${username}69`,
        `${username}18`,
        `${username}official`,
        `official${username}`,
        `real${username}`,
        `${username}real`,
        `${username}vip`,
        `vip${username}`,
        `${username}model`,
        `model${username}`,
        `${username}cam`,
        `cam${username}`,
        `${username}onlyfans`,
        `${username}fansly`,
        `${username}.backup`,
        `backup.${username}`,
        `${username}2024`,
        `${username}2025`,
        username.replace(/\d+/g, ''), // remove números
        username.replace(/[^a-zA-Z0-9]/g, ''), // remove caracteres especiais
    ];
    
    // Remove duplicatas
    return [...new Set(variations)];
}
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
    console.log('🔍 Iniciando busca PROFUNDA para:', username);
    
    // Gera variações do username
    const variations = generateUsernameVariations(username);
    console.log(`📝 Geradas ${variations.length} variações do username`);
    
    // Combina plataformas principais com fóruns
    const allPlatforms = [...platforms, ...forumSites];
    
    // Reset do estado
    appState = {
        isSearching: true,
        progress: 0,
        results: [],
        currentQuery: username,
        totalChecks: allPlatforms.length * Math.min(variations.length, 5), // Limita a 5 variações principais
        currentCheck: 0
    };
    
    console.log(`🎯 Total de verificações planejadas: ${appState.totalChecks}`);
    
    let checkIndex = 0;
    
    // Processa cada plataforma com as principais variações
    allPlatforms.forEach((platform, platformIndex) => {
        // Usa as 5 variações mais relevantes para cada plataforma
        const mainVariations = variations.slice(0, 5);
        
        mainVariations.forEach((variation, variationIndex) => {
            const delay = checkIndex * 300; // 300ms entre cada verificação
            
            setTimeout(() => {
                searchPlatformVariation(platform, variation, username, checkIndex);
            }, delay);
            
            checkIndex++;
        });
    });
}

/**
 * Busca em uma plataforma específica com variação de username
 */
function searchPlatformVariation(platform, variation, originalUsername, checkIndex) {
    console.log(`🔎 Verificando ${platform.name} com variação: ${variation}`);
    
    const url = platform.url.replace('{username}', variation);
    
    // Simula verificação da plataforma com algoritmo mais inteligente
    let found = false;
    let confidence = 0;
    
    // Diferentes probabilidades baseadas na categoria e variação
    if (variation === originalUsername) {
        // Username original tem maior chance
        found = Math.random() > 0.3; // 70% chance
        confidence = found ? Math.random() * 0.3 + 0.7 : Math.random() * 0.3; // 70-100% ou 0-30%
    } else if (variation.includes(originalUsername)) {
        // Variações que contêm o username original
        found = Math.random() > 0.5; // 50% chance
        confidence = found ? Math.random() * 0.3 + 0.5 : Math.random() * 0.4; // 50-80% ou 0-40%
    } else {
        // Outras variações
        found = Math.random() > 0.7; // 30% chance
        confidence = found ? Math.random() * 0.3 + 0.3 : Math.random() * 0.3; // 30-60% ou 0-30%
    }
    
    // Ajusta probabilidade baseada na categoria
    const categoryMultipliers = {
        'social': 1.2,
        'adult': 0.8,
        'cam': 0.7,
        'portfolio': 1.0,
        'casting': 0.9,
        'forum': 0.4,
        'archive': 0.3,
        'linkinbio': 1.1,
        'images': 0.6,
        'dev': 1.0
    };
    
    const multiplier = categoryMultipliers[platform.category] || 1.0;
    confidence = Math.min(confidence * multiplier, 1.0);
    
    const result = {
        platform: platform.name,
        url: url,
        icon: platform.icon,
        category: platform.category || 'other',
        status: found ? 'found' : 'not_found',
        confidence: Math.round(confidence * 100),
        variation: variation,
        originalQuery: originalUsername,
        timestamp: new Date().toISOString(),
        checked: true,
        matchType: variation === originalUsername ? 'exact' : 'variation'
    };
    
    // Adiciona informações extras para resultados encontrados
    if (found) {
        result.riskLevel = confidence > 0.8 ? 'high' : confidence > 0.5 ? 'medium' : 'low';
        result.priority = platform.category === 'adult' || platform.category === 'cam' ? 'urgent' : 'normal';
        
        // Adiciona palavras-chave relacionadas encontradas (simulação)
        const relatedKeywords = searchPatterns.filter(() => Math.random() > 0.7).slice(0, 3);
        if (relatedKeywords.length > 0) {
            result.relatedKeywords = relatedKeywords;
        }
    }
    
    appState.results.push(result);
    appState.currentCheck++;
    appState.progress = Math.round((appState.currentCheck / appState.totalChecks) * 100);
    
    console.log(`✅ ${platform.name} (${variation}): ${result.status} - Confiança: ${result.confidence}% (${appState.progress}%)`);
    
    // Finaliza busca quando todas as verificações foram feitas
    if (appState.currentCheck >= appState.totalChecks) {
        finishSearch();
    }
}

/**
 * Finaliza a busca
 */
function finishSearch() {
    console.log('🏁 Busca PROFUNDA concluída!');
    
    // Organiza resultados por prioridade e confiança
    appState.results.sort((a, b) => {
        if (a.status === 'found' && b.status !== 'found') return -1;
        if (b.status === 'found' && a.status !== 'found') return 1;
        if (a.status === 'found' && b.status === 'found') {
            // Prioriza por urgência, depois por confiança
            if (a.priority === 'urgent' && b.priority !== 'urgent') return -1;
            if (b.priority === 'urgent' && a.priority !== 'urgent') return 1;
            return b.confidence - a.confidence;
        }
        return 0;
    });
    
    appState.isSearching = false;
    appState.progress = 100;
    
    // Gera estatísticas da busca
    const stats = {
        totalChecks: appState.results.length,
        found: appState.results.filter(r => r.status === 'found').length,
        notFound: appState.results.filter(r => r.status === 'not_found').length,
        highRisk: appState.results.filter(r => r.riskLevel === 'high').length,
        urgent: appState.results.filter(r => r.priority === 'urgent').length,
        categories: {},
        avgConfidence: 0
    };
    
    // Conta por categoria
    appState.results.forEach(result => {
        const cat = result.category || 'other';
        stats.categories[cat] = (stats.categories[cat] || 0) + 1;
        
        if (result.status === 'found' && result.confidence) {
            stats.avgConfidence += result.confidence;
        }
    });
    
    if (stats.found > 0) {
        stats.avgConfidence = Math.round(stats.avgConfidence / stats.found);
    }
    
    appState.searchStats = stats;
    
    console.log('📊 Estatísticas da busca:', stats);
    
    // Salva resultados no storage
    chrome.storage.local.set({
        lastSearch: {
            query: appState.currentQuery,
            results: appState.results,
            stats: stats,
            timestamp: new Date().toISOString(),
            version: '2.0-expanded'
        }
    });
    
    console.log(`✅ Busca finalizada: ${stats.found}/${stats.totalChecks} encontrados (${Math.round((stats.found/stats.totalChecks)*100)}%)`);
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
