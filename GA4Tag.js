/*
*  GA4Tag.js
*   - Custom element to install Google Analytics 4 (GA4) on a web page
*   - After inclusion in the head 
*       <script src="GA4Tag.js"></script>
*   within the body use  
*    <ga-tag propertyid="G-XXXXXXXXXX"></ga-tag>
*/

class GA4Tag extends HTMLElement {
    constructor() {
        super();
        this.propertyid = "G-XXXXXXXXXX";
    }

    connectedCallback() {
        if (
          this.propertyid === "G-XXXXXXXXXX" ||
          !this.isValidGAId(this.propertyid)
        ) {
            console.error("GA4Tag --> No valid GA4 property Id was provided.  Received: propertyId =", this.propertyid);
            return;
        }

        this.installGA4();
    }

    static get observedAttributes() {
        return ["propertyid"];
    }
        
    attributeChangedCallback(property, oldValue, newValue) {
        if (oldValue === newValue) return;
        this[property] = newValue;
    }

    /* Install GA4 */
    installGA4() {
        this.createLocalScript(`window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${this.propertyid}');`);
        
        this.createExternalScript(
          `https://www.googletagmanager.com/gtag/js?id=${this.propertyid}`
        );
    }

    /* Functions to insert scripts in head of doc */
    createExternalScript(src) {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = src;
        script.setAttribute("async", "");

        document.head.insertBefore(script, document.head.firstChild);
    }

    createLocalScript(scriptText) {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.innerHTML = scriptText;

        document.head.insertBefore(script, document.head.firstChild);
    }

    /* Validate GA4 Id with regex */
    isValidGAId(str) {
        let regex = new RegExp(/^G-[a-zA-Z0-9]+$/);
    
        return (str == null) ? null : regex.test(str);
    }
}


customElements.define( 'ga-tag', GA4Tag );
