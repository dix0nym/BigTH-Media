$(async() => {
    console.log("loaded");
    await loadHeader("header2.html", "successNav");
    await loadFooter("footer.html");
    await loadDownloads();
});

async function loadDownloads() {
    const customer = getCustomer();
    if (customer === undefined || customer === null) {
        $('.success-card').hide();
        $('#error').append('<span class="mr-2">you didn\'t bought anything - try again!</span<');
        $('#error').append('<a href="/index.html"><i class="fa fa-home"></i></a>');
        $('#error').show();
        return;
    }
    if ('orderpositions' in customer) {
        let orderpositions = customer.orderpositions;
        const tbody = $('#dl-table-body');
        for (let pos of orderpositions) {
            let row = createDownloadRow(pos.product, pos.uuid);
            tbody.append(row);
        }
    }
    clearCart();
    clearCustomer();
}

function createDownloadRow(product, uuid) {
    const row = $('<tr />');
    const col2 = $('<th class="align-middle p-1"><img class="img-responsive alt="preview" height="48" width="48" src="../media/resized/' + product.filename + '" /></th>');
    row.append(col2);
    const col3 = $('<th class="align-middle">' + product.title + '</th>');
    row.append(col3);
    const col4 = $('<th class="align-middle"><a href="/api/download/' + uuid + '"><i class="fa fa-download"></i></a></th>');
    row.append(col4);
    return row;
}