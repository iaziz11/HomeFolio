jQuery(function () {
  $("#modalNewForm #newCheck").on("change", function () {
    if ($("#modalNewForm #newCheck").is(":checked")) {
      $("#newRemindText").text("Remind Me Starting:");
      $("#newEveryContainer").show();
    } else {
      $("#newRemindText").text("Remind Me On:");
      $("#newEveryContainer").hide();
    }
  });

  $("#modalEditForm #editCheck").on("change", function () {
    if ($("#modalEditForm #editCheck").is(":checked")) {
      $("#editRemindText").text("Remind Me Starting:");
      $("#editEveryContainer").show();
    } else {
      $("#editRemindText").text("Remind Me On:");
      $("#editEveryContainer").hide();
    }
  });

  $(".submit-new-form").on("click", function () {
    $("#newReminderText").css("display", "none");
    $("#newSpinner").css("display", "block");
    $.ajax({
      url: "/items/" + this.id + "/reminders",
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
      "/items/" +
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
        "/items/" +
        button.getAttribute("data-bs-itemid") +
        "/reminders/" +
        button.getAttribute("data-bs-id"),
      method: "GET",
    })
      .done(function (data) {
        const d = new Date(data.nextDate);
        console.log(d);
        const dateTimeLocalValue = new Date(
          d.getTime() - d.getTimezoneOffset() * 60000
        )
          .toISOString()
          .slice(0, -1);
        console.log(dateTimeLocalValue);
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
        $("#modalEditForm #editNextDate").val(dateTimeLocalValue);
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
    $("#editEveryContainer").hide();
    $("#modalEditForm")[0].reset();
  });

  $(".submit-edit-form").on("click", function () {
    $("#editReminderText").css("display", "none");
    $("#editSpinner").css("display", "block");
    let itemId = $(this).attr("data-itemid");
    let id = $(this).attr("data-id");
    $.ajax({
      url: "/items/" + itemId + "/reminders/" + id,
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
    console.log("/items/" + itemId + "/reminders/" + id);
    $.ajax({
      url: "/items/" + itemId + "/reminders/" + id,
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
