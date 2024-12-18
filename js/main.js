
//DOM Objects
let nameFieldElement = document.getElementById("Name");
let countFieldElement = document.getElementById("Number");

let addButtonElement = document.getElementById("btnAgregar");
let clearButtonElement = document.getElementById("btnClear");

let invalidNameElement = document.getElementById("invalid-name");
let invalidCountElement = document.getElementById("invalid-count");

let productTableElement  = document.getElementById("product-table");
let productTableBodyElement  = document.getElementById("product-table-body");

let totalCountElement = document.getElementById("productosTotal");
let totalPriceElement = document.getElementById("precioTotal");
let totalProductsElement = document.getElementById("contadorProductos");

//Global Variables

let productOrderNumber = 1;
let totalCount = 0;
let totalPrice = 0;
let totalProducts = 0;
let productData = [];

//Local Functions
const createRandomPrice = () => Math.floor(Math.random() * 100);
const showError = (errorMessage, targetField) => {
  errorMessage.style.display = "unset";
  targetField.style.borderColor = "#a8324e";
  targetField.style.transition = "300ms";
  }
const removeError = (errorMessage, targetField) => {
  errorMessage.style.display = "none";
  targetField.style.borderColor = "white";
  targetField.style.transition = "300ms";
}
const isNameValid = name => name.length >= 3;
const isNumValid = num => !isNaN(num) && parseInt(num) > 0;
const validate = (valuetype) => {
  if (["name", "both"].includes(valuetype)) {
    let nameTxt = nameFieldElement.value;
    nameTxt = nameTxt.trim();
    if (!isNameValid(nameTxt)) {
      showError(invalidNameElement, nameFieldElement);
    }
  }
  if (["count", "both"].includes(valuetype)) {
    let countTxt = countFieldElement.value;
    countTxt = countTxt.trim();
    if (!isNumValid(countTxt)) {
      showError(invalidCountElement, countFieldElement);
  }
}

}
const resetVars = () => {
  productOrderNumber = 1;
  totalCount = 0;
  totalPrice = 0;
  totalProducts = 0;
}
const clearVals = () => {
  totalCountElement.innerText = "0";
  totalPriceElement.innerText = "$0";
  totalProductsElement.innerText = "0";
}
const clearFields = () => {
  nameFieldElement.value = "";
  countFieldElement.value = "";
}

//Event Listeners
addButtonElement.addEventListener("click", e => {
  e.preventDefault();

  //Declare Local Variables
  let productName = nameFieldElement.value;
  let productCount = parseInt(countFieldElement.value);
  let productPrice = createRandomPrice();

  //Verify Submitted Data
  if (nameFieldElement.value.length < 3 || countFieldElement.value.length === 0) {
    validate("both");
    return;
  }

  //Update Product Table
  let newRow = `
    <tr>
      <th scope="row">${productOrderNumber}</th>
      <td>${productName}</td>
      <td>${productCount}</td>
      <td>$${productPrice}</td>
    </tr>`;
  productTableBodyElement.insertAdjacentHTML("beforeend", newRow);
  productOrderNumber++;
  productData.push({
    order: productOrderNumber,
    name: productName,
    count: productCount,
    price : productPrice
  })

  //Update Order Summary
  totalProducts++;
  totalProductsElement.innerText = totalProducts;

  totalCount += productCount;
  totalCountElement.innerText = totalCount;

  totalPrice += productPrice * productCount;
  totalPriceElement.innerText = "$" + totalPrice;

  //Clear Name, Count Fields
  clearFields();

  //Add info to local storage
  localStorage.setItem("totalProducts", totalProducts);
  localStorage.setItem("totalPrice", totalPrice);
  localStorage.setItem("totalCount", totalCount);
  localStorage.setItem("productData", JSON.stringify(productData))
})

clearButtonElement.addEventListener("click", e =>{
  resetVars();
  clearVals();
  productTableBodyElement.innerHTML = "";
  localStorage.removeItem("totalProducts");
  localStorage.removeItem("totalPrice");
  localStorage.removeItem("totalCount");
  localStorage.removeItem("productData");
})

nameFieldElement.addEventListener("click", e => {
  removeError(invalidNameElement, e.target);
})
nameFieldElement.addEventListener("blur", e => {
  validate("name")
});

countFieldElement.addEventListener("click", e => {
  e.target.style.borderColor = "white";
  invalidCountElement.style.display = "none";
})
countFieldElement.addEventListener("blur", e => {
  validate("count")
});

window.addEventListener("load", e => {
  if (localStorage.getItem("totalProducts") != null) {
    totalProducts += Number(localStorage.getItem("totalProducts"));
  }
  if (localStorage.getItem("totalCount") != null) {
    totalCount += Number(localStorage.getItem("totalCount"));
  }
  if (localStorage.getItem("totalPrice") != null) {
    totalPrice += Number(localStorage.getItem("totalPrice"));
  }

  if (localStorage.getItem("productData") != null){
    data = JSON.parse(localStorage.getItem("productData"));

    data.forEach( e => {
      productData.push(e);
      let newRow = `
        <tr>
          <th scope="row">${e.order}</th>
          <td>${e.name}</td>
          <td>${e.count}</td>
          <td>$${e.price}</td>
        </tr>
      `;
      productTableBodyElement.insertAdjacentHTML("beforeend", newRow);
    });
  }


  totalCountElement.innerText = totalCount;
  totalProductsElement.innerText = totalProducts;
  totalPriceElement.innerText = "$" + totalPrice;
})
