document.addEventListener('DOMContentLoaded', () => {
    // initExpenseForm();

    simpleIncomeTransaction();

    // detailedIncomeTransaction();
});

/* ----------------- Funciones reutilizables ------------------ */

// Carga de arrays account, bank, currency y state
function callExpenseArrays() {
    const account = JSON.parse(localStorage.getItem("account")) || [];
    const currency = JSON.parse(localStorage.getItem("currency")) || [];
    const bank = JSON.parse(localStorage.getItem("bank")) || [];
    const state = JSON.parse(localStorage.getItem("state")) || [];
    const category = JSON.parse(localStorage.getItem("category")) || [];
    return { account, currency, bank, state, category };
}

// Mostrar mensaje
function showMessage(elementId, message) {
    const messageElement = document.getElementById(elementId);
    messageElement.textContent = message;
}

// Opción dinámica de cuenta bancaria
function populateBankDropdown (selectId) {
    // Selccionamos el elemento select
    const xExpenseAccount = document.getElementById(selectId);
    // Cargamos los arrays principales para expense
    const {account, currency, bank, state} = callExpenseArrays();
    // Iteramos sobre cada item para el contanido de cada option
    account.forEach((elm) => {
        const option = document.createElement("option");
        option.value = elm.id;
        const currentBank = bank.find(b => b.id === elm.accountBankId)
        const bankName = currentBank ? currentBank.bankName : "Unknown bank";
        const currentCurrency = currency.find(c => c.id === elm.accountCurrencyId)
        const currencySymbol = currentCurrency ? currentCurrency.currencySymbol : "Unknown bank";
        option.textContent = ` ${bankName} - ${elm.accountName} ${currencySymbol} ${elm.accountBalance}`;
        xExpenseAccount.appendChild(option);    
    });
}

/* ----------------- JS para Simple Income ----------------- */

function simpleIncomeTransaction () {
    // Opción dinámica de account

    populateBankDropdown ('simpleIncomeAccount');

    /* Modificación de balance de cuenta */
    document.getElementById("saveIncome").addEventListener("click", function (event) {
        event.preventDefault();
        /* Verificación del array */
        /* Verificación del array */
        const {bank, account, state} = callExpenseArrays();
        /* Obtenemos los valores de la página */
        const incomeAccountId = parseInt(document.getElementById("simpleIncomeAccount").value);
        const incomeAmmount = Math.abs(parseFloat(document.getElementById("incomeAmmount").value));
        const incomeDescription = document.getElementById("incomeDescription").value;
        if (!incomeAccountId || isNaN(incomeAmmount) || !incomeDescription) {
            const incomeMessage = document.getElementById("incomeMessage");
            incomeMessage.textContent = "Por favor llene toda la información.";
        }
        const currentAccount = account.find(elm => elm.id === incomeAccountId)
        if(currentAccount){
            const currentBalance = currentAccount.accountBalance + incomeAmmount;
            currentAccount.accountBalance = currentBalance;
            localStorage.setItem("account",JSON.stringify(account));

            // Creamos el objeto transaction
            const transaction = { 
                date: new Date().toISOString(), 
                accountId: incomeAccountId, 
                bankName: bank.find(b => b.id === currentAccount.accountBankId)?.bankName || "Unknown bank", 
                accountName: currentAccount.accountName, 
                amount: incomeAmmount,
                description: incomeDescription,
                inventory: state.inventory, 
                transaction_type: state.transaction_type }; 
            // Cargar las transacciones históricas y agregar la nueva 
            const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
            transactions.push(transaction); 
            localStorage.setItem("transactions", JSON.stringify(transactions));

            /* Mensaje de éxito */
            const incomeMessage = document.getElementById("incomeMessage");
            incomeMessage.textContent="Registro grabado con éxito.";
            /* Reseteamos los campos */
            document.getElementById("simpleIncomeAccount").value="";
            document.getElementById("incomeAmmount").value="";
            setTimeout(() => {
                window.location.reload();
            },1500);
        } else{
            const incomeMessage = document.getElementById("incomeMessage");
            incomeMessage.textContent="Account not found";
        }


    });
}