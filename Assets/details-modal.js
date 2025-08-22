class SearchModal {
  constructor() {
    this.modals = document.querySelectorAll('details-modal[data-search-modal]');
    this.triggers = document.querySelectorAll('.js-open-search');
    this.isInitialized = false;
    this.init();
  }

  init() {
    if (this.isInitialized) return;
  
    this.bindSearchTriggers();
  
    this.bindModalEvents();
    
    document.addEventListener('keyup', this.handleEscapeKey.bind(this));
    
    this.isInitialized = true;
    console.log('Search modal initialized');
  }

  bindSearchTriggers() {
    this.triggers.forEach(trigger => {
      trigger.removeEventListener('click', this.handleTriggerClick);
      trigger.addEventListener('click', this.handleTriggerClick.bind(this));
    });
  }

  bindModalEvents() {
    this.modals.forEach(modal => {
      const closeBtn = modal.querySelector('[data-search-close]');
      const details = modal.querySelector('details');
      const modalContent = modal.querySelector('.search-modal');
      
      if (closeBtn) {
        closeBtn.removeEventListener('click', this.closeModal);
        closeBtn.addEventListener('click', () => this.closeModal(modal));
      }
      
      if (modalContent) {
        modalContent.addEventListener('click', (e) => {
          if (e.target === modalContent) {
            this.closeModal(modal);
          }
        });
      }
    });
  }

  handleTriggerClick(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const modal = document.querySelector('details-modal[data-search-modal]');
    if (!modal) {
      console.warn('Search modal not found');
      return;
    }
    
    this.openModal(modal);
  }

  openModal(modal) {
    const details = modal.querySelector('details');
    const summary = modal.querySelector('summary');
    const input = modal.querySelector('input[type="search"]');
    
    if (!details || !summary) return;
    
    details.setAttribute('open', '');
    summary.setAttribute('aria-expanded', 'true');
    modal.classList.add('modal-open');
    
    document.body.classList.add('overflow-hidden');
    
    setTimeout(() => {
      if (input) {
        input.focus();
        if (typeof trapFocus === 'function') {
          trapFocus(details, input);
        }
      }
    }, 100);
    
    console.log('Search modal opened');
  }

  closeModal(modal) {
    const details = modal.querySelector('details');
    const summary = modal.querySelector('summary');
    
    if (!details || !summary) return;
    
    details.removeAttribute('open');
    summary.setAttribute('aria-expanded', 'false');
    modal.classList.remove('modal-open');
    
    document.body.classList.remove('overflow-hidden');
    
    if (typeof removeTrapFocus === 'function') {
      removeTrapFocus();
    }
    
    console.log('Search modal closed');
  }

  handleEscapeKey(e) {
    if (e.code !== 'Escape' && e.key !== 'Escape') return;
    
    const openModal = document.querySelector('details-modal[data-search-modal] details[open]');
    if (openModal) {
      this.closeModal(openModal.closest('details-modal'));
    }
  }

  reinitialize() {
    this.triggers = document.querySelectorAll('.js-open-search');
    this.modals = document.querySelectorAll('details-modal[data-search-modal]');
    this.bindSearchTriggers();
    this.bindModalEvents();
    console.log('Search modal reinitialized');
  }
}

let searchModalInstance = null;

function initSearchModal() {
  if (!searchModalInstance) {
    searchModalInstance = new SearchModal();
  } else {
    searchModalInstance.reinitialize();
  }
}

document.addEventListener('DOMContentLoaded', initSearchModal);

const headerObserver = new MutationObserver((mutations) => {
  let shouldReinit = false;
  
  mutations.forEach((mutation) => {
    if (mutation.type === 'childList') {
      const addedNodes = Array.from(mutation.addedNodes);
      const hasSearchTrigger = addedNodes.some(node => 
        node.nodeType === 1 && 
        (node.classList?.contains('js-open-search') || node.querySelector?.('.js-open-search'))
      );
      
      if (hasSearchTrigger) {
        shouldReinit = true;
      }
    }
  });
  
  if (shouldReinit && searchModalInstance) {
    setTimeout(() => {
      searchModalInstance.reinitialize();
    }, 100);
  }
});

const headerContainer = document.querySelector('body');
if (headerContainer) {
  headerObserver.observe(headerContainer, {
    childList: true,
    subtree: true
  });
}