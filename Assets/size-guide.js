document.addEventListener('DOMContentLoaded', function () {
  const popup = document.querySelector('.size-guide-popup');
  const steps = document.querySelectorAll('.size-guide-step');
  const nextBtns = document.querySelectorAll('[data-next]');
  const prevBtns = document.querySelectorAll('[data-prev]');
  const closeBtn = document.querySelector('.close-size-guide');
  let currentStep = 0;

  function showStep(index) {
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
  }

  function closePopup() {
    popup.style.display = 'none';
    currentStep = 0;
    showStep(currentStep);
  }

  nextBtns.forEach(btn => btn.addEventListener('click', nextStep));
  prevBtns.forEach(btn => btn.addEventListener('click', prevStep));
  if (closeBtn) closeBtn.addEventListener('click', closePopup);

  document.querySelectorAll('[data-open-size-guide]').forEach(btn => {
    btn.addEventListener('click', openPopup);
  });

  document.querySelectorAll('.option-button').forEach(button => {
    button.addEventListener('click', () => {
      const group = button.closest('.option-group');

      if (group) {
        group.querySelectorAll('.option-button').forEach(btn => btn.classList.remove('active'));
      }

      button.classList.add('active');

      const currentStepElement = button.closest('.size-guide-step');
      if (currentStepElement && (currentStepElement.classList.contains('step-1') || currentStepElement.classList.contains('step-2'))) {
        nextStep();
      }
    });
  });
});
