async function loadHeader(path, activeId) {
    $("#header").load(path, () => {
        setNavItemActive(activeId)
    });
}

async function loadFooter(path) {
    $("#footer").load(path);
}

function setNavItemActive(id) {
    $("li.nav-item").each( (idx, item) => {
        let nav = $(item);
        if (nav.attr('id') === id) {
            nav.addClass('active');
            nav.removeClass('disabled');
        } else {
            nav.addClass('disabled')
            nav.removeClass('active')
        }
    });
}

function getCart() {
    if ('cart' in sessionStorage) {
        return JSON.parse(sessionStorage.getItem('cart'));
    } else {
        return {}
    }
}

function setCart(cart) {
    sessionStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(id) {
    let cart = getCart();
    console.log(JSON.stringify(cart));
    if (id in cart) {
        cart[id] += 1;
    } else {
        cart[id] = 1;
    }
    setCart(cart);
    console.log(JSON.stringify(cart));
}

function removeFromCart(item) {
    let cart = getCart();
    if (item.id in card) {
        delete card[item.id];
        setCart(cart);
    }
}

function setCustomer(customer) {
    sessionStorage.setItem('customer', JSON.stringify(customer));
}

function getCustomer() {
    return JSON.parse(sessionStorage.getItem('customer'));
}