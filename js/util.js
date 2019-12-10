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

function addToCart(item) {
    // {id: qty}
    let cart = getCart();
    
    if (item.id in cart) {
        cart[item.id].qty += 1;
    } else {
        cart[item.id] = qty;
    }
    sessionStorage.setItem('cart', JSON.stringify(cart));
    sessionStorage.setItem('total', getTotal());
}

function getTotal() {
    let total = 0;
    let cart = getCart();
    cart.forEach(key => {
        total += cart[key].price * cart[key].qty;
    });
    return total;
}

function removeFromCart(item) {
    if (!('cart' in sessionStorage)) {
        console.log('cant remove item from empty cart!');
    }
    var cart = sessionStorage.getItem('cart');
    if (item.id in card) {
        delete card[item.id];
    }
    sessionStorage.setItem('cart', JSON.stringify(cart));
    sessionStorage.setItem('total', getTotal(cart));
}