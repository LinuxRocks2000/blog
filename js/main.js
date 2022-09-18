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

var timewalls = [];
Array.from(document.getElementsByClassName("timerwall")).forEach((item, i) => {
    timewalls.push({
        el: item,
        timeleft: item.getAttribute("data-time") || 30,
        started: false
    });
});

function getAnchor(el){
    var node = el;
    var pos = 0;
    while (node){
        if (node.offsetTop){
            pos += node.offsetTop;
        }
        node = node.parentNode;
    }
    return pos;
}

window.addEventListener("scroll", function() {
    timewalls.forEach((item, i) => {
        if (!item.done){
            if (item.el.getBoundingClientRect().top < 0){
                if (!item.started){
                    item.started = true;
                    var doTickDown = () => {
                        if (item.timeleft == 0){
                            item.done = true;
                            item.el.style.height = "0px";
                            return;
                        }
                        item.timeleft --;
                        item.el.innerText = "You have " + item.timeleft + " seconds before you can view what lies below.";
                        setTimeout(doTickDown, 1000);
                    };
                    doTickDown();
                }
                window.scrollTo({
                    left: 0,
                    top: getAnchor(item.el)
                });
                window.scrollBy({
                    left: 0,
                    top: item.el.getBoundingClientRect().top - (window.innerHeight * 2/3),
                    behavior: "smooth"
                });
            }
        }
    });
});
