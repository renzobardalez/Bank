
document.addEventListener('DOMContentLoaded', () => {
    initExpenseForm();

    simpleExpenseTransaction();

    detailedExpenseTransaction();
});


/* ----------------- Funciones para inicializar página ------------------ */
function initExpenseForm() {
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
}
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

// Carga de suma total de cada detalle
function sumTotalAmounts(){
    let total = 0;
    const amounInputs = document.querySelectorAll("#detailedExpenseAmmount");
    amounInputs.forEach(input =>{
        const value = Math.abs(parseFloat(input.value || 0))
        total += value
    });
    document.getElementById("detailedExpenseTotalAmmount").textContent = `Total expense: ${total}`;
}

// Desplegable de categoría para cada detalle
function populateCategoryDropdown(selectElement) { 
    const category = JSON.parse(localStorage.getItem("category")) || []; 

    selectElement.innerHTML = "";
    const placeholderOption = document.createElement("option");
    placeholderOption.value = "";
    placeholderOption.textContent = "Select one category";
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    selectElement.appendChild(placeholderOption)
    
    category.forEach((elm) => { 
        const option = document.createElement("option"); 
        option.value = elm.id; 
        option.textContent = elm.categoryName; 
        selectElement.appendChild(option);
    });
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

/* ----------------- JS para Simple Expense ----------------- */
function simpleExpenseTransaction () {

    // Opción dinámica de account
    populateBankDropdown ('simpleExpenseAccount');

    /* Modificación de balance de cuenta */
    document.getElementById("saveSimpleExpense").addEventListener("click", function (event) {
        event.preventDefault();
        /* Verificación del array */
        const {bank, account, state} = callExpenseArrays();
        // const account = JSON.parse(localStorage.getItem("account")) || [];
        /* Obtenemos los valores de la página */
        const simpleExpenseAccountId = parseInt(document.getElementById("simpleExpenseAccount").value);
        const simpleExpenseAmmount = Math.abs(parseFloat(document.getElementById("simpleExpenseAmmount").value));
        const simpleExpenseDescription = document.getElementById("simpleExpenseDescription").value;
        if (!simpleExpenseAccountId || isNaN(simpleExpenseAmmount) || !simpleExpenseDescription)
        {
            showMessage ('simpleExpenseMessage','Por favor llene todos los campos.')
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
                description: simpleExpenseDescription,
                amount: simpleExpenseAmmount, 
                inventory: state.inventory, 
                transaction_type: state.transaction_type }; 
            // Cargar las transacciones históricas y agregar la nueva 
            const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
            transactions.push(transaction); 
            localStorage.setItem("transactions", JSON.stringify(transactions));
            /* Mensaje de éxito */
            showMessage('simpleExpenseMessage','Registro grabado con éxito.')
            /* Reseteamos los campos */
            document.getElementById("simpleExpenseAccount").value="";
            document.getElementById("simpleExpenseAmmount").value="";
            setTimeout(() => {
                window.location.reload();
            },1500);
        } else{
            showMessage('simpleExpenseMessage','Cuenta no encontrada.')
        }
    });
}

/* ----------------- JS para Detailed Expense ----------------- */
function detailedExpenseTransaction() {
    // Cargamos los arrays principales para expense
    const {account, currency, bank, state} = callExpenseArrays();

    /* Suma del total de importes */
    sumTotalAmounts();

    /* Función para llenar el desplegable de categorías del div por defecto */
    const selectElement = document.getElementById('detailedExpenseCategory');
    populateCategoryDropdown(selectElement);

    /* Opción para agregar divs */
    const container = document.getElementById("detailedExpenseContainer");
    const template = document.getElementById("detailedExpenseContainerTemplate");

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
        // Para popular las categorías de los divs adicionales
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

    // Opción dinámica de account
    populateBankDropdown ('detailedExpenseAccount');

    // Inicializa el dropdown del div nativo de lapágina
    populateCategoryDropdown(document.getElementById("detailedExpenseCategory"));  

    /* Modificación de balance de cuenta */ 
    document.getElementById("saveDetailedExpense").addEventListener("click", function (event) { 
        event.preventDefault();
        /* Verificación del array */
        const {account, bank, state} = callExpenseArrays();
        /* Obtenemos los valores de la página */
        const detailedExpenseAccountId = parseInt(document.getElementById("detailedExpenseAccount").value);
        const detailedMainExpenseDescription = document.getElementById("detailedMainExpenseDescription").value;

        const currentAccount = account.find(elm => elm.id === detailedExpenseAccountId);
        if (!currentAccount || !detailedMainExpenseDescription) { 
            showMessage('detailedExpenseMessage','Por favor seleccione una cuenta válida y agregue una descripción para su transacción.');
            return;
        }

        const transactionDetails = [];
        // Para detectar si hay errores
        let hasErrors = false;
        document.querySelectorAll(".detailedExpense-div-container").forEach(container => { 
            const {category} = callExpenseArrays();
            // Validamos que el desplegable contenga un valor
            const detailedExpenseCategoryValue = container.querySelector("#detailedExpenseCategory").value;
            if (detailedExpenseCategoryValue === ""){
                showMessage('detailedExpenseMessage','Por favor seleccione una categoría del desplegable.');
                hasErrors = true;
                return;
            }
            // Validamos los demás campos
            const detailedExpenseItem = container.querySelector("#detailedExpenseItem").value; 
            const detailedExpenseCategoryId = parseInt(container.querySelector("#detailedExpenseCategory").value); 
            const detailedExpenseAmmount = Math.abs(parseFloat(container.querySelector("#detailedExpenseAmmount").value)); 
            const detailedExpenseCommentary = container.querySelector("#detailedExpenseCommentary").value; 
            const currentCategory = category.find(e => e.id === detailedExpenseCategoryId); 
            if (!currentCategory || !detailedExpenseItem || isNaN(detailedExpenseAmmount)) { 
                showMessage('detailedExpenseMessage','Por favor ingrese valores válidos en todos los detalles.')
                hasErrors = true;
                return;
            }
            transactionDetails.push({ 
                itemName: detailedExpenseItem, 
                categoryName: currentCategory.categoryName, 
                amount: detailedExpenseAmmount, 
                commentary: detailedExpenseCommentary
            });
        });
        // Detenemos si ha errores
        if (hasErrors){
            return;
        }
        /* Actualización de balance */
        // Calculamos la suma de todos los input de cada detalle
        const totalAmount = transactionDetails.reduce((sum, detail) => sum + detail.amount, 0);
        currentAccount.accountBalance -= totalAmount;
        localStorage.setItem("account", JSON.stringify(account)); 
        // Creamos el objeto de transacción con detalles
        const detailedTransaction = { 
            date: new Date().toISOString(),
            accountId: detailedExpenseAccountId,
            bankName: bank.find(b => b.id === currentAccount.accountBankId)?.bankName || "Unknown bank",
            accountName: currentAccount.accountName,
            amount: totalAmount,
            description: detailedMainExpenseDescription,
            transactionDetails: transactionDetails,
            inventory: state.inventory,
            transaction_type: state.transaction_type
        }; 
        // Cargar las transacciones históricas y agregar la nueva 
        const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
        transactions.push(detailedTransaction); 
        localStorage.setItem("transactions", JSON.stringify(transactions));
        /* Mensaje de éxito */
        showMessage('detailedExpenseMessage','Registro grabado con éxito.')
        
        /* Reseteamos los campos */
        document.getElementById("detailedExpenseAccount").value = ""; 
        document.querySelectorAll(".detailedExpense-div-container").forEach(container => { 
            container.querySelector("#detailedExpenseItem").value = ""; 
            container.querySelector("#detailedExpenseCategory").value = ""; 
            container.querySelector("#detailedExpenseAmmount").value = ""; 
            container.querySelector("#detailedExpenseCommentary").value = "";
        });
        setTimeout(() => {
            window.location.reload();
        }, 1500);

        
    });
}
