$(async () => {
    let cart = getCart();
    let data = await loadData(cart);
    await createCartEntries(data);
});

async function loadData(cart) {
    let data = {}
    cart.forEach(id => {
        try {
            const response = await fetch("/api/products/" + id);
            var product = response.json();
        } catch (exception) {
            console.log(exception);
            return;
        }
        data[id] = {id: product.id, img_src: product.img_src, title: product.title, desc: product.desc, price: product.price, qty: cart[id].qty}
    });
    return data;
}

function createRow(rowdata) {
    // rowdata: {id, img_src, title, desc, price, qty }
    let row = $('<div class="row"/>');
    
    let imgWrapper = $('<div class="col-xs-2 col-md-2"/>');
    let productImg = $('<img class="img-responsive alt="preview"/>');
    productImg.attr('src', rowdata.img_src);
    imgWrapper.append(productImg);
    row.append(imgWrapper)

    let titlewrapper = $('<div class="col-xs-4 col-md-6"/>');
    let title = $('<h4 class="product-name"><strong>' + rowdata.title + '</strong></h4>');
    let desc = $('<h4><small>' + rowdata.desc + '</small></h4>');
    titlewrapper.append(title)
    titlewrapper.append(desc);
    row.append(titlewrapper)

    let priceQtyWrapper = $('<div class="col-xs-6 col-md-4 row align-self-center"/>');
    let priceWrapper = $('<div class="col-xs-4 col-md-4 text-right align-self-center" style="padding-top: 5px"/>');
    let price = $('<h6><strong>' + rowdata.price + ' <span class="text-muted">x</span></strong</h6>');
    priceWrapper.append(price);
    priceQtyWrapper.append(priceWrapper);

    let qtyWrapper = $('<div class="col-xs-6 col-md-6">');
    let qtyInputGroup = $('<div class="input-group"/>');
    let qtyInputGroupPrepend = $('<div class="input-group-prepend"><button style="min-width: 2.5rem;" class="btn btn-decrement btn-outline-secondary" type="button"><strong>-</strong></button></div>');
    let qtyInput = $('<input type="text" style="text-align: center;" class="form-control" value="' + parseInt(rowdata.qty) + '"/>');
    let qtyInputGroupAppend = $('<div class="input-group-append"><button style="min-width: 2.5rem;" class="btn btn-increment btn-outline-secondary" type="button"><strong>+</strong></button></div>');
    qtyInputGroup.append(qtyInputGroupPrepend);
    qtyInputGroup.append(qtyInput);
    qtyInputGroup.append(qtyInputGroupAppend);
    qtyWrapper.append(qtyInputGroup);
    priceQtyWrapper.append(qtyWrapper);

    let removeBtnWrapper = $('<div class="col-xs-2 col-md-2"/>');
    let removeBtn = $('<button data-id=' + rowdata.id + 'type="button" class="btn btn-outline-danger btn-xs"><i class="fa fa-trash" aria-hidden="true"></i></button>');
    removeBtnWrapper.append(removeBtn);
    priceQtyWrapper.append(removeBtnWrapper);

    row.append(priceQtyWrapper);
    return row;
}

async function createCartEntries(data){
    let container = $("#cart-container")
    data.forEach(id => {
        let row = createRow(data[id]);
        container.append(row);
    });
}

async function deleteCartEntry(clickedButtonEvent) {
    const clickedButton = $(clickedButtonEvent.currentTarget);
    const entryIdToDelete = clickedButton.attr("data-id");

    let cart = getCart();
    if (entryIdToDelete in cart) {
        delete cart[entryIdToDelete];
        const entryRow = clickedButton.parents(".cart-entry");
        entryRow.remove();
    } else {
        console.log(entryIdToDelete, "not in cart");
    }
}