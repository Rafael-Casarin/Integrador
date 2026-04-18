const menuButton = document.getElementById("menuButton");
const dropdownMenu = document.getElementById("dropdownMenu");

if (menuButton && dropdownMenu) {
menuButton.addEventListener("click", function (e) {
e.stopPropagation();
dropdownMenu.classList.toggle("show");
});
document.addEventListener("click", function (e) {
if (!dropdownMenu.contains(e.target) && !menuButton.contains(e.target)) {
dropdownMenu.classList.remove("show");
}
});
}
