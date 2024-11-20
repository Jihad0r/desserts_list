let productList = document.querySelector(".list");
let emptyMessage = document.querySelector(".no_item");
let orderSection = document.querySelector(".ordered");
let totalOrderCount = document.querySelector("span.orders");
let orderContainer = document.querySelector("div.orders");
let grandTotal = document.querySelector(".total span");
let confirmButton = document.querySelector("button.confirm");
let confirmModal = document.querySelector("div.confirm");
let overlay = document.querySelector(".blackBackground");
let removeAllOrdersButton = document.querySelector("img.remove");
let totalProductCount = 0;

function createProductCard(product) {
  let productCard = document.createElement("div");
  productCard.classList.add("item");

  let imageContainer = document.createElement("div");
  imageContainer.classList.add("image");
  let productImage = document.createElement("img");
  if (window.innerWidth < 600) {
    productImage.setAttribute("src", product.image.mobile);
  } else if (window.innerWidth < 1120) {
    productImage.setAttribute("src", product.image.tablet);
  } else {
    productImage.setAttribute("src", product.image.desktop);
  }

  let addToCartButton = document.createElement("div");
  addToCartButton.classList.add("add");

  let addIcon = document.createElement("img");
  addIcon.setAttribute("src", "/assets/images/icon-add-to-cart.svg");
  addToCartButton.append(addIcon, "Add to Cart");

  let quantityControls = document.createElement("div");
  quantityControls.classList.add("count");
  quantityControls.style.display = "none";

  let decreaseButton = document.createElement("img");
  decreaseButton.setAttribute(
    "src",
    "/assets/images/icon-decrement-quantity.svg"
  );

  let increaseButton = document.createElement("img");
  increaseButton.setAttribute(
    "src",
    "/assets/images/icon-increment-quantity.svg"
  );

  let quantityDisplay = document.createElement("span");
  quantityDisplay.textContent = 1;
  quantityControls.append(decreaseButton, quantityDisplay, increaseButton);

  let categoryLabel = document.createElement("span");
  categoryLabel.classList.add("category");
  categoryLabel.textContent = product.category;

  let productTitle = document.createElement("h3");
  productTitle.textContent = product.name;

  let priceLabel = document.createElement("span");
  priceLabel.classList.add("price");
  priceLabel.textContent = product.price.toFixed(2);

  imageContainer.append(productImage, addToCartButton, quantityControls);
  productCard.append(imageContainer, categoryLabel, productTitle, priceLabel);

  addToCartButton.addEventListener("click", () => {
    addToCartButton.style.display = "none";
    quantityControls.style.display = "flex";
    emptyMessage.style.display = "none";
    orderSection.style.display = "block";
    productImage.style.border = "1px solid hsl(14, 86%, 42%)";
    quantityDisplay.textContent = 1;
    totalOrderCount.textContent = 1 + parseInt(totalOrderCount.textContent);
    grandTotal.textContent = (
      product.price + parseInt(grandTotal.textContent)
    ).toFixed(2);
    addOrder(product, quantityControls, quantityDisplay, true);
  });

  return productCard;
}

function addOrder(product, quantityControls, quantityDisplay, isNew) {
  let currentCount = isNew ? 1 : parseInt(quantityDisplay.textContent);
  let orderItem = document.createElement("div");
  orderItem.classList.add("order");
  let orderDetails = document.createElement("div");
  let orderImage = document.createElement("img");
  orderImage.setAttribute("src", product.image.desktop);
  orderImage.classList.add("ordered_food");
  let orderTitle = document.createElement("h4");
  orderTitle.textContent = product.name;

  let quantityLabel = document.createElement("span");
  let unitPriceLabel = document.createElement("span");
  let itemTotalLabel = document.createElement("span");
  quantityLabel.textContent = parseInt(
    quantityControls.querySelector("span").textContent
  );
  unitPriceLabel.textContent = product.price.toFixed(2);
  itemTotalLabel.textContent = (
    parseInt(quantityControls.querySelector("span").textContent) * product.price
  ).toFixed(2);

  let removeButton = document.createElement("img");
  removeButton.classList.add("remove_item");
  removeButton.setAttribute("src", "/assets/images/icon-remove-item.svg");

  quantityControls
    .querySelector("img[src='/assets/images/icon-increment-quantity.svg']")
    .addEventListener("click", () => {
      currentCount++;
      quantityLabel.textContent = currentCount;
      quantityDisplay.textContent = currentCount;
      itemTotalLabel.textContent = (currentCount * product.price).toFixed(2);
      totalOrderCount.textContent = quantityLabel.textContent;
      grandTotal.textContent = (product.price * currentCount).toFixed(2);
      updateTotalCount();
      updateGrandTotal();
    });

  quantityControls
    .querySelector("img[src='/assets/images/icon-decrement-quantity.svg']")
    .addEventListener("click", () => {
      if (currentCount > 0) {
        currentCount--;
        quantityLabel.textContent = currentCount;
        quantityDisplay.textContent = currentCount;
        itemTotalLabel.textContent = (currentCount * product.price).toFixed(2);
        grandTotal.textContent = (product.price * currentCount).toFixed(2);
        updateTotalCount();
        updateGrandTotal();
      }
      if (currentCount === 0) {
        orderContainer.removeChild(orderItem);
        let productCard = Array.from(document.querySelectorAll(".item")).find(
          (card) => card.querySelector("h3").textContent === product.name
        );
        if (productCard) {
          let addToCartButton = productCard.querySelector(".add");
          let quantityControls = productCard.querySelector(".count");
          addToCartButton.style.display = "block";
          quantityControls.style.display = "none";
        }
        if (orderContainer.children.length === 0) {
          emptyMessage.style.display = "block";
          orderSection.style.display = "none";
        }
        updateTotalCount();
        updateGrandTotal();
      }
    });

  removeButton.addEventListener("click", () => {
    orderContainer.removeChild(orderItem);
    let productCard = Array.from(document.querySelectorAll(".item")).find(
      (card) => card.querySelector("h3").textContent === product.name
    );
    if (productCard) {
      let addToCartButton = productCard.querySelector(".add");
      let quantityControls = productCard.querySelector(".count");
      addToCartButton.style.display = "block";
      quantityControls.style.display = "none";
    }
    if (orderContainer.children.length === 0) {
      emptyMessage.style.display = "block";
      orderSection.style.display = "none";
    }
    updateTotalCount();
    updateGrandTotal();
  });

  function updateTotalCount() {
    let totalItems = Array.from(orderContainer.children).reduce(
      (sum, order) => {
        let itemQuantity = order.querySelector("span:first-of-type");
        return sum + parseInt(itemQuantity.textContent, 10);
      },
      0
    );
    totalOrderCount.textContent = totalItems;
  }

  function updateGrandTotal() {
    totalProductCount = Array.from(orderContainer.children).reduce(
      (sum, order) => {
        let itemTotal = order.querySelector("span:last-of-type");
        return sum + parseFloat(itemTotal.textContent);
      },
      0
    );
    grandTotal.textContent = totalProductCount.toFixed(2);
  }

  orderDetails.append(
    orderImage,
    orderTitle,
    quantityLabel,
    unitPriceLabel,
    itemTotalLabel
  );
  orderItem.append(orderDetails, removeButton);
  orderContainer.appendChild(orderItem);
}
confirmButton.addEventListener("click", () => {
  let clonedOrders = orderContainer.cloneNode(true);
  let clonedTotal = grandTotal.cloneNode(true);
  let orderSummary = document.createElement("div");
  overlay.style.display = "block";
  confirmModal.style.display = "flex";

  Array.from(clonedOrders.children).forEach((order) => {
    let clonedImage = order.querySelector("div img");
    let clonedTitle = order.querySelector("div h4");
    let clonedData = order.querySelectorAll("div span");
    let summaryItem = document.createElement("div");
    summaryItem.classList.add("order-item");
    let itemDetails = document.createElement("div");
    itemDetails.classList.add("order-info");
    itemDetails.append(clonedTitle);
    clonedData.forEach((data) => itemDetails.append(data.cloneNode(true)));
    summaryItem.append(clonedImage.cloneNode(true), itemDetails);
    orderSummary.append(summaryItem);
  });

  let totalDisplay = document.createElement("div");
  totalDisplay.classList.add("totalprice");
  let totalText = document.createElement("p");
  totalText.textContent = "Total";
  let newOrderButton = document.createElement("button");
  newOrderButton.textContent = "Start New Order";
  totalDisplay.append(totalText, clonedTotal);
  orderSummary.append(totalDisplay, newOrderButton);
  confirmModal.append(orderSummary);

  newOrderButton.addEventListener("click", () => {
    resetOrders(orderSummary);
  });

  removeAllOrdersButton.addEventListener("click", () => {
    resetOrders(orderSummary);
  });
});

function resetOrders(orderSummary) {
  orderContainer.querySelectorAll(".order").forEach((order) => order.remove());
  totalOrderCount.textContent = 0;
  grandTotal.textContent = 0;
  emptyMessage.style.display = "block";
  orderSection.style.display = "none";
  let allProductCards = Array.from(document.querySelectorAll(".item"));

  allProductCards.forEach((productCard) => {
    let productImage = productCard.querySelector("img");
    let addToCartButton = productCard.querySelector(".add");
    let quantityControls = productCard.querySelector(".count");
    let quantityDisplay = productCard.querySelector(".count span");

    quantityDisplay.textContent = 0;
    overlay.style.display = "none";
    addToCartButton.style.display = "block";
    quantityControls.style.display = "none";
    productImage.style.border = "none";

    orderSummary
      .querySelectorAll("div, button")
      .forEach((element) => element.remove());
  });

  confirmModal.style.display = "none";
}

async function fetchProductData() {
  try {
    productList.textContent = "Loading items...";
    let response = await fetch("./data.json");
    if (!response.ok) {
      throw new Error(
        `Failed to fetch data: ${response.status} ${response.statusText}`
      );
    }
    productList.textContent = "";
    let data = await response.json();
    data.forEach((product) => {
      let productCard = createProductCard(product);
      productList.appendChild(productCard);
    });
  } catch {
    productList.textContent = "Failed to load items. Please try again later.";
  }
}

fetchProductData();
