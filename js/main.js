class FootNote extends HTMLElement{
    constructor(){
        super();
        this.attachShadow();
        var super = document.createElement("sup");
        this.appendChild(super);
    }
    connectedCallback(){
        console.log(this);
    }
}

customElements.define('collapsible-footnote', FootNote);
