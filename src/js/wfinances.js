/*These are events used by the app*/
const appAdd = new Event("appAdd");
const appRemove = new Event("appRemove");
const appFail = new Event("appFail");
const appChange = new Event("appChange");
const appInvalidInput = new Event("appInvalidInput");
window.currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

window.wfinances = {
  /*These are the main variables of the app, including the transactions array*/
  balance: 0,
  expenses: 0,
  income: 0,
  transactions: [],
  /*This function sets the balance to zero and then goes through every item of the transactions array adding the values to the "balance" variable*/
  get_sum: function () {
    this.balance = 0;
    this.transactions.forEach((transaction) => {
      if (transaction.type == "income") {
        this.balance += transaction.value;
      } else {
        this.balance -= Math.abs(transaction.value);
      }
    });
    this.update();
  },
  /*This function gets the "income" values aka the positive values*/
  get_income_expenses: function () {
    this.income = 0;
    this.expenses = 0;
    this.transactions.forEach((transaction) => {
      if (transaction.type == "income") {
        wfinances.income += transaction.value;
      } else {
        wfinances.expenses += Math.abs(transaction.value);
      }
    });
  },
  /*This function returns a random value to use as the card id*/
  get_transaction_id: function () {
    return Math.round(Math.random() * 20000);
  },
  /*This function adds the transaction given in the parameters to the transactions array and then shows a message on the screen*/
  add_transaction: function (transaction) {
    this.transactions.unshift(transaction);
    window.dispatchEvent(appAdd);
    this.get_sum();
  },
  /*This function removes the transaction given in the parameters to the transactions array and then shows a message on the screen*/
  remove_transaction: function (id) {
    this.transactions = this.transactions.filter((element) => element.id != id);
    window.dispatchEvent(appRemove);
    this.get_sum();
  },
  set: function (id){
    const edit_card_name = $(`transaction_name_change-${id}`);
    const edit_card_value = $(`transaction_value_change-${id}`);
    const edit_card_type = $(`transaction-type-change-${id}`);
    let name = edit_card_name.value;
    let value = Number(edit_card_value.value);
    let type = edit_card_type.checked;
    let transaction = this.return_card(id);
    transaction.name = name == "" ? transaction.name : name;
    transaction.value = value == 0 || isNaN(value) ? transaction.value : value;
    transaction.type = type || value < 0 ? "expense" : "income";
    this.get_sum();
    this.update();
    window.dispatchEvent(appChange);
  },
  return_card: function (id) {
    cardToReturn = wfinances.transactions.filter((element) => element.id == id)[0];
    return cardToReturn;
  },
  start: function () {
    transaction_modal_add_button.addEventListener("click", create_transaction);
    wfinances.get_sum();
    wfinances.start_listeners();
  },
  update: function () {
    this.get_income_expenses();
    transactions_container.innerHTML = "";
    this.transactions.forEach((transaction) => {
      add_card_to_html(transaction, transactions_container);
    });
    balance_el.innerText = currency.format(wfinances.balance);
    income_el.innerText = currency.format(wfinances.income);
    expenses_el.innerText = currency.format(wfinances.expenses);
    transaction_name_input.value = "";
    transaction_value_input.value = "";
  },
  /*These are the event listeners which are used by the main app(the events are declared at the beginning of the file)*/
  start_listeners: function () {
    window.addEventListener("appAdd", () => {
      M.toast({
        html: "Transação adicionada com sucesso!",
        classes: "purple darken-3",
      });
    });
    window.addEventListener("appRemove", () => {
      M.toast({
        html: "Transação removida com sucesso!",
        classes: "orange darken-1",
      });
    });
    window.addEventListener("appFail", () => {
      M.toast({
        html: "Erro",
        classes: "red darken-2",
      });
    });
    window.addEventListener("appChange", () => {
      M.toast({
        html: "Transação alterada com sucesso!",
        classes: "green darken-2",
      });
    });
    window.addEventListener("appInvalidInput", () => {
      M.toast({
        html: "É necessario definir um nome e valor válidos!",
        classes: "orange darken-1",
      });
    });
  }
};

document.body.onload = () => {
  wfinances.start();
};
