$(async () => {
    console.log("loaded");
    await loadHeader("header2.html", "paymentMethodeNav");
    await loadFooter("footer.html");
    listenRadio();
    hide();
});

function listenRadio() {
    let radios = $('.container > .card > .card-body > .card-title > input[type=radio]');
    radios.each( (idx, radio) => {
        $(radio).change( () => {
            if ($(radio).is(':checked')) {
                $(radios).not(radio).prop('checked', false);
            }
            hide();
        })
    })
}

function hide() {
    let cards = $(".container > .card");
    cards.each( (idx, item) => {
        let radio = $(item).find('.card-body > .card-title > input');
        let body = $(item).find('.card-body > .list-group');
        if (radio.prop('checked')) {
            body.show();
        } else {
            body.hide();
        }
    });
}