jQuery(function () {
    $('.submit-new-form').on('click', function () {
        $('#newExpenseText').css('display', 'none');
        $('#newSpinner').css('display', 'block');
        $.ajax({
            url: '/items/' + this.id + "/expenses",
            method: 'POST',
            data: $('#modalNewForm').serialize()
        })
            .always(function () {
                $('#newExpenseText').css('display', 'inline');
                $('#newSpinner').css('display', 'none');
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
                console.log(d)
                console.log(dateTimeLocalValue)
                $('#modalEditForm #editExpenseName').val(data.name);
                $('#modalEditForm #editExpenseValue').val((data.value / 100));
                $('#modalEditForm #editDate').val(dateTimeLocalValue);
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

    $("#editModal").on('hide.bs.modal', function (e) {
        $('#modalEditForm')[0].reset();
    })

    $('.submit-edit-form').on('click', function () {
        $('#editExpenseText').css('display', 'none');
        $('#editSpinner').css('display', 'block');
        let itemId = $(this).attr('data-itemid');
        let id = $(this).attr('data-id');
        $.ajax({
            url: '/items/' + itemId + "/expenses/" + id,
            method: 'PUT',
            data: $('#modalEditForm').serialize()
        })
            .always(function () {
                $('#editExpenseText').css('display', 'inline');
                $('#editSpinner').css('display', 'none');
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
