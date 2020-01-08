$(async () => {
    console.log("loaded");
    await loadHeader("header2.html", "");
    await loadFooter("footer.html");
    await loadCountry();
});

async function loadCountry() {
    try {
        var countryResponse = await fetch("/api/country/all/");
        var countryJson = await countryResponse.json();
        var select = $('#inputCountry');
        for(var country of countryJson.data) {
            var option = $('<option value="' + country.id + '">' + country.name + '</option>');
            select.append(option);
        }
    } catch (exception) {
        console.log(exception);
        return;
    }
}

$('#personal-information').on('submit', () => {
    var formData = $("form#personal-information").serializeArray();
    var formData = formData.reduce(function(map, obj) {
        map[obj.name] = obj.value;
        return map;
    }, {});
    console.log(formData);
    var addressData = {street: formData.street, number: formData.number, additionaladdressinfo: formData.additionaladdressinfo, zip: formData.zip, city: formData.city, countryid: formData.countryid };
    $.post("/api/address", addressData, (data) => {
        console.log(data);
        var customerData = {title: formData.title, name: formData.name, surname: formData.surname, addressid: data.data.id, phonenumber: formData.phonenumber, mail: formData.mail, dateofbirth: formData.dateofbirth};
        $.post("/api/customer", customerData, (data) => {
            console.log(data);
            setCustomer(data.data);
            window.location.href = "payment.html";
        }, "json").fail(response => {
            console.log(response.responseJSON.msg);
            $('#error').text(response.responseJSON.msg);
            $('#error').show();
        });
    }, "json" ).fail(response => {
        console.log(response.responseJSON.msg);
        $('#error').text(response.responseJSON.msg);
        $('#error').show();
    });
    return false;
});