
export const getLayoutFixerData = (domId) => {
    try {
        if (typeof window !== 'undefined') {
            const { layoutFixer } = window;
            if (layoutFixer && layoutFixer[domId] && !layoutFixer[domId].hydrated) {
                layoutFixer[domId].hydrated = true;
                console.log('[LAYOUT FIXER] used structure and container from layoutFixer', layoutFixer[domId]);
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