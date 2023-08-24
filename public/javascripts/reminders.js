jQuery(function () {
    $('.submit-new-form').on('click', function () {
        $.ajax({
            url: '/items/' + this.id + "/reminders",
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

    $('.form-check-input').on('change', function () {
        let sendData = this.name + '=' + this.checked;
        let url = '/items/' + $(this).attr('data-itemid') + '/reminders/' + $(this).attr('data-id') + '/toggleCompleted'
        $.ajax({
            url,
            method: 'PUT',
            data: sendData
        })
            .done(function () {
                console.log('Changed successfully!')
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
            url: '/items/' + button.getAttribute('data-bs-itemid') + "/reminders/" + button.getAttribute('data-bs-id'),
            method: 'GET'
        })
            .done(function (data) {
                const d = new Date(data.nextDate);
                const dateTimeLocalValue = (new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString()).slice(0, -1);
                $('#modalEditForm #text').val(data.text);
                $('#modalEditForm #recurring').prop('checked', data.recurring);
                $('#modalEditForm #nextDate').val(dateTimeLocalValue);
                $(`#modalEditForm #every option[value='${data.every.join(' ')}']`).attr('selected', 'true');
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
            url: '/items/' + itemId + "/reminders/" + id,
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
        console.log("/items/" + itemId + '/reminders/' + id)
        $.ajax({
            url: "/items/" + itemId + '/reminders/' + id,
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

