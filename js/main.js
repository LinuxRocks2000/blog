class FootNote extends HTMLElement{
    constructor(){
        super();
        this.superscript = document.createElement("sup");
        this.data = document.createElement("div");
        this.superscript.onclick = () => {
            this.supClicked();
        };
        this.superscript.classList.add("citationSup");
        this.data.style.display = "none";
        this.data.style.position = "absolute";
        this.data.style.backgroundColor = "wheat";
        this.data.style.padding = "5px";
        this.data.style.maxWidth = "200px";
        this.data.style.fontSize = "0.75em";
        this.data.innerHTML = this.innerHTML;
        this.innerText = "";
        this.appendChild(this.data);
        this.appendChild(this.superscript);
    }
    static get observedAttributes(){
        return ["citationname"];
    }
    attributeChangedCallback(attr, oldval, val){
        switch(attr){
            case "citationname":
                this.citationName = val;
                this.superscript.innerHTML = val;
            break;
        }
    }
    /*set citationname(data){
        alert(data);
    }*/
    supClicked(){
        var rect = this.superscript.getBoundingClientRect();
        this.data.style.top = rect.y + rect.height + document.documentElement.scrollPosition + "px";
        this.data.style.left = rect.x + rect.width + "px";
        if (this.data.style.display == "block"){
            this.data.style.display = "none";
        }
        else{
            this.data.style.display = "block";
        }
    }
    connectedCallback(){
        console.log(this);
    }
}

customElements.define('collapsible-footnote', FootNote);
