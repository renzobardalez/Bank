// Obtenemos información de las transacciones, cuentas y bancos
const account = JSON.parse(localStorage.getItem("account")) || [];
const currency = JSON.parse(localStorage.getItem("currency")) || [];
const bank = JSON.parse(localStorage.getItem("bank")) || [];
const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
// Ubicamos el elemento select
const accountFilter = document.getElementById("accountFilter");
// Iteramos sobre cada item para el contanido de cada option
account.forEach((elm) => {
    const option = document.createElement("option");
    option.value = elm.id;
    const currentBank = bank.find(b => b.id === elm.accountBankId)
    const bankName = currentBank ? currentBank.bankName : "Unknown bank";
    const currentCurrency = currency.find(c => c.id === parseInt(elm.accountCurrencyId));
    const currencySymbol = currentCurrency ? currentCurrency.currencySymbol:'Unknown currency';
    option.textContent = ` ${bankName} - ${elm.accountName} ${currencySymbol} ${elm.accountBalance}`;
    accountFilter.appendChild(option);
});
function getTransactionType(inventory, transaction_type){
    let transactionType;
    switch (true){
        case (inventory === 0 && transaction_type ===0):
        transactionType = "Expense";
        break;
        case (inventory === 0 && transaction_type ===1):
        transactionType = "Income";
        break;
        case (inventory === 1 && transaction_type === 0):
        transactionType = "Sell";
        break;
        case (inventory === 1 && transaction_type === 1):
        transactionType = "Purchase";
        break;
        case (inventory === 1 && transaction_type === 2):
        transactionType = "Trade";
        break;
        default:
            transactionType = "Error"
    } 
    return transactionType;
}
// Ordenamos las transacciones de más reciente a más antiguo
transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
// Ubicamos el contenedor
const transactionsResultsContainer = document.getElementById("transactionsResultsContainer");
transactions.forEach((elm) => {
    // Obtenemos el tipo de transacción de cada elemento
    const transactionType = getTransactionType(elm.inventory, elm.transaction_type);
    // Creamos los divs de cada transacción
    const div = document.createElement("div")
    div.classList.add("transaction-container-div")
        div.innerHTML = 
        `
        <div> Bank Name: ${elm.bankName}</div>
        <div> Account: ${elm.accountName}</div>
        <div> Ammount: ${elm.amount}</div>
        <div> Type: ${transactionType}</div>
        <div> Date: ${elm.date}</div>
        `    
    
    transactionsResultsContainer.appendChild(div)
});