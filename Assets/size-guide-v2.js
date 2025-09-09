document.addEventListener('DOMContentLoaded', function () {
    const popup = document.querySelector('.size-guide-popup');
    const steps = document.querySelectorAll('.size-guide-step');
    const nextBtns = document.querySelectorAll('[data-next]');
    const prevBtns = document.querySelectorAll('[data-prev]');
    const closeBtn = document.querySelector('.close-size-guide');
    let currentStep = 0;
    let hasSubmittedSizeOnly = false;
  
    function showStep(index) {
      currentStep = index;
      steps.forEach((step, i) => {
        step.classList.toggle('active', i === index);
      });
      const box = document.querySelector('.size-guide-box');
      box.classList.remove('step-1', 'step-2', 'step-3');
      box.classList.add(`step-${index + 1}`);
    }
  
    function nextStep() {
      if (currentStep < steps.length - 1) {
        currentStep++;
        showStep(currentStep);
      }
      if (currentStep === 2) {
        calculateSize();
      }
    }
  
    function prevStep() {
      if (currentStep > 0) {
        currentStep--;
        showStep(currentStep);
      }
    }
  
    function openPopup() {
      popup.style.display = 'flex';
      showStep(currentStep);
      bindOptionButtonEvents();
    }
  
    function closePopup() {
      popup.style.display = 'none';
      currentStep = 0;
      showStep(currentStep);
    }
  
    function calculateSize() {
      const gender = document.querySelector('.step-1 .option-button.active')?.dataset.value;
      const breed = document.querySelector('.step-2 .form-row')?.dataset.value;
      const weight = document.querySelector('.step-2 .form-row')?.dataset.value;
      let resultSize = 'M';
  
      if (gender && weight) {
        if (weight === '1,2,3') resultSize = 'XXS';
        else if (weight === '4,5,6,7') resultSize = 'XS';
        else if (weight === '8,9,10,11,12,13,14,15') resultSize = 'S';
        else if (weight === '16,17,18,19,20,21,22,23,24,25,26,27,28,29,30') resultSize = 'M';
        else if (weight === '31,32,33,34,35,36,37,38,39,40,41,41,42,43,44,45,46,47,48,49,50') resultSize = 'M+';
        else if (weight === '51,52,53,54,55,56,57,58,59,60,61,62,63,64,65') resultSize = 'L';
        else if (weight === '66-140') resultSize = 'XL';
      }
  
      const resultSizeEl = document.querySelector('.result-size');
      const shopNowBtn = document.querySelector('.shop-now-btn');
  
      if (resultSizeEl) resultSizeEl.textContent = resultSize;
  
      const productLinks = {
        XXS: 'https://pawinspired.com/products/disposable-dog-diapers?variant=44676932075720',
        XS: 'https://pawinspired.com/products/disposable-dog-diapers?variant=42132254294216',
        S: 'https://pawinspired.com/products/disposable-dog-diapers?variant=42132254359752',
        M: 'https://pawinspired.com/products/disposable-dog-diapers?variant=42132254425288',
        'M+': 'https://pawinspired.com/products/disposable-dog-diapers?variant=42132254490824',
        L: 'https://pawinspired.com/products/disposable-dog-diapers?variant=42132254523592',
        XL: 'https://pawinspired.com/products/disposable-dog-diapers?variant=42132254589128'
      };
  
      if (shopNowBtn && productLinks[resultSize]) {
        shopNowBtn.href = productLinks[resultSize];
      }
  
      const uniqueKey = `pawSize_${gender}_${breed}_${weight}_${resultSize}`;
      if (!hasSubmittedSizeOnly && !localStorage.getItem(uniqueKey)) {
        const data = {
          Gender: gender || '',
          'Suggested Size': resultSize,
          Breed: '',
          Weight: resultDesc
        };
  
        fetch('https://script.google.com/macros/s/AKfycbyjfabCyA4WOuwvGd_XBs6DhXMmxTUANgqEWKnWVQUKje5m2IO94JQmm4XImWfEOSVh/exec', {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
  
        hasSubmittedSizeOnly = true;
        localStorage.setItem(uniqueKey, '1');
      }
    }
  
    nextBtns.forEach(btn => btn.addEventListener('click', nextStep));
    prevBtns.forEach(btn => btn.addEventListener('click', prevStep));
    if (closeBtn) closeBtn.addEventListener('click', closePopup);
    document.querySelectorAll('[data-open-size-guide]').forEach(btn => {
      btn.addEventListener('click', openPopup);
    });
  
    function bindOptionButtonEvents() {
      document.querySelectorAll('.option-button:not([data-bound])').forEach(button => {
        button.setAttribute('data-bound', 'true');
        button.addEventListener('click', () => {
          const step = button.closest('.size-guide-step');
          const stepClass = step?.classList;
          const isStep3 = stepClass?.contains('step-3') && stepClass.contains('active');
          const group = button.closest('.option-group, .step2-option-group');
  
          if (isStep3) {
            button.classList.toggle('active');
          } else {
            if (stepClass?.contains('step-2')) {
             step.querySelectorAll('.option-button').forEach(btn => btn.classList.remove('active'));
            } else if (group) {
              group.querySelectorAll('.option-button').forEach(btn => btn.classList.remove('active'));
            }
            button.classList.add('active');
            if (stepClass?.contains('step-1')) {
            nextStep();
            }
          }
        });
      });
    }
  
    const feedbackToggle = document.getElementById("toggle-feedback-form");
    const feedbackForm = document.getElementById("feedback-form");
  
    if (feedbackToggle && feedbackForm) {
      feedbackToggle.addEventListener("click", function () {
        feedbackForm.style.display = "block";
        feedbackToggle.style.display = "none";
      });
    }
  
    const submitBtn = document.querySelector('.submit-feedback');
    if (submitBtn) {
      const newSubmitBtn = submitBtn.cloneNode(true);
      submitBtn.replaceWith(newSubmitBtn);
  
      newSubmitBtn.addEventListener('click', function () {
        const gender = document.querySelector('.step-1 .option-button.active')?.dataset.value || '';
        const weight = document.querySelector('.step-2 .option-button.active')?.dataset.value || '';
        const useCases = Array.from(document.querySelectorAll('.step-3 .option-button.active')).map(btn => btn.dataset.value);
        const suggestedSize = document.querySelector('.result-size')?.textContent?.trim() || '';
        const suggestedSizeDesc = document.querySelector('.result-desc')?.textContent?.trim() || '';
  
        const data = {
          UUID: uuid,
          Type: 'feedback',
          Source: getURLParameter?.('source') || 'Web',
          'Order ID': getURLParameter('orderId') || '',
          Email: document.querySelector('input[name="email"]')?.value || '',
          Gender: gender,
          Situation: useCases.join(', '),
          'Suggested Size': suggestedSize,
          'Used Size': document.querySelector('select[name="UsedSize"]')?.value || '',
          'Fit Feedback': document.querySelector('select[name="feedback"]')?.value || '',
          'Product Used': document.querySelector('select[name="ProductUsed"]')?.value || '',
          Breed: document.querySelector('input[name="breed"]')?.value || '',
          Weight: document.querySelector('select[name="weight"]')?.value || ''
        };
  
        fetch('https://script.google.com/macros/s/AKfycbyjfabCyA4WOuwvGd_XBs6DhXMmxTUANgqEWKnWVQUKje5m2IO94JQmm4XImWfEOSVh/exec', {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
  
        alert("High paw! 🐾 You're one of over 10,000 pet parents helping us create a better fit for every pup.");
      });
    } else {
      console.warn('🚫 Submit button not found in DOM!');
    }
  });
  