class CartDrawer extends HTMLElement {
  constructor() {
    super();

    this.addEventListener('keyup', (evt) => evt.code === 'Escape' && this.close());
    this.querySelector('#CartDrawer-Overlay')?.addEventListener('click', this.close.bind(this));
    this.setHeaderCartIconAccessibility();
    
    setTimeout(() => {
      this.bindCartUpdateEvents();
    }, 100);
  }

  bindCartUpdateEvents() {
    if (typeof subscribe === 'function' && typeof PUB_SUB_EVENTS !== 'undefined') {
      this.cartUpdateUnsubscriber = subscribe(PUB_SUB_EVENTS.cartUpdate, (event) => {
        if (event.source === 'product-form' && event.cartData && event.cartData.item_count > 0) {
          setTimeout(() => {
            this.open();
          }, 100);
        }
      });
    }

    document.addEventListener('cart:item-added', (event) => {
      console.log('Custom cart item added event');
      if (event.detail && event.detail.success) {
        this.open();
      }
    });

    this.observeCartUpdates();
  }

  observeCartUpdates() {
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
      const [url, options] = args;
      
      if (url.includes('/cart/add') || url.includes('cart_add_url')) {
        return originalFetch.apply(this, args)
          .then(response => {
            if (response.ok) {
              setTimeout(() => {
                const cartDrawer = document.querySelector('cart-drawer');
                if (cartDrawer) {
                  console.log('Opening drawer after successful cart/add');
                  cartDrawer.open();
                }
              }, 200);
            }
            return response;
          });
      }
      
      return originalFetch.apply(this, args);
    };
  }

  setHeaderCartIconAccessibility() {
    const cartLink = document.querySelector('#cart-icon-bubble');
    if (!cartLink) return;
    
    cartLink.setAttribute('role', 'button');
    cartLink.setAttribute('aria-haspopup', 'dialog');
    cartLink.addEventListener('click', (event) => {
      event.preventDefault();
      this.open(cartLink);
    });
    cartLink.addEventListener('keydown', (event) => {
      if (event.code.toUpperCase() === 'SPACE') {
        event.preventDefault();
        this.open(cartLink);
      }
    });
  }

  open(triggeredBy) {
    console.log('Opening cart drawer');
    
    this.refreshCartContents().then(() => {
      if (triggeredBy) this.setActiveElement(triggeredBy);
      
      const cartDrawerNote = this.querySelector('[id^="Details-"] summary');
      if (cartDrawerNote && !cartDrawerNote.hasAttribute('role')) {
        this.setSummaryAccessibility(cartDrawerNote);
      }
    
      setTimeout(() => {
        this.classList.add('animate', 'active');
      }, 10);

      this.addEventListener(
        'transitionend',
        () => {
          const containerToTrapFocusOn = this.classList.contains('is-empty')
            ? this.querySelector('.drawer__inner-empty')
            : document.getElementById('CartDrawer');
          const focusElement = this.querySelector('.drawer__inner') || this.querySelector('.drawer__close');
          if (typeof trapFocus === 'function' && containerToTrapFocusOn && focusElement) {
            trapFocus(containerToTrapFocusOn, focusElement);
          }
        },
        { once: true }
      );

      document.body.classList.add('overflow-hidden');
    });
  }

  refreshCartContents() {
    return fetch(`${routes.cart_url}?section_id=cart-drawer`)
      .then(response => response.text())
      .then(responseText => {
        const html = new DOMParser().parseFromString(responseText, 'text/html');
        const newDrawerContent = html.querySelector('#CartDrawer .drawer__inner');
        const currentDrawerContent = this.querySelector('#CartDrawer .drawer__inner');
        
        if (newDrawerContent && currentDrawerContent) {
          currentDrawerContent.innerHTML = newDrawerContent.innerHTML;
        }

        const newCartIcon = html.querySelector('#cart-icon-bubble');
        const currentCartIcon = document.querySelector('#cart-icon-bubble');
        if (newCartIcon && currentCartIcon) {
          currentCartIcon.innerHTML = newCartIcon.innerHTML;
        }

        const isEmpty = html.querySelector('.drawer__inner')?.classList.contains('is-empty') || 
                       html.querySelectorAll('.cart-item').length === 0;
        this.classList.toggle('is-empty', isEmpty);
      })
      .catch(error => {
        console.error('Failed to refresh cart contents:', error);
      });
  }

  close() {
    this.classList.remove('active');
    if (typeof removeTrapFocus === 'function' && this.activeElement) {
      removeTrapFocus(this.activeElement);
    }
    document.body.classList.remove('overflow-hidden');
  }

  setSummaryAccessibility(cartDrawerNote) {
    cartDrawerNote.setAttribute('role', 'button');
    cartDrawerNote.setAttribute('aria-expanded', 'false');

    if (cartDrawerNote.nextElementSibling?.getAttribute('id')) {
      cartDrawerNote.setAttribute('aria-controls', cartDrawerNote.nextElementSibling.id);
    }

    cartDrawerNote.addEventListener('click', (event) => {
      event.currentTarget.setAttribute('aria-expanded', !event.currentTarget.closest('details').hasAttribute('open'));
    });

    if (typeof onKeyUpEscape === 'function') {
      cartDrawerNote.parentElement.addEventListener('keyup', onKeyUpEscape);
    }
  }

  renderContents(parsedState) {
    this.querySelector('.drawer__inner')?.classList.remove('is-empty');
    this.productId = parsedState.id;
    
    this.getSectionsToRender().forEach((section) => {
      const sectionElement = section.selector
        ? document.querySelector(section.selector)
        : document.getElementById(section.id);
      if (sectionElement && parsedState.sections && parsedState.sections[section.id]) {
        sectionElement.innerHTML = this.getSectionInnerHTML(parsedState.sections[section.id], section.selector);
      }
    });

    setTimeout(() => {
      this.querySelector('#CartDrawer-Overlay')?.addEventListener('click', this.close.bind(this));
      this.open();
    });
  }

  getSectionInnerHTML(html, selector = '.shopify-section') {
    return new DOMParser().parseFromString(html, 'text/html').querySelector(selector)?.innerHTML || '';
  }

  getSectionsToRender() {
    return [
      {
        id: 'cart-drawer',
        selector: '#CartDrawer',
      },
      {
        id: 'cart-icon-bubble',
      },
      {
        id: 'cart-drawer-footer',
        section: 'cart-drawer',
        selector: '.cart-drawer__footer',
      },
    ];
  }

  getSectionDOM(html, selector = '.shopify-section') {
    return new DOMParser().parseFromString(html, 'text/html').querySelector(selector);
  }

  setActiveElement(element) {
    this.activeElement = element;
  }

  disconnectedCallback() {
    if (this.cartUpdateUnsubscriber) {
      this.cartUpdateUnsubscriber();
    }
    
  }
}

customElements.define('cart-drawer', CartDrawer);

class CartDrawerItems extends CartItems {
  getSectionsToRender() {
    return [
      {
        id: 'CartDrawer',
        section: 'cart-drawer',
        selector: '.drawer__inner',
      },
      {
        id: 'cart-icon-bubble',
        section: 'cart-icon-bubble',
        selector: '#cart-icon-bubble',
      },
      {
        id: 'cart-drawer-footer',
        section: 'cart-drawer',
        selector: '.cart-drawer__footer',
      },
    ];
  }
}

customElements.define('cart-drawer-items', CartDrawerItems);

if (!customElements.get('cart-note')) {
  customElements.define(
    'cart-note',
    class CartNote extends HTMLElement {
      constructor() {
        super();

        this.addEventListener(
          'input',
          debounce((event) => {
            const body = JSON.stringify({ note: event.target.value });
            fetch(`${routes.cart_update_url}`, { 
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body 
            });
          }, ON_CHANGE_DEBOUNCE_TIMER || 300)
        );
      }
    }
  );
}