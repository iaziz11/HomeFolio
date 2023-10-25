jQuery(function () {
  $("#dateRange").on("change", function () {
    $.ajax({
      url: "/allexpenses/updateRange?time=" + $("#dateRange").val(),
      type: "GET",
    })
      .done(function ({ expenseDict }) {
        console.log(expenseDict);
        if (expenseDict.length === 2) {
          $("#mainContent").html(
            `<div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th class="text-center">No expenses for this time range</th>
                </tr>
              </thead>
            </table>
          </div>`
          );
        } else {
          $("#mainContent").html(
            `<div class="row justify-content-center mb-3">
              <canvas id="myChart"></canvas>
            </div>`
          );
        }
        const ctx = document.getElementById("myChart");
        const values = JSON.parse(expenseDict);
        let data = {
          labels: [],
          datasets: [
            {
              label: "Total Spent",
              data: [],
              backgroundColor: [],
              hoverOffset: 4,
            },
          ],
        };
        for (const [key, value] of Object.entries(values)) {
          data["datasets"][0]["data"].push(value[0]);
          data["datasets"][0]["backgroundColor"].push(value[1]);
          data["labels"].push(value[2]);
        }
        new Chart(ctx, {
          type: "doughnut",
          data,
          options: {
            responsive: false,
            tooltips: {
              callbacks: {
                label: (ctx, data) =>
                  `${data.labels[ctx.index]}: $${
                    data.datasets[ctx.datasetIndex].data[ctx.index] / 100
                  }`,
              },
            },
          },
        });
      })
      .fail(function (xhr, status, errorThrown) {
        alert("Sorry, there was a problem!");
        console.log("Error: " + errorThrown);
        console.log("Status: " + status);
        console.dir(xhr);
      });
  });
});
