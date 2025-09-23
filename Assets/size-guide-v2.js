document.addEventListener('DOMContentLoaded', function () {
    const popup = document.querySelector('.size-guide-popup');
    const sizeGuideBox = document.querySelector('.size-guide-box');
    const steps = document.querySelectorAll('.size-guide-step');
    const genderButtons = document.querySelectorAll('.option-button');
    const nextButtons = document.querySelectorAll('.next-button');
    const prevButtons = document.querySelectorAll('.prev-button');
    const closeBtn = document.querySelector('.close-size-guide');

    let selectedGender = '';
    let hasSubmittedSizeOnly = false;

    // Custom Select Class
    class CustomSelect {
        constructor(element) {
            this.element = element;
            this.selected = element.querySelector('.select-selected');
            this.items = element.querySelector('.select-items');
            this.options = element.querySelectorAll('.select-items div:not(.disabled)');
            this.value = '';
            this.placeholder = 'My pet is a...';
            
            this.init();
        }

        init() {
            console.log('Initializing CustomSelect for:', this.element);
            console.log('Selected element:', this.selected);
            console.log('Items element:', this.items);
    
            if (!this.selected || !this.items) {
                console.error('Required elements not found!');
                return;
            }
            this.selected.addEventListener('click', (e) => {
                console.log('Select clicked');
                e.stopPropagation();
                this.toggle();
            });

            // 點擊選項
            this.options.forEach(option => {
                option.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.selectOption(option);
                });
            });

            // 點擊外部關閉
            document.addEventListener('click', () => {
                this.close();
            });

            // 鍵盤支援
            this.element.addEventListener('keydown', (e) => {
                this.handleKeyDown(e);
            });

            // 讓容器可以獲得焦點
            this.element.setAttribute('tabindex', '0');
        }

        toggle() {
            console.log('Toggle called, current state:', this.items.classList.contains('select-hide'));
            if (this.items.classList.contains('select-hide')) {
                this.open();
            } else {
                this.close();
            }
        }

        open() {
            console.log('Opening select');
            this.closeAllSelects();
            this.items.classList.remove('select-hide');
            this.selected.classList.add('select-arrow-active');
            this.element.classList.add('focused');
        }

        close() {
            this.items.classList.add('select-hide');
            this.selected.classList.remove('select-arrow-active');
            this.element.classList.remove('focused');
        }

        closeAllSelects() {
            // 關閉頁面上所有其他的自訂下拉選單
            document.querySelectorAll('.select-items').forEach(item => {
                item.classList.add('select-hide');
            });
            document.querySelectorAll('.select-selected').forEach(selected => {
                selected.classList.remove('select-arrow-active');
            });
            document.querySelectorAll('.custom-select').forEach(select => {
                select.classList.remove('focused');
            });
        }

        selectOption(option) {
            if (option.classList.contains('disabled')) return;

            const value = option.getAttribute('data-value');
            const text = option.textContent;

            // 更新選中狀態
            this.options.forEach(opt => opt.classList.remove('same-as-selected'));
            option.classList.add('same-as-selected');

            // 更新顯示文字
            this.selected.textContent = text;
            this.selected.classList.remove('placeholder');
            this.value = value;

            // 觸發change事件
            const changeEvent = new CustomEvent('change', {
                detail: { value: value, text: text }
            });
            this.element.dispatchEvent(changeEvent);

            this.close();
        }

        handleKeyDown(e) {
            switch(e.key) {
                case 'Enter':
                case ' ':
                    e.preventDefault();
                    this.toggle();
                    break;
                case 'Escape':
                    this.close();
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    if (this.items.classList.contains('select-hide')) {
                        this.open();
                    } else {
                        this.focusNextOption();
                    }
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    if (!this.items.classList.contains('select-hide')) {
                        this.focusPrevOption();
                    }
                    break;
            }
        }

        focusNextOption() {
            const currentIndex = Array.from(this.options).findIndex(opt => 
                opt.classList.contains('same-as-selected'));
            const nextIndex = (currentIndex + 1) % this.options.length;
            this.selectOption(this.options[nextIndex]);
        }

        focusPrevOption() {
            const currentIndex = Array.from(this.options).findIndex(opt => 
                opt.classList.contains('same-as-selected'));
            const prevIndex = currentIndex <= 0 ? this.options.length - 1 : currentIndex - 1;
            this.selectOption(this.options[prevIndex]);
        }

        getValue() {
            return this.value;
        }

        setValue(value) {
            const option = Array.from(this.options).find(opt => 
                opt.getAttribute('data-value') === value);
            if (option) {
                this.selectOption(option);
            }
        }

        reset() {
            this.options.forEach(opt => opt.classList.remove('same-as-selected'));
            this.selected.textContent = this.placeholder;
            this.selected.classList.add('placeholder');
            this.value = '';
        }
    }

    const selectInstances = [];
    
    function initializeCustomSelects() {
        const customSelects = document.querySelectorAll('.size-guide-step.active .custom-select');
    
        customSelects.forEach(selectElement => {
            if (selectElement.hasAttribute('data-initialized')) {
                return;
            }
        
            console.log('Initializing select for:', selectElement.id);
            const selected = selectElement.querySelector('.select-selected');
            const items = selectElement.querySelector('.select-items');
        
            if (selected && items) {
                const instance = new CustomSelect(selectElement);
                selectInstances.push(instance);
                selectElement.setAttribute('data-initialized', 'true');
                console.log('CustomSelect instance created for:', selectElement.id);
            }
        });
    }

    function resetSizeGuide() {
        hasSubmittedSizeOnly = false;
        selectedGender = '';
        console.log('Size guide reset - hasSubmittedSizeOnly:', hasSubmittedSizeOnly);
    }

    function showStep(stepClass) {
        steps.forEach(step => step.classList.remove('active'));
        const targetStep = document.querySelector('.' + stepClass);
        if (targetStep) {
            targetStep.classList.add('active');
        }

        updateBackground(stepClass);

        setTimeout(() => {
            initializeCustomSelects();
        }, 100);
    }

    function updateBackground(stepClass) {
        sizeGuideBox.className = 'size-guide-box';

        if (stepClass === 'step-1') {
            sizeGuideBox.classList.add('step-1-bg');
        } else if (stepClass === 'step-2-female') {
            sizeGuideBox.classList.add('step-2-female-bg');
        } else if (stepClass === 'step-2-male') {
            sizeGuideBox.classList.add('step-2-male-bg');
        } else if (stepClass === 'step-3') {
            if (selectedGender === 'female') {
                sizeGuideBox.classList.add('step-3-female-bg');
            } else {
                sizeGuideBox.classList.add('step-3-male-bg');
            }
        }
    }

    function validateCurrentStep() {
        const currentActiveStep = document.querySelector('.size-guide-step.active');
        
        if (currentActiveStep.classList.contains('step-2-female')) {
            const breedSelect = document.querySelector('#breed-select-female');
            const customSelectInstance = selectInstances.find(instance => instance.element === breedSelect);
            const breed = customSelectInstance ? customSelectInstance.getValue() : '';
            const weight = document.querySelector('input[name="weight"]').value;
            return breed && weight;
        } else if (currentActiveStep.classList.contains('step-2-male')) {
            const breedSelect = document.querySelector('#breed-select-male');
            const customSelectInstance = selectInstances.find(instance => instance.element === breedSelect);
            const breed = customSelectInstance ? customSelectInstance.getValue() : '';
            const waist = document.querySelector('input[name="waist"]').value;
            return breed && waist;
        }
        
        return true;
    }

    // Helper function to convert breed value to readable name
    function getBreedName(breedValue) {
        const breedMap = {
            'other': 'Other/Not Listed',
            'australian': 'Australian Shepherd',
            'basset': 'Basset Hound',
            'beagle': 'Beagle',
            'bichonsFrise': 'Bichons Frise',
            'borderCollie': 'Border Collie',
            'boston': 'Boston Terrier',
            'boxer': 'Boxer',
            'bulldogUS': 'Bulldog (American)',
            'bulldogUK': 'Bulldog (English)',
            'cat': 'Cat',
            'kingCharles': 'Cavalier King Charles Spaniel',
            'chihuahua': 'Chihuahua',
            'cocker': 'Cocker Spaniel',
            'corgi': 'Corgi',
            'dachshundMini': 'Dachshund (Mini)',
            'dachshundStandard': 'Dachshund (Standard)',
            'doberman': 'Doberman Pinscher',
            'french': 'French Bulldog',
            'german': 'German Shepherd',
            'golden': 'Golden Retriever',
            'labrador': 'Labrador Retriever',
            'lhasaApso': 'Lhasa Apso',
            'maltese': 'Maltese',
            'miniature': 'Miniature Pinscher',
            'pitBull': 'Pit Bull',
            'pomeranian': 'Pomeranian',
            'poodleMini': 'Poodle (Mini)',
            'poodleToy': 'Poodle (Toy)',
            'pug': 'Pug',
            'rottweiler': 'Rottweiler',
            'russell': 'Russell Terrier',
            'schnauzerMini': 'Schnauzer (Mini)',
            'schnauzerStandard': 'Schnauzer (Standard)',
            'shibaInu': 'Shiba Inu',
            'shihTzu': 'Shih Tzu',
            'silky': 'Silky Terrier',
            'teacup': 'Teacup Breeds',
            'yorkshire': 'Yorkshire Terrier'
        };
        
        return breedMap[breedValue] || breedValue;
    }
  
    function calculateSize() {
        if (hasSubmittedSizeOnly) {
            console.log('Data already submitted, skipping...');
            return;
        }

        const resultSizeEl = document.querySelector('.result-size');
        const shopNowBtn = document.querySelector('.shop-now-btn');
        let resultSize = 'M';
        let breed = '';
        let measurement = '';
        let measurementType = '';

        if (selectedGender === 'female') {
            const weightInput = document.querySelector('input[name="weight"]');
            const weight = parseFloat(weightInput ? weightInput.value : 0);
            const breedSelect = document.querySelector('#breed-select-female');
            const customSelectInstance = selectInstances.find(instance => instance.element === breedSelect);
            breed = customSelectInstance ? customSelectInstance.getValue() : '';
            measurement = weight;
            measurementType = 'weight';

            console.log('Female data - Weight:', weight, 'Breed:', breed);

            // Female dog diaper sizing based on weight (lbs)
            if (weight >= 1 && weight <= 3) {
                resultSize = 'XXS';
            } else if (weight >= 4 && weight <= 7) {
                resultSize = 'XS';
            } else if (weight >= 8 && weight <= 15) {
                resultSize = 'S';
            } else if (weight >= 16 && weight <= 30) {
                resultSize = 'M';
            } else if (weight >= 31 && weight <= 50) {
                resultSize = 'M+';
            } else if (weight >= 51 && weight <= 65) {
                resultSize = 'L';
            } else if (weight >= 66 && weight <= 140) {
                resultSize = 'XL';
            } else {
                resultSize = weight < 1 ? 'XXS' : 'XL';
            }

            // Product links for female diapers
            const femaleProductLinks = {
                'XXS': 'https://pawinspired.com/products/disposable-dog-diapers?variant=44676932075720',
                'XS': 'https://pawinspired.com/products/disposable-dog-diapers?variant=42132254294216',
                'S': 'https://pawinspired.com/products/disposable-dog-diapers?variant=42132254359752',
                'M': 'https://pawinspired.com/products/disposable-dog-diapers?variant=42132254425288',
                'M+': 'https://pawinspired.com/products/disposable-dog-diapers?variant=42132254490824',
                'L': 'https://pawinspired.com/products/disposable-dog-diapers?variant=42132254523592',
                'XL': 'https://pawinspired.com/products/disposable-dog-diapers?variant=42132254589128'
            };

            if (shopNowBtn && femaleProductLinks[resultSize]) {
                shopNowBtn.href = femaleProductLinks[resultSize];
            }

        } else if (selectedGender === 'male') {
            const waistInput = document.querySelector('input[name="waist"]');
            const waist = parseFloat(waistInput ? waistInput.value : 0);
            const breedSelect = document.querySelector('#breed-select-male');
            const customSelectInstance = selectInstances.find(instance => instance.element === breedSelect);
            breed = customSelectInstance ? customSelectInstance.getValue() : '';
            measurement = waist;
            measurementType = 'waist';

            console.log('Male data - Waist:', waist, 'Breed:', breed);

            // Male dog wrap sizing based on waist (inches)
            if (waist >= 6 && waist < 12) {
                resultSize = 'XS';
            } else if (waist >= 12 && waist < 18) {
                resultSize = 'S';
            } else if (waist >= 18 && waist < 23.5) {
                resultSize = 'M';
            } else if (waist >= 23.5 && waist <= 31.5) {
                resultSize = 'L';
            } else {
                resultSize = waist < 6 ? 'XS' : 'L';
            }

            // Product links for male wraps
            const maleProductLinks = {
                'XS': 'https://www.pawinspired.com/products/disposable-male-wraps?variant=42130809225416',
                'S': 'https://www.pawinspired.com/products/disposable-male-wraps?variant=43089194516680',
                'M': 'https://www.pawinspired.com/products/disposable-male-wraps?variant=42130809290952',
                'L': 'https://www.pawinspired.com/products/disposable-male-wraps?variant=43089196318920',
            };

            if (shopNowBtn && maleProductLinks[resultSize]) {
                shopNowBtn.href = maleProductLinks[resultSize];
            }
        }

        // Update display
        if (resultSizeEl) resultSizeEl.textContent = resultSize;
        if (!selectedGender || !measurement || !breed) {
            console.warn('Missing required data, not submitting:', { selectedGender, measurement, breed });
            return;
        }

        const data = { 
            Gender: selectedGender || '',
            'Suggested Size': resultSize || '',
            Breed: getBreedName(breed) || '',
            Weight: selectedGender === 'female' ? `${measurement} lbs` : '',
            'Waist Size': selectedGender === 'male' ? `${measurement} inches` : '',
            Timestamp: new Date().toISOString()
        };

        console.log('Data to submit:', data);

        fetch('https://script.google.com/macros/s/AKfycbya3XLAYgSvqoJ7WPp5JOEwhhgc-IHfi4gSQdvRhO7JzY5hMt6sjEoi095QWZBjfMYKvQ/exec', {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(() => {
            console.log('Data submitted successfully');
            hasSubmittedSizeOnly = true;
        })
        .catch(error => {
            console.error('Data submission error:', error);
            hasSubmittedSizeOnly = false;
        });
    }

    // Close popup function
    function closePopup() {
        if (popup) {
            popup.style.display = 'none';
        }
    }

    // Open popup function
    function openPopup() {
        if (popup) {
            popup.style.display = 'block';
            resetSizeGuide();
        }
    }

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
                        setTimeout(() => {
                            const targetStep = selectedGender === 'male' ? 'step-2-male' : 'step-2-female';
                            showStep(targetStep);
                        }, 300);
                    }
                }
            });
        });
    }

    // Gender selection
    genderButtons.forEach(button => {
        button.addEventListener('click', function() {
            genderButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            selectedGender = this.dataset.value;

            const targetStep = selectedGender === 'male' ? 'step-2-male' : 'step-2-female';
            showStep(targetStep);
        });
    });

    // Navigation buttons
    nextButtons.forEach(button => { 
        button.addEventListener('click', function() {
            const target = this.dataset.target;
            if (target && validateCurrentStep()) {
                showStep(target);
                if (target === 'step-3') {
                    this.disabled = true; 
                    calculateSize();
                }
            }
        });
    });

    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            const target = this.dataset.target;
            if (target) {
                showStep(target);
            }
        });
    });

    // Event listeners
    if (closeBtn) closeBtn.addEventListener('click', closePopup);
    document.querySelectorAll('[data-open-size-guide]').forEach(btn => {
        btn.addEventListener('click', openPopup);
    });
    
    // Initialize option button events
    bindOptionButtonEvents();
    initializeCustomSelects();
});