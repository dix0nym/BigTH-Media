$(async() => {
    console.log("loaded");
    await loadHeader("header2.html", "paymentMethodeNav");
    await loadFooter("footer.html");
    listenRadio();
    hide();
});

function listenRadio() {
    let radios = $('.container > .card > .card-body > .card-title > input[type=radio]');
    radios.each((idx, radio) => {
        $(radio).change(() => {
            if ($(radio).is(':checked')) {
                $(radios).not(radio).prop('checked', false);
            }
            hide();
        })
    })
}

function hide() {
    let cards = $(".container > .card");
    cards.each((idx, item) => {
        let radio = $(item).find('.card-body > .card-title > input');
        let body = $(item).find('.card-body > .list-group');
        if (radio.prop('checked')) {
            body.show();
        } else {
            body.hide();
        }
    });
}

$('.card-body').on('click', event => {
    var target = event.currentTarget;
    var radioBtn = $(target).find('input');
    $(radioBtn).prop('checked', true);
    $(radioBtn).trigger('change');
});

$('.submitBtn').on('click', (event) => {
    event.preventDefault();
    const clickedButton = $(event.currentTarget);
    const paymentid = clickedButton.attr("data-id");
    let customer = getCustomer();
    let cart = getCart();
    cart = Object.keys(cart).map((key) => {
        return { id: key, amount: cart[key] };
    });
    // create order
    $.post('/api/order/', { customerid: customer.id, paymentid: paymentid, orderposition: cart }, (response) => {
        customer.orderpositions = response.data.orderpositions;
        setCustomer(customer);
        window.location.href = '/pages/success.html';
    }, 'json').fail(response => {
        $('#error').text(response.responseJSON.msg);
        $('#error').show();
    });
});