(function () {
    const self = document.currentScript;
    const gentxt = async () => {
        const txt = document.createElement('p');
        txt.innerText = 'Loading...';
        self.after(txt);

        const prompt = self.dataset['prompt'];
        const url = new URL('https://iguanagothere.azurewebsites.net/api/opeanai_text_completion');
        url.searchParams.set('prompt', prompt);
        const data = await fetch(url).then(res => res.json());
        txt.innerText = data.result;
    };

    const genimg = () => {
        // TODO.
    };

    const type = self.dataset['type'];
    const generr = () => { throw new Error(`Unknown dataset type: "${type}".`) };
    ({ 'txt': gentxt, 'img': genimg }[type] || generr)();
})();