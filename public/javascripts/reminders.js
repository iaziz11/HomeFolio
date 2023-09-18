jQuery(function () {
  $("#modalNewForm #newCheck").on("change", function () {
    if ($("#modalNewForm #newCheck").is(":checked")) {
      $("#newRemindText").text("Remind Me Starting:");
      $("#newEveryContainer").show();
      $("#everyPeriod").attr("required", true);
    } else {
      $("#newRemindText").text("Remind Me On:");
      $("#newEveryContainer").hide();
      $("#everyPeriod").attr("required", false);
    }
  });

  $("#modalEditForm #editCheck").on("change", function () {
    if ($("#modalEditForm #editCheck").is(":checked")) {
      $("#editRemindText").text("Remind Me Starting:");
      $("#editEveryContainer").show();
      $("#editEveryPeriod").attr("required", true);
    } else {
      $("#editRemindText").text("Remind Me On:");
      $("#editEveryContainer").hide();
      $("#editEveryPeriod").attr("required", false);
    }
  });

  $(".submit-new-form").on("click", function () {
    $("#modalNewForm").addClass("was-validated");
    if (!document.querySelector("#modalNewForm").checkValidity()) {
      return;
    }
    $("#newReminderText").css("display", "none");
    $("#newSpinner").css("display", "block");
    $.ajax({
      url: "/folios/" + this.id + "/reminders",
      method: "POST",
      data: $("#modalNewForm").serialize(),
    })
      .always(function () {
        $("#newReminderText").css("display", "inline");
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

  $("table .form-check-input").on("change", function () {
    let sendData = this.name + "=" + this.checked;
    let url =
      "/folios/" +
      $(this).attr("data-itemid") +
      "/reminders/" +
      $(this).attr("data-id") +
      "/toggleCompleted";
    $.ajax({
      url,
      method: "PUT",
      data: sendData,
    })
      .done(function () {
        console.log("Changed successfully!");
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
        "/reminders/" +
        button.getAttribute("data-bs-id"),
      method: "GET",
    })
      .done(function (data) {
        let newDate = new Date(data.nextDate);
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
        console.log(newDate);
        let everyPeriod = 0;
        for (let [i, v] of data.every.entries()) {
          if (v > 0) {
            data.every[i] = 1;
            everyPeriod = v;
          }
        }
        $("#modalEditForm #editReminderName").val(data.text);
        $("#modalEditForm #editCheck")
          .prop("checked", data.recurring)
          .trigger("change");
        $("#modalEditForm #editNextDate").val(editDate);
        $(
          `#modalEditForm #editEvery option[value='${data.every.join(" ")}']`
        ).attr("selected", "true");
        $("#modalEditForm #editEveryPeriod").val(everyPeriod);
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
    $("#editRemindText").text("Remind Me On:");
    $("#modalEditForm").removeClass("was-validated");
    $("#editEveryContainer").hide();
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
    $("#editReminderText").css("display", "none");
    $("#editSpinner").css("display", "block");
    let itemId = $(this).attr("data-itemid");
    let id = $(this).attr("data-id");
    $.ajax({
      url: "/folios/" + itemId + "/reminders/" + id,
      method: "PUT",
      data: $("#modalEditForm").serialize(),
    })
      .always(function () {
        $("#editReminderText").css("display", "inline");
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
      url: "/folios/" + itemId + "/reminders/" + id,
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
