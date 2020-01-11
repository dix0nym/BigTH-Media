$(async() => {
    let cart = getCart();
    await loadData(cart);

});

/*
TODO Sven: differentiate between product types: sales and pictures
*/
async function loadData(cart) {
    let data = [];

    for (var id in cart) {
        try {
            const url = (parseInt(id) > 1000) ? "/api/sales/get/" + id : "/api/product/get/" + id;
            const response = await fetch(url);
            if (!response.ok) {
                console.log("failed to get product/sales", response);
                return data;
            }
            var product = await response.json();
            product = product.data;
            product.qty = cart[id]
            data.push(product);
        } catch (exception) {
            console.log(exception);
            return;
        }
    };
    await createCartEntries(data);
}

function createRow(rowdata) {
    let row = $('<div class="row cart-entry mb-2"/>');

    let imgWrapper = $('<div class="col-xs-2 col-md-2"/>');
    let productImg = $('<img class="img-responsive alt="preview"/>');
    productImg.attr('src', "../media/resized/" + rowdata.filename);
    imgWrapper.append(productImg);
    row.append(imgWrapper)

    let titlewrapper = $('<div class="col-xs-4 col-md-6"/>');
    let title = $('<h4 class="product-name"><strong>' + rowdata.title + '</strong></h4>');
    let desc = $('<h4><small>' + rowdata.details + '</small></h4>');
    titlewrapper.append(title)
    titlewrapper.append(desc);
    row.append(titlewrapper)

    let priceQtyWrapper = $('<div class="col-xs-6 col-md-4 row align-self-center"/>');
    let priceWrapper = $('<div class="col-xs-4 col-md-4 text-right align-self-center" style="padding-top: 5px"/>');
    let price = $('<h6><strong><div id="price">' + rowdata.grossprice + '</div> (' + rowdata.netprice + ' + ' + rowdata.vat.percentage + '%) <span class="text-muted">x</span></strong</h6>');
    priceWrapper.append(price);
    priceQtyWrapper.append(priceWrapper);

    let qtyWrapper = $('<div class="col-xs-6 col-md-6">');
    let qtyInputGroup = $('<div class="input-group"/>');
    let qtyInputGroupPrepend = $('<div class="input-group-prepend"><button data-id="' + rowdata.id + '" style="min-width: 2.5rem;" class="btn btn-decrement btn-outline-secondary btnRedQty" type="button"><strong>-</strong></button></div>');
    let qtyInput = $('<input type="text" id="qtyInput" style="text-align: center;" class="form-control" value="' + parseInt(rowdata.qty) + '"/>');
    let qtyInputGroupAppend = $('<div class="input-group-append"><button data-id="' + rowdata.id + '" style="min-width: 2.5rem;" class="btn btn-increment btn-outline-secondary btnAddQty" type="button"><strong>+</strong></button></div>');
    qtyInputGroup.append(qtyInputGroupPrepend);
    qtyInputGroup.append(qtyInput);
    qtyInputGroup.append(qtyInputGroupAppend);
    qtyWrapper.append(qtyInputGroup);
    priceQtyWrapper.append(qtyWrapper);

    let removeBtnWrapper = $('<div class="col-xs-2 col-md-2"/>');
    let removeBtn = $('<button data-id="' + rowdata.id + '" type="button" class="btn btn-outline-danger btn-xs deleteEntryBtn"><i class="fa fa-trash" aria-hidden="true"></i></button>');
    removeBtnWrapper.append(removeBtn);
    priceQtyWrapper.append(removeBtnWrapper);

    row.append(priceQtyWrapper);
    return row;
}

async function createCartEntries(data) {
    let container = $("#cart-container")
    container.empty();
    if (data.length == 0) {
        container.append('<div class="text-center text-muted">shopping cart is empty</div>')
    } else {
        let total = 0;
        data.forEach(rowdata => {
            let row = createRow(rowdata);
            container.append(row);
            total += rowdata.brutto * rowdata.qty;
        });
        $('div#price-wrapper > b').first().text(Number(total).toFixed(2) + '€');
        $('.deleteEntryBtn', container).click(async(clickedButtonEvent) => deleteCartEntry(clickedButtonEvent));
        $('.btnAddQty', container).click(async(clickedButtonEvent) => addQty(clickedButtonEvent));
        $('.btnRedQty', container).click(async(clickedButtonEvent) => removeQty(clickedButtonEvent));
        calcTotal();
    }
}

async function deleteCartEntry(clickedButtonEvent) {
    const clickedButton = $(clickedButtonEvent.currentTarget);
    const entryIdToDelete = clickedButton.attr("data-id");
    console.log(entryIdToDelete);

    let cart = getCart();
    if (entryIdToDelete in cart) {
        delete cart[entryIdToDelete];
        const entryRow = clickedButton.parents(".cart-entry");
        entryRow.remove();
        setCart(cart);
        if (cart.length == 0) {
            $("#cart-container").append('<div class="text-center text-muted">shopping cart is empty</div>')
        }
    } else {
        console.log(entryIdToDelete, "not in cart");
    }
}

async function addQty(clickedButtonEvent) {
    const clickedButton = $(clickedButtonEvent.currentTarget);
    const id = clickedButton.attr("data-id");
    console.log(id);

    let cart = getCart();
    if (id in cart) {
        cart[id] += 1;
        $('input#qtyInput').val(cart[id]);
        setCart(cart);
    }
    calcTotal();
}

function calcTotal() {
    let total = 0;
    $('#cart-container > div.row').each((idx, item) => {
        let price = $(item).find('div#price').text();
        let qty = $(item).find('input#qtyInput').val()
        console.log(idx, price, qty, price * qty);
        total += price * qty;
    });
    $('div#price-wrapper > b').first().text(Number(total).toFixed(2) + '€');
}

async function removeQty(clickedButtonEvent) {
    const clickedButton = $(clickedButtonEvent.currentTarget);
    const id = clickedButton.attr("data-id");
    console.log(id);

    let cart = getCart();
    if (id in cart) {
        cart[id] -= 1;
        setCart(cart);
        if (cart[id] <= 0) {
            delete cart[id]
            deleteCartEntry(clickedButtonEvent);
            setCart(cart);
        } else {
            $('input#qtyInput').val(cart[id]);
        }
    }
    calcTotal();
}

$('#buyBtn').on('click', () => {
    if (Object.keys(getCart()).length > 0) {
        window.location.href = '/pages/checkout.html';
    } else {
        $('#error').text("Cart is empty");
        $('#error').show();
    }
});