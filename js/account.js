/* Opción dinámica de bank */
// Selccionamos el elemento select
const accountBank = document.getElementById("accountBank");
// Cargamos el array
const bank = JSON.parse(localStorage.getItem("bank")) || [];
// Iteramos sobre cada item
bank.forEach((elm) => {
    const option = document.createElement("option");
    option.value = elm.id;
    option.textContent = elm.bankName;
    accountBank.appendChild(option);    
});
/* Opción dinámica de currency */
// Selccionamos el elemento select
const accountCurrency = document.getElementById("accountCurrency");
// Cargamos el array
const currency = JSON.parse(localStorage.getItem("currency")) || [];
// Iteramos sobre cada item
currency.forEach((elm) => {
    const option = document.createElement("option");
    option.value = elm.id;
    option.textContent = elm.currencyName;
    accountCurrency.appendChild(option);   
});

/* Registro de cuenta bancaria */
document.getElementById("saveAccount").addEventListener("click", function (event) {
    event.preventDefault(); // Evita que la página se recargue
    /* Verificación del array */
    let account = JSON.parse(localStorage.getItem("account")) || [];
    let accountIdCounter = parseInt(localStorage.getItem("accountIdCounter")) || 1;
    /* Incrementamos el id para el siguiente uso */
    let newId = accountIdCounter;
    /* Obtenemos los valores de la página */
    const accountBankId = document.getElementById("accountBank").value;
    const accountCurrencyId = document.getElementById("accountCurrency").value;
    const accountName = document.getElementById("accountName").value;
    const accountNumber = document.getElementById("accountNumber").value;
    const accountDescription = document.getElementById("accountDescription").value;
    const accountBalance = document.getElementById("accountBalance").value;
    if (!accountBankId || !accountCurrencyId || !accountName || !accountNumber || isNaN(accountBalance)
    ){
        const accountMessage = document.getElementById("accountMessage");
        accountMessage.textContent = "Por favor ingrese valores válidos.";
        setTimeout(() => {
            window.location.reload();
        },1500);
        return;
    }
    /* Creación del array */
    let newAccount = {
        id: newId,
        date: new Date().toISOString(), 
        accountBankId: parseInt(accountBankId),
        accountCurrencyId: parseInt(accountCurrencyId),
        accountName: accountName,
        accountNumber: accountNumber,
        accountDescription: accountDescription,
        accountBalance: parseFloat(accountBalance)
    };
    
    account.push(newAccount);
    localStorage.setItem("account", JSON.stringify(account));
    localStorage.setItem("accountIdCounter", newId +1);
    /* Mensaje de éxito */
    const accountMessage = document.getElementById("accountMessage");
    accountMessage.textContent="Registro grabado con éxito.";
    /* Reseteamos los campos */
    document.getElementById("accountBank").value="";
    document.getElementById("accountCurrency").value="";
    document.getElementById("accountName").value="";
    document.getElementById("accountNumber").value="";
    document.getElementById("accountDescription").value="";
    document.getElementById("accountBalance").value="";
    setTimeout(() => {
        window.location.reload();
    },1500);
});
// Ubicamos el contenedor
const configResultsContainer = document.getElementById("configResultsContainer");
// Obtenemos el array bank
const account = JSON.parse(localStorage.getItem("account")) || [];
// Iteramos cada div resultado
account.forEach((elm) => {
    const div = document.createElement("div")
    div.classList.add("config-container-div")
    const currentBank = bank.find(b => b.id === parseInt(elm.accountBankId));
    const bankName = currentBank ? currentBank.bankName : '';
    const currentCurrency = currency.find(c => c.id === parseInt(elm.accountCurrencyId));
    const currencySymbol = currentCurrency ? currentCurrency.currencySymbol:'';
    div.innerHTML =
    `
    <div> Account id: ${elm.accountBankId}</div>
    <div> Bank name description: ${bankName}</div>
    <div> Account currency: ${currencySymbol}</div>
    <div> Account description: ${elm.accountDescription}</div>
    <div> Account balance description: ${elm.accountBalance}</div>
    <div> Date: ${elm.date}</div>
    `
    configResultsContainer.appendChild(div)
});