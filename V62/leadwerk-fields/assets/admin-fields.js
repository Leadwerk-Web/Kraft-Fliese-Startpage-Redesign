document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-leadwerk-tab]').forEach((tab) => {
        tab.addEventListener('click', () => {
            const app = tab.closest('.leadwerk-fields-app');
            app?.querySelectorAll('[data-leadwerk-tab], [data-leadwerk-panel]').forEach((node) => node.classList.remove('is-active'));
            tab.classList.add('is-active');
            app?.querySelector(`[data-leadwerk-panel="${tab.dataset.leadwerkTab}"]`)?.classList.add('is-active');
        });
    });

    document.addEventListener('click', (event) => {
        const select = event.target.closest('.leadwerk-media-select');
        const remove = event.target.closest('.leadwerk-media-remove');
        if (select) {
            event.preventDefault();
            const field = select.closest('.leadwerk-media-field');
            const frame = wp.media({ title: 'Bild wählen', library: { type: 'image' }, multiple: false });
            frame.on('select', () => {
                const image = frame.state().get('selection').first().toJSON();
                field.querySelector('.leadwerk-media-id').value = image.id;
                field.querySelector('.leadwerk-media-preview').innerHTML = `<img src="${image.sizes?.medium?.url || image.url}" alt="">`;
            });
            frame.open();
        }
        if (remove) {
            event.preventDefault();
            const field = remove.closest('.leadwerk-media-field');
            field.querySelector('.leadwerk-media-id').value = '0';
            field.querySelector('.leadwerk-media-preview').innerHTML = '<span>Kein Bild gewählt</span>';
        }
    });
});
