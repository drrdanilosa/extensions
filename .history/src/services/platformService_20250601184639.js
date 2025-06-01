/**
 * Platform Service - Gerenciamento de plataformas de busca
 * @version 3.0.0
 */

export class PlatformService {
    constructor() {
        this.platforms = this._loadPlatforms();
        this.forumSites = this._loadForumSites();
        this.searchPatterns = this._loadSearchPatterns();
    }

    /**
     * Obter todas as plataformas
     */
    getAllPlatforms() {
        return [...this.platforms, ...this.forumSites];
    }

    /**
     * Obter plataformas por categoria
     */
    getPlatformsByCategory(category) {
        return this.platforms.filter(platform => platform.category === category);
    }

    /**
     * Obter padrões de busca
     */
    getSearchPatterns() {
        return this.searchPatterns;
    }    /**
     * Carregar plataformas principais
     */
    _loadPlatforms() {
        return [
            // 🔷 Redes Sociais Principais
            { name: 'Instagram', url: 'https://instagram.com/{username}', icon: '📷', category: 'social', priority: 'high' },
            { name: 'Facebook', url: 'https://facebook.com/{username}', icon: '👥', category: 'social', priority: 'high' },
            { name: 'Twitter', url: 'https://twitter.com/{username}', icon: '🐦', category: 'social', priority: 'high' },
            { name: 'X.com', url: 'https://x.com/{username}', icon: '❌', category: 'social', priority: 'high' },
            { name: 'TikTok', url: 'https://tiktok.com/@{username}', icon: '🎵', category: 'social', priority: 'high' },
            { name: 'YouTube', url: 'https://youtube.com/@{username}', icon: '📺', category: 'social', priority: 'high' },
            { name: 'Snapchat', url: 'https://snapchat.com/add/{username}', icon: '👻', category: 'social', priority: 'medium' },
            { name: 'Pinterest', url: 'https://pinterest.com/{username}', icon: '📌', category: 'social', priority: 'medium' },
            { name: 'LinkedIn', url: 'https://linkedin.com/in/{username}', icon: '💼', category: 'social', priority: 'medium' },
            { name: 'Tumblr', url: 'https://{username}.tumblr.com', icon: '🔵', category: 'social', priority: 'medium' },
            { name: 'Reddit', url: 'https://reddit.com/user/{username}', icon: '🤖', category: 'social', priority: 'medium' },
            { name: 'Discord', url: 'https://discord.com/users/{username}', icon: '🎮', category: 'social', priority: 'medium' },
            { name: 'Telegram', url: 'https://t.me/{username}', icon: '✈️', category: 'social', priority: 'medium' },
            { name: 'VK', url: 'https://vk.com/{username}', icon: '🇷🇺', category: 'social', priority: 'low' },
            { name: 'Clubhouse', url: 'https://clubhouse.com/@{username}', icon: '🎪', category: 'social', priority: 'low' },            { name: 'Mastodon', url: 'https://mastodon.social/@{username}', icon: '🐘', category: 'social', priority: 'low' },
            { name: 'Kwai', url: 'https://kwai.com/@{username}', icon: '📱', category: 'social', priority: 'low' },
            { name: 'GetTR', url: 'https://gettr.com/user/{username}', icon: '🔊', category: 'social', priority: 'low' },
            { name: 'Truth Social', url: 'https://truthsocial.com/@{username}', icon: '🗣️', category: 'social', priority: 'low' },
            
            // 🎵 Plataformas de Música e Audio
            { name: 'Spotify', url: 'https://open.spotify.com/user/{username}', icon: '🎵', category: 'music', priority: 'medium' },
            { name: 'SoundCloud', url: 'https://soundcloud.com/{username}', icon: '☁️', category: 'music', priority: 'medium' },
            { name: 'Bandcamp', url: 'https://{username}.bandcamp.com', icon: '🎸', category: 'music', priority: 'medium' },
            { name: 'Last.fm', url: 'https://last.fm/user/{username}', icon: '🎧', category: 'music', priority: 'low' },
            { name: 'Palco MP3', url: 'https://palcomp3.com/{username}', icon: '🎵', category: 'music', priority: 'low' },
            
            // 🎮 Plataformas Gaming
            { name: 'Twitch', url: 'https://twitch.tv/{username}', icon: '🎮', category: 'gaming', priority: 'medium' },
            { name: 'Steam', url: 'https://steamcommunity.com/id/{username}', icon: '🎯', category: 'gaming', priority: 'medium' },
            { name: 'Xbox Live', url: 'https://account.xbox.com/profile?gamertag={username}', icon: '🎮', category: 'gaming', priority: 'low' },
            { name: 'PlayStation', url: 'https://psnprofiles.com/{username}', icon: '🎮', category: 'gaming', priority: 'low' },
            { name: 'Gamersclub', url: 'https://gamersclub.com.br/player/{username}', icon: '🎮', category: 'gaming', priority: 'low' },
            
            // 🛒 Sites de E-commerce/Freelance
            { name: 'Fiverr', url: 'https://fiverr.com/{username}', icon: '💸', category: 'freelance', priority: 'medium' },
            { name: 'Upwork', url: 'https://upwork.com/freelancers/{username}', icon: '💼', category: 'freelance', priority: 'medium' },
            { name: 'Etsy', url: 'https://etsy.com/shop/{username}', icon: '🛍️', category: 'shop', priority: 'low' },
            { name: 'eBay', url: 'https://ebay.com/usr/{username}', icon: '🏪', category: 'shop', priority: 'low' },
            { name: 'Mercado Livre', url: 'https://mercadolivre.com.br/perfil/{username}', icon: '🛒', category: 'shop', priority: 'low' },
            
            // 💰 Sites de Investimento/Crypto
            { name: 'Binance', url: 'https://binance.com/en/user/{username}', icon: '₿', category: 'crypto', priority: 'medium' },
            { name: 'Coinbase', url: 'https://coinbase.com/{username}', icon: '🪙', category: 'crypto', priority: 'medium' },
            
            // 📰 Sites de Blog/Notícias
            { name: 'Medium', url: 'https://medium.com/@{username}', icon: '📝', category: 'blog', priority: 'low' },
            { name: 'Substack', url: 'https://{username}.substack.com', icon: '📰', category: 'blog', priority: 'low' },
            { name: 'WordPress', url: 'https://{username}.wordpress.com', icon: '📝', category: 'blog', priority: 'low' },

            // 🟥 Plataformas de Conteúdo Adulto
            { name: 'OnlyFans', url: 'https://onlyfans.com/{username}', icon: '🔞', category: 'adult', priority: 'critical' },
            { name: 'Fansly', url: 'https://fansly.com/{username}', icon: '💋', category: 'adult', priority: 'critical' },
            { name: 'JustForFans', url: 'https://justfor.fans/{username}', icon: '🔥', category: 'adult', priority: 'high' },
            { name: 'FanCentro', url: 'https://fancentro.com/{username}', icon: '💎', category: 'adult', priority: 'high' },
            { name: 'LoyalFans', url: 'https://loyalfans.com/{username}', icon: '👑', category: 'adult', priority: 'high' },
            { name: 'ManyVids', url: 'https://manyvids.com/{username}', icon: '🎬', category: 'adult', priority: 'high' },

            // 🟥 Sites de Cam
            { name: 'Chaturbate', url: 'https://chaturbate.com/{username}', icon: '💬', category: 'cam', priority: 'critical' },
            { name: 'Stripchat', url: 'https://stripchat.com/{username}', icon: '💃', category: 'cam', priority: 'high' },
            { name: 'LiveJasmin', url: 'https://livejasmin.com/{username}', icon: '🌹', category: 'cam', priority: 'high' },
            { name: 'MyFreeCams', url: 'https://myfreecams.com/{username}', icon: '🎥', category: 'cam', priority: 'high' },
            { name: 'BongaCams', url: 'https://bonga.com/{username}', icon: '🥁', category: 'cam', priority: 'high' },
            { name: 'Cam4', url: 'https://cam4.com/{username}', icon: '📷', category: 'cam', priority: 'medium' },
            { name: 'CamSoda', url: 'https://camsoda.com/{username}', icon: '🥤', category: 'cam', priority: 'medium' },

            // 🟨 Sites de Portfólio
            { name: 'Behance', url: 'https://behance.net/{username}', icon: '🎨', category: 'portfolio', priority: 'medium' },
            { name: 'ArtStation', url: 'https://artstation.com/{username}', icon: '🖼️', category: 'portfolio', priority: 'medium' },
            { name: 'ModelMayhem', url: 'https://modelmayhem.com/{username}', icon: '📸', category: 'portfolio', priority: 'medium' },
            { name: '500px', url: 'https://500px.com/{username}', icon: '📷', category: 'portfolio', priority: 'medium' },
            { name: 'DeviantArt', url: 'https://deviantart.com/{username}', icon: '🎭', category: 'portfolio', priority: 'low' },

            // 🟦 Sites de Casting
            { name: 'Backstage', url: 'https://backstage.com/{username}', icon: '🎬', category: 'casting', priority: 'medium' },
            { name: 'StarNow', url: 'https://starnow.com/{username}', icon: '⭐', category: 'casting', priority: 'medium' },
            { name: 'Models.com', url: 'https://models.com/{username}', icon: '👗', category: 'casting', priority: 'medium' },

            // 🔗 Link in Bio
            { name: 'Linktree', url: 'https://linktr.ee/{username}', icon: '🌳', category: 'linkinbio', priority: 'high' },
            { name: 'Beacons.ai', url: 'https://beacons.ai/{username}', icon: '🔗', category: 'linkinbio', priority: 'medium' },
            { name: 'Carrd', url: 'https://{username}.carrd.co', icon: '🎴', category: 'linkinbio', priority: 'medium' },

            // 📚 Desenvolvimento
            { name: 'GitHub', url: 'https://github.com/{username}', icon: '📚', category: 'dev', priority: 'low' },
            { name: 'GitLab', url: 'https://gitlab.com/{username}', icon: '🦊', category: 'dev', priority: 'low' },
        ];
    }

    /**
     * Carregar sites de fóruns
     */
    _loadForumSites() {
        return [
            { name: 'Leak.sx', url: 'https://leak.sx/search?q={username}', icon: '💧', category: 'forum', priority: 'critical' },
            { name: 'Fapello', url: 'https://fapello.com/search/{username}', icon: '🔍', category: 'forum', priority: 'critical' },
            { name: 'Coomer.party', url: 'https://coomer.party/search?q={username}', icon: '🎉', category: 'forum', priority: 'high' },
            { name: 'Reddit Search', url: 'https://reddit.com/search?q={username}', icon: '🔎', category: 'forum', priority: 'medium' },
            { name: 'Archive.today', url: 'https://archive.today/{username}', icon: '📚', category: 'archive', priority: 'low' },
        ];
    }

    /**
     * Carregar padrões de busca
     */
    _loadSearchPatterns() {
        return [
            'onlyfans', 'ofans', 'fansly', 'privacy', 'nudes', 'leaked', 'content creator',
            'camgirl', 'camboy', 'camming', 'tip menu', 'escort', 'acompanhantes',
            'sugar baby', 'sugar daddy', 'elite model', 'casting', 'portfolio',
            'nsfw', 'explicit', '18+', 'xxx', 'videos', 'custom content',
            'model profile', 'art nude', 'erotic photography', 'cosplay'
        ];
    }
}
