$(async () => {
    console.log("loaded");
    await setNavbarActive();
    console.log("finished");
});

async function setNavbarActive() {
    console.log("function start")
    console.log($("#personalInfoNav"))
    $("li.nav-item > a.nav-link").each( (idx, nav) => {
        console.log(nav.attr('id'))
        if (nav.attr('id') === 'paymentMethodeNav') {
            nav.addClass('active');
            console.log("active")
        } else {
            nav.addClass('disabled')
            console.log('disabled');
        }
    });
}