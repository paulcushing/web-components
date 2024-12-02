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
            display: flex;
            flex-direction: column;
            justify-content: center;
            margin: 20px;
          }

          #fundraising-wrapper > .slider {
            height: 40px;
            width: 100%;
            margin-bottom: 5px;
            background-color: rgba(145, 145, 145, 0.2);
            border-radius: 20px;
            overflow: hidden;
            text-align: left;
          }

          #fundraising-wrapper > .slider > .fill {
            position: relative;
            top: 0;
            left: 0;
            height: 100%;
            width: 0%;
            background-color: rgba(0, 0, 139, 1);
              overflow:hidden;
              -webkit-transition: width 4s cubic-bezier(.42,.98,.63,.98);
              -moz-transition: width 4s cubic-bezier(.42,.98,.63,.98);
              -o-transition: width 4s cubic-bezier(.42,.98,.63,.98);
              transition: width 4s cubic-bezier(.42,.98,.63,.98);
          }

          #fundraising-wrapper > .donated {
            color: rgba(0, 0, 139, 1);
            position: relative;
            font-size: clamp(14px, 4vw, 36px);
            margin: 0 auto;
          }

          #fundraising-wrapper > .donated > span {
            color: rgba(145, 145, 145, 0.7);
            font-size: clamp(12px, 3.6vw, 24px);
          }
      </style>
      <div id="fundraising-wrapper">
        <div class="slider">
          <div class="fill"></div>
        </div>
        <p class="donated"><span></span></p>
      </div>
      `;

    let templateContent = template.content;
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(templateContent.cloneNode(true));
  }

  static get observedAttributes() {
    return [
      "units",
      "currentAmount",
      "goal",
      "time",
      "primaryColor",
      "secondaryColor",
    ];
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
    const currentValue = parseInt(this.getAttribute("currentAmount")) || 0;
    const goalValue = parseInt(this.getAttribute("goal")) || 100;
    const time = this.getAttribute("time") || 4;
    const units = this.getAttribute("units") || "$";

    /* Set the variables to dom parts */
    const component = this.shadowRoot;
    const fill = component.querySelector(".fill");
    const currentValueDisplay = component.querySelector(".donated");

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
      component.querySelector(".donated").style.color =
        this.getAttribute("primaryColor");
    }

    let subColor;

    if (this.getAttribute("secondaryColor")) {
      component.querySelector(".slider").style.background = hexToRgba(
        this.getAttribute("secondaryColor"),
        0.2
      );

      subColor = hexToRgba(this.getAttribute("secondaryColor"), 0.7);
    }

    if (time !== 4) {
      fill.style.transition = `width ${time}s cubic-bezier(.42,.98,.63,.98)`;
    }

    const maxSlider = (currentValue / goalValue) * 100;

    let i = 0;
    const animationTime = time * 1000; //in ms

    function formatNumberDollars(num) {
      return num.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
    }

    function formatNumberOther(num) {
      return num.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
    }

    const goalDisplayValue =
      units === "$"
        ? formatNumberDollars(goalValue)
        : formatNumberOther(goalValue) + " " + units;

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

        const currentDisplayValue =
          units === "$"
            ? formatNumberDollars(currentValue * (percentComplete / 100))
            : formatNumberOther(currentValue * (percentComplete / 100));

        const formattedValueDisplay = `${currentDisplayValue} <span${
          subColor ? " style='color: " + subColor + "'" : ""
        }>of ${goalDisplayValue} Goal</span>`;
        currentValueDisplay.innerHTML = formattedValueDisplay;

        // Stop when complete
        if (elapsedTime >= totalTime) {
          clearInterval(progressTimer);
        }
      }, interval);

      return progressTimer;
    }

    window.addEventListener("load", function () {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(animationTime);
            fill.style.width = maxSlider + "%";
            observer.disconnect();
          }
        });
      });

      observer.observe(component.querySelector("#fundraising-wrapper"));
    });
  }
}

customElements.define("fundraising-bar", FundraisingBar);
