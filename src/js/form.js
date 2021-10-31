let ErrorManager = {
    status: false,
    clear: function () {
        this.status = false;
    },
    setError: function () {
        this.status = true;
    },
    isSuccess: function () {
        return this.status === false;
    }
};

let errorContent = null;

const renderContent = (el, template, place = `beforeend`) =>
    el.insertAdjacentHTML(place, template);
    

const createErrorText = (content) => {
    return (`<span class="error">${content}</span>`)
}


const addErrorText = (el, content) => {
    renderContent(el, createErrorText(content));
}


const validateOnEmpty = (input) => {
    const inputRow = input.closest('.input-row'),
        span = inputRow.querySelector('span.error'),
        inputName = input.id;

    errorContent = 'Поле является обязательным';

    if (input.value === '') {
        ErrorManager.setError();
        inputRow.classList.add('error');

        if(!span) {
            addErrorText(inputRow, errorContent);
        }

    } else if(input.value !== '') {
        inputRow.classList.remove('error');
        inputRow.classList.add('success');
        
        localStorage.setItem("inputName", input.value);
        
        if(span) {
            span.remove();
        }

        addToLocalStorage(inputName, input);
    }
}


const addToLocalStorage = (inputName, input) => {
    localStorage.setItem("`${inputName}`", input.value);
}


const clickOnFormBtn = () => {
    const addProductBtn = document.getElementById('addProductBtn');

    if(addProductBtn) {
        addProductBtn.addEventListener('click', (e) => {
            ErrorManager.clear();
            e.preventDefault();

            const form = document.getElementById('addProductForm'),
                requiredRows = form.querySelectorAll('.input-row--required');

            if(requiredRows) {
                requiredRows.forEach((row) => {
                    const input = row.querySelector('input, textarea');
                    const productImage = document.getElementById('productImage');

                    validateOnEmpty(input);

                    if(productImage && productImage.value !== '') {
                        const closestRow = productImage.closest('.input-row');

                        regForImageSrc(productImage, closestRow)
                    }
                })
            }

            if (!ErrorManager.isSuccess()) {
                e.preventDefault();
            } else if (ErrorManager.isSuccess()) {
                e.preventDefault();
                // addProductBtn.classList.add('success');

                const newImage = document.getElementById('productImage').value,
                    newTitle = document.getElementById('productTitle').value,
                    newDescription = document.getElementById('productDescription').value;
                    newPrice = document.getElementById('productPrice').value;

                createNewProduct(newImage, newTitle, newPrice, newDescription);
            }
        })
    }
}

clickOnFormBtn();


const addDisabledClass = () => {
    const requiredInputs = Array.from(document.querySelectorAll('.input-row--required input'));

    requiredInputs.forEach(input => {
        if(input.value === '') {
            addProductBtn.classList.add('btn--disabled');
        }
    })
}

addDisabledClass();

const writePriceInThousands = () => {
    const productPrice = document.getElementById('productPrice');

    if(productPrice) {
        const allowedCodes = [8, 9, 27, 35, 36, 37, 38, 39, 46, 110, 188];
        const pattern = /^\d+(\.?)\d{0,2}$/g

        productPrice.oninput = function(e) {
            const value = this.value;
            if( !(value.replace(/\s/g, '').match(pattern) || allowedCodes.some(code => code === e.keyCode))) this.value = value.slice(0, -1);
        }
    
        let inputValue = 0;

        productPrice.onkeyup = function() {
            inputValue = productPrice.value;  
            inputValue = inputValue.replace(/\s/g, '');  
            
            if (!inputValue) return; 
            var hasDotInNumber = inputValue.includes('.');

            if (hasDotInNumber)
                var stringAfterDot = inputValue.toString().split('.').pop();
            
            inputValue = Number.parseFloat(inputValue);
            if (isNaN(inputValue)) return;  
                
            productPrice.value = parseInt(inputValue).toLocaleString('ru').replace(',', '.') + (hasDotInNumber ? '.' + stringAfterDot : '');  
        }
    }
}

writePriceInThousands();


const createNewProduct = (imgSrc, title, price, description) => {
    const elem = document.querySelectorAll('.products__item')[0],
            newElem = elem.cloneNode(true),
            noItemsText = document.querySelector('.products__no-items'),
            productsArray = Array.from(document.querySelectorAll('.products__item'));

    elem.before(newElem);
    newElem.style.display = 'block';
    productsArray.push(newElem);

    if(noItemsText) {
        noItemsText.remove();
    }

    const newElemImage = newElem.querySelector('.products__item-image img'),
        newElemTitle = newElem.querySelector('.products__item-title'),
        newElemDescription = newElem.querySelector('.products__item-text'),
        newElemPrice = newElem.querySelector('.products__item-price span');

    newElemImage.setAttribute('src', imgSrc);
    newElemTitle.textContent = title;
    newElemDescription.textContent = description;
    newElemPrice.textContent = price;

    const formInputs = document.querySelectorAll('#addProductForm input, #addProductForm textarea');

    formInputs.forEach((input) => {
        input.value = '';
    })
}


const watchInputsState = () => {
    const inputRows = document.querySelectorAll('.input-row');

    if(inputRows) {
        inputRows.forEach((row) => {
            const input = row.querySelector('input, textarea');

            errorContent = 'Поле является обязательным';

            input.onfocus = () => {
                const span = row.querySelector('span.error');

                row.classList.remove('error');
                input.classList.remove('error');

                if(span) {
                    span.remove();
                }
            }

            input.onblur = () => {
                if(row.classList.contains('input-row--required') && 
                    input.value === '') {
                    const span = row.querySelector('span.error');

                    row.classList.add('error');
                    input.classList.add('error');

                    if(span) {
                        span.remove();
                        addErrorText(row, errorContent);
                    } else {
                        addErrorText(row, errorContent);
                    }
                }
            }

            input.oninput = () => {
                const requiredInputs = Array.from(document.querySelectorAll('.input-row--required input'));
                const imageInput = document.getElementById('productImage');

                if(imageInput && imageInput.value !== '') {
                    const closestRow = imageInput.closest('.input-row');

                    regForImageSrc(imageInput, closestRow);
                }
            
                if(requiredInputs.every(el => !el.classList.contains('error')) && 
                requiredInputs.every(el => el.value !== '')) {
                    addProductBtn.classList.remove('btn--disabled');
                    addProductBtn.classList.add('btn--success');
                }
            }
        })
    }
}

watchInputsState();

const regForImageSrc = (input, row) => {
    const regLink = /^((ftp|http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9\-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-\/])*)?/;

    if (!input.value.match(regLink)) {
        ErrorManager.setError();

        errorContent = 'Необходимо указать ссылку';

        const span = row.querySelector('span.error')

        row.classList.add('error');
        input.classList.add('error');

        if(!span) {
            addErrorText(row, errorContent);
        } else if(span.length) {
            span.remove();
            addErrorText(row, errorContent);
        }
    }
}

