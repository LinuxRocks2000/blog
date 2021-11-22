class FootNote extends HTMLElement{
    constructor(){
        super();
        this.attachShadow({mode:"open"});
        var superscript = document.createElement("sup");
        superscript.innerHTML = "[citation]";
        this.shadowRoot.appendChild(superscript);
    }
    connectedCallback(){
        console.log(this);
    }
}

customElements.define('collapsible-footnote', FootNote);
