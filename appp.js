let list = document.querySelector(".list");
let orderList = document.querySelector("span.orders");
let noItem = document.querySelector(".no_item");
let ordered = document.querySelector(".ordered");
let orders = document.querySelector("div.orders");
let total = document.querySelector(".total span");
let btnconfirm = document.querySelector("button.confirm");
let confirm = document.querySelector("button.confirm");
if (!list) {
  console.error("Element with class 'list' not found in the DOM.");
}

let superCount = 0;

// Function to create a product card
function createProductCard(itemData) {
  let item = document.createElement("div");
  item.classList.add("item");

  let image = document.createElement("div");
  image.classList.add("image");

  let img = document.createElement("img");
  img.setAttribute("src", itemData.image.desktop || itemData.image.thumbnail);
  img.setAttribute("alt", itemData.name);
  image.appendChild(img);

  let addToCartButton = document.createElement("div");
  addToCartButton.classList.add("add");
  let icon = document.createElement("img");
  icon.setAttribute("src", "/assets/images/icon-add-to-cart.svg");
  addToCartButton.append(icon, "Add to Cart");

  let counter = document.createElement("div");
  counter.classList.add("count");
  counter.style.display = "none";

  let increment = document.createElement("img");
  increment.setAttribute("src", "/assets/images/icon-increment-quantity.svg");

  let decrement = document.createElement("img");
  decrement.setAttribute("src", "/assets/images/icon-decrement-quantity.svg");

  let quantityDisplay = document.createElement("span");
  quantityDisplay.textContent = 0;

  counter.append(decrement, quantityDisplay, increment);
  image.appendChild(addToCartButton);
  image.appendChild(counter);

  let category = document.createElement("span");
  category.classList.add("category");
  category.textContent = itemData.category;

  let h3 = document.createElement("h3");
  h3.textContent = itemData.name;

  let price = document.createElement("span");
  price.classList.add("price");
  price.textContent = itemData.price.toFixed(2);

  item.append(image, category, h3, price);

  // Attach event listener to the "Add to Cart" button
  addToCartButton.addEventListener("click", () => {
    addToCartButton.style.display = "none";
    counter.style.display = "flex";
    noItem.style.display = "none";
    ordered.style.display = "block";
    superCount++;
    orderList.textContent = superCount;
    createCartItem(itemData, counter, quantityDisplay, true); // Add to cart initially
  });

  return item;
}

// Function to create a cart item
function createCartItem(itemData, counter, quantityDisplay, isNew) {
  let existingItem = Array.from(orders.children).find(
    (child) => child.dataset.itemName === itemData.name
  );

  // If the item already exists, update the existing one
  if (existingItem) {
    let quantitySpan = existingItem.querySelector("span:first-of-type");
    let totalPriceSpan = existingItem.querySelector("span:last-of-type");

    let count = parseInt(quantitySpan.textContent);
    count++;
    quantityDisplay.textContent = count;
    quantitySpan.textContent = count;
    totalPriceSpan.textContent = (itemData.price * count).toFixed(2);
    updateSuperCount();
    updateTotalPrice();
    return;
  }
  function updateSuperCount() {
    superCount = Array.from(orders.children).reduce((sum, order) => {
      let quantitySpan = order.querySelector("span:first-of-type");
      return sum + parseInt(quantitySpan.textContent, 10);
    }, 0);
    orderList.textContent = superCount;
  }
  // Proceed with creating a new cart item
  let count = isNew ? 1 : parseInt(quantityDisplay.textContent);
  quantityDisplay.textContent = count;

  let orderedItem = document.createElement("div");
  orderedItem.classList.add("order");
  orderedItem.dataset.itemName = itemData.name; // Track item by name

  let itemInfo = document.createElement("div");

  let title = document.createElement("h4");
  title.textContent = itemData.name;

  let quantitySpan = document.createElement("span");
  quantitySpan.textContent = count;

  let priceSpan = document.createElement("span");
  priceSpan.textContent = itemData.price.toFixed(2);

  let totalPriceSpan = document.createElement("span");
  totalPriceSpan.textContent = (itemData.price * count).toFixed(2);

  let removeItem = document.createElement("img");
  removeItem.setAttribute("src", "/assets/images/icon-remove-item.svg");

  // Increment and decrement logic
  counter
    .querySelector("img[src='/assets/images/icon-increment-quantity.svg']")
    .addEventListener("click", () => {
      count++;
      quantityDisplay.textContent = count;
      quantitySpan.textContent = count;
      totalPriceSpan.textContent = (itemData.price * count).toFixed(2);
      updateSuperCount();
      updateTotalPrice();
    });

  counter
    .querySelector("img[src='/assets/images/icon-decrement-quantity.svg']")
    .addEventListener("click", () => {
      if (count > 0) {
        count--;
        quantityDisplay.textContent = count;
        quantitySpan.textContent = count;
        totalPriceSpan.textContent = (itemData.price * count).toFixed(2);
        updateSuperCount();
        updateTotalPrice();
      }
      if (count === 0) {
        // Remove from the cart
        orders.removeChild(orderedItem);

        // Show the "Add to Cart" button and hide the counter
        let productCard = Array.from(document.querySelectorAll(".item")).find(
          (item) => item.querySelector("h3").textContent === itemData.name
        );
        if (productCard) {
          let addToCartButton = productCard.querySelector(".add");
          let counter = productCard.querySelector(".count");
          addToCartButton.style.display = "flex";
          counter.style.display = "none";
        }

        // Check if the cart is empty
        if (orders.children.length === 0) {
          noItem.style.display = "block";
          ordered.style.display = "none";
        }
        updateSuperCount();
        updateTotalPrice();
      }
    });

  // Remove item logic
  removeItem.addEventListener("click", () => {
    orders.removeChild(orderedItem);

    // Show the "Add to Cart" button and hide the counter
    let productCard = Array.from(document.querySelectorAll(".item")).find(
      (item) => item.querySelector("h3").textContent === itemData.name
    );
    if (productCard) {
      let addToCartButton = productCard.querySelector(".add");
      let counter = productCard.querySelector(".count");
      addToCartButton.style.display = "flex";
      counter.style.display = "none";
    }

    // Check if the cart is empty
    if (orders.children.length === 0) {
      noItem.style.display = "block";
      ordered.style.display = "none";
    }

    updateSuperCount();
    updateTotalPrice();
  });

  itemInfo.append(title, quantitySpan, priceSpan, totalPriceSpan);
  orderedItem.append(itemInfo, removeItem);
  orders.appendChild(orderedItem);
  btnconfirm.addEventListener("click", () => {
    confirm.append(orders);
  });
  updateSuperCount(); // Ensure superCount is updated when the item is added
}

// Function to update the total price in the .total span element
function updateTotalPrice() {
  let totalPrice = 0;

  // Collect all the totalPriceSpan elements and sum their values
  document
    .querySelectorAll(".order span:last-child")
    .forEach((totalPriceSpan) => {
      totalPrice += parseFloat(totalPriceSpan.textContent) || 0;
    });

  // Update the total display
  total.textContent = totalPrice.toFixed(2);
}

// Fetch and render products
async function getData() {
  try {
    list.textContent = "Loading items...";
    let response = await fetch("./data.json");

    if (!response.ok) {
      throw new Error(
        `Failed to fetch data: ${response.status} ${response.statusText}`
      );
    }

    let data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("Expected data to be an array.");
    }

    list.textContent = ""; // Clear loading message

    data.forEach((itemData) => {
      // Validate required properties
      if (
        !itemData.image ||
        !itemData.image.desktop ||
        !itemData.name ||
        !itemData.category ||
        itemData.price == null
      ) {
        console.warn("Skipping item with missing properties:", itemData);
        return;
      }

      let productCard = createProductCard(itemData);
      list.appendChild(productCard);
    });
  } catch (error) {
    console.error(
      "An error occurred while fetching or processing data:",
      error.message
    );
    list.textContent = "Failed to load items. Please try again later.";
  }
}

getData();
