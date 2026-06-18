const $rosterList = $("#roster-list");

const formatUrl = (name) => `./public/${name.toLowerCase().replace('_', '')}.png`;

const compareAlpha = (a, b) => a.name.localeCompare(b.name);

const getLastChamp = (title) => titleHistory[title][titleHistory[title].length - 1];

const getBrandColor = (brand) => {
	if (brand === "SD" || brand === "US") return "SD";
	if (brand === "RAW" || brand === "HARDCORE") return "RAW";
	if (brand === "NXT" || brand === "MENS-NXT") return "NXT";
	return "ALUMNI";
};

const generateRoster = (brand) => {
	$rosterList.removeClass("hide");
	$("#hof-page").addClass("hide");

	let arr = brand === "ALUMNI" ? alumniArray : rosterArray;

	if (brand === 'ALL') {
		let champs = generateChampPage();
		let champsArray = champs.map(obj => obj.name);
		arr = arr.filter(obj => !champsArray.includes(obj.name));
	} else {
		$rosterList.empty();
	}

	for (let superstar of arr.sort(compareAlpha)) {
		if (brand !== "NXT" && superstar.gender === "M" && superstar.brand === "NXT") continue;
		if (!(superstar.brand === brand || (brand === "SD" && superstar.gender === "M") || brand === "ALL")) continue;

		let url = formatUrl(superstar.name);
		let color = superstar.gender === "M" && brand === "SD" ? "SD" : superstar.brand;

		let $imageContainer = $(`<div class='superstar-container' data-gender='${superstar.gender}' data-superstar='${superstar.name}' />`);
		$imageContainer.append(`<div class='superstar-background ${color}-color' />`);
		$imageContainer.append(`<img class="superstar" src="${url}">`);
		$imageContainer.append(`<img class="superstar-filter" src="${url}">`);
		$imageContainer.append(`<div class="nameplate"> ${superstar.name.replace("_", " ")} </div>`);
		$rosterList.append($imageContainer);
	}
};

const generateChampPage = () => {
	const champsArray = [
		{ name: getLastChamp("RAW").name, brand: "RAW", gender: "F" },
		{ name: getLastChamp("SMACKDOWN").name, brand: "SD", gender: "F" },
		{ name: getLastChamp("US").name, brand: "US", gender: "F" },
		{ name: getLastChamp("HARDCORE").name, brand: "HARDCORE", gender: "F" },
		{ name: getLastChamp("WORLD-TOP").name, brand: "WORLD-TOP", gender: "M" },
		{ name: getLastChamp("ALPHA-TOP").name, brand: "ALPHA-TOP", gender: "M" },
		{ name: getLastChamp("NXT").name, brand: "NXT", gender: "F" },
		{ name: getLastChamp("MENS-NXT").name, brand: "MENS-NXT", gender: "M" }
	];

	const tagArray = [
		{ name: getLastChamp("TAG").name, members: getLastChamp("TAG").members.match(/\w+(?=\[\d+\])/g), titleName: "Womens Tag" },
		{ name: getLastChamp("MENS-TAG").name, members: getLastChamp("MENS-TAG").members.match(/\w+(?=\[\d+\])/g), titleName: "Mens Tag" }
	];

	const triosData = getLastChamp("TRIOS");
	const triosMembers = (triosData.members || "").match(/\w+(?=\[\d+\])/g);
	const triosObj = { name: triosData.name, members: triosMembers || [], titleName: "TRIOS" };

	$rosterList.empty();

	// Solo champs
	for (let superstar of champsArray) {
		let picUrl = formatUrl(superstar.name);
		let color = getBrandColor(superstar.brand);

		let $imageContainer = $(`<div class='superstar-container' data-gender='${superstar.gender}' data-superstar='${superstar.name}'/>`);
		$imageContainer.append(`<div class='superstar-background ${color}-color' />`);
		$imageContainer.append(`<img class="superstar" src="${picUrl}">`);
		$imageContainer.append(`<img class="superstar-filter" src="${picUrl}">`);
		$imageContainer.append(`<div class="nameplate champs"><span class='champ-title'> ${superstar.brand} Champion </span><br/>${superstar.name.replace("_", " ")}</div>`);
		$rosterList.append($imageContainer);
	}

	// Tag champs
	for (let tag of tagArray) {
		let $imageContainer = $("<div class='superstar-container nonclickable' />");
		$imageContainer.append(`<div class='superstar-background ALUMNI-color' />`);
		$imageContainer.append(`<img class="superstar left-tag" src="${formatUrl(tag.members[0])}">`);
		$imageContainer.append(`<img class="superstar-filter left-tag-filter" src="${formatUrl(tag.members[0])}">`);
		$imageContainer.append(`<img class="superstar right-tag" src="${formatUrl(tag.members[1])}">`);
		$imageContainer.append(`<img class="superstar-filter right-tag-filter" src="${formatUrl(tag.members[1])}">`);
		$imageContainer.append(`<div class="nameplate champs"><span class='champ-title'> ${tag.titleName} Champion </span><br/>${tag.name}</div>`);
		$rosterList.append($imageContainer);
	}

	// Trios champ
	if (triosObj.members.length >= 3) {
	let $imageContainer = $("<div class='superstar-container' />");
	$imageContainer.append(`<div class='superstar-background ALUMNI-color' />`);
	$imageContainer.append(`<img class="superstar trios-left-tag" src="${formatUrl(triosObj.members[0])}">`);
	$imageContainer.append(`<img class="superstar-filter trios-left-tag-filter" src="${formatUrl(triosObj.members[0])}">`);
	$imageContainer.append(`<img class="superstar trios-right-tag" src="${formatUrl(triosObj.members[1])}">`);
	$imageContainer.append(`<img class="superstar-filter trios-right-tag-filter" src="${formatUrl(triosObj.members[1])}">`);
	$imageContainer.append(`<img class="superstar trios-front" src="${formatUrl(triosObj.members[2])}">`);
	$imageContainer.append(`<img class="superstar-filter trios-front-filter" src="${formatUrl(triosObj.members[2])}">`);
	$imageContainer.append(`<div class="nameplate champs"><span class='champ-title'> ${triosObj.titleName} Champion </span><br/>${triosObj.name}</div>`);
	$rosterList.append($imageContainer);
	}

	return champsArray;
};

function getTopOpponents(name, gender) {
	const soloTitles = gender === "F"
		? ["RAW", "SMACKDOWN", "NXT", "HARDCORE", "US"]
		: ["WORLD-TOP", "DOM-TOP", "ALPHA-TOP", "MENS-NXT"];

	// Normalize a defense string into individual opponent names,
	// stripping suffixes like -DQ, -MITB, " - WARGAMES", " - THE GREAT WAR" etc.
	function parseOpponents(defense) {
		// Remove anything after " - " (space-dash-space) like " - THE GREAT WAR"
		const beforeNote = defense.split(" - ")[0].trim();
		// Split multi-person by &
		return beforeNote.split("&").map(o => {
			// Strip dash-suffixes like -DQ, -MITB, -WARGAMES, -GIVEN etc.
			return o.trim().replace(/-\S+$/, "").trim();
		}).filter(o => o.length > 0);
	}

	// Returns true if `defense` string should be excluded (ends in -DQ variant)
	function isDQ(defense) {
		// Covers "OPP-DQ", "OPP - DQ", "OPP-DQ extra", etc.
		return /[-\s]DQ/i.test(defense);
	}

	// Build a map: opponentName -> { wins, losses }
	const record = {};

	function ensureEntry(opp) {
		if (!record[opp]) record[opp] = { wins: 0, losses: 0 };
	}

	soloTitles.forEach(title => {
		titleHistory[title].forEach(reign => {
			if (reign.name === "VACATED") return;

			if (reign.name === name) {
				// These are our defenses = WINS for `name`
				(reign.defenses || []).forEach(defense => {
					if (isDQ(defense)) return; // skip DQ
					parseOpponents(defense).forEach(opp => {
						if (opp && opp !== name) {
							ensureEntry(opp);
							record[opp].wins++;
						}
					});
				});
			} else {
				// Check if `name` appears in this other champion's defenses = LOSSES for `name`
				(reign.defenses || []).forEach(defense => {
					if (isDQ(defense)) return; // skip DQ
					const opps = parseOpponents(defense);
					if (opps.includes(name)) {
						const champ = reign.name;
						ensureEntry(champ);
						record[champ].losses++;
					}
				});
			}
		});
	});

	// Total matches = wins + losses; sort by total desc
	return Object.entries(record)
		.map(([opp, { wins, losses }]) => ({ opp, wins, losses, total: wins + losses }))
		.filter(e => e.total > 0)
		.sort((a, b) => b.total - a.total)
		.slice(0, 5);
}

// --- Navigation ---
$("#home").click(function() {
	$(".selected-page").removeClass("selected-page");
	$(this).addClass("selected-page");
	$(".page").addClass("hide");
});

$("#rosterpg").click(function() {
	$(".selected-page").removeClass("selected-page");
	$(this).addClass("selected-page");
	$(".page").addClass("hide");
	$("#roster").removeClass("hide");
	$("#all").click();
});

$("#titles").click(function() {
	$(".selected-page").removeClass("selected-page");
	$(this).addClass("selected-page");
	$(".page").addClass("hide");
	$("#reigns").removeClass("hide");
	$("#rawreign").click();
});

$("#apply").click(function() {
	$(".selected-page").removeClass("selected-page");
	$(this).addClass("selected-page");
	$(".page").addClass("hide");
	$("#apply-page").removeClass("hide");
});

$("#apply-form").submit(function() {
	$("#apply-msg").removeClass("hide");
	this.reset();
});

// --- Brand selection (consolidated) ---
["all", "raw", "sd", "nxt", "alumni"].forEach(id => {
	$(`#${id}`).click(function() {
		$('.roster-display-page').animate({ scrollTop: 0 }, 'fast');
		generateRoster(id.toUpperCase());
		$(".selected-brand").removeClass("selected-brand");
		$(this).addClass("selected-brand");
	});
});

$("#hof").click(function() {
	$('.roster-display-page').animate({ scrollTop: 0 }, 'fast');
	$("#hof-page").removeClass("hide");
	$rosterList.addClass("hide");
	$(".selected-brand").removeClass("selected-brand");
	$(this).addClass("selected-brand");
});

// --- Wrestler modal ---
function figureReignCount(titleArray, name) {
	for (let a = 0; a < titleArray.length; a++) {
		if (name === titleArray[a].name) return titleArray[a].reign;
	}
	return 0;
}

function figureTagReignCount(titleArray, name) {
	for (let a = 0; a < titleArray.length; a++) {
		if (titleArray[a].name === "VACATED") continue;
		if (titleArray[a].members.includes(name)) {
			let index = titleArray[a].members.indexOf(name);
			return titleArray[a].members.substring(index + name.length + 1, index + name.length + 2);
		}
	}
	return 0;
}

$(document).on("click", ".superstar-container:not(.nonclickable)", function() {
	const name = $(this).attr("data-superstar");
	const gender = $(this).attr("data-gender");
	$(".accolates").empty();
	$(".selected-wrestler-image").attr("src", formatUrl(name));
	$(".select-name").text(name.replace("_", " "));
	$(".wrestler-modal").removeClass("hide");

	const tagTitles = gender === "F" ? ["TAG", "TRIOS"] : ["MENS-TAG"];
	const soloTitles = gender === "F"
		? ["RAW", "SMACKDOWN", "NXT", "HARDCORE", "US"]
		: ["WORLD-TOP", "DOM-TOP", "ALPHA-TOP", "MENS-NXT"];

	[...soloTitles, ...tagTitles].forEach(title => {
		let desiredTitle = [...titleHistory[title]].reverse();
		let reignCount = tagTitles.includes(title)
			? figureTagReignCount(desiredTitle, name)
			: figureReignCount(desiredTitle, name);

		if (reignCount !== 0) {
			$(".accolates").append(`<p class='nav-title'>${reignCount}x ${title} CHAMPION</p>`);
		}
	});

	["MITB", "ELIMINATION_CHAMBER", "ROYAL_RUMBLE"].forEach(special => {
		if (Object.hasOwn(titleHistory[special], name)) {
			$(".accolates").append(`<p class='nav-title'>${titleHistory[special][name]}x ${special} WINNER</p>`);
		}
	});
});

$(".wrestler-modal").click(function() {
	$(this).addClass("hide");
});
