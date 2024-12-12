/* ----------------- JS para Toggle button ------------------ */
document.addEventListener('DOMContentLoaded', () => {
    const simpleForm = document.getElementById('simpleExpenseForm');
    const detailedForm = document.getElementById('detailedExpenseForm');
    const toggleSwitch = document.getElementById('toggleExpenseForm');
    const expenseTitle = document.getElementById('expenseFormTitle');
    const switchLabel = document.getElementById('switchLabel');
    
    // Estado inicial de la página
    simpleForm.style.display = 'block';
    detailedForm.style.display = 'none';
    expenseTitle.textContent = 'Simple Expense';
    switchLabel.textContent = 'Switch to DETAILED expense'
    
    toggleSwitch.addEventListener('click', () => {
        // Limpiar campos del formulario
        clearFields(simpleForm);
        clearFields(detailedForm);
        // Alternar visibilidad de formularios y cambiar título 
        if (toggleSwitch.checked) {
            simpleForm.style.display = 'none';
            detailedForm.style.display = 'grid';
            expenseTitle.textContent = 'Detailed Expense';
            switchLabel.textContent = 'Switch to SIMPLE expense';
        } else {
            simpleForm.style.display = 'grid'; 
            detailedForm.style.display = 'none'; 
            expenseTitle.textContent = 'Simple Expense'; 
            switchLabel.textContent = 'Switch to DETAILED Expense'; 
        } 
    }); 
    function clearFields(form) { 
        const inputs = form.querySelectorAll('input'); 
        inputs.forEach(input => input.value = ""); 
        const selects = form.querySelectorAll('select'); 
        selects.forEach(select => select.selectedIndex = 0);
        }
});
/* ----------------- JS para Simple Expense ----------------- */
/* Opción dinámica de bank */
// Selccionamos el elemento select
const simpleExpenseAccount = document.getElementById("simpleExpenseAccount");
// Cargamos el array de cuentas y bancos para nombre de  la cuenta
const account = JSON.parse(localStorage.getItem("account")) || [];
const currency = JSON.parse(localStorage.getItem("currency")) || [];
const bank = JSON.parse(localStorage.getItem("bank")) || [];
// Cargamos el objeto state
const state = JSON.parse(localStorage.getItem("state")) || {};
// Iteramos sobre cada item para el contanido de cada option
account.forEach((elm) => {
    const option = document.createElement("option");
    option.value = elm.id;
    const currentBank = bank.find(b => b.id === elm.accountBankId)
    const bankName = currentBank ? currentBank.bankName : "Unknown bank";
    const currentCurrency = currency.find(c => c.id === elm.accountCurrencyId)
    const currencySymbol = currentCurrency ? currentCurrency.currencySymbol : "Unknown bank";
    option.textContent = ` ${bankName} - ${elm.accountName} ${currencySymbol} ${elm.accountBalance}`;
    simpleExpenseAccount.appendChild(option);    
});
/* Modificación de balance de cuenta */
document.getElementById("saveSimpleExpense").addEventListener("click", function (event) {
    event.preventDefault();
    /* Verificación del array */
    const account = JSON.parse(localStorage.getItem("account")) || [];
    /* Obtenemos los valores de la página */
    const simpleExpenseAccountId = parseInt(document.getElementById("simpleExpenseAccount").value);
    const simpleExpenseAmmount = Math.abs(parseFloat(document.getElementById("simpleExpenseAmmount").value));
    if (!simpleExpenseAccountId || isNaN(simpleExpenseAmmount)
    ){
        const simpleExpenseMessage = document.getElementById("simpleExpenseMessage");
        simpleExpenseMessage.textContent = "Por favor ingrese valores válidos.";
        // setTimeout(() => {
        //     window.location.reload();
        // },1500);
        return;
    }
    const currentAccount = account.find(elm => elm.id === simpleExpenseAccountId)
    if(currentAccount){
        const currentBalance = currentAccount.accountBalance - simpleExpenseAmmount;
        currentAccount.accountBalance = currentBalance;
        localStorage.setItem("account",JSON.stringify(account));
        // Creamos el objeto transaction
        const transaction = { 
            date: new Date().toISOString(), 
            accountId: simpleExpenseAccountId, 
            bankName: bank.find(b => b.id === currentAccount.accountBankId)?.bankName || "Unknown bank", 
            accountName: currentAccount.accountName, 
            amount: simpleExpenseAmmount, 
            inventory: state.inventory, 
            transaction_type: state.transaction_type }; 
        // Cargar las transacciones históricas y agregar la nueva 
        const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
        transactions.push(transaction); 
        localStorage.setItem("transactions", JSON.stringify(transactions));
        /* Mensaje de éxito */
        const simpleExpenseMessage = document.getElementById("simpleExpenseMessage");
        simpleExpenseMessage.textContent="Registro grabado con éxito.";
        /* Reseteamos los campos */
        document.getElementById("simpleExpenseAccount").value="";
        document.getElementById("simpleExpenseAmmount").value="";
        setTimeout(() => {
            window.location.reload();
        },1500);
    } else{
        const simpleExpenseMessage = document.getElementById("accountMessage");
        simpleExpenseMessage.textContent="Account not found";
    }
});
/* ----------------- JS para Detailed Expense ----------------- */
/* Opción para agregar divs */
const container = document.getElementById("detailedExpenseContainer");
const template = document.getElementById("detailedExpenseContainerTemplate");
/* Suma del total de importes */
function sumTotalAmounts(){
    let total = 0;
    const amounInputs = document.querySelectorAll("#detailedExpenseAmmount");
    amounInputs.forEach(input =>{
        const value = Math.abs(parseFloat(input.value || 0))
        total += value
    });
    document.getElementById("detailedExpenseTotalAmmount").textContent = `Total expense: ${total}`;
}
/* Función para llenar el desplegable de categorías */
function populateCategoryDropdown(selectElement) { 
    const category = JSON.parse(localStorage.getItem("category")) || []; 
    category.forEach((elm) => { 
        const option = document.createElement("option"); 
        option.value = elm.id; 
        option.textContent = elm.categoryName; 
        selectElement.appendChild(option);
    });
}
/* Agregar divs desde el template */
document.getElementById("addDetailedExpense").addEventListener("click", function (event) {
    event.preventDefault();
    // Clonar el contenido del template
    const newDiv = template.content.firstElementChild.cloneNode(true);
    // Agregar el nuevo div al contenedor
    container.appendChild(newDiv);
    // Añadir event listener para los nuevos inputs
    newDiv.querySelectorAll("#detailedExpenseAmmount").forEach(input =>{
        input.addEventListener('blur', sumTotalAmounts);
    });
    const newCategorySelect = newDiv.querySelector('#detailedExpenseCategory');
    populateCategoryDropdown(newCategorySelect);
    sumTotalAmounts();
});
/* Opción para eliminar divs creados */
container.addEventListener("click", (event) => {
    event.preventDefault();
    // Verifica si el clic fue en un botón con la clase "delete-btn"
    if (event.target.classList.contains("detailedExpense-delete")) {
    // Encuentra el div contenedor más cercano del botón
    const rowToDelete = event.target.closest(".detailedExpense-div-container");
    // Elimina el div contenedor del DOM
        if (rowToDelete) {
            rowToDelete.remove();
            sumTotalAmounts();
        }
    }
});
// Añadir event listeners iniciales para los inputs de amount existentes 
document.querySelectorAll("#detailedExpenseAmmount").forEach(input => { 
    input.addEventListener('blur', sumTotalAmounts);
});
/* Opción dinámica de account */
// Selccionamos el elemento select
const detailedExpenseAccount = document.getElementById("detailedExpenseAccount");
// Iteramos sobre cada item para el contanido de cada option
account.forEach((elm) => {
    const option = document.createElement("option");
    option.value = elm.id;
    const currentBank = bank.find(b => b.id === elm.accountBankId)
    const bankName = currentBank ? currentBank.bankName : "Unknown bank";
    const currentCurrency = currency.find(c => c.id === elm.accountCurrencyId)
    const currencySymbol = currentCurrency ? currentCurrency.currencySymbol : "Unknown bank";
    option.textContent = ` ${bankName} - ${elm.accountName} ${currencySymbol} ${elm.accountBalance}`;
    detailedExpenseAccount.appendChild(option);    
});
/* Opción dinámica de category */
// Inicializa el primer selector de categoría
populateCategoryDropdown(document.getElementById("detailedExpenseCategory"));  

/* Modificación de balance de cuenta */ 
document.getElementById("saveDetailedExpense").addEventListener("click", function (event) { 
    event.preventDefault();
    /* Verificación del array */
    const account = JSON.parse(localStorage.getItem("account")) || [];
    const category = JSON.parse(localStorage.getItem("category")) || [];
    const state = JSON.parse(localStorage.getItem("state")) || [];
    const bank = JSON.parse(localStorage.getItem("bank")) || [];
    /* Obtenemos los valores de la página */
    const detailedExpenseAccountId = parseInt(document.getElementById("detailedExpenseAccount").value);
    const currentAccount = account.find(elm => elm.id === detailedExpenseAccountId);
    if (!currentAccount) { 
        const detailedExpenseMessage = document.getElementById("detailedExpenseMessage");
        detailedExpenseMessage.textContent = "Por favor seleccione una cuenta válida.";
        // setTimeout(() => { 
        //     window.location.reload();
        // }, 1500);
        return;
    }
    const transactionDetails = []; 
    document.querySelectorAll(".detailedExpense-div-container").forEach(container => { 
        const detailedExpenseDescription = container.querySelector("#detailedExpenseDescription").value; 
        const detailedExpenseCategoryId = parseInt(container.querySelector("#detailedExpenseCategory").value); 
        const detailedExpenseAmmount = Math.abs(parseFloat(container.querySelector("#detailedExpenseAmmount").value)); 
        const detailedExpenseCommentary = container.querySelector("#detailedExpenseCommentary").value; 
        const currentCategory = category.find(elm => elm.id === detailedExpenseCategoryId); 
        console.log(detailedExpenseDescription);
        console.log(detailedExpenseCategoryId); -- NaN
        console.log(detailedExpenseAmmount); -- NaN
        console.log(detailedExpenseCommentary); 
        console.log(currentCategory); --undefined

        if (!currentCategory || !detailedExpenseDescription || isNaN(detailedExpenseAmmount) || !detailedExpenseCommentary) { 
            const detailedExpenseMessage = document.getElementById("detailedExpenseMessage"); 
            detailedExpenseMessage.textContent = "Por favor ingrese valores válidos en todos los detalles.";
            setTimeout(() => { 
                window.location.reload();
            }, 30000);
            return;
        } 
        transactionDetails.push({ 
            descriptionName: detailedExpenseDescription, 
            categoryName: currentCategory.categoryName, 
            amount: detailedExpenseAmmount, 
            commentary: detailedExpenseCommentary
        });
    });
    
    /* Actualización de balance */
    const totalAmount = transactionDetails.reduce((sum, detail) => sum + detail.amount, 0);
    currentAccount.accountBalance -= totalAmount;
    localStorage.setItem("account", JSON.stringify(account)); 
    // Creamos el objeto de transacción con detalles
    const detailedTransaction = { 
        date: new Date().toISOString(),
        accountId: detailedExpenseAccountId,
        bankName: bank.find(b => b.id === currentAccount.accountBankId)?.bankName || "Unknown bank",
        accountName: currentAccount.accountName,
        transactionDetails: transactionDetails,
        inventory: state.inventory,
        transaction_type: state.transaction_type
    }; 
    // Cargar las transacciones históricas y agregar la nueva 
    const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    transactions.push(detailedTransaction); 
    localStorage.setItem("transactions", JSON.stringify(transactions));
    /* Mensaje de éxito */
    const detailedExpenseMessage = document.getElementById("detailedExpenseMessage"); 
    detailedExpenseMessage.textContent = "Registro grabado con éxito."; 
    /* Reseteamos los campos */
    document.getElementById("detailedExpenseAccount").value = ""; 
    document.querySelectorAll(".detailedExpense-div-container").forEach(container => { 
        container.querySelector("#detailedExpenseDescription").value = ""; 
        container.querySelector("#detailedExpenseCategory").value = ""; 
        container.querySelector("#detailedExpenseAmmount").value = ""; 
        container.querySelector("#detailedExpenseCommentary").value = "";
    });
    // setTimeout(() => {
    //     window.location.reload();
    // }, 1500);
});