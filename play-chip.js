'use strict';

(function() {
  class PlayChip extends HTMLElement {
    static get observedAttributes() {
      return ['label', 'disable', 'outline', 'delete'];
    }

    constructor() {
      // establish prototype chain
      super();

      // attaches shadow tree and returns shadow root reference
      // https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow
      const shadow = this.attachShadow({ mode: 'open' });

      // creating a container for the play-chip PlayChip
      const editableListContainer = document.createElement('div');

      // get attribute values from getters
      const label = this.label;
      const isDelete = this.isDelete;

      // adding a class to our container for the sake of clarity
      editableListContainer.classList.add('play-chip');

      // creating the inner HTML of the editable list element
      editableListContainer.innerHTML = `
        <style>
          .chip {
            background-color: var(--my-background, #eee);
            cursor: default;
            display: flex;
            width: max-content;
            align-items: center;
            border-radius: 30px;
            padding: 5px;
            height: 20px;
            color: black;
            font-family: Verdana, Geneva, Tahoma, sans-serif;
            font-size: 12px;
            margin: 5px;
          }
          .hidden {
            display: none;
          }
          .disabled {
            opacity: 0.3;
          }
          .outlined {
            border: 0.5px solid black;
            background-color: transparent;
          }
          ::slotted(*) {
            object-fit: cover;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: var(--icon-background, gainsboro);
          }
          p {
            margin-left: 5px;
            margin-right: 5px;
          }
          button {
            background-color: #ACACAC;
            cursor: pointer;
            border: none;
            border-radius: 50%;
            height: 18px;
            width: 18px;
            display: flex;
            align-items: center;
            color: white;
            justify-content: center;
          }
          button:hover {
            background-color: #8D8D8D;
          } 
        </style>
        <div id="main-chip">
          <slot></slot>
        </div>
      `;

      // binding methods
      this.removeChipItem = this.removeChipItem.bind(this);

      // appending the container to the shadow DOM
      shadow.appendChild(editableListContainer);
    }

    renderContent() {
      // determines chip style customization based on passed properties
      let chipClass = 'chip';
      const mainChip = this.shadowRoot.querySelector('#main-chip');
      if (this.getAttribute('disable')) chipClass += ' disabled';
      if (this.getAttribute('outline')) chipClass += ' outlined';
      mainChip.className = chipClass;

      const label = this.label;
      const isDelete = this.isDelete;
      const shadow = this.shadowRoot;
      shadow.querySelector('#main-chip').innerHTML = `
        <slot></slot>
        <p>${label}</p>
        ${isDelete}
      `

      // add event handle if there's a delete button on chip
      const deleteChipButton = this.shadowRoot.querySelector('.remove-chip');
      deleteChipButton && deleteChipButton.addEventListener('click', this.removeChipItem);      
    }

    // fires after the element has been attached to the DOM
    connectedCallback() {
      this.renderContent();   
    }

    attributeChangedCallback(name, oldValue, newValue) {
      console.log(name);
      if (oldValue !== newValue) {
        this.renderContent();
      }
    }
    

    get label() {
      return this.getAttribute('label') || '';
    }
    get isDelete() {
      // conditional rendering
      if (this.getAttribute('delete')) {
        return `<button class="remove-chip">✕</button>`;
      }
      return '';
    }

    removeChipItem(e) {
      e.target.parentNode.remove();
    }
  }

  // let the browser know about the custom element
  customElements.define('play-chip', PlayChip);
})();