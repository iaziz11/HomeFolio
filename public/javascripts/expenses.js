jQuery(function () {
  const militaryToStandardTime = (time) => {
    time = time.split(":");
    let hours = Number(time[0]);
    let minutes = Number(time[1]);
    let timeValue;
    if (hours > 0 && hours <= 12) {
      timeValue = "" + hours;
    } else if (hours > 12) {
      timeValue = "" + (hours - 12);
    } else if (hours == 0) {
      timeValue = "12";
    }
    timeValue += minutes < 10 ? ":0" + minutes : ":" + minutes;
    timeValue += hours >= 12 ? " P.M." : " A.M.";
    return timeValue;
  };

  $(".submit-new-form").on("click", function () {
    $("#modalNewForm").addClass("was-validated");
    if (!document.querySelector("#modalNewForm").checkValidity()) {
      return;
    }
    $("#newExpenseText").css("display", "none");
    $("#newSpinner").css("display", "block");
    $.ajax({
      url: "/folios/" + this.id + "/expenses",
      method: "POST",
      data: $("#modalNewForm").serialize(),
    })
      .always(function () {
        $("#newExpenseText").css("display", "inline");
        $("#newSpinner").css("display", "none");
      })
      .done(function () {
        console.log("Added successfully!");
        window.location.reload();
      })
      .fail(function (xhr, status, errorThrown) {
        alert("Sorry, there was a problem!");
        console.log("Error: " + errorThrown);
        console.log("Status: " + status);
        console.dir(xhr);
      });
  });

  $("#editModal").on("show.bs.modal", function (e) {
    const button = e.relatedTarget;

    $.ajax({
      url:
        "/folios/" +
        button.getAttribute("data-bs-itemid") +
        "/expenses/" +
        button.getAttribute("data-bs-id"),
      method: "GET",
    })
      .done(function (data) {
        let newDate = new Date(data.date);
        let editDate =
          newDate.getFullYear() +
          "-" +
          ("0" + (newDate.getMonth() + 1)).slice(-2) +
          "-" +
          ("0" + newDate.getDate()).slice(-2) +
          "T" +
          ("0" + newDate.getHours()).slice(-2) +
          ":" +
          ("0" + newDate.getMinutes()).slice(-2);
        $("#modalEditForm #editExpenseName").val(data.name);
        $("#modalEditForm #editExpenseValue").val(data.value / 100);
        $("#modalEditForm #editDate").val(editDate);
        $(".submit-edit-form").attr(
          "data-itemid",
          $(button).attr("data-bs-itemid")
        );
        $(".submit-edit-form").attr("data-id", $(button).attr("data-bs-id"));
      })
      .fail(function (xhr, status, errorThrown) {
        alert("Sorry, there was a problem!");
        console.log("Error: " + errorThrown);
        console.log("Status: " + status);
        console.dir(xhr);
      });
  });

  $("#editModal").on("hide.bs.modal", function (e) {
    $("#modalEditForm").removeClass("was-validated");
    $("#modalEditForm")[0].reset();
  });

  $("#newModal").on("hide.bs.modal", function (e) {
    $("#modalNewForm").removeClass("was-validated");
  });

  $(".submit-edit-form").on("click", function () {
    $("#modalEditForm").addClass("was-validated");
    if (!document.querySelector("#modalEditForm").checkValidity()) {
      return;
    }
    $("#editExpenseText").css("display", "none");
    $("#editSpinner").css("display", "block");
    let itemId = $(this).attr("data-itemid");
    let id = $(this).attr("data-id");
    $.ajax({
      url: "/folios/" + itemId + "/expenses/" + id,
      method: "PUT",
      data: $("#modalEditForm").serialize(),
    })
      .always(function () {
        $("#editExpenseText").css("display", "inline");
        $("#editSpinner").css("display", "none");
      })
      .done(function () {
        console.log("Added successfully!");
        window.location.reload();
      })
      .fail(function (xhr, status, errorThrown) {
        alert("Sorry, there was a problem!");
        console.log("Error: " + errorThrown);
        console.log("Status: " + status);
        console.dir(xhr);
      });
  });

  $("#deleteModal").on("show.bs.modal", function (e) {
    const button = e.relatedTarget;
    let id = button.getAttribute("data-id");
    let itemId = button.getAttribute("data-itemid");
    $(".delete-button").attr("data-itemid", itemId);
    $(".delete-button").attr("data-id", id);
  });

  $(".delete-button").on("click", function (e) {
    let id = $(".delete-button").attr("data-id");
    let itemId = $(".delete-button").attr("data-itemid");
    $("#deleteReminderText").css("display", "none");
    $("#deleteSpinner").css("display", "block");
    $.ajax({
      url: "/folios/" + itemId + "/expenses/" + id,
      type: "DELETE",
    })
      .always(function () {
        $("#deleteReminderText").css("display", "inline");
        $("#deleteSpinner").css("display", "none");
      })
      .done(function () {
        console.log("Deleted successfully!");
        window.location.reload();
      })
      .fail(function (xhr, status, errorThrown) {
        alert("Sorry, there was a problem!");
        console.log("Error: " + errorThrown);
        console.log("Status: " + status);
        console.dir(xhr);
      });
  });

  $("#dateRange").on("change", function () {
    let itemId = $("#dateRange").attr("data-itemid");
    $.ajax({
      url:
        "/folios/" +
        itemId +
        "/expenses/updateRange?time=" +
        $("#dateRange").val(),
      type: "GET",
    })
      .done(function ({ expenses, total }) {
        console.log(expenses);
        if (!expenses.length) {
          $("#expenseTable").html(
            "<thead><tr><th class='text-center'>No expenses to display</th></tr></thead>"
          );
        } else {
          $("#expenseTable").html(
            `<thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Date</th>
                    <th scope="col">File</th>
                    <th scope="col">Expense</th>
                    <th></th>
                  </tr>
                </thead>
            ${expenses.map((e) => {
              let newDate = new Date(e.date);
              return `
                <tr class="tr-hover">
                    <td class="align-middle">${e.name}</td>
                    <td class="align-middle">
                      ${
                        newDate.getMonth() +
                        1 +
                        "/" +
                        newDate.getDate() +
                        "/" +
                        newDate.getFullYear() +
                        " @ " +
                        militaryToStandardTime(
                          `${newDate.getHours()}:${newDate.getMinutes()}`
                        )
                      }
                    </td>
                    <td class="align-middle">
                      ${
                        e.file
                          ? `<a href=${e.file.url} target='_blank'>View File</a>`
                          : ""
                      }
                    </td>
                    <td class="align-middle">$${(e.value / 100).toFixed(2)}</td>
                    <td class="align-middle">
                      <button
                        class="btn btn-primary btn-sm"
                        data-bs-toggle="modal"
                        data-bs-target="#editModal"
                        data-bs-id="${e._id}"
                        data-bs-itemid="${itemId}"
                      >
                        <i class="bi bi-pencil-square"></i>
                      </button>
                      <button
                        class="btn btn-danger btn-sm"
                        data-bs-toggle="modal"
                        data-bs-target="#deleteModal"
                        data-id="${e._id}"
                        data-itemid="${itemId}"
                      >
                        <i class="bi bi-trash-fill"></i>
                      </button>
                    </td>
                  </tr>`;
            })}
            <tfoot>
              <tr>
                <th>Total</th>
                <td colspan="2"></td>
                <td>$${(total / 100).toFixed(2)}</td>
                <td></td>
              </tr>
            </tfoot>`
          );
        }
      })
      .fail(function (xhr, status, errorThrown) {
        alert("Sorry, there was a problem!");
        console.log("Error: " + errorThrown);
        console.log("Status: " + status);
        console.dir(xhr);
      });
  });
});
