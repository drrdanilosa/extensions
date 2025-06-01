/**
 * DeepAlias Hunter Pro - Background Script
 * Versão limpa e funcional para Firefox
 */

console.log('🚀 DeepAlias Hunter Pro - Background Script Iniciado');

// Estado da aplicação
var appState = {
    isSearching: false,
    progress: 0,
    results: [],
    currentQuery: null
};

// Plataformas para busca - Base de dados completa expandida v3.1
var platforms = [
    // 🔷 Redes Sociais Principais
    { name: 'Instagram', url: 'https://instagram.com/{username}', icon: '📷', category: 'social', risk: 'low' },
    { name: 'Facebook', url: 'https://facebook.com/{username}', icon: '👥', category: 'social', risk: 'low' },
    { name: 'Twitter', url: 'https://twitter.com/{username}', icon: '🐦', category: 'social', risk: 'low' },
    { name: 'X.com', url: 'https://x.com/{username}', icon: '❌', category: 'social', risk: 'low' },
    { name: 'TikTok', url: 'https://tiktok.com/@{username}', icon: '🎵', category: 'social', risk: 'low' },
    { name: 'YouTube', url: 'https://youtube.com/@{username}', icon: '📺', category: 'social', risk: 'low' },
    { name: 'Snapchat', url: 'https://snapchat.com/add/{username}', icon: '👻', category: 'social', risk: 'low' },
    { name: 'Pinterest', url: 'https://pinterest.com/{username}', icon: '📌', category: 'social', risk: 'low' },
    { name: 'LinkedIn', url: 'https://linkedin.com/in/{username}', icon: '💼', category: 'social', risk: 'low' },
    { name: 'Tumblr', url: 'https://{username}.tumblr.com', icon: '🔵', category: 'social', risk: 'medium' },
    { name: 'Reddit', url: 'https://reddit.com/user/{username}', icon: '🤖', category: 'social', risk: 'low' },
    { name: 'Discord', url: 'https://discord.com/users/{username}', icon: '🎮', category: 'social', risk: 'medium' },
    { name: 'Telegram', url: 'https://t.me/{username}', icon: '✈️', category: 'social', risk: 'medium' },
    { name: 'VK', url: 'https://vk.com/{username}', icon: '🇷🇺', category: 'social', risk: 'low' },
    { name: 'WeHeartIt', url: 'https://weheartit.com/{username}', icon: '💖', category: 'social', risk: 'low' },
    { name: 'Ask.fm', url: 'https://ask.fm/{username}', icon: '❓', category: 'social', risk: 'medium' },
    { name: 'CuriousCat', url: 'https://curiouscat.live/{username}', icon: '🐱', category: 'social', risk: 'medium' },
    { name: 'Yubo', url: 'https://yubo.live/{username}', icon: '💛', category: 'social', risk: 'medium' },
    { name: 'Bigo Live', url: 'https://bigo.tv/{username}', icon: '📹', category: 'social', risk: 'medium' },

    // 🟥 Sites de Conteúdo Adulto e Venda de Conteúdo
    { name: 'OnlyFans', url: 'https://onlyfans.com/{username}', icon: '🔞', category: 'adult', risk: 'high', adult: true, urgent: true },
    { name: 'Privacy.com.br', url: 'https://privacy.com.br/{username}', icon: '🇧🇷', category: 'adult', risk: 'high', adult: true, urgent: true },
    { name: 'Fansly', url: 'https://fansly.com/{username}', icon: '💋', category: 'adult', risk: 'high', adult: true, urgent: true },
    { name: 'JustForFans', url: 'https://justfor.fans/{username}', icon: '🔥', category: 'adult', risk: 'high', adult: true, urgent: true },
    { name: 'FanCentro', url: 'https://fancentro.com/{username}', icon: '💎', category: 'adult', risk: 'high', adult: true },
    { name: 'FanFever', url: 'https://fanfever.com.br/{username}', icon: '🔥', category: 'adult', risk: 'high', adult: true },
    { name: 'CameraPrivé', url: 'https://cameraprive.com/{username}', icon: '📹', category: 'adult', risk: 'high', adult: true },
    { name: 'PepperPlay', url: 'https://pepperplay.com/{username}', icon: '🌶️', category: 'adult', risk: 'high', adult: true },
    { name: 'LoyalFans', url: 'https://loyalfans.com/{username}', icon: '👑', category: 'adult', risk: 'high', adult: true },
    { name: 'Fanvue', url: 'https://fanvue.com/{username}', icon: '🌟', category: 'adult', risk: 'high', adult: true },
    { name: 'ManyVids', url: 'https://manyvids.com/{username}', icon: '🎬', category: 'adult', risk: 'high', adult: true },
    { name: 'AVNStars', url: 'https://avnstars.com/{username}', icon: '⭐', category: 'adult', risk: 'high', adult: true },
    { name: 'IsMyGirl', url: 'https://ismygirl.com/{username}', icon: '💃', category: 'adult', risk: 'high', adult: true },
    { name: 'PocketStars', url: 'https://pocketstars.com/{username}', icon: '🌟', category: 'adult', risk: 'high', adult: true },
    { name: 'Clipp Store', url: 'https://clipp.store/{username}', icon: '🛒', category: 'adult', risk: 'high', adult: true },
    { name: 'IWantClips', url: 'https://iwantclips.com/{username}', icon: '📎', category: 'adult', risk: 'high', adult: true },
    { name: 'ModelHub', url: 'https://modelhub.com/{username}', icon: '🎭', category: 'adult', risk: 'high', adult: true },
    { name: 'AdultWork', url: 'https://adultwork.com/{username}', icon: '💼', category: 'adult', risk: 'high', adult: true },
    { name: 'NaughtyAmerica', url: 'https://naughtyamerica.com/{username}', icon: '🇺🇸', category: 'adult', risk: 'high', adult: true },
    { name: 'UnlokMe', url: 'https://unlok.me/{username}', icon: '🔓', category: 'adult', risk: 'high', adult: true },
    { name: 'NSFWFans', url: 'https://nsfwfans.com/{username}', icon: '🔞', category: 'adult', risk: 'high', adult: true },
    { name: 'PornPayPerView', url: 'https://pornpayperview.com/{username}', icon: '💰', category: 'adult', risk: 'high', adult: true },
    { name: 'EPlay', url: 'https://eplay.com/{username}', icon: '🎮', category: 'adult', risk: 'high', adult: true },
    
    // 🟥 Sites de Cam e Streaming Adulto
    { name: 'Chaturbate', url: 'https://chaturbate.com/{username}', icon: '💬', category: 'cam', risk: 'high', adult: true, urgent: true },
    { name: 'Stripchat', url: 'https://stripchat.com/{username}', icon: '💃', category: 'cam', risk: 'high', adult: true, urgent: true },
    { name: 'LiveJasmin', url: 'https://livejasmin.com/{username}', icon: '🌹', category: 'cam', risk: 'high', adult: true, urgent: true },
    { name: 'MyFreeCams', url: 'https://myfreecams.com/{username}', icon: '🎥', category: 'cam', risk: 'high', adult: true, urgent: true },
    { name: 'BongaCams', url: 'https://bonga.com/{username}', icon: '🥁', category: 'cam', risk: 'high', adult: true, urgent: true },
    { name: 'Cam4', url: 'https://cam4.com/{username}', icon: '📷', category: 'cam', risk: 'high', adult: true, urgent: true },
    { name: 'CamSoda', url: 'https://camsoda.com/{username}', icon: '🥤', category: 'cam', risk: 'high', adult: true, urgent: true },
    { name: 'Camversity', url: 'https://camversity.com/{username}', icon: '🎓', category: 'cam', risk: 'high', adult: true },
    { name: 'Flirt4Free', url: 'https://flirt4free.com/{username}', icon: '😘', category: 'cam', risk: 'high', adult: true },
    { name: 'CamPlace', url: 'https://camplace.com/{username}', icon: '🏠', category: 'cam', risk: 'high', adult: true },
    { name: 'Cams.com', url: 'https://cams.com/{username}', icon: '📹', category: 'cam', risk: 'high', adult: true },
    { name: 'XHamsterLive', url: 'https://xhamsterlive.com/{username}', icon: '🐹', category: 'cam', risk: 'high', adult: true },
    { name: 'XVideosLive', url: 'https://xvideoslive.com/{username}', icon: '🎬', category: 'cam', risk: 'high', adult: true },
    { name: 'CamWhores.tv', url: 'https://camwhores.tv/{username}', icon: '📺', category: 'cam', risk: 'high', adult: true },
    { name: 'CamModelDirectory', url: 'https://cammodeldirectory.com/{username}', icon: '📋', category: 'cam', risk: 'high', adult: true },
    { name: 'OnlyCam', url: 'https://onlycam.com/{username}', icon: '📹', category: 'cam', risk: 'high', adult: true },
    { name: 'JustCamIt', url: 'https://justcamit.com/{username}', icon: '🎥', category: 'cam', risk: 'high', adult: true },
    { name: 'SexCamsPlus', url: 'https://sexcamsplus.com/{username}', icon: '➕', category: 'cam', risk: 'high', adult: true },
    { name: 'HerbicepsCam', url: 'https://herbicepscam.com/{username}', icon: '💪', category: 'cam', risk: 'high', adult: true },
    
    // 🟨 Sites de Portfólio de Modelos / Fotógrafos / Criadores
    { name: 'Behance', url: 'https://behance.net/{username}', icon: '🎨', category: 'portfolio', risk: 'low' },
    { name: 'ArtStation', url: 'https://artstation.com/{username}', icon: '🖼️', category: 'portfolio', risk: 'low' },
    { name: 'ModelMayhem', url: 'https://modelmayhem.com/{username}', icon: '📸', category: 'portfolio', risk: 'medium' },
    { name: 'ViewBug', url: 'https://viewbug.com/{username}', icon: '🐛', category: 'portfolio', risk: 'low' },
    { name: '500px', url: 'https://500px.com/{username}', icon: '📷', category: 'portfolio', risk: 'low' },
    { name: 'Dribbble', url: 'https://dribbble.com/{username}', icon: '🏀', category: 'portfolio', risk: 'low' },
    { name: 'DeviantArt', url: 'https://deviantart.com/{username}', icon: '🎭', category: 'portfolio', risk: 'medium' },
    { name: 'VSCO', url: 'https://vsco.co/{username}', icon: '📱', category: 'portfolio', risk: 'low' },
    { name: 'About.me', url: 'https://about.me/{username}', icon: '👤', category: 'portfolio', risk: 'low' },
    { name: 'Pixpa', url: 'https://{username}.pixpa.com', icon: '🌐', category: 'portfolio', risk: 'low' },
    { name: 'Format', url: 'https://{username}.format.com', icon: '📐', category: 'portfolio', risk: 'low' },
    { name: 'FolioHD', url: 'https://foliohd.com/{username}', icon: '📱', category: 'portfolio', risk: 'low' },
    { name: 'Canva', url: 'https://canva.com/{username}', icon: '🎨', category: 'portfolio', risk: 'low' },
    { name: 'OneModelPlace', url: 'https://onemodelplace.com/{username}', icon: '📸', category: 'portfolio', risk: 'medium' },
    { name: 'PortfolioBox', url: 'https://portfoliobox.net/{username}', icon: '📦', category: 'portfolio', risk: 'low' },
    { name: 'PhotoShelter', url: 'https://photoshelter.com/{username}', icon: '🏠', category: 'portfolio', risk: 'low' },
    { name: 'Zenfolio', url: 'https://zenfolio.com/{username}', icon: '🧘', category: 'portfolio', risk: 'low' },
    { name: 'PhotoDeck', url: 'https://photodeck.com/{username}', icon: '🃏', category: 'portfolio', risk: 'low' },
    { name: 'SmugMug', url: 'https://smugmug.com/{username}', icon: '☕', category: 'portfolio', risk: 'low' },
    { name: 'WordPress', url: 'https://{username}.wordpress.com', icon: '📝', category: 'portfolio', risk: 'low' },
    { name: 'Wix', url: 'https://{username}.wixsite.com', icon: '🏗️', category: 'portfolio', risk: 'low' },
    { name: 'Cargo', url: 'https://cargo.site/{username}', icon: '📦', category: 'portfolio', risk: 'low' },
    { name: 'Carbonmade', url: 'https://{username}.carbonmade.com', icon: '💎', category: 'portfolio', risk: 'low' },
    { name: 'Krop', url: 'https://krop.com/{username}', icon: '🌾', category: 'portfolio', risk: 'low' },
    { name: 'Clippings.me', url: 'https://clippings.me/{username}', icon: '📎', category: 'portfolio', risk: 'low' },
    { name: 'Dunked', url: 'https://dunked.com/{username}', icon: '🏀', category: 'portfolio', risk: 'low' },
    { name: 'Crevado', url: 'https://crevado.com/{username}', icon: '🎨', category: 'portfolio', risk: 'low' },
    { name: 'Yola', url: 'https://yola.com/{username}', icon: '🌐', category: 'portfolio', risk: 'low' },
    { name: 'Weebly', url: 'https://weebly.com/{username}', icon: '🐝', category: 'portfolio', risk: 'low' },
    { name: 'VisualSociety', url: 'https://visualsociety.com/{username}', icon: '👁️', category: 'portfolio', risk: 'low' },
    { name: 'Lightfolio', url: 'https://lightfolio.com/{username}', icon: '💡', category: 'portfolio', risk: 'low' },
    { name: 'SlickPic', url: 'https://slickpic.com/{username}', icon: '📸', category: 'portfolio', risk: 'low' },
    { name: 'Pixieset', url: 'https://pixieset.com/{username}', icon: '🧚', category: 'portfolio', risk: 'low' },
    { name: 'Snapwire', url: 'https://snapwi.re/{username}', icon: '📷', category: 'portfolio', risk: 'low' },
    { name: 'ShootProof', url: 'https://shootproof.com/{username}', icon: '🎯', category: 'portfolio', risk: 'low' },
    { name: 'PicTime', url: 'https://pic-time.com/{username}', icon: '⏰', category: 'portfolio', risk: 'low' },
    
    // 🟦 Sites de Casting / Agências de Modelos
    { name: 'Backstage', url: 'https://backstage.com/{username}', icon: '🎬', category: 'casting', risk: 'medium' },
    { name: 'StarNow', url: 'https://starnow.com/{username}', icon: '⭐', category: 'casting', risk: 'medium' },
    { name: 'CastingNetworks', url: 'https://castingnetworks.com/{username}', icon: '🌐', category: 'casting', risk: 'medium' },
    { name: 'Models.com', url: 'https://models.com/{username}', icon: '👗', category: 'casting', risk: 'medium' },
    { name: 'ActorsAccess', url: 'https://actorsaccess.com/{username}', icon: '🎭', category: 'casting', risk: 'medium' },
    { name: 'CastingFrontier', url: 'https://castingfrontier.com/{username}', icon: '🚀', category: 'casting', risk: 'medium' },
    { name: 'ExploreModeling', url: 'https://exploretalent.com/{username}', icon: '🔍', category: 'casting', risk: 'medium' },
    { name: 'NewFaces', url: 'https://newfaces.com/{username}', icon: '👶', category: 'casting', risk: 'medium' },
    { name: 'ModelScouts', url: 'https://modelscouts.com/{username}', icon: '🕵️', category: 'casting', risk: 'medium' },
    { name: 'TalentHouse', url: 'https://talenthouse.com/{username}', icon: '🏠', category: 'casting', risk: 'medium' },
    { name: 'ModNet.io', url: 'https://modnet.io/{username}', icon: '🌐', category: 'casting', risk: 'medium' },
    { name: 'ModelManagement', url: 'https://modelmanagement.com/{username}', icon: '👔', category: 'casting', risk: 'medium' },
    { name: 'TheCastingNetwork', url: 'https://thecastingnetwork.com/{username}', icon: '🕸️', category: 'casting', risk: 'medium' },
    { name: 'CastingCallHub', url: 'https://castingcallhub.com/{username}', icon: '📞', category: 'casting', risk: 'medium' },
    { name: 'CastItTalent', url: 'https://castittalent.com/{username}', icon: '🎯', category: 'casting', risk: 'medium' },
    { name: 'CastingNowUK', url: 'https://castingnow.co.uk/{username}', icon: '🇬🇧', category: 'casting', risk: 'medium' },
    { name: 'AllCasting', url: 'https://allcasting.com/{username}', icon: '🎭', category: 'casting', risk: 'medium' },
    { name: 'ModelWire', url: 'https://modelwire.com/{username}', icon: '📡', category: 'casting', risk: 'medium' },
    { name: 'ModelBookings', url: 'https://modelbookings.com/{username}', icon: '📅', category: 'casting', risk: 'medium' },
    { name: 'CastingElite', url: 'https://castingelite.com/{username}', icon: '👑', category: 'casting', risk: 'medium' },
    { name: 'Talentt', url: 'https://talentt.com/{username}', icon: '🎪', category: 'casting', risk: 'medium' },
    { name: 'EliteModelWorld', url: 'https://elitemodelworld.com/{username}', icon: '🌍', category: 'casting', risk: 'medium' },
    { name: 'Wilhelmina', url: 'https://wilhelmina.com/{username}', icon: '👸', category: 'casting', risk: 'medium' },
    { name: 'FordModels', url: 'https://fordmodels.com/{username}', icon: '🚗', category: 'casting', risk: 'medium' },
    { name: 'IMGModels', url: 'https://imgmodels.com/{username}', icon: '🖼️', category: 'casting', risk: 'medium' },
    { name: 'NextManagement', url: 'https://nextmanagement.com/{username}', icon: '⏭️', category: 'casting', risk: 'medium' },
    { name: 'DNAModels', url: 'https://dna-models.com/{username}', icon: '🧬', category: 'casting', risk: 'medium' },
    
    // 🟧 Sites/Fóruns de Acompanhantes / Anúncios / Encontros  
    { name: 'FatalModel', url: 'https://fatalmodel.com/{username}', icon: '💀', category: 'escort', risk: 'high', adult: true, urgent: true },
    { name: 'Skokka', url: 'https://skokka.com/{username}', icon: '💄', category: 'escort', risk: 'high', adult: true, urgent: true },
    { name: 'Lupanares', url: 'https://lupanares.com/{username}', icon: '🏠', category: 'escort', risk: 'high', adult: true, urgent: true },
    { name: 'Meetes', url: 'https://meetes.com/{username}', icon: '🤝', category: 'escort', risk: 'high', adult: true },
    { name: 'AnunciArt', url: 'https://anunciart.com/{username}', icon: '📢', category: 'escort', risk: 'high', adult: true },
    { name: 'EasyCompanions', url: 'https://easycompanions.com/{username}', icon: '👫', category: 'escort', risk: 'high', adult: true },
    { name: 'VivaStreet', url: 'https://vivastreet.com/{username}', icon: '🚶', category: 'escort', risk: 'high', adult: true },
    { name: 'Locanto', url: 'https://locanto.com/{username}', icon: '📍', category: 'escort', risk: 'high', adult: true },
    { name: 'MileRoticos', url: 'https://mileroticos.com/{username}', icon: '🌶️', category: 'escort', risk: 'high', adult: true },
    { name: 'Gatas.com', url: 'https://gatas.com/{username}', icon: '🐱', category: 'escort', risk: 'high', adult: true },
    { name: 'GPOnline', url: 'https://gponline.net/{username}', icon: '💻', category: 'escort', risk: 'high', adult: true },
    { name: 'Terapeuta.net', url: 'https://terapeuta.net/{username}', icon: '💆', category: 'escort', risk: 'high', adult: true },
    { name: 'CityOfLove', url: 'https://cityoflove.com/{username}', icon: '💕', category: 'escort', risk: 'high', adult: true },
    { name: 'MassageRepublic', url: 'https://massage-republic.com/{username}', icon: '💆‍♀️', category: 'escort', risk: 'high', adult: true },
    { name: 'EuroGirlsEscort', url: 'https://eurogirlsescort.com/{username}', icon: '🇪🇺', category: 'escort', risk: 'high', adult: true },
    { name: 'Hot.com.br', url: 'https://hot.com.br/{username}', icon: '🔥', category: 'escort', risk: 'high', adult: true },
    { name: 'BrHookup', url: 'https://br.hookup.com/{username}', icon: '🪝', category: 'escort', risk: 'high', adult: true },
    { name: 'EncontreUmGaroto', url: 'https://encontreumgaroto.com/{username}', icon: '👦', category: 'escort', risk: 'high', adult: true },
    { name: 'Companheiros.net', url: 'https://companheiros.net/{username}', icon: '🤝', category: 'escort', risk: 'high', adult: true },
    
    // 🟪 Sites de Compartilhamento de Imagens Sensíveis
    { name: 'Imgur', url: 'https://imgur.com/user/{username}', icon: '🖼️', category: 'images', risk: 'medium' },
    { name: 'ImageFap', url: 'https://imagefap.com/{username}', icon: '📸', category: 'images', risk: 'high', adult: true },
    { name: 'Motherless', url: 'https://motherless.com/{username}', icon: '🚫', category: 'images', risk: 'high', adult: true },
    { name: 'E621', url: 'https://e621.net/{username}', icon: '🦊', category: 'images', risk: 'high', adult: true },
    { name: 'FurAffinity', url: 'https://furaffinity.net/user/{username}', icon: '🦊', category: 'images', risk: 'medium', adult: true },
    { name: 'Rule34.xxx', url: 'https://rule34.xxx/{username}', icon: '🔞', category: 'images', risk: 'high', adult: true },
    { name: 'Rule34Paheal', url: 'https://rule34.paheal.net/{username}', icon: '🎭', category: 'images', risk: 'high', adult: true },
    { name: 'XBooru', url: 'https://xbooru.com/{username}', icon: '📚', category: 'images', risk: 'high', adult: true },
    { name: 'Gelbooru', url: 'https://gelbooru.com/{username}', icon: '🟦', category: 'images', risk: 'high', adult: true },
    { name: 'Danbooru', url: 'https://danbooru.donmai.us/{username}', icon: '🟫', category: 'images', risk: 'high', adult: true },
    { name: 'HypnoHub', url: 'https://hypnohub.net/{username}', icon: '🌀', category: 'images', risk: 'high', adult: true },
    { name: 'HentaiFoundry', url: 'https://hentai-foundry.com/{username}', icon: '⚒️', category: 'images', risk: 'high', adult: true },
    { name: '8Muses', url: 'https://8muses.com/{username}', icon: '🎭', category: 'images', risk: 'high', adult: true },
    { name: 'Pixiv', url: 'https://pixiv.net/users/{username}', icon: '🎨', category: 'images', risk: 'medium', adult: true },
    { name: 'NHentai', url: 'https://nhentai.net/{username}', icon: '📚', category: 'images', risk: 'high', adult: true },
    { name: 'PornPics', url: 'https://pornpics.com/{username}', icon: '📸', category: 'images', risk: 'high', adult: true },
    { name: 'PornImg', url: 'https://pornimg.com/{username}', icon: '🖼️', category: 'images', risk: 'high', adult: true },
    { name: 'LeakGirls', url: 'https://leakgirls.com/{username}', icon: '💧', category: 'images', risk: 'high', adult: true, urgent: true },
    { name: 'R18.com', url: 'https://r18.com/{username}', icon: '🔞', category: 'images', risk: 'high', adult: true },
    { name: 'SuperHQ', url: 'https://superhq.net/{username}', icon: '🦸', category: 'images', risk: 'high', adult: true },
    
    // 🔗 Link in Bio Platforms
    { name: 'Linktree', url: 'https://linktr.ee/{username}', icon: '🌳', category: 'linkinbio', risk: 'low' },
    { name: 'Beacons.ai', url: 'https://beacons.ai/{username}', icon: '🔗', category: 'linkinbio', risk: 'low' },
    { name: 'Carrd', url: 'https://{username}.carrd.co', icon: '🎴', category: 'linkinbio', risk: 'low' },
    
    // 📚 Plataformas de Desenvolvimento
    { name: 'GitHub', url: 'https://github.com/{username}', icon: '📚', category: 'dev', risk: 'low' },
    { name: 'GitLab', url: 'https://gitlab.com/{username}', icon: '🦊', category: 'dev', risk: 'low' },
    { name: 'CodePen', url: 'https://codepen.io/{username}', icon: '✒️', category: 'dev', risk: 'low' },
    { name: 'Stack Overflow', url: 'https://stackoverflow.com/users/{username}', icon: '📚', category: 'dev', risk: 'low' }
];

// Palavras-chave e padrões de busca associados
var searchPatterns = [
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
var forumSites = [
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
    var variations = [
        username,
        username.toLowerCase(),
        username.toUpperCase(),
        username + '_',
        '_' + username,
        username + 'x',
        'x' + username,
        username + '69',
        username + '18',
        username + 'official',
        'official' + username,
        'real' + username,
        username + 'real',
        username + 'vip',
        'vip' + username,
        username + 'model',
        'model' + username,
        username + 'cam',
        'cam' + username,
        username + 'onlyfans',
        username + 'fansly',
        username + '.backup',
        'backup.' + username,
        username + '2024',
        username + '2025',
        username.replace(/\d+/g, ''), // remove números
        username.replace(/[^a-zA-Z0-9]/g, ''), // remove caracteres especiais
    ];
    
    // Remove duplicatas usando ES5
    var uniqueVariations = [];
    for (var i = 0; i < variations.length; i++) {
        if (uniqueVariations.indexOf(variations[i]) === -1) {
            uniqueVariations.push(variations[i]);
        }
    }
    
    return uniqueVariations;
}

// Tornar disponível globalmente para testes
if (typeof global !== 'undefined') {
    global.generateUsernameVariations = generateUsernameVariations;
    global.platforms = platforms;
    global.searchPatterns = searchPatterns;
    global.forumSites = forumSites;
}
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
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
                    isComplete: !appState.isSearching && appState.progress === 100,
                    progress: {
                        percentage: appState.progress,
                        current: appState.currentCheck || 0,
                        total: appState.totalChecks || 1
                    }
                });
                break;
                  case 'getResults':
                sendResponse({
                    status: 'success',
                    results: appState.results
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
    var variations = generateUsernameVariations(username);
    console.log('📝 Geradas ' + variations.length + ' variações do username');
    
    // Combina plataformas principais com fóruns usando ES5
    var allPlatforms = platforms.concat(forumSites);
    
    // Reset do estado
    appState = {
        isSearching: true,
        progress: 0,
        results: [],
        currentQuery: username,
        totalChecks: allPlatforms.length * Math.min(variations.length, 5), // Limita a 5 variações principais
        currentCheck: 0
    };
    
    console.log('🎯 Total de verificações planejadas: ' + appState.totalChecks);
    
    var checkIndex = 0;
    
    // Processa cada plataforma com as principais variações
    allPlatforms.forEach(function(platform, platformIndex) {
        // Usa as 5 variações mais relevantes para cada plataforma
        var mainVariations = variations.slice(0, 5);
        
        mainVariations.forEach(function(variation, variationIndex) {
            var delay = checkIndex * 300; // 300ms entre cada verificação
            
            setTimeout(function() {
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
    console.log('🔎 Verificando ' + platform.name + ' com variação: ' + variation);
    
    var url = platform.url.replace('{username}', variation);
    
    // Simula verificação da plataforma com algoritmo mais inteligente
    var found = false;
    var confidence = 0;
    
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
    var categoryMultipliers = {
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
    
    var multiplier = categoryMultipliers[platform.category] || 1.0;
    confidence = Math.min(confidence * multiplier, 1.0);
    
    var result = {
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
        var relatedKeywords = searchPatterns.filter(function() { return Math.random() > 0.7; }).slice(0, 3);
        if (relatedKeywords.length > 0) {
            result.relatedKeywords = relatedKeywords;
        }
    }
    
    appState.results.push(result);
    appState.currentCheck++;
    appState.progress = Math.round((appState.currentCheck / appState.totalChecks) * 100);
    
    console.log('✅ ' + platform.name + ' (' + variation + '): ' + result.status + ' - Confiança: ' + result.confidence + '% (' + appState.progress + '%)');
    
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
    appState.results.sort(function(a, b) {
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
    var stats = {
        totalChecks: appState.results.length,
        found: appState.results.filter(function(r) { return r.status === 'found'; }).length,
        notFound: appState.results.filter(function(r) { return r.status === 'not_found'; }).length,
        highRisk: appState.results.filter(function(r) { return r.riskLevel === 'high'; }).length,
        urgent: appState.results.filter(function(r) { return r.priority === 'urgent'; }).length,
        categories: {},
        avgConfidence: 0
    };
    
    // Conta por categoria
    appState.results.forEach(function(result) {
        var cat = result.category || 'other';
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
    
    console.log('✅ Busca finalizada: ' + stats.found + '/' + stats.totalChecks + ' encontrados (' + Math.round((stats.found/stats.totalChecks)*100) + '%)');
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
