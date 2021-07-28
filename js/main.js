class FootNote extends HTMLElement{
    constructor(){
        super();
    }
    connectedCallback(){
        alert("Yofa");
    }
}

customElements.define('collapsible-footnote', FootNote);
