/*
 *  FundraisingBar.js
 *   - Custom element to provide display of fundraising progress
 *   - After inclusion in the head
 *       <script src="fundraisingBar.js"></script>
 *   within the body use
 *    <fundraising-bar currentAmount="" goal="" time="" primaryColor="" secondaryColor=""></fundraising-bar>
 *
 *  Attributes:
 *   currentAmount="120.45" (required)
 *   goal="500" (required)
 *   time="4" (optional) - time in seconds - default is 4 seconds
 *   primaryColor="#000000" (optional)
 *   secondaryColor="#ffffff" (optional)
 *
 */

class FundraisingBar extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement("template");
    template.setAttribute("id", "fundraisingBarTemplate");
    template.innerHTML = `
        <style>
            #fundraising-wrapper {
              font-family: Arial;
              width: 600px;
              margin: 40px auto;
              display: flex;
              flex-direction: column;
              justify-content: center;
            }
  
            #fundraising-wrapper > .slider {
              height: 40px;
              width: 500px;
              margin: 20px auto;
              background-color: rgba(145, 145, 145, 0.2);
              border-radius: 20px;
              overflow: hidden;
            }
  
            #fundraising-wrapper > .slider > .fill {
              position: relative;
              top: 0;
              left: 0;
              height: 100%;
              width: 0%;
              background-color: rgba(0, 0, 139, 1);
                overflow:hidden;
                -webkit-transition: width 4s cubic-bezier(0, 0, 0.58, 1);
                -moz-transition: width 4s cubic-bezier(0, 0, 0.58, 1);
                -o-transition: width 4s cubic-bezier(0, 0, 0.58, 1);
                transition: width 4s cubic-bezier(0, 0, 0.58, 1);
            }
  
            #fundraising-wrapper > .amount-donated {
              color: rgba(0, 0, 139, 1);
              position: relative;
              font-size: 2rem;
              margin: 0 auto;
            }
  
            #fundraising-wrapper > .amount-donated > span {
              color: rgba(145, 145, 145, 0.7);
              font-size: 1.4rem;
            }
        </style>
        <div id="fundraising-wrapper">
          <div class="slider">
            <div class="fill"></div>
          </div>
          <p class="amount-donated"><span></span></p>
        </div>
        `;

    let templateContent = template.content;
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(templateContent.cloneNode(true));
  }

  static get observedAttributes() {
    return ["currentAmount", "goal", "time", "primaryColor", "secondaryColor"];
  }

  attributeChangedCallback(property, oldValue, newValue) {
    if (oldValue === newValue) return;
    this[property] = newValue;
  }

  connectedCallback() {
    if (!this.getAttribute("currentAmount") || !this.getAttribute("goal")) {
      console.error(
        "FUNDRAISING BAR: Missing required attributes. (currentAmount, goal)"
      );
      return;
    }
    const currentValue = this.getAttribute("currentAmount") || 0;
    const goalValue = this.getAttribute("goal") || 100;
    const time = this.getAttribute("time") || 4;

    /* Set the variables to dom parts */
    const component = this.shadowRoot;
    const fill = component.querySelector(".fill");
    const currentValueDisplay = component.querySelector(".amount-donated");

    function hexToRgba(hex, alpha) {
      // Remove the # if present
      hex = hex.replace("#", "");

      // Check if it's a shorthand hex value (e.g., #f00)
      if (hex.length === 3) {
        hex = hex
          .split("")
          .map((char) => char + char)
          .join("");
      }

      // Parse the hex values into decimal
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);

      //return { r, g, b, a: alpha };
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    /* Set colors */
    if (this.getAttribute("primaryColor")) {
      fill.style.backgroundColor = this.getAttribute("primaryColor");
      component.querySelector(".amount-donated").style.color =
        this.getAttribute("primaryColor");
    }

    if (this.getAttribute("secondaryColor")) {
      component.querySelector(".slider").style.color = hexToRgba(
        this.getAttribute("secondaryColor"),
        0.2
      );
      component.querySelector(".amount-donated > span").style.color = hexToRgba(
        this.getAttribute("secondaryColor"),
        0.7
      );
    }

    if (time !== 4) {
      fill.style.transition = `width ${time}s cubic-bezier(0, 0, 0.58, 1)`;
    }

    const maxSlider = (currentValue / goalValue) * 100;

    let i = 0;
    const animationTime = time * 1000; //in ms

    function formatNumber(num) {
      return num.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }

    function animate(totalTime) {
      const startTime = Date.now();
      const interval = 10; // move every 10 ms

      const progressTimer = setInterval(() => {
        const currentTime = Date.now();
        const elapsedTime = currentTime - startTime;

        // Calculate percentage complete
        const percentComplete = Math.min(
          Math.round((elapsedTime / totalTime) * 100),
          100
        );

        const currentDisplayValue = currentValue * (percentComplete / 100);
        const formattedValueDisplay = `$${formatNumber(
          currentDisplayValue
        )} of <span>$${formatNumber(goalValue)} goal</span>`;
        currentValueDisplay.innerHTML = formattedValueDisplay;

        // Stop when complete
        if (elapsedTime >= totalTime) {
          clearInterval(progressTimer);
        }
      }, interval);

      // Optional: Return the interval timer in case you want to cancel it manually
      return progressTimer;
    }

    window.addEventListener("load", function () {
      animate(animationTime);
      fill.style.width = maxSlider + "%";
    });
  }
}

customElements.define("fundraising-bar", FundraisingBar);