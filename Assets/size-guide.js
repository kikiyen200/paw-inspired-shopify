function getURLParameter(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

function generateUUID() {
  return crypto.randomUUID();
}

if (!localStorage.getItem('pawUUID')) {
  localStorage.setItem('pawUUID', generateUUID());
}
const uuid = localStorage.getItem('pawUUID');

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
    box.classList.remove('step-1', 'step-2', 'step-3', 'step-4');
    box.classList.add(`step-${index + 1}`);
  }

  function nextStep() {
    if (currentStep < steps.length - 1) {
      currentStep++;
      showStep(currentStep);
    }
    if (currentStep === 3) {
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
    const weight = document.querySelector('.step-2 .option-button.active')?.dataset.value;
    const useCases = Array.from(document.querySelectorAll('.step-3 .option-button.active')).map(btn => btn.dataset.value);
    let resultSize = 'M';
    let resultDesc = '(6-10 KG)';

    if (gender && weight) {
      if (weight === '<3') resultSize = 'XXS', resultDesc = '(< 3 KG / 6.6 lb)';
      else if (weight === '3–6') resultSize = 'XS', resultDesc = '(3–6 KG/ 6.6–13.2 lbs)';
      else if (weight === '6–10') resultSize = 'S', resultDesc = '(6–10 KG / 13.2–22 lbs)';
      else if (weight === '10–14') resultSize = 'M', resultDesc = '(10–14 KG / 22–30.9 lbs)';
      else if (weight === '14–23') resultSize = 'M+', resultDesc = '(14–23 KG / 30.9–50.7 lbs)';
      else if (weight === '23–30') resultSize = 'L', resultDesc = '(23–30 KG / 50.7–66.1 lbs)';
      else if (weight === '>30') resultSize = 'XL', resultDesc = '(>30 KG / 66.1+ lbs)';
    }

    const resultSizeEl = document.querySelector('.result-size');
    const resultDescEl = document.querySelector('.result-desc');
    const shopNowBtn = document.querySelector('.shop-now-btn');

    if (resultSizeEl) resultSizeEl.textContent = resultSize;
    if (resultDescEl) resultDescEl.textContent = resultDesc;

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

    const uniqueKey = `pawSize_${uuid}_${gender}_${weight}_${useCases.join('-')}_${resultSize}`;
    if (!hasSubmittedSizeOnly && !localStorage.getItem(uniqueKey)) {
      const data = {
        UUID: uuid,
        Type: 'recommendation',
        Source: getURLParameter?.('source') || 'Web',
        'Order ID': getURLParameter('orderId') || '',
        Email: '',
        Gender: gender || '',
        Situation: useCases.join(', '),
        'Suggested Size': resultSize,
        'Used Size': '',
        'Fit Feedback': '',
        'Product Used': '',
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
