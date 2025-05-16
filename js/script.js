// script.js
let budgetData = {};
let currentMonth = new Date().toLocaleString('default', { month: 'long' });
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Initialize month select
const monthSelect = document.getElementById("monthSelect");
months.forEach(month => {
  const option = document.createElement("option");
  option.value = month;
  option.text = month;
  if (month === currentMonth) option.selected = true;
  monthSelect.appendChild(option);
});

function switchMonth() {
  currentMonth = document.getElementById("monthSelect").value;
  renderData();
}

function setIncome() {
  const income = parseFloat(document.getElementById("incomeInput").value);
  if (!budgetData[currentMonth]) budgetData[currentMonth] = { income: 0, expenses: [] };
  budgetData[currentMonth].income = income;
  renderData();
  saveData();
}

function addExpense() {
  const name = document.getElementById("expenseName").value;
  const amount = parseFloat(document.getElementById("expenseAmount").value);
  if (!name || isNaN(amount)) return;

  if (!budgetData[currentMonth]) budgetData[currentMonth] = { income: 0, expenses: [] };
  budgetData[currentMonth].expenses.push({ name, amount, paid: false, paidDate: null });
  renderData();
  saveData();
  document.getElementById("expenseName").value = "";
  document.getElementById("expenseAmount").value = "";
}

function togglePaid(index) {
  const expense = budgetData[currentMonth].expenses[index];
  expense.paid = !expense.paid;
  expense.paidDate = expense.paid ? new Date().toLocaleDateString() : null;
  renderData();
  saveData();
}

function deleteExpense(index) {
  budgetData[currentMonth].expenses.splice(index, 1);
  renderData();
  saveData();
}

function renderData() {
  const list = document.getElementById("expenseList");
  list.innerHTML = "";

  if (!budgetData[currentMonth]) budgetData[currentMonth] = { income: 0, expenses: [] };

  let totalPaid = 0;

  budgetData[currentMonth].expenses.forEach((item, index) => {
    if (item.paid) totalPaid += item.amount;

    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";

    li.innerHTML = `
      <div>
        <input type="checkbox" class="form-check-input me-2" ${item.paid ? "checked" : ""} onclick="togglePaid(${index})">
        ${item.name} - R${item.amount.toFixed(2)}
        ${item.paidDate ? `<small class="text-muted ms-2">(Paid on ${item.paidDate})</small>` : ""}
      </div>
      <button class="btn btn-sm btn-danger" onclick="deleteExpense(${index})">Delete</button>
    `;

    list.appendChild(li);
  });

  document.getElementById("totalIncome").innerText = budgetData[currentMonth].income.toFixed(2);
  document.getElementById("totalPaid").innerText = totalPaid.toFixed(2);
  document.getElementById("balance").innerText = (budgetData[currentMonth].income - totalPaid).toFixed(2);

  updateChart();
}

// Chart.js setup
const ctx = document.getElementById('spendingChart').getContext('2d');
let spendingChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: [],
    datasets: [{
      label: 'Total Spent (R)',
      data: [],
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});

function updateChart() {
  spendingChart.data.labels = [];
  spendingChart.data.datasets[0].data = [];

  for (let month of months) {
    if (budgetData[month]) {
      const paid = budgetData[month].expenses.filter(e => e.paid).reduce((sum, e) => sum + e.amount, 0);
      spendingChart.data.labels.push(month);
      spendingChart.data.datasets[0].data.push(paid);
    }
  }
  spendingChart.update();
}

function saveData() {
  localStorage.setItem("budgetData", JSON.stringify(budgetData));
}

function loadData() {
  const data = localStorage.getItem("budgetData");
  if (data) {
    budgetData = JSON.parse(data);
  }
}

loadData();
renderData();
