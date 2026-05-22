// --- Shop Data ---
// Each wrestler with merch gets an entry. Add more wrestlers here as shirts become available.
const shopItems = [
	{ name: "AOD", gender: "F", img: "./public/shirt_aod.png" },
	{ name: "JORDAN_SKY", gender: "F", img: "./public/shirt_jordansky.png" },
	{ name: "DAISY_MAYFIELD", gender: "F", img: "./public/shirt_daisymayfield.png" },
	{ name: "MORGAN_NITRA", gender: "F", img: "./public/shirt_morgannitra.png" },
	{ name: "CAROLINA_CHAZ", gender: "F", img: "./public/shirt_carolinachaz.png" },
	{ name: "CLARKSON_WILDE", gender: "M", img: "./public/shirt_clarksonwilde.png" },
	{ name: "BRADLY_WEST", gender: "M", img: "./public/shirt_bradlywest.png" },
	{ name: "ELI_BOLTON", gender: "M", img: "./public/shirt_elibolton.png" },
];

const $shopGrid = $("#shop-grid");
const cart = [];

function renderShop(filter) {
	$shopGrid.empty();
	const items = filter === "ALL" ? shopItems : shopItems.filter(i => i.gender === filter);

	for (let item of items) {
		const displayName = item.name.replace(/_/g, " ");
		const $card = $(`
			<div class="shop-card" data-name="${item.name}" data-img="${item.img}">
				<img class="shop-card-img" src="${item.img}" onerror="this.src='./public/vacant.png';this.onerror='';" />
				<div class="shop-card-name">${displayName}</div>
				<div class="shop-card-price">$24.99</div>
			</div>
		`);
		$shopGrid.append($card);
	}
}

// --- Shop nav click ---
$("#shop").click(function() {
	$(".selected-page").removeClass("selected-page");
	$(this).addClass("selected-page");
	$(".page").addClass("hide");
	$("#shop-page").removeClass("hide");
	$("#shop-all").click();
});

// --- Category tabs ---
["shop-all", "shop-women", "shop-men"].forEach(id => {
	$(`#${id}`).click(function() {
		$(".selected-shop-cat").removeClass("selected-shop-cat");
		$(this).addClass("selected-shop-cat");
		const filter = id === "shop-all" ? "ALL" : id === "shop-women" ? "F" : "M";
		renderShop(filter);
	});
});

// --- Open shirt modal ---
$(document).on("click", ".shop-card", function() {
	const name = $(this).attr("data-name");
	const img = $(this).attr("data-img");
	$("#shop-modal-img").attr("src", img);
	$("#shop-modal-name").text(name.replace(/_/g, " "));
	$("#shop-cart-msg").addClass("hide");
	$("#shop-modal").removeClass("hide");
});

// --- Close modal ---
$(".shop-modal-close, #shop-modal").click(function(e) {
	if (e.target === this) {
		$("#shop-modal").addClass("hide");
	}
});

// --- Add to cart ---
$("#shop-add-cart").click(function(e) {
	e.stopPropagation();
	const name = $("#shop-modal-name").text();
	const size = $("#shop-size-select").val();
	cart.push({ name, size, price: 24.99 });
	$("#shop-cart-msg").removeClass("hide");
	setTimeout(() => $("#shop-cart-msg").addClass("hide"), 2000);
});
