import { formatToMilliseconds } from "../backend/helper";

let tags = {};
let selectedTags = [];
let products = [];


$(async () => {
    // load products
    products  = await loadProducts();
    renderProducts(products);
    // add listeners
    addTagListeners(products);
});


function addTagListeners(){
    $('.tag').on('click', event => {
        console.log(event);
        let clickedTag = $(event.currentTarget);
        clickedTag.toggleClass('active');
        selectedTags.splice(0, selectedTags.length);
        $('#tagsContainer .tag.active').each((_, tag) => selectedTags.push($(tag).attr('data-name')));
        let filteredProducts = products.filter(f => selectedTags.every(tag => f.tags.includes(tag)));
        updateProducts(filteredProducts);
    });
}

async function loadProducts() {
    try {
        const productResponse = await fetch("/produkt/alle/");
        var products = productResponse.json();
        products.forEach(product => {
            const BildResponse = await fetch("/produktbild/gib/" + product.id);
            product.img = BildResponse.json().BildPfad;
            const tagResponse = await fetch("/")
            product.tags = 
        })
    } catch (exception) {
        console.log(exception);
        return;
    }
    return products;
}

function updateProducts(products) {
    const productContainer = $('#productsContainer');
    productContainer.empty();
    let currentTags = {};
    products.forEach(product => {
        const newProduct = createProduct(product);
        productContainer.append(newProduct);
        product.tags.forEach( tag => {
            if (!(tag in currentTags)) {
                currentTags[tag] = 0;
            } 
            currentTags[tag] += 1;
        });
    });
    updateTags(currentTags);
}

function updateTags(currentTags) {
    const tagsContainer = $('#tagsContainer');
    tagsContainer.empty();
    Object.keys(tags).forEach(tag => {
        if (tag in currentTags) {
            tags[tag] = currentTags[tag];
        } else {
            tags[tag] = 0;
        }
        const tagElement = createTag(tag, tags[tag], selectedTags.includes(tag));
        tagsContainer.append(tagElement);
    });
    addTagListeners();
}

function renderProducts(products) {
    const productContainer = $('#productsContainer');
    productContainer.empty();
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
        const tag = createTag(key, tags[key], false);
        tagsContainer.append(tag);
    });
}

function createProduct(data) {
    const product = $('<div class="card m-2" style="width: 15rem;" href="/product.html?id=' + data.id + '"/>');
    let img = $('<img class="card-img-top"/>');
    img.attr('src', data.img);
    const body = $('<div class="card-body"/>');
    const title = $('<h5 class="card-title"/>');
    title.text(data.Bezeichnung);
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

function createTag(name, count, active) {
    const tag = $('<a href="#" class="list-group-item tag"/>')
    if (active) {
        tag.addClass('active');
    }
    const counter = $('<span class="float-right badge badge-light round"/>')
    counter.text(count)
    tag.text(name);
    tag.attr("data-name", name)
    tag.append(counter);
    return tag;
}

