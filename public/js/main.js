const socket = io();

socket.on("productsChange", (products) => {
  const productList = document.getElementById("productList");
  productList.innerHTML = "";
  products.forEach((product) => {
    const li = document.createElement("li");
    li.innerHTML = `<b>${product.title}</b> - UYU$ ${product.price}`;
    productList.appendChild(li);
  });
});
