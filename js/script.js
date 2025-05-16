let budgetData = {};
let currentMonth = '';

function populateMonthSelect() {
  const monthSelect = document.getElementById('monthSelect');
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  months.forEach((month) => {
    const option = document.createElement('option');
    option.value = month;
    option.textContent = month;
    monthSelect.appendChild(option);
  });

  const now = new Date();
  currentMonth = months[now.getMonth()];
  monthSelect.value = currentMonth;

  if (!budgetData[currentMonth]) {
    budgetData[currentMonth] = {
      income: 0,
      expenses: []
    };
  }

  updateUI();
}

function switchMonth() {
  currentMonth = document.getElementById('monthSelect').value;
  if (!budgetData[currentMonth]) {
    budgetData[currentMonth] = {
      income: 0,
      expenses: []
    };
  }
  updateUI();
}

// Add income from modal, sums to current income
function addIncomeFromModal() {
  const input = document.getElementById('incomeInputModal');
  const errorMsg = document.getElementById('incomeError');
  const amount = parseFloat(input.value);

  if (!isNaN(amount) && amount > 0) {
    budgetData[currentMonth].income += amount;
    updateUI();
    input.value = '';
    errorMsg.style.display = 'none';

    const incomeModal = bootstrap.Modal.getInstance(document.getElementById('incomeModal'));
    incomeModal.hide();
  } else {
    errorMsg.style.display = 'block';
  }
}

// Add expense from modal
function addExpenseFromModal() {
  const nameInput = document.getElementById('expenseNameModal');
  const amountInput = document.getElementById('expenseAmountModal');
  const nameError = document.getElementById('expenseNameError');
  const amountError = document.getElementById('expenseAmountError');

  const name = nameInput.value.trim();
  const amount = parseFloat(amountInput.value);

  let valid = true;

  if (!name) {
    nameError.style.display = 'block';
    valid = false;
  } else {
    nameError.style.display = 'none';
  }

  if (isNaN(amount) || amount <= 0) {
    amountError.style.display = 'block';
    valid = false;
  } else {
    amountError.style.display = 'none';
  }

  if (valid) {
    budgetData[currentMonth].expenses.push({ name, amount });
    updateUI();
    nameInput.value = '';
    amountInput.value = '';

    const expenseModal = bootstrap.Modal.getInstance(document.getElementById('expenseModal'));
    expenseModal.hide();
  }
}

function updateUI() {
  const data = budgetData[currentMonth];
  document.getElementById('totalIncome').textContent = data.income.toFixed(2);

  const list = document.getElementById('expenseList');
  list.innerHTML = '';
  let totalPaid = 0;

  data.expenses.forEach((expense) => {
    totalPaid += expense.amount;
    const li = document.createElement('li');
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.textContent = expense.name;
    const span = document.createElement('span');
    span.className = "badge bg-primary rounded-pill";
    span.textContent = `R${expense.amount.toFixed(2)}`;
    li.appendChild(span);
    list.appendChild(li);
  });

  document.getElementById('totalPaid').textContent = totalPaid.toFixed(2);

  const balance = data.income - totalPaid;
  document.getElementById('balance').textContent = balance.toFixed(2);
}

window.onload = () => {
  populateMonthSelect();
};
