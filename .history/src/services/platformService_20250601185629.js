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
            { name: 'WordPress', url: 'https://{username}.wordpress.com', icon: '📝', category: 'blog', priority: 'low' },            // 🟥 Plataformas de Conteúdo Adulto
            { name: 'OnlyFans', url: 'https://onlyfans.com/{username}', icon: '🔞', category: 'adult', priority: 'critical' },
            { name: 'Privacy.com.br', url: 'https://privacy.com.br/{username}', icon: '🇧🇷', category: 'adult', priority: 'critical' },
            { name: 'Fansly', url: 'https://fansly.com/{username}', icon: '💋', category: 'adult', priority: 'critical' },
            { name: 'JustForFans', url: 'https://justfor.fans/{username}', icon: '🔥', category: 'adult', priority: 'high' },
            { name: 'FanCentro', url: 'https://fancentro.com/{username}', icon: '💎', category: 'adult', priority: 'high' },
            { name: 'FanFever', url: 'https://fanfever.com.br/{username}', icon: '🔥', category: 'adult', priority: 'high' },
            { name: 'LoyalFans', url: 'https://loyalfans.com/{username}', icon: '👑', category: 'adult', priority: 'high' },
            { name: 'ManyVids', url: 'https://manyvids.com/{username}', icon: '🎬', category: 'adult', priority: 'high' },
            { name: 'AVNStars', url: 'https://avnstars.com/{username}', icon: '⭐', category: 'adult', priority: 'high' },
            { name: 'IsMyGirl', url: 'https://ismygirl.com/{username}', icon: '💃', category: 'adult', priority: 'high' },
            { name: 'PocketStars', url: 'https://pocketstars.com/{username}', icon: '🌟', category: 'adult', priority: 'high' },
            { name: 'Clipp Store', url: 'https://clipp.store/{username}', icon: '🛒', category: 'adult', priority: 'high' },
            { name: 'IWantClips', url: 'https://iwantclips.com/{username}', icon: '📎', category: 'adult', priority: 'high' },
            { name: 'ModelHub', url: 'https://modelhub.com/{username}', icon: '🎭', category: 'adult', priority: 'high' },
            { name: 'AdultWork', url: 'https://adultwork.com/{username}', icon: '💼', category: 'adult', priority: 'high' },
            { name: 'UnlokMe', url: 'https://unlok.me/{username}', icon: '🔓', category: 'adult', priority: 'high' },
            { name: 'NSFWFans', url: 'https://nsfwfans.com/{username}', icon: '🔞', category: 'adult', priority: 'high' },
            { name: 'PornPayPerView', url: 'https://pornpayperview.com/{username}', icon: '💰', category: 'adult', priority: 'high' },
            { name: 'EPlay', url: 'https://eplay.com/{username}', icon: '🎮', category: 'adult', priority: 'high' },

            // 🟥 Sites de Cam
            { name: 'Chaturbate', url: 'https://chaturbate.com/{username}', icon: '💬', category: 'cam', priority: 'critical' },
            { name: 'Stripchat', url: 'https://stripchat.com/{username}', icon: '💃', category: 'cam', priority: 'high' },
            { name: 'LiveJasmin', url: 'https://livejasmin.com/{username}', icon: '🌹', category: 'cam', priority: 'high' },
            { name: 'MyFreeCams', url: 'https://myfreecams.com/{username}', icon: '🎥', category: 'cam', priority: 'high' },
            { name: 'BongaCams', url: 'https://bonga.com/{username}', icon: '🥁', category: 'cam', priority: 'high' },
            { name: 'Cam4', url: 'https://cam4.com/{username}', icon: '📷', category: 'cam', priority: 'high' },
            { name: 'CamSoda', url: 'https://camsoda.com/{username}', icon: '🥤', category: 'cam', priority: 'high' },
            { name: 'Flirt4Free', url: 'https://flirt4free.com/{username}', icon: '😘', category: 'cam', priority: 'high' },
            { name: 'XHamsterLive', url: 'https://xhamsterlive.com/{username}', icon: '🐹', category: 'cam', priority: 'high' },            { name: 'CamWhores.tv', url: 'https://camwhores.tv/{username}', icon: '📺', category: 'cam', priority: 'high' },            // 🟨 Sites de Portfólio
            { name: 'Behance', url: 'https://behance.net/{username}', icon: '🎨', category: 'portfolio', priority: 'medium' },
            { name: 'ArtStation', url: 'https://artstation.com/{username}', icon: '🖼️', category: 'portfolio', priority: 'medium' },
            { name: 'ModelMayhem', url: 'https://modelmayhem.com/{username}', icon: '📸', category: 'portfolio', priority: 'medium' },
            { name: '500px', url: 'https://500px.com/{username}', icon: '📷', category: 'portfolio', priority: 'medium' },
            { name: 'DeviantArt', url: 'https://deviantart.com/{username}', icon: '🎭', category: 'portfolio', priority: 'low' },
            { name: 'VSCO', url: 'https://vsco.co/{username}', icon: '📱', category: 'portfolio', priority: 'medium' },
            { name: 'About.me', url: 'https://about.me/{username}', icon: '👤', category: 'portfolio', priority: 'medium' },
            { name: 'Dribbble', url: 'https://dribbble.com/{username}', icon: '🏀', category: 'portfolio', priority: 'medium' },
            { name: 'Format', url: 'https://{username}.format.com', icon: '📐', category: 'portfolio', priority: 'low' },
            { name: 'FolioHD', url: 'https://foliohd.com/{username}', icon: '📱', category: 'portfolio', priority: 'low' },
            { name: 'Canva', url: 'https://canva.com/{username}', icon: '🎨', category: 'portfolio', priority: 'low' },
            { name: 'OneModelPlace', url: 'https://onemodelplace.com/{username}', icon: '📸', category: 'portfolio', priority: 'medium' },
            { name: 'PortfolioBox', url: 'https://portfoliobox.net/{username}', icon: '📦', category: 'portfolio', priority: 'low' },
            { name: 'PhotoShelter', url: 'https://photoshelter.com/{username}', icon: '🏠', category: 'portfolio', priority: 'low' },
            { name: 'Zenfolio', url: 'https://zenfolio.com/{username}', icon: '🧘', category: 'portfolio', priority: 'low' },
            { name: 'PhotoDeck', url: 'https://photodeck.com/{username}', icon: '🃏', category: 'portfolio', priority: 'low' },

            // 🟦 Sites de Casting
            { name: 'Backstage', url: 'https://backstage.com/{username}', icon: '🎬', category: 'casting', priority: 'medium' },
            { name: 'StarNow', url: 'https://starnow.com/{username}', icon: '⭐', category: 'casting', priority: 'medium' },
            { name: 'CastingNetworks', url: 'https://castingnetworks.com/{username}', icon: '🌐', category: 'casting', priority: 'medium' },
            { name: 'Models.com', url: 'https://models.com/{username}', icon: '👗', category: 'casting', priority: 'high' },
            { name: 'ActorsAccess', url: 'https://actorsaccess.com/{username}', icon: '🎭', category: 'casting', priority: 'medium' },
            { name: 'CastingFrontier', url: 'https://castingfrontier.com/{username}', icon: '🚀', category: 'casting', priority: 'medium' },
            { name: 'ExploreModeling', url: 'https://exploretalent.com/{username}', icon: '🔍', category: 'casting', priority: 'medium' },
            { name: 'NewFaces', url: 'https://newfaces.com/{username}', icon: '👶', category: 'casting', priority: 'medium' },
            { name: 'ModelScouts', url: 'https://modelscouts.com/{username}', icon: '🕵️', category: 'casting', priority: 'medium' },
            { name: 'TalentHouse', url: 'https://talenthouse.com/{username}', icon: '🏠', category: 'casting', priority: 'medium' },
            { name: 'ModNet.io', url: 'https://modnet.io/{username}', icon: '🌐', category: 'casting', priority: 'medium' },            { name: 'ModelManagement', url: 'https://modelmanagement.com/{username}', icon: '👔', category: 'casting', priority: 'high' },
            
            // 🟧 Sites de Escort/Acompanhantes
            { name: 'FatalModel', url: 'https://fatalmodel.com/{username}', icon: '💀', category: 'escort', priority: 'critical' },
            { name: 'Skokka', url: 'https://skokka.com/{username}', icon: '💄', category: 'escort', priority: 'critical' },
            { name: 'Lupanares', url: 'https://lupanares.com/{username}', icon: '🏠', category: 'escort', priority: 'critical' },
            { name: 'Meetes', url: 'https://meetes.com/{username}', icon: '🤝', category: 'escort', priority: 'high' },
            { name: 'AnunciArt', url: 'https://anunciart.com/{username}', icon: '📢', category: 'escort', priority: 'high' },
            { name: 'EasyCompanions', url: 'https://easycompanions.com/{username}', icon: '👫', category: 'escort', priority: 'high' },
            { name: 'VivaStreet', url: 'https://vivastreet.com/{username}', icon: '🚶', category: 'escort', priority: 'high' },
            { name: 'Locanto', url: 'https://locanto.com/{username}', icon: '📍', category: 'escort', priority: 'high' },
            { name: 'MileRoticos', url: 'https://mileroticos.com/{username}', icon: '🌶️', category: 'escort', priority: 'high' },
            { name: 'GPOnline', url: 'https://gponline.net/{username}', icon: '💻', category: 'escort', priority: 'high' },
            { name: 'Hot.com.br', url: 'https://hot.com.br/{username}', icon: '🔥', category: 'escort', priority: 'high' },
            
            // 🟪 Sites de Compartilhamento de Imagens
            { name: 'Imgur', url: 'https://imgur.com/user/{username}', icon: '🖼️', category: 'images', priority: 'medium' },
            { name: 'ImageFap', url: 'https://imagefap.com/{username}', icon: '📸', category: 'images', priority: 'high' },
            { name: 'Motherless', url: 'https://motherless.com/{username}', icon: '🚫', category: 'images', priority: 'high' },
            { name: 'FurAffinity', url: 'https://furaffinity.net/user/{username}', icon: '🦊', category: 'images', priority: 'medium' },
            { name: 'Rule34.xxx', url: 'https://rule34.xxx/{username}', icon: '🔞', category: 'images', priority: 'high' },
            { name: 'Pixiv', url: 'https://pixiv.net/users/{username}', icon: '🎨', category: 'images', priority: 'medium' },
            { name: 'LeakGirls', url: 'https://leakgirls.com/{username}', icon: '💧', category: 'images', priority: 'critical' },

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
            // Fóruns de Leak/OSINT
            { name: 'Leak.sx', url: 'https://leak.sx/search?q={username}', icon: '💧', category: 'forum', priority: 'critical' },
            { name: 'Fapello', url: 'https://fapello.com/search/{username}', icon: '🔍', category: 'forum', priority: 'critical' },
            { name: 'Coomer.party', url: 'https://coomer.party/search?q={username}', icon: '🎉', category: 'forum', priority: 'high' },
            { name: 'Forumophilia', url: 'https://forumophilia.com/search?q={username}', icon: '🧠', category: 'forum', priority: 'high' },
            { name: 'TheFappeningBlog', url: 'https://thefappeningblog.com/?s={username}', icon: '📸', category: 'forum', priority: 'high' },
            { name: 'CelebLeaks', url: 'https://celebleaks.online/?s={username}', icon: '⭐', category: 'forum', priority: 'high' },
            { name: '8kun', url: 'https://8kun.top/index.html?keywords={username}', icon: '8️⃣', category: 'forum', priority: 'high' },
            { name: '4chan Archive', url: 'https://archived.moe/_/search/text/{username}/', icon: '4️⃣', category: 'forum', priority: 'high' },
            { name: 'RealityForum', url: 'https://realityforum.net/search?q={username}', icon: '🌐', category: 'forum', priority: 'high' },
            { name: 'Forum.xxx', url: 'https://forum.xxx/search?q={username}', icon: '🔍', category: 'forum', priority: 'high' },
            { name: 'Leaked.Zone', url: 'https://leaked.zone/?s={username}', icon: '🚫', category: 'forum', priority: 'high' },
            { name: 'NoNude.club', url: 'https://nonude.club/?s={username}', icon: '👙', category: 'forum', priority: 'high' },
            { name: 'R34Porn', url: 'https://r34porn.com/?s={username}', icon: '🔞', category: 'forum', priority: 'high' },
            { name: 'NSFW.xxx', url: 'https://nsfw.xxx/search?q={username}', icon: '❌', category: 'forum', priority: 'high' },
            { name: 'ViperGirls', url: 'https://vipergirls.to/search?q={username}', icon: '🐍', category: 'forum', priority: 'high' },
            { name: 'BDSMLR', url: 'https://bdsmlr.com/search?q={username}', icon: '⛓️', category: 'forum', priority: 'high' },
            { name: 'MyDirtyHobby', url: 'https://mydirtyhobby.com/search/{username}', icon: '🧹', category: 'forum', priority: 'high' },
            { name: 'PlanetLeak', url: 'https://planetsuzy.org/_/search/query/{username}/', icon: '🌎', category: 'forum', priority: 'high' },
            { name: 'DarkF', url: 'https://darkf.app/search?q={username}', icon: '🕶️', category: 'forum', priority: 'high' },
            { name: 'SpankBang', url: 'https://spankbang.com/s/{username}/', icon: '👋', category: 'forum', priority: 'high' },
            { name: 'XVideos', url: 'https://xvideos.com/?k={username}', icon: '❌', category: 'forum', priority: 'high' },
            { name: 'XNXX', url: 'https://xnxx.com/search/{username}', icon: '🔷', category: 'forum', priority: 'high' },
            { name: 'Pornhub', url: 'https://pornhub.com/video/search?search={username}', icon: '🟠', category: 'forum', priority: 'high' },
            { name: 'XXXStreams', url: 'https://xxxstreams.org/?s={username}', icon: '🌊', category: 'forum', priority: 'high' },
            { name: 'SxyPrn', url: 'https://sxyprn.com/search/{username}.html', icon: '🎬', category: 'forum', priority: 'high' },
            
            // Fóruns Brasileiros
            { name: 'GozoFans', url: 'https://gozofans.com/search?q={username}', icon: '💦', category: 'forum', priority: 'critical' },
            { name: 'Fotolog Brasil', url: 'https://fotolog.com.br/search?q={username}', icon: '📸', category: 'forum', priority: 'high' },
            { name: 'Panela de Pressão', url: 'https://panelapressao.org.br/search?q={username}', icon: '🍲', category: 'forum', priority: 'medium' },
            { name: 'Fórum UOL', url: 'https://forum.uol.com.br/search?q={username}', icon: '🇧🇷', category: 'forum', priority: 'medium' },
            { name: 'Gpguia', url: 'https://gpguia.net/search?q={username}', icon: '📝', category: 'forum', priority: 'high' },
            { name: 'Achei Gatas', url: 'https://acheigatas.com/search/{username}', icon: '🐱', category: 'forum', priority: 'high' },
            { name: 'FórumBR', url: 'https://forumbr.net/{username}', icon: '🧵', category: 'forum', priority: 'medium' },
            { name: 'HardBR', url: 'https://hardbr.com/busca?busca={username}', icon: '🔨', category: 'forum', priority: 'high' },
            
            // Arquivos/Wayback
            { name: 'Archive.today', url: 'https://archive.today/{username}', icon: '📚', category: 'archive', priority: 'low' },
            { name: 'Wayback Machine', url: 'https://web.archive.org/web/*/{username}', icon: '⏮️', category: 'archive', priority: 'low' },
            { name: 'Google Cache', url: 'https://webcache.googleusercontent.com/search?q=cache:{username}', icon: '🔍', category: 'archive', priority: 'low' },
            
            // Motores de busca
            { name: 'Google', url: 'https://google.com/search?q=%22{username}%22', icon: '🔍', category: 'search', priority: 'medium' },
            { name: 'Yandex', url: 'https://yandex.com/search/?text=%22{username}%22', icon: '🇷🇺', category: 'search', priority: 'medium' },
            { name: 'Reddit Search', url: 'https://reddit.com/search?q={username}', icon: '🤖', category: 'search', priority: 'medium' },
            { name: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=%22{username}%22', icon: '🦆', category: 'search', priority: 'medium' },
            { name: 'Bing', url: 'https://bing.com/search?q=%22{username}%22', icon: '🅱️', category: 'search', priority: 'medium' }
        ];
    }

    /**
     * Carregar padrões de busca
     */
    _loadSearchPatterns() {
        return [
            // Padrões Adultos/OnlyFans
            'onlyfans', 'ofans', 'fansly', 'privacy', 'nudes', 'leaked', 'content creator', 
            'camgirl', 'camboy', 'camming', 'tip menu', 'cam4free', 'custom content',
            'nsfw', 'explicit', '18+', 'xxx', 'videos', 'dms open', 'payperview', 
            'sub4sub', 'content menu', 'buy my content', 'dm for prices', 'sell nudes',
            'fancentro', 'justforfans', 'manyvids', 'avnstars', 'ismygirl', 'pocketstars',
            'clipp store', 'iwantclips', 'modelhub', 'adultwork', 'loyalfans', 'unlokme',
            'nsfwfans', 'pornpayperview', 'eplay', 
            
            // Padrões de Cam Sites
            'chaturbate', 'stripchat', 'livejasmin',
            'myfreecams', 'bongacams', 'camsoda', 'camversity', 'flirt4free', 'camplace',
            'onlycam', 'justcamit', 'sexcamsplus', 'herbicepscam', 'camwhores', 'xhamsterlive',
            'join my vip', 'premium snapchat', 'private snap', 'fetish content', 'kink friendly',
            
            // Termos brasileiros específicos
            'creator', 'modelo', 'atriz', 'ator', 'conteúdo adulto', 'vídeos personalizados',
            'fotógrafa sensual', 'freelance model', 'ritmo intenso', 'findom', 'femdom',
            'dominatrix', 'submissiva', 'lingerie', 'sigiloso', 'webcam', 'renda extra',
            'ensaios', 'pacotes promocionais', 'conteúdo desbloqueado', 'semprecinto',
            'domingo tem', 'conteúdo especial', 'sigam', 'novinha', 'novinho', 'privacy br',
            'monetize seu conteúdo', 'produtor', 'atendimento vip', 'satisfeita', 'satisfeito',
            
            // Termos de escort/acompanhantes
            'escort', 'acompanhantes', 'sugar baby', 'sugar daddy', 'gp', 'garota programa',
            'fatalmodel', 'skokka', 'lupanares', 'meetes', 'anunciart', 'easycompanions',
            'vivastreet', 'locanto', 'mileroticos', 'gatas', 'gponline', 'terapeuta',
            'cityoflove', 'massage republic', 'eurogirlsescort', 'hot.com.br', 'hookup',
            'encontreumgaroto', 'companheiros', 'massage', 'sensual', 'intimate',
            'acompanhante de luxo', 'massagista', 'massagem com final feliz', 'massoterapia',
            'massagem tântrica', 'terapêutica', 'relaxamento profundo', 'atendimento com local',
            'atendimento a domicílio', 'sigilo absoluto', 'com local', 'massagens', 'encontros',
            
            // Termos de modelagem e portfolio
            'elite model', 'casting', 'portfolio', 'portfolio link', 'booking', 'hire me',
            'model profile', 'art nude', 'erotic photography', 'implied nude', 'fashion model',
            'behance', 'artstation', 'modelmayhem', 'viewbug', '500px', 'dribbble', 'deviantart',
            'vsco', 'pixpa', 'format', 'foliohd', 'canva', 'onemodelplace', 'portfoliobox',
            'photoshelter', 'zenfolio', 'photodeck', 'smugmug', 'carbonmade', 'krop',
            'backstage', 'starnow', 'castingnetworks', 'models.com', 'actorsaccess',
            'castingfrontier', 'exploretalent', 'newfaces', 'modelscouts', 'talenthouse',
            
            // Termos de redes sociais
            'instagram model', 'reels', 'tiktok viral', 'snap', 'snapcode', 'linktr.ee',
            'beacons.ai', 'carrd', 'linkinbio', 'check bio', 'link in bio', 'bio link',
            'youtube channel', 'twitch streamer', 'discord server', 'telegram channel',
            'vk profile', 'weheartit', 'ask.fm', 'curiouscat', 'yubo', 'bigo live',
            
            // Termos de imagens/compartilhamento
            'imgur', 'imagefap', 'motherless', 'e621', 'furaffinity', 'rule34', 'xbooru',
            'gelbooru', 'danbooru', 'hypnohub', 'hentai foundry', '8muses', 'pixiv',
            'nhentai', 'pornpics', 'pornimg', 'leakgirls', 'r18', 'superhq',
            'album privado', 'fotos privadas', 'acervo', 'coleção', 'conteúdo vazado',
            'exclusivo', 'vip access', 'mega folder', 'mega link', 'compartilhe',
            
            // Termos de fóruns/leak/comunidades
            'leak.sx', 'fapello', 'coomer.party', 'forumophilia', 'thefappeningblog',
            'celebleaks', '8kun', '4chan', 'redditside', 'realityforum', 'forum.xxx',
            'leaked.zone', 'anon-ib', 'nonude.club', 'r34porn', 'nsfw.xxx', 'vipergirls',
            'bdsmlr', 'mydirtyhobby', 'planetleak', 'torlinkbunker', 'nofacefreak_18',
            'darkf.app', 'spankbang', 'xvideos', 'xnxx', 'pornhub', 'xxxstreams', 'sxyprn',
            
            // Termos regionais brasileiros
            'faz programa', 'acompanhante de luxo', 'acompanhante executiva',
            'sigilo absoluto', 'sem frescura', 'sigiloso', 'liberal', 'privacy br', 'privacy brasil',
            'webcamgirl br', 'novinha', 'carioca', 'paulista', 'gaúcha', 'mineira', 'nordestina',
            'tesuda', 'safadinha', 'safadão', 'gostosa', 'gostoso', 'putaria', 'sacanagem',
            'casa das primas', 'close friends', 'só para amigos',
            
            // Termos gerais OSINT
            'leak', 'leaked content', 'private content', 'exclusive content',
            'patreon', 'feetpics', 'feetfinder', 'feet pics', 'foot fetish',
            'cosplay lewd', 'cosplay nsfw', 'femboy', 'furry nsfw', 'hentai', 'r34',
            'rule34', 'anime girl', 'waifu', 'ahegao', 'ecchi', 'lewd', 'hentai girl',
            'backup account', 'second account', 'alt account', 'private account',
            'vip content', 'premium content', 'paid content', 'subscription', 'ppv',
            'tribute', 'cumtribute', 'cock tribute', 'rate', 'dick rate', 'sph',
            'privacy leak', 'filter bypass', 'dating profile', 'anúncio pessoal',
            'verificado', 'verified', 'blue check', 'selo azul', 'official', 'real'
        ];
    }
}
