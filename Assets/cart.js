class CartRemoveButton extends HTMLElement {
    constructor() {
      super();
  
      this.addEventListener('click', (event) => {
        event.preventDefault();
        const cartItems = this.closest('cart-items') || this.closest('cart-drawer-items');
        if (cartItems) {
          cartItems.updateQuantity(this.dataset.index, 0);
        }
      });
    }
  }
  
  customElements.define('cart-remove-button', CartRemoveButton);
  
  class CartItems extends HTMLElement {
    constructor() {
      super();
      this.lineItemStatusElement =
        document.getElementById('shopping-cart-line-item-status') || document.getElementById('CartDrawer-LineItemStatus');
  
      const debouncedOnChange = debounce((event) => {
        this.onChange(event);
      }, ON_CHANGE_DEBOUNCE_TIMER || 300);
  
      this.addEventListener('change', debouncedOnChange.bind(this));
    }
  
    cartUpdateUnsubscriber = undefined;
  
    connectedCallback() {
      if (typeof subscribe === 'function' && typeof PUB_SUB_EVENTS !== 'undefined') {
        this.cartUpdateUnsubscriber = subscribe(PUB_SUB_EVENTS.cartUpdate, (event) => {
          if (event.source === 'cart-items') {
            return;
          }
          this.onCartUpdate();
        });
      }
    }
  
    disconnectedCallback() {
      if (this.cartUpdateUnsubscriber) {
        this.cartUpdateUnsubscriber();
      }
    }
  
    onChange(event) {
      this.updateQuantity(
        event.target.dataset.index, 
        event.target.value, 
        document.activeElement?.getAttribute('name'), 
        event.target.dataset.quantityVariantId
      );
    }
  
    onCartUpdate() {
      if (this.tagName === 'CART-DRAWER-ITEMS') {
        this.updateCartDrawer();
      } else {
        this.updateCartPage();
      }
    }
  
    updateCartDrawer() {
      fetch(`${routes.cart_url}?section_id=cart-drawer`)
        .then((response) => response.text())
        .then((responseText) => {
          const html = new DOMParser().parseFromString(responseText, 'text/html');
          const selectors = ['cart-drawer-items', '.cart-drawer__footer'];
          
          for (const selector of selectors) {
            const targetElement = document.querySelector(selector);
            const sourceElement = html.querySelector(selector);
            if (targetElement && sourceElement) {
              targetElement.replaceWith(sourceElement);
            }
          }
        })
        .catch((e) => {
          console.error('Failed to update cart drawer:', e);
        });
    }
  
    updateCartPage() {
      const sectionsToFetch = ['main-cart-items', 'main-cart-footer', 'cart-icon-bubble'];
      
      fetch(`${routes.cart_url}?sections=${sectionsToFetch.join(',')}`)
        .then((response) => response.json())
        .then((data) => {
  
          if (data['main-cart-items']) {
            const cartItemsContainer = document.querySelector('cart-items');
            if (cartItemsContainer) {
                cartItemsContainer.innerHTML = this.getSectionInnerHTML(data['main-cart-items'], '.js-contents');
            }
          }
  
          if (data['main-cart-footer']) {
            const currentFooter = document.querySelector('.cart__footer');
            if (currentFooter) {
                const footerContent = this.getSectionInnerHTML(data['main-cart-footer'], '.js-contents');
                const innerContainer = currentFooter.querySelector('.js-contents');
                if (innerContainer) {
                    innerContainer.innerHTML = footerContent;
                } else {
                    currentFooter.innerHTML = footerContent;
                }
                currentFooter.dispatchEvent(new CustomEvent('shopify:section:load', { bubbles: true }));
            } else {
              console.warn('Cart footer element (.cart__footer) not found');
            }
          }
          
          this.updateCartIcon(data.item_count); 
        })
        .catch((e) => {
          console.error('Failed to update cart sections:', e);
          this.simpleCartUpdate();
        });
    }
  
    simpleCartUpdate() {
      fetch(`${routes.cart_url}?section_id=main-cart-items`)
        .then((response) => response.text())
        .then((responseText) => {
          const html = new DOMParser().parseFromString(responseText, 'text/html');
          const sourceQty = html.querySelector('cart-items');
          if (sourceQty) {
            this.innerHTML = sourceQty.innerHTML;
          }
        })
        .catch((e) => {
          console.error('Simple cart update failed:', e);
        });
    }
  
    getSectionsToRender() {
      return [
        {
          id: 'main-cart-items',
          section: 'main-cart-items',
          selector: '.js-contents',
        },
        {
          id: 'cart-icon-bubble',
          section: 'cart-icon-bubble', 
          selector: '#cart-icon-bubble',
        },
        {
          id: 'cart-live-region-text',
          section: 'cart-live-region-text',
          selector: '[data-cart-live-region-text]',
        },
        {
          id: 'main-cart-footer',
          section: 'main-cart-footer',
          selector: '.js-contents',
        },
      ];
    }
  
    updateQuantity(line, quantity, name, variantId) {
      this.enableLoading(line);
  
      const body = JSON.stringify({
        line,
        quantity,
        sections: this.getSectionsToRender().map((section) => section.section),
        sections_url: window.location.pathname,
      });
  
      fetch(`${routes.cart_change_url}`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body 
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.text();
        })
        .then((state) => {
          const parsedState = JSON.parse(state);
          this.handleCartUpdateResponse(parsedState, line, name, variantId);
        })
        .catch((error) => {
          console.error('Cart update failed:', error);
          this.handleCartUpdateError(line);
        })
        .finally(() => {
          this.disableLoading(line);
        });
    }
  
handleCartUpdateResponse(parsedState, line, name, variantId) {
  const quantityElement =
    document.getElementById(`Quantity-${line}`) || document.getElementById(`Drawer-quantity-${line}`);

  if (parsedState.errors) {
    if (quantityElement) {
      quantityElement.value = quantityElement.getAttribute('value');
    }
    this.updateLiveRegions(line, parsedState.errors);
    return;
  }

  this.classList.toggle('is-empty', parsedState.item_count === 0);
  const cartDrawerWrapper = document.querySelector('cart-drawer');
  const cartFooter = document.querySelector('.cart__footer');

  if (cartFooter) {
    cartFooter.classList.remove('is-empty');
    
    if (parsedState.sections && parsedState.sections['main-cart-footer']) {
      const newSectionHtml = parsedState.sections['main-cart-footer'];
      const innerElementToReplace = cartFooter.querySelector('.js-contents');
      
      if (innerElementToReplace) {
        const newContent = this.getSectionInnerHTML(newSectionHtml, '.js-contents');
        if (newContent) {
          innerElementToReplace.innerHTML = newContent;
          cartFooter.dispatchEvent(new CustomEvent('shopify:section:load', { bubbles: true }));
          cartFooter.dispatchEvent(new CustomEvent('cart:refresh', { bubbles: true }));
        } else {
          this.updateTotalManually(parsedState, cartFooter);
        }
      } else {
        console.warn('Inner content container (.js-contents) not found in footer');
        const newContent = this.getSectionInnerHTML(newSectionHtml, '.js-contents');
        if (newContent) {
          cartFooter.innerHTML = newContent;
          cartFooter.dispatchEvent(new CustomEvent('shopify:section:load', { bubbles: true }));
          cartFooter.dispatchEvent(new CustomEvent('cart:refresh', { bubbles: true }));
        } else {
          this.updateTotalManually(parsedState, cartFooter);
        }
      }
    } else {
      console.warn('Main cart footer section data missing, updating manually');
      this.updateTotalManually(parsedState, cartFooter);
    }
  }

  if (cartDrawerWrapper) cartDrawerWrapper.classList.toggle('is-empty', parsedState.item_count === 0);

  this.getSectionsToRender().forEach((section) => {
    const elementToReplace = document.getElementById(section.id) || document.querySelector(`.${section.id.replace(/-/g, '_')}`);
    if (elementToReplace && parsedState.sections && parsedState.sections[section.section]) {
      const newSectionHtml = parsedState.sections[section.section];
      const innerElementToReplace = elementToReplace.querySelector(section.selector) || elementToReplace;
      if (innerElementToReplace) {
        const newContent = this.getSectionInnerHTML(newSectionHtml, section.selector);
        if (newContent) {
          innerElementToReplace.innerHTML = newContent;
        }
      }
    }
  });

  this.handlePostUpdateFocus(parsedState, line, name, quantityElement, cartDrawerWrapper);

  if (typeof window.updateCartIconBubble === 'function') {
    window.updateCartIconBubble(parsedState.item_count);
  }


  if (typeof publish === 'function' && typeof PUB_SUB_EVENTS !== 'undefined') {
    publish(PUB_SUB_EVENTS.cartUpdate, { 
      source: 'cart-items', 
      cartData: parsedState, 
      variantId: variantId 
    });
  }
}

updateTotalManually(parsedState, cartFooter) {
  const totalAmount = parsedState.total_price / 100; 
  
  const totalSelectors = [
    '.estimated-total',
    '.cart__checkout-total', 
    '[data-testid="cart-subtotal"]',
    '.cart__total',
    '.totals__total-value',
    '.cart-subtotal--final',
    '.cart__subtotal-price',
    '.subtotal-price'
  ];
  
  let totalElement = null;
  for (const selector of totalSelectors) {
    totalElement = cartFooter.querySelector(selector);
    if (totalElement) break;
  }
  
  if (totalElement) {
    const formattedPrice = this.formatPrice(totalAmount);
    totalElement.innerHTML = formattedPrice;
  } else {
    console.warn('No total element found with any of the selectors:', totalSelectors);
    const allPriceElements = cartFooter.querySelectorAll('[data-price], .price, .money');
  }
  
  const itemCountElements = cartFooter.querySelectorAll('.cart-count, [data-cart-count]');
  itemCountElements.forEach(element => {
    element.textContent = parsedState.item_count;
  });
}

formatPrice(amount) {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD'
  }).format(amount);
  
}

getSectionInnerHTML(html, selector) {
  try {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const element = doc.querySelector(selector);
    
    if (!element) {
      console.warn(`Selector ${selector} not found in HTML:`, html.substring(0, 200));
      return '';
    }
    
    return element.innerHTML;
  } catch (error) {
    console.error('Error parsing HTML:', error);
    return '';
  }
}

updateQuantity(line, quantity, name, variantId) {
  this.enableLoading(line);

  const body = JSON.stringify({
    line,
    quantity,
    sections: this.getSectionsToRender().map((section) => section.section),
    sections_url: window.location.pathname,
  });

  fetch(`${routes.cart_change_url}`, { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    },
    body 
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();
    })
    .then((state) => {
      let parsedState;
      try {
        parsedState = JSON.parse(state);
      
        if (!parsedState.hasOwnProperty('total_price')) {
        }
        if (!parsedState.sections) {
        }
        
      } catch (parseError) {
        throw new Error('Invalid JSON response');
      }
      
      this.handleCartUpdateResponse(parsedState, line, name, variantId);
    })
    .catch((error) => {
      this.handleCartUpdateError(line);
    })
    .finally(() => {
      this.disableLoading(line);
    });
}
  
    updateCartIcon(itemCount) {
      const bubble = document.querySelector('#cart-icon-bubble .cart-count-bubble span');
      if (bubble) {
        bubble.textContent = itemCount < 100 ? itemCount : '99+';
      }
      
      fetch(`${routes.cart_url}?sections=cart-icon-bubble`)
        .then((res) => res.json())
        .then((data) => {
          const bubbleContainer = document.getElementById('cart-icon-bubble');
          if (bubbleContainer && data['cart-icon-bubble']) {
            bubbleContainer.innerHTML = data['cart-icon-bubble'];
          }
        })
        .catch((e) => {
          console.warn('Failed to update cart icon:', e);
        });
    }
  
    handlePostUpdateFocus(parsedState, line, name, quantityElement, cartDrawerWrapper) {
      const items = document.querySelectorAll('.cart-item');
      const updatedValue = parsedState.items[line - 1] ? parsedState.items[line - 1].quantity : undefined;
      
      let message = '';
      if (items.length === parsedState.items.length && updatedValue !== parseInt(quantityElement?.value || 0)) {
        if (typeof updatedValue === 'undefined') {
          message = window.cartStrings?.error || 'An error occurred';
        } else {
          message = (window.cartStrings?.quantityError || 'Quantity updated to [quantity]').replace('[quantity]', updatedValue);
        }
      }
      this.updateLiveRegions(line, message);
  
      const lineItem =
        document.getElementById(`CartItem-${line}`) || document.getElementById(`CartDrawer-Item-${line}`);
      if (lineItem && name && lineItem.querySelector(`[name="${name}"]`)) {
        const focusTarget = lineItem.querySelector(`[name="${name}"]`);
        if (cartDrawerWrapper && typeof trapFocus === 'function') {
          trapFocus(cartDrawerWrapper, focusTarget);
        } else if (focusTarget) {
          focusTarget.focus();
        }
      } else if (parsedState.item_count === 0 && cartDrawerWrapper) {
        const emptyDrawer = cartDrawerWrapper.querySelector('.drawer__inner-empty');
        const emptyLink = cartDrawerWrapper.querySelector('a');
        if (emptyDrawer && emptyLink && typeof trapFocus === 'function') {
          trapFocus(emptyDrawer, emptyLink);
        }
      } else if (document.querySelector('.cart-item') && cartDrawerWrapper) {
        const cartItemName = document.querySelector('.cart-item__name');
        if (cartItemName && typeof trapFocus === 'function') {
          trapFocus(cartDrawerWrapper, cartItemName);
        }
      }
    }
  
    handleCartUpdateError(line) {
      console.error('Handling cart update error for line:', line);
      
      this.querySelectorAll('.loading__spinner').forEach((overlay) => overlay.classList.add('hidden'));
      
      const quantityElement = document.getElementById(`Quantity-${line}`) || document.getElementById(`Drawer-quantity-${line}`);
      if (quantityElement) {
        const originalValue = quantityElement.getAttribute('value') || quantityElement.getAttribute('data-value');
        if (originalValue) {
          quantityElement.value = originalValue;
        }
      }
      
      const errors = document.getElementById('cart-errors') || document.getElementById('CartDrawer-CartErrors');
      if (errors) {
        errors.textContent = window.cartStrings?.error || 'There was an error while updating your cart. Please try again.';
        errors.style.display = 'block';
        
        setTimeout(() => {
          errors.style.display = 'none';
        }, 5000);
      }
      
      this.updateLiveRegions(line, window.cartStrings?.error || 'Update failed');
    }
  
    updateLiveRegions(line, message) {
      const lineItemError =
        document.getElementById(`Line-item-error-${line}`) || document.getElementById(`CartDrawer-LineItemError-${line}`);
      if (lineItemError) {
        const errorText = lineItemError.querySelector('.cart-item__error-text');
        if (errorText) {
          errorText.innerHTML = message;
        }
      }
  
      if (this.lineItemStatusElement) {
        this.lineItemStatusElement.setAttribute('aria-hidden', true);
      }
  
      const cartStatus =
        document.getElementById('cart-live-region-text') || document.getElementById('CartDrawer-LiveRegionText');
      if (cartStatus) {
        cartStatus.setAttribute('aria-hidden', false);
        setTimeout(() => {
          cartStatus.setAttribute('aria-hidden', true);
        }, 1000);
      }
    }
  
    getSectionInnerHTML(html, selector) {
      return new DOMParser().parseFromString(html, 'text/html').querySelector(selector)?.innerHTML || '';
    }
  
    enableLoading(line) {
      const mainCartItems = document.getElementById('main-cart-items') || document.getElementById('CartDrawer-CartItems');
      if (mainCartItems) {
        mainCartItems.classList.add('cart__items--disabled');
      }
  
      const cartItemElements = this.querySelectorAll(`#CartItem-${line} .loading__spinner`);
      const cartDrawerItemElements = this.querySelectorAll(`#CartDrawer-Item-${line} .loading__spinner`);
  
      [...cartItemElements, ...cartDrawerItemElements].forEach((overlay) => overlay.classList.remove('hidden'));
  
      if (document.activeElement && typeof document.activeElement.blur === 'function') {
        document.activeElement.blur();
      }
      
      if (this.lineItemStatusElement) {
        this.lineItemStatusElement.setAttribute('aria-hidden', false);
      }
    }
  
    disableLoading(line) {
      const mainCartItems = document.getElementById('main-cart-items') || document.getElementById('CartDrawer-CartItems');
      if (mainCartItems) {
        mainCartItems.classList.remove('cart__items--disabled');
      }
  
      const cartItemElements = this.querySelectorAll(`#CartItem-${line} .loading__spinner`);
      const cartDrawerItemElements = this.querySelectorAll(`#CartDrawer-Item-${line} .loading__spinner`);
  
      cartItemElements.forEach((overlay) => overlay.classList.add('hidden'));
      cartDrawerItemElements.forEach((overlay) => overlay.classList.add('hidden'));
    }
  }
  
  customElements.define('cart-items', CartItems);
  
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