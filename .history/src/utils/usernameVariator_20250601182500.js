/**
 * Username Variator - Gerador de variações de username
 * @version 3.0.0
 */

export class UsernameVariator {
    /**
     * Gerar variações do username
     */
    generateVariations(username) {
        const variations = new Set();
        
        // Adicionar username original
        variations.add(username);
        
        // Variações básicas
        this._addBasicVariations(username, variations);
        
        // Variações numéricas
        this._addNumericVariations(username, variations);
        
        // Variações de plataforma específicas
        this._addPlatformSpecificVariations(username, variations);
        
        // Variações de contexto adulto
        this._addAdultContextVariations(username, variations);
        
        // Variações de limpeza
        this._addCleanVariations(username, variations);
        
        // Converter para array e ordenar por relevância
        return this._sortByRelevance([...variations], username);
    }    /**
     * Variações básicas
     */
    _addBasicVariations(username, variations) {
        variations.add(username.toLowerCase());
        variations.add(username.toUpperCase());
        variations.add(`${username}_`);
        variations.add(`_${username}`);
        variations.add(`${username}x`);
        variations.add(`x${username}`);
        variations.add(`real${username}`);
        variations.add(`${username}real`);
        variations.add(`official${username}`);
        variations.add(`${username}official`);
        variations.add(`${username}.oficial`);
        variations.add(`${username}.official`);
        variations.add(`${username}.real`);
        variations.add(`${username}.vip`);
        variations.add(`${username}_oficial`);
        variations.add(`${username}_official`);
        variations.add(`${username}_real`);
        variations.add(`${username}_vip`);
        variations.add(`${username}-`);
        variations.add(`-${username}`);
    }    /**
     * Variações numéricas
     */
    _addNumericVariations(username, variations) {
        // Números comuns globais
        const commonNumbers = ['69', '18', '21', '2024', '2025', '01', '1'];
        
        // Números específicos para Brasil
        const brNumbers = ['10', '11', '015', '021', '027', '031', '41', '43', '47', '51', '55', '61', '71', '81', '85', '91', '11'];
        
        // Datas comuns
        const dateNumbers = ['1990', '1991', '1992', '1993', '1994', '1995', '1996', '1997', '1998', '1999', '2000'];
        
        // Anos recentes
        const recentYears = ['20', '21', '22', '23', '24', '25', '2020', '2021', '2022', '2023', '2024', '2025'];
        
        [...commonNumbers, ...brNumbers, ...dateNumbers, ...recentYears].forEach(num => {
            variations.add(`${username}${num}`);
            variations.add(`${num}${username}`);
        });
        
        // Remover números existentes
        const withoutNumbers = username.replace(/\d+/g, '');
        if (withoutNumbers !== username) {
            variations.add(withoutNumbers);
        }
    }    /**
     * Variações específicas de plataforma
     */
    _addPlatformSpecificVariations(username, variations) {
        // Sufixos de plataformas
        const platformSuffixes = [
            // Cam/Adult
            'onlyfans', 'of', 'fansly', 'cam', 'chaturbate', 'cb', 'priv', 'privacy',
            'privado', 'privada', 'privé', 'model', 'vip', 'premium', 'exclusive', 
            'private', 'content', 'quarentena', 'hot', 'topcontent', 'top',
            
            // Profissional/Oficial
            'oficial', 'official', 'real', 'verificado', 'verified', 'media',
            'assessoria', 'work', 'job', 'pro', 'business', 'contato', 'contact',
            'management', 'casting', 'agency', 'team', 'press', 'global', 'br',
            
            // Backup/Alternativas
            'backup', 'alt', '2', 'reserva', 'extra', 'new', 'novo', 'nova',
            'atual', 'perfil2', 'conta2', 'second', 'alternative', 'outro',
            'outra', 'fechado', 'fechada', 'aberto', 'aberta', 'temporario',
            'temporaria', 'temp', 'main', 'principal', 'store', 'loja',
            
            // Plataformas específicas
            'insta', 'instagram', 'ig', 'fb', 'face', 'tt', 'tweet', 'tiktok', 'tk',
            'yt', 'snap', 'sc', 'snpchat', 'twitch', 'live', 'discord', 'reddit',
        ];
        
        platformSuffixes.forEach(suffix => {
            variations.add(`${username}${suffix}`);
            variations.add(`${username}_${suffix}`);
            variations.add(`${suffix}${username}`);
            variations.add(`${suffix}_${username}`);
        });
    }

    /**
     * Variações de contexto adulto
     */
    _addAdultContextVariations(username, variations) {
        const adultSuffixes = [
            'babe', 'baby', 'girl', 'boy', 'hot', 'sexy',
            'angel', 'goddess', 'princess', 'queen', 'king'
        ];
        
        adultSuffixes.forEach(suffix => {
            variations.add(`${username}${suffix}`);
            variations.add(`${suffix}${username}`);
        });
    }

    /**
     * Variações de limpeza
     */
    _addCleanVariations(username, variations) {
        // Remover caracteres especiais
        const cleaned = username.replace(/[^a-zA-Z0-9]/g, '');
        if (cleaned !== username) {
            variations.add(cleaned);
        }
        
        // Variações com pontos e traços
        variations.add(username.replace(/[_-]/g, '.'));
        variations.add(username.replace(/[._]/g, '-'));
        variations.add(username.replace(/[.-]/g, '_'));
    }

    /**
     * Ordenar por relevância
     */
    _sortByRelevance(variations, original) {
        return variations.sort((a, b) => {
            // Username original sempre primeiro
            if (a === original) return -1;
            if (b === original) return 1;
            
            // Variações que contêm o original
            const aContains = a.includes(original);
            const bContains = b.includes(original);
            
            if (aContains && !bContains) return -1;
            if (!aContains && bContains) return 1;
            
            // Por tamanho (mais próximo do original)
            const aSize = Math.abs(a.length - original.length);
            const bSize = Math.abs(b.length - original.length);
            
            if (aSize !== bSize) return aSize - bSize;
            
            // Alfabética como último critério
            return a.localeCompare(b);
        });
    }
}
