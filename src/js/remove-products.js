const createNoItemsText = () => {
 return (`<div class="products__no-items">
     <p>Товаров пока нет. Добавьте первый</p>
 </div>`)
}

const renderContent = (elem, template, place = `beforeend`) =>
    elem.insertAdjacentHTML(place, template);


const removeItemFromPage = () => {
  const delBtns = document.querySelectorAll('.products__item-del');

  if(delBtns) {
    delBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            const products = Array.from(document.querySelectorAll('.products__item')),
                product = btn.closest('.products__item'),
                productIndex = products.indexOf(product);

            if(products.length < 2) {
                product.style.display = 'none';
                addTextAfterDeletion(product.closest('.products__list'));

            } else if(products.length > 1) {
                product.remove();
                products.splice(productIndex, 1);
            }
        })
    })
}
}

removeItemFromPage();

const addTextAfterDeletion = (el) => {
    renderContent(el, createNoItemsText());
}
