
export const getLayoutFixerData = (domId) => {
    try {
        if (typeof window !== 'undefined') {
            const { layoutFixer } = window;
            if (layoutFixer && layoutFixer[domId] && !layoutFixer[domId].mounted) {
                layoutFixer[domId].hydrated = true;
                console.log('[LAYOUT FIXER] used blueprint from layoutFixer', layoutFixer[domId]);
                const { structure, items, container, styles } = layoutFixer[domId];
                return { structure, items, container, styles }
            }
        }
        return {}
    } catch (e) {
        console.log('Failed to get data from the layoutFixer', e);
        return {}
    }
}

export const setLayoutFixerMounted = (domId) => {
    try {
        if (typeof window !== 'undefined') {
            const { layoutFixer } = window;
            if (layoutFixer && layoutFixer[domId] && !layoutFixer[domId].mounted) {
                layoutFixer[domId].mounted = true;
                console.log('[LAYOUT FIXER] mounted', layoutFixer[domId]);
            }
        }
    } catch (e) {
        console.log('Failed to set the layoutFixer to mounted', e);
    }
}