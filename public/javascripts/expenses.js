jQuery(function () {
    $('.submit-new-form').on('click', function () {
        $.ajax({
            url: '/items/' + this.id + "/expenses",
            method: 'POST',
            data: $('#modalNewForm').serialize()
        })
            .done(function () {
                console.log('Added successfully!')
                window.location.reload()
            })
            .fail(function (xhr, status, errorThrown) {
                alert("Sorry, there was a problem!");
                console.log("Error: " + errorThrown);
                console.log("Status: " + status);
                console.dir(xhr);
            })
    })

    $("#editModal").on('show.bs.modal', function (e) {
        const button = e.relatedTarget
        $.ajax({
            url: '/items/' + button.getAttribute('data-bs-itemid') + "/expenses/" + button.getAttribute('data-bs-id'),
            method: 'GET'
        })
            .done(function (data) {
                const d = new Date(data.date);
                const dateTimeLocalValue = (new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString()).slice(0, -1);
                $('#modalEditForm #name').val(data.name);
                $('#modalEditForm #value').val(data.value);
                $('#modalEditForm #date').val(dateTimeLocalValue);
                $('.submit-edit-form').attr('data-itemid', $(button).attr('data-bs-itemid'));
                $('.submit-edit-form').attr('data-id', $(button).attr('data-bs-id'))
            })
            .fail(function (xhr, status, errorThrown) {
                alert("Sorry, there was a problem!");
                console.log("Error: " + errorThrown);
                console.log("Status: " + status);
                console.dir(xhr);
            })
    })

    $('.submit-edit-form').on('click', function () {
        let itemId = $(this).attr('data-itemid');
        let id = $(this).attr('data-id');
        $.ajax({
            url: '/items/' + itemId + "/expenses/" + id,
            method: 'PUT',
            data: $('#modalEditForm').serialize()
        })
            .done(function () {
                console.log('Added successfully!')
                window.location.reload()
            })
            .fail(function (xhr, status, errorThrown) {
                alert("Sorry, there was a problem!");
                console.log("Error: " + errorThrown);
                console.log("Status: " + status);
                console.dir(xhr);
            })
    })

    $('.delete-button').on('click', function () {
        let id = $(this).attr('data-id')
        let itemId = $(this).attr('data-itemid')
        $.ajax({
            url: "/items/" + itemId + '/expenses/' + id,
            type: 'DELETE'
        })
            .done(function () {
                console.log('Deleted successfully!')
                window.location.reload()
            })
            .fail(function (xhr, status, errorThrown) {
                alert("Sorry, there was a problem!");
                console.log("Error: " + errorThrown);
                console.log("Status: " + status);
                console.dir(xhr);
            })
    })
})
