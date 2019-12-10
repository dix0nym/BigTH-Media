$(async () => {
    let prodcut = await loadData();
});

async function loadData() {
    let searchParams = new URLSearchParams(window.location.search);
    if (!(searchParams.has('id'))) {
        console.log("ERROR");
    }
    let id = searchParams.get('id');
    try {
        const response = await fetch("/api/products/gib/" + id);
        var product = response.json();
    } catch (exception) {
        console.log(exception);
        return;
    }
    renderProduct(product);
}

function renderProduct(data) {
    const container = $('#productContainer');
    const img = $('<img class="card-img-top" alt="product"/>')
    img.attr('src', data.img);
    const body = $('<div class="card-body"/>');
    const title = $('<h5 class="card-title"/>');
    title.text(data.title);
    body.append(body);
    const text =$('<p class="card-text"/>');
    text.text(data.text);
    body.append(text);

    const body2 = body.clone();
    const btnBuy = $('<a class="btn btn-primary" id="buyBtn"/>');
    btnBuy.click(async () => {
        addToCart(data);
    });
    body2.append(btnBuy);

    container.append(img);
    container.append(body);
    container.append(body2);
}
