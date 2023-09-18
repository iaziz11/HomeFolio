jQuery(function () {
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

  $(".delete-button").on("click", function () {
    let id = $(this).attr("data-id");
    let itemId = $(this).attr("data-itemid");
    $.ajax({
      url: "/folios/" + itemId + "/expenses/" + id,
      type: "DELETE",
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
});
