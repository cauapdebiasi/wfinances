/* shorthand to write querySelector and getElementById */
const $ = (element) => document.getElementById(element) || 
                       document.querySelector(`.${element}`);

/*HTML elements*/
const balance_el = $("saldo");
const income_el = $("receita");
const expenses_el = $("despesas");
const transactions_container = $(
  "transactions-container"
);
const transaction_name_input = $("transaction_name");
const transaction_value_input = $("transaction_value");
const transaction_modal_add_button = $(
  "transaction-modal-add-button"
);
const transaction_type_input = $(
  "transaction-type-input"
);
const edit_card_modal_container = $(
  "generated-edit-card"
);
const edit_card_template = $("edit-card-template");
const expenses_income_transaction_container = $(
    "expenses-income-container"
);
const expenses_income_title = $("exp-inc-title");

/*These functions are used to open the Materialize modals*/
const add_transaction_modal = function () {
  const add_trans_modal = $("add-transaction");
  const options = {
    opacity: 0.5,
    startingTop: "50%",
    endingTop: "15%",
  };
  var add_transaction_modal = M.Modal.init(add_trans_modal, options);
  return add_transaction_modal;
};
function open_add_transaction() {
  add_transaction_modal().open();
}
const edit_transaction_modal = function (id) {
  const edit_trans_modal = $(`edit-transaction-${id}`);
  const options = {
    opacity: 0.5,
    startingTop: "50%",
    endingTop: "5%",
  };
  var edit_transaction_modal = M.Modal.init(edit_trans_modal, options);
  return edit_transaction_modal;
};
function open_edit_transaction(id) {
  edit_transaction_modal(id).open();
}
const income_expenses_modal = function () {
  const income_expenses_el = $('expenses-income-modal');
  const options = {
    opacity: 0.5,
    startingTop: "50%",
    endingTop: "5%",
  };
  var income_expenses_modal = M.Modal.init(income_expenses_el, options);
  return income_expenses_modal;
};
function open_income_expenses() {
  income_expenses_modal().open();
}
/*This function creates a HTML card based on the information given*/
function add_card_to_html({ id, name, type, value }, container) {
  const card = `<div class="card horizontal ${
    type == "income" ? "income" : "expense"
  }"">
                    <div class="card-content transacoes-content">
                        <div class="card-wrapper">    
                            <a class="modal-trigger purple-text darken-2" data-target="edit-transaction-${id}" style="cursor:pointer;" onclick="card_edit_to_html(${id});" ><i class="material-icons left">more_vert</i></a>
                            <span>${name}</span>
                        </div>
                        <span>${currency.format(value)}</span>
                    </div>
                  </div>`;
  container.innerHTML += card;
}
function card_edit_to_html(id) {
  edit_card_modal_container.innerHTML = "";
  let card = wfinances.return_card(id);
  card_html = load_card_info(card, edit_card_template);
  edit_card_modal_container.innerHTML = card_html;
  open_edit_transaction(id);
}
function inc_exp_to_html(isExpense) {
  exp_inc = isExpense ? "Despesas" : "Receitas";
  expenses_income_transaction_container.innerHTML = '';
  expenses_income_title.innerText = exp_inc;
  cards_html = filter_exp_inc(isExpense);
  cards_html.length == 0 
  ? expenses_income_transaction_container.innerHTML = `<div><h6>Você não tem ${exp_inc}</h6></div>` 
  : cards_html.forEach(item => add_card_to_html(item, expenses_income_transaction_container));
  open_income_expenses();
}
function load_card_info(transaction, card_template) {
  let template = card_template.innerHTML;
  return eval("`" + template + "`");
}
function filter_exp_inc(isExpense){
  if (isExpense){
      result = wfinances.transactions.filter(transaction => transaction.type == "expense")
      return result;
  }else{
    result = wfinances.transactions.filter(transaction => transaction.type == "income")
    return result;
  }
}
/*This function returns the complete date formatted with only the essential parts */
function date_formatter() {
  const now = new Date();
  const dateToFormat = now.toString();
  let dateParts = dateToFormat.split(" ");
  let month = now.getMonth();
  let formattedDate = {
    year: dateParts[3],
    month: month + 1,
    day: dateParts[2],
    hours: dateParts[4],
  };
  return formattedDate;
}
/*This function gets the value of the inputs of the modal and calls the function to add the transaction to the main app*/
function create_transaction() {
  const transaction_name = transaction_name_input.value;
  const transaction_value = Number(transaction_value_input.value);
  const transaction_type = transaction_type_input.checked;
  if (
    transaction_name == "" ||
    isNaN(transaction_value) ||
    transaction_value == ""
  ) {
    /*If the value of the input is invalid this shows a message on the screen and rejects the attempt*/
    window.dispatchEvent(appInvalidInput);
  } else {
    wfinances.add_transaction({
      id: wfinances.get_transaction_id(),
      name: transaction_name.trim(),
      type: transaction_type || transaction_value < 0 ? "expense" : "income",
      value: transaction_value,
      time: date_formatter(),
    });
  }
}