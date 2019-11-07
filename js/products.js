$(async () => {
    // load products
    let products  = await loadProducts();
    // add listeners
    await addTagListeners();
});

let tags = [];

async function addTagListeners(){
    $('.tag').on('click', event => {
        let clickedTag = $(event.currentTarget);
        clickedTag.toggleClass('active');
        tags = $('#tagsContainer .tag').map(k => $(k).text());
        console.log(tags);
    })
}

async function loadProducts() {
    let products =  [
            {img: "https://via.placeholder.com/150", id: 1, title: "Test", tags: ["Animals"], photograph: "Unkown", price: 1000.33},
            {img: "https://via.placeholder.com/150", id: 2, title: "Test2", tags: ["Animals", "Rom"], photograph: "BigTH", price: 7777.33},
            {img: "https://via.placeholder.com/150", id: 3, title: "Test3", tags: ["Hiking", "Alpen"], photograph: "Unkown", price: 135.33},
            {img: "https://via.placeholder.com/150", id: 4, title: "Test4", tags: ["China", "Country"], photograph: "BigTH", price: 5000.33},
            {img: "https://via.placeholder.com/150", id: 5, title: "Test5", tags: ["Cars"], photograph: "Unkown", price: 100.33},
            {img: "https://via.placeholder.com/150", id: 6, title: "Test6", tags: ["Nachaufnamen"], photograph: "BigTH", price: 2000.33},
        ];
    renderProducts(products);
}

function renderProducts(products) {
    const productContainer = $('#productsContainer');
    productContainer.empty();
    let tags = {};
    const tagsContainer = $('#tagsContainer');
    tagsContainer.empty();
    products.forEach(product => {
        const newProduct = createProduct(product);
        product.tags.forEach( tag => {
            if (!(tag in tags)) {
                tags[tag] = 0;
            } 
            tags[tag] += 1;
        })
        productContainer.append(newProduct);
    });

    Object.keys(tags).forEach(key => {
        const tag = createTag(key, tags[key]);
        tagsContainer.append(tag);
    });
}

function createProduct(data) {
    const product = $('<div class="card m-2" style="width: 15rem;" href="/product.html?id=' + data.id + '"/>');
    let img = $('<img class="card-img-top"/>');
    img.attr('src', data.img);
    const body = $('<div class="card-body"/>');
    const title = $('<h5 class="card-title"/>');
    title.text(data.title);
    body.append(title);
    const tags = $('<div class="tags"/>');
    data.tags.forEach(itag => {
        const tag = $('<span class="tag badge badge-fill badge-primary mr-2"/>');
        tag.text(itag);
        tags.append(tag);
    });
    body.append(tags);
    product.append(img);
    product.append(body);
    return product;
}

function createTag(name, count) {
    const tag = $('<a href="#" class="list-group-item tag"/>')
    const counter = $('<span class="float-right badge badge-light round"/>')
    counter.text(count)
    tag.text(name);
    tag.append(counter);
    return tag;
}

