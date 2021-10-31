import {Select} from './select/select'

const productsSelect = new Select('#select', {
    placeholder: 'Сортировать',
    selectedId: 'sortDefault',
    data: [
        {id: 'sortDefault', value: 'По умолчанию'},
        {id: 'fromMinToMax', value: 'По возрастанию цены'},
        {id: 'fromMaxToMin', value: 'По убыванию цены'},
        {id: 'sortByName', value: 'По наименованию'},
    ],
    // onSelect(item) {
    //   console.log('Selected Item', item)
    // }
})

window.s = select


const sortingProducts = () => {
    const items = document.querySelectorAll('.products__item');
    const parent = document.querySelector('.products__list');
    let sortByPrice = {};
    let sortByName = {};

    items.forEach(function(item, idx){
        let itemValue = parseInt(item.querySelector('.products__item-price span').textContent.replace(/\s+/g, ''));
        let itemName = item.querySelector('.products__item-title').textContent;

        sortByPrice[itemValue] = {
            'element': item, 
            'index': idx
        };

        sortByName[itemName] = {
            'element': item, 
            'index': idx
        };
    });

    let priceKeys = Object.keys(sortByPrice);
    let nameKeys = Object.keys(sortByName);


    document.addEventListener('click', (e) => {
        let target = e.target;
        
        const minToMaxBtn = document.querySelector('.select__item[data-id="fromMinToMax"]'),
            maxToMinBtn = document.querySelector('.select__item[data-id="fromMaxToMin"]'),
            byName = document.querySelector('.select__item[data-id="sortByName"]');

        if (target === minToMaxBtn) {
            priceKeys.sort(fromMinToMax);
            priceKeys.map(function(key, idx){
                parent.insertAdjacentElement('afterbegin', sortByPrice[key]['element']);
            });

        } else if (target === maxToMinBtn) {
            priceKeys.sort(fromMaxToMin);
            priceKeys.map(function(key, idx){
                parent.insertAdjacentElement('afterbegin', sortByPrice[key]['element']);
            });

        } else if (target === byName) {
            const titles = Array.from(document.querySelectorAll('.products__item-title'));
            const titlesArr = []
        
            titles.forEach(title => {
                const titleText = title.textContent
                titlesArr.push(titleText)
            })

            nameKeys.sort(funcByName);

            nameKeys.map(function(key, idx){
                parent.insertAdjacentElement('afterbegin', sortByName[key]['element']);
            });
        }
    })

}

sortingProducts();

function fromMinToMax(a, b) {
    a = parseInt(a);
    b = parseInt(b);
    if (a < b) return 1;
    if (a > b) return -1;
}

function fromMaxToMin(a, b) {
    a = parseInt(a);
    b = parseInt(b);
    if (a < b) return -1;
    if (a > b) return 1;
}

function funcByName(a, b) {  
    const nameA = a.toLowerCase(), 
          nameB=b.toLowerCase();

    if (nameA[nameA.length - 1] > nameB[nameB.length - 1])
        return -1;
    else if (nameA[nameA.length - 1] < nameB[nameB.length - 1])
        return 1;

    return 0;
}

