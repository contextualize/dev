(function () {
    const self = document.currentScript;
    // const url = new URL('https://iguanagothere.azurewebsites.net');
    const url = new URL('http://localhost:7071');
    const gentxt = async () => {
        url.pathname = '/api/openai_text_completion';
        url.searchParams.set('prompt', self.dataset['prompt']);
        const data = fetch(url).then(res => res.json()).then(x => x.result);
        if (self.dataset.callback) {
            window[self.dataset.callback](await data);
        } else {
            const txt = document.createElement('p');
            txt.innerText = self.dataset.loading || 'Loading...';
            self.after(txt);
            txt.innerText = await data;
        }
    };

    const genimg = async () => {
        const size = parseInt(self.dataset.size) || 256;
        url.pathname = '/api/openai_image_generation';
        url.searchParams.set('size', size);
        url.searchParams.set('prompt', self.dataset.prompt);
        const data = fetch(url).then(res => res.json()).then(x => x.result);
        if (self.dataset.callback) {
            window[self.dataset.callback](await data);
        } else {
            const img = document.createElement('img');
            img.width = size;
            img.src = self.dataset.loading || '';
            self.after(img);
            img.src = await data;
        }
    };

    const type = self.dataset['type'];
    const generr = () => { throw new Error(`Unknown dataset type: "${type}".`) };
    ({ 'txt': gentxt, 'img': genimg }[type] || generr)();
})();