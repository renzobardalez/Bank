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
    detailedExpenseAccount.appendChild(option);    
});


/* Opción dinámica de category */
// Inicializa el primer selector de categoría
populateCategoryDropdown(document.getElementById("detailedExpenseCategory"));  



/* Modificación 11/12/24 - Se graba el detallado por cada div */
// /* Modificación de balance de cuenta */
// document.getElementById("saveDetailedExpense").addEventListener("click", function (event) {
//     event.preventDefault();
//     /* Verificación del array */
//     const account = JSON.parse(localStorage.getItem("account")) || [];
//     /* Obtenemos los valores de la página */
//     const detailedExpenseAccountId = parseInt(document.getElementById("detailedExpenseAccount").value);
//     const detailedExpenseDescription = document.getElementById("detailedExpenseDescription").value;
//     const detailedExpenseCategoryId = parseInt(document.getElementById("detailedExpenseCategory").value);
//     const detailedExpenseAmmount = Math.abs(parseFloat(document.getElementById("detailedExpenseAmmount").value));
//     const detailedExpenseCommentary = document.getElementById("detailedExpenseCommentary").value;
    
//     /* Validación de búsqueda de cuenta y categoría */
//     const currentAccount = account.find(elm => elm.id === detailedExpenseAccountId)
//     const currentCategory = category.find(elm =>  elm.id === detailedExpenseCategoryId)
//     /* Validación de */
//     if (!currentAccount || !currentCategory || !detailedExpenseDescription || isNaN(detailedExpenseAmmount) || !detailedExpenseCommentary){
//         const detailedExpenseMessage = document.getElementById("detailedExpenseMessage");
//         detailedExpenseMessage.textContent="Por favor ingrese valores válidos.";
//         setTimeout(() => {
//             window.location.reload();
//         },1500);
//         return;
//     }
//         const currentBalance = currentAccount.accountBalance - detailedExpenseAmmount;
//     currentAccount.accountBalance = currentBalance;
//     localStorage.setItem("account",JSON.stringify(account));

// Creamos el objeto transaction
//     const detailedTransaction = { 
//         date: new Date().toISOString(), 
//         accountId: detailedExpenseAccountId, 
//         bankName: bank.find(b => b.id === currentAccount.accountBankId)?.bankName || "Unknown bank", 
//         accountName: currentAccount.accountName,
//         descriptionName: detailedExpenseDescription,
//         categoryName: category.find(c => c.id === currentCategory.id)?.categoryName || "Unknown category", 
//         amount: detailedExpenseAmmount,
//         commentary: detailedExpenseCommentary,
//         inventory: state.inventory, 
//         transaction_type: state.transaction_type }; 
//     Cargar las transacciones históricas y agregar la nueva 
//     const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
//     transactions.push(detailedTransaction); 
//     localStorage.setItem("transactions", JSON.stringify(transactions));

//     /* Mensaje de éxito */
//     const detailedExpenseMessage = document.getElementById("detailedExpenseMessage");
//     detailedExpenseMessage.textContent="Registro grabado con éxito.";
//     /* Reseteamos los campos */
//     document.getElementById("detailedExpenseAccount").value="";
//     document.getElementById("detailedExpenseDescription").value="";
//     document.getElementById("detailedExpenseCategory").value="";
//     document.getElementById("detailedExpenseAmmount").value="";
//     document.getElementById("detailedExpenseCommentary").value="";
//     setTimeout(() => {
//         window.location.reload();
//     },1500);

// }
// );
/* ------------------------------------------------------------------------- */


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
        if (!currentCategory || !detailedExpenseDescription || isNaN(detailedExpenseAmmount) || !detailedExpenseCommentary) { 
            const detailedExpenseMessage = document.getElementById("detailedExpenseMessage"); 
            detailedExpenseMessage.textContent = "Por favor ingrese valores válidos en todos los detalles.";
            setTimeout(() => { 
                window.location.reload();
            }, 1500);
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
    setTimeout(() => {
        window.location.reload();
    }, 1500);
});