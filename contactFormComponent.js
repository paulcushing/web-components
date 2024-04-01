/*
*  ContactFormComponent.js
*   - Custom element to provide contact form dialog
*   - After inclusion in the head 
*       <script src="contactFormComponent.js"></script>
*   within the body use  
*    <contact-form></contact-form>
*
*  Attributes:
*   apiUrl="https://your-api-url" (required)
*   buttonStyle="button" or "link" (optional)
*   buttonColor="#000000" (optional) - applies to background if button, or text if link
*   buttonText="Contact" (optional)
*   dialogTitle="Contact" (optional)
*
*/

class ContactForm extends HTMLElement {
    constructor() {
        super();

        const template = document.createElement("template");
        template.setAttribute("id", "contactFormTemplate");
        template.innerHTML = `
        <style>
            :host {
                --cf-border-spacing-x: 0;
                --cf-border-spacing-y: 0;
                --cf-translate-x: 0;
                --cf-translate-y: 0;
                --cf-rotate: 0;
                --cf-skew-x: 0;
                --cf-skew-y: 0;
                --cf-scale-x: 1;
                --cf-scale-y: 1;
                --cf-scroll-snap-strictness: proximity;
                --cf-ring-offset-width: 0px;
                --cf-ring-offset-color: #fff;
                --cf-ring-color: rgb(59 130 246 / 0.5);
                --cf-ring-offset-shadow: 0 0 #0000;
                --cf-ring-shadow: 0 0 #0000;
                --cf-shadow: 0 0 #0000;
                --cf-shadow-colored: 0 0 #0000;
                --cf-ring-offset-shadow: 0 0 #0000;
                --cf-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
                --cf-shadow-colored: 0 1px 3px 0 var(--cf-shadow-color), 0 1px 2px -1px #000000;
                --cf-font-family: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
            }

            .triggerButton {
                -webkit-tap-highlight-color: transparent;
                box-sizing: border-box;
                border-width: 0;
                border-style: solid;
                border-color: #e5e7eb;
                font-family: inherit;
                font-size: 100%;
                -webkit-appearance: button;
                cursor: pointer;
                border-radius: 0.5rem;
                background-color: rgb(3 105 161 / 1);
                padding-left: 2rem;
                padding-right: 2rem;
                padding-top: 0.5rem;
                padding-bottom: 0.5rem;
                color: #ffffff;
            }

            .triggerLink {
                -webkit-tap-highlight-color: transparent;
                box-sizing: border-box;
                -webkit-appearance: button;
                font-family: inherit;
                font-size: 100%;
                cursor: pointer;
                padding-left: 2rem;
                padding-right: 2rem;
                padding-top: 0.5rem;
                padding-bottom: 0.5rem;
                border: none;
                background: none;
                color: rgb(3 105 161 / 1);
            }

            .triggerLink:hover {
                text-decoration: underline;
            }

            h1 {
                -webkit-tap-highlight-color: transparent;
                color: #000000;
                box-sizing: border-box;
                border-width: 0;
                border-style: solid;
                border-color: #e5e7eb;
                margin: 0;
                margin-bottom: 2rem;
                text-align: center;
                font-size: 1.5rem;
                line-height: 2rem;
                font-weight: 700;
            }

            #loaderWrapper {
                -webkit-tap-highlight-color: transparent;
                line-height: inherit;
                box-sizing: border-box;
                border-width: 0;
                border-style: solid;
                border-color: #e5e7eb;
                width: 24rem;
            }

            .input {
                -webkit-tap-highlight-color: transparent;
                box-sizing: border-box;
                border-style: solid;
                font-size: 100%;
                color: #000000;
                margin: 0;
                margin-bottom: 1.5rem;
                width: 100%;
                border-radius: 0.5rem;
                border-width: 1px;
                border-color: rgb(203 213 225 / 1);
                padding: 0.8rem;
                background-color: #ffffff;
            }

            .inputarea {
                -webkit-tap-highlight-color: transparent;
                box-sizing: border-box;
                border-style: solid;
                font-size: 100%;
                font-family: inherit;
                color: #000000;
                margin: 0;
                resize: vertical;
                margin-bottom: 1.5rem;
                width: 100%;
                border-radius: 0.5rem;
                border-width: 1px;
                border-color: rgb(203 213 225 / 1);
                padding: 0.5rem;
                background-color: #ffffff;
            }

            #submit {
                -webkit-tap-highlight-color: transparent;
                box-sizing: border-box;
                border-width: 0;
                border-style: solid;
                border-color: #e5e7eb;
                font-size: 100%;
                margin: 0;
                text-transform: none;
                cursor: pointer;
                -webkit-appearance: button;
                background-image: none;
                border-radius: 0.5rem;
                background-color: rgba(3, 105, 161, 0.8);
                padding-left: 2rem;
                padding-right: 2rem;
                padding-top: 0.5rem;
                padding-bottom: 0.5rem;
                color: rgb(255 255 255 / 1);
                box-shadow: var(--cf-ring-offset-shadow, 0 0 #0000), var(--cf-ring-shadow, 0 0 #0000), var(--cf-shadow);
            }

            #submit:disabled {
                -webkit-tap-highlight-color: transparent;
                box-sizing: border-box;
                border-width: 0;
                border-style: solid;
                border-color: #e5e7eb;
                font-family: inherit;
                font-size: 100%;
                margin: 0;
                text-transform: none;
                -webkit-appearance: button;
                background-image: none;
                cursor: default;
                border-radius: 0.5rem;
                padding-left: 2rem;
                padding-right: 2rem;
                padding-top: 0.5rem;
                padding-bottom: 0.5rem;
                color: rgb(255 255 255 / 1);
                background-color: rgba(203, 213, 225, 0.8);
                box-shadow: var(--cf-ring-offset-shadow, 0 0 #0000), var(--cf-ring-shadow, 0 0 #0000), var(--cf-shadow);
            }

            #submit:hover:enabled {
                background-color: rgba(3, 105, 161, 1.0);
                box-shadow: var(--cf-ring-offset-shadow, 0 0 #0000), var(--cf-ring-shadow, 0 0 #0000), var(--cf-shadow);
            }

            #closeDialog {
                font-feature-settings: normal;
                font-variation-settings: normal;
                -webkit-tap-highlight-color: transparent;
                line-height: inherit;
                box-sizing: border-box;
                border-style: solid;
                margin-left: 1rem;
                cursor: pointer;
                border-radius: 0.5rem;
                border-width: 1px;
                border-color: rgb(203 213 225 / 1);
                background-color: rgb(255 255 255 / 1);
                padding-left: 2rem;
                padding-right: 2rem;
                padding-top: 0.5rem;
                padding-bottom: 0.5rem;
                color: rgb(100 116 139 / 1);
                box-shadow: var(--cf-ring-offset-shadow, 0 0 #0000), var(--cf-ring-shadow, 0 0 #0000), var(--cf-shadow);
            }

            #closeDialog:hover {
                background-color: rgb(203 213 225 / 0.5);
                box-shadow: var(--cf-ring-offset-shadow, 0 0 #0000), var(--cf-ring-shadow, 0 0 #0000), var(--cf-shadow);
            }

            #confirm p {
                text-align: center;
                color: #000000;
            }

            .loader {
                margin: 60px auto;
                width: 40px;
                height: 30px;
                --c:no-repeat linear-gradient(#000 0 0);
                background:
                    var(--c) 0    100%/8px 30px,
                    var(--c) 50%  100%/8px 20px,
                    var(--c) 100% 100%/8px 10px;
                position: relative;
                clip-path: inset(-100% 0);
            }

            .loader:before {
                content: "";
                position: absolute;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: #000;
                left: -16px;
                top: 0;
                animation: 
                    l5-1 2s   linear infinite,
                    l5-2 0.5s cubic-bezier(0,200,.8,200) infinite;
            }

            @keyframes l5-1 {
                0%   {left:-16px;transform:translateY(-8px)}
                100% {left:calc(100% + 8px);transform:translateY(22px)}
            }
            @keyframes l5-2 {
                100% {top:-0.1px}
            }
    
            #contactDialog {
                font-family: var(--cf-font-family);
                -webkit-tap-highlight-color: transparent;
                line-height: inherit;
                box-sizing: border-box;
                border-width: 0;
                border-style: solid;
                border-color: #e5e7eb;
                border-radius: 0.5rem;
                background-color: rgb(255 255 255 / 1);
                padding: 1rem;
                padding-left: 2rem;
                padding-right: 2rem;
                margin-top: 2rem;
                box-shadow: var(--cf-ring-offset-shadow, 0 0 #0000), var(--cf-ring-shadow, 0 0 #0000), var(--cf-shadow);
            }

            #contactDialog[open] {
                -webkit-animation: show 0.7s ease;
            }

            #contactDialog[open].hide {
                -webkit-animation: hide 0.7s ease;
            }

            #contactDialog[open]::backdrop {
                -webkit-animation: show-bd 0.7s ease;
            }

            #contactDialog[open].hide::backdrop {
                -webkit-animation: hide-bd 0.7s ease;
            }
              
              @-webkit-keyframes show {
                0% {
                    opacity: 0;
                    transform: translateY(-100vh);
                }
                80% {
                    opacity: 1;
                    transform: translateY(0%);
                }
                100% {
                    opacity: 1;
                    transform: translateY(0%);
                }
              }
              
              @-webkit-keyframes hide {
                0% {
                    opacity: 1;
                    transform: translateY(0%);
                }
                20% {
                    opacity: 1;
                    transform: translateY(0%);
                }
                100% {
                    opacity: 0;
                    transform: translateY(-100vh);
                }
              }

              @-webkit-keyframes show-bd {
                0% {
                    opacity: 0;
                }
                80% {
                    opacity: 1;
                }
                100% {
                    opacity: 1;
                }
              }
              
              @-webkit-keyframes hide-bd {
                0% {
                    opacity: 1;
                }
                100% {
                    opacity: 0;
                }
              }


            .hidden {
                display: none;
            }

            .w-full {
                width: 100%;
            }
        </style>
        <button id="showContactForm" class="triggerButton">Contact</button>
        <dialog id="contactDialog">
            <h1 id="title">Contact</h1>
            <div id="loaderWrapper">
                <div class="loader hidden"></div>
            </div>
            <form class="w-full">
                <input type="text" name="name" class="input" placeholder="Name" autocomplete />
                <input type="email" name="email" class="input" placeholder="Email" autocomplete />
                <textarea name="message" class="inputarea" placeholder="Message"></textarea>
                <button type="submit" id="submit" disabled>Send</button>
                <buttton id="closeDialog">Cancel</buttton>
            </form>
            <div id="confirm" class="hidden">
                <p>Got it. I'll reply as soon as I can. Thanks!</p>
            </div>
        </dialog>
        `;

        let templateContent = template.content;
        const shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.appendChild(templateContent.cloneNode(true));
    }

    static get observedAttributes() {
        return ["apiUrl", "buttonStyle", "buttonText", "dialogTitle", "buttonColor", "token"];
    }
        
    attributeChangedCallback(property, oldValue, newValue) {
        if (oldValue === newValue) return;
        this[property] = newValue;
    }

    connectedCallback() {
        /* Check for required apiUrl */
        if (!this.getAttribute('apiUrl')) {
            console.error("CONTACT FORM: API URL not provided. Please include the url using 'apiUrl=\"https://your-api-url\"' in the contact-form tag.");
            return;
        }
        const apiUrl = this.getAttribute('apiUrl');

        /* Set the variables to dom parts */
        const component = this.shadowRoot;
        const triggerDialogButton = component.querySelector('#showContactForm');
        const contactDialog = component.querySelector('#contactDialog')
        const form = component.querySelector('form');
        const inputs = form.querySelectorAll('input, textarea');
        const submitButton = form.querySelector('#submit');
        const closeButton = component.querySelector('#closeDialog');

        const loader = component.querySelector('.loader');
        const confirm = component.querySelector('#confirm');
        
        /* Set the button style */
        if (this.getAttribute('buttonStyle')) {
            if (this.getAttribute('buttonStyle') === 'link') {
                triggerDialogButton.classList.remove('triggerButton');
                triggerDialogButton.classList.add('triggerLink');
            } else if (this.getAttribute('buttonStyle') !== 'button') {
                console.warn('CONTACT FORM: Invalid button style. Options are "button" or "link".');
            }
            // else leave it default (button style)
        }

        /* Set the button color */
        if (this.getAttribute('buttonColor')) {
            if (this.getAttribute('buttonStyle') === 'link') {
                triggerDialogButton.style.color = this.getAttribute('buttonColor');
            } else {
                triggerDialogButton.style.backgroundColor = this.getAttribute('buttonColor');
            }
        }

        if (this.getAttribute('buttonText')) {
            triggerDialogButton.textContent = this.getAttribute('buttonText');
        }

        if (this.getAttribute('dialogTitle')) {
            component.querySelector('#title').textContent = this.getAttribute('dialogTitle');
        }

        this.dialogTitle = this.getAttribute('dialogTitle');

        const token = this.getAttribute('token') || '';

        /* Listen for click on the button */
        triggerDialogButton.addEventListener('click', function() {
            contactDialog.showModal();
        });
        
        function animateHide() {
            contactDialog.classList.add('hide');
            contactDialog.addEventListener('webkitAnimationEnd', function removeIt() {
                contactDialog.classList.remove('hide');
                contactDialog.close();
                form.reset();
                contactDialog.removeEventListener('webkitAnimationEnd', removeIt, false);
            }, false);
        }
        
        closeButton.addEventListener('click', animateHide, false);   

        inputs.forEach(input => {
            input.addEventListener('input', function() {
                const isFormValid = Array.from(inputs).every(input => input.value);
                submitButton.disabled = !isFormValid;
            });
        });
    
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            submitForm();
        });

        function submitForm() {
            const data = {};
            let errors = [];

            inputs.forEach(input => {
                data[input.name] = input.value;
            });
            
            data.site = window.location.href;

            form.classList.add('hidden');
            loader.classList.remove('hidden');

            if (data.name === '') {
                errors.name = 'CONTACT FORM: Missing name.';
            } else {
                delete errors.name;
            }
            if (data.email === '' || !data.email.includes('@')) {
                errors.email = 'CONTACT FORM: Missing email address.';
            } else {
                delete errors.email;
            }
            if (data.message === '') {
                errors.message = 'CONTACT FORM: Missing message.';
            } else {
                delete errors.message;
            }

            // Submit to the API
            if (!errors.length > 0) {
                fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(data),
                }).then(response => {
                    if (response.ok) {
                        console.log('Message sent');
                        loader.classList.add('hidden');
                        confirm.classList.remove('hidden');
                        setTimeout(() => {
                            animateHide();
                            setTimeout(() => {
                                form.reset();
                                confirm.classList.add('hidden');
                                form.classList.remove('hidden');
                            }, 500);                            
                        }, 3000);
                    } else {
                        console.error('Error sending message');
                    }
                }).catch(error => {
                    console.error('Error sending message', error);
                });
            } else {
                console.error('Errors in form submission', errors);
            }
        }
    }
}


customElements.define( 'contact-form', ContactForm );