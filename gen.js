(function () {
    const self = document.currentScript;
    // const url = new URL('http://localhost:7071');
    const url = new URL('https://iguanagothere.azurewebsites.net');
    const gentxt = async () => {
        url.pathname = '/api/openai_text_completion';
        url.searchParams.set('prompt', self.dataset.prompt);
        const data = fetch(url).then(res => res.json()).then(x => x.result);
        if (self.dataset.callback) {
            window[self.dataset.callback](await data);
        } else if (self.dataset.target) {
            document.querySelector(self.dataset.target).innerText = await data;
        } else {
            const txt = document.createElement('p');
            txt.innerText = self.dataset.loading || '...';
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
        } else if (self.dataset.target) {
            document.querySelector(self.dataset.target).setAttribute('src', await data);
        } else {
            const img = document.createElement('img');
            img.width = size;
            img.src = self.dataset.loading || '';
            self.after(img);
            img.src = await data;
        }
    };

    // Look for mandatory attributes.
    if (!self.dataset.prompt) throw new Error(`Missing "data-prompt" attribute.`);

    // Determine the function to call based on the type requested.
    const type = self.dataset.type;
    const generr = () => { throw new Error(`Unknown dataset type: "${type}".`) };
    ({ 'txt': gentxt, 'img': genimg }[type] || generr)();
    document.currentScript.remove();
})();