const $reignList = $("#reign-list");

const generateReign = (titleName) => {
	$reignList.empty();

	const isTag = titleName === "TAG" || titleName === "TRIOS" || titleName === "MENS-TAG";
	const isTrios = titleName === "TRIOS";
	const arr = [...titleHistory[titleName]].reverse();

	for (let i in arr) {
		const current = i == 0;
		const notvacant = arr[i].name !== "VACATED";
		const evenOrOdd = parseInt(i) % 2 == 0 ? "-even" : "-odd";

		const $container = $(`<div class='reign-container' />`);
		const $imgContainer = $(`<div class='reign-image-container ${!notvacant ? "vacant" : ""} ${current ? "" : "pastChamps-" + titleName + evenOrOdd}' />`);

		if (isTag && notvacant && arr[i].members) {
			const $tagPicsContainer = $("<div class='tagpicsContainer' />");
			const names = arr[i].members.split("&").map(str => str.replace(/\[\d+\]/, ""));

			$tagPicsContainer.append(`<img class='reign-pic' src=${formatUrl(names[0])} onerror="this.src='./public/vacant.png';this.onerror='';"/>`);
			$tagPicsContainer.append(`<img class='reign-pic' src=${formatUrl(names[1])} onerror="this.src='./public/vacant.png';this.onerror='';"/>`);
			if (isTrios) {
				$tagPicsContainer.append(`<img class='reign-pic' src=${formatUrl(names[2])} onerror="this.src='./public/vacant.png';this.onerror='';"/>`);
			}
			$imgContainer.append($tagPicsContainer);
		} else if (notvacant) {
			$imgContainer.append(`<img class='reign-pic' src=${formatUrl(arr[i].name)} onerror="this.src='./public/vacant.png';this.onerror='';"/>`);
		}

		const formattedName = isTag ? arr[i].name.replace(" ", " <br/> ") : arr[i].name.replace("_", " <br/> ");

		let memberNameDisplay = "";
		if (isTag && notvacant && arr[i].members) {
			memberNameDisplay = arr[i].members.split("&").map(entry => {
				const match = entry.match(/^([A-Z_]+)\[(\d+)\]$/);
				if (!match) return entry;
				const name = match[1].replace(/_/g, " ");
				const count = parseInt(match[2], 10);
				return count === 1 ? name : `${name}(${count})`;
			}).join(" & ");
		}

		const $reignName = $(`<div class='reign-name'><h2 class='${isTag ? "tagName" : ""}'> ${formattedName} <br/> <span> ${isTag && notvacant ? memberNameDisplay : ""} </span></h2></div>`);
		$imgContainer.append($reignName);

		if (notvacant) {
			const reignNum = arr[i].reign > 1 ? `${arr[i].reign}` : "";
			const numDefenses = arr[i].defenses.length - 1;

			const $numberContainer = $("<div class='numCon' />");
			$numberContainer.append(`<div class='reign-def ${arr[i].reign > 1 ? "" : "noVis"}'><h5 class='num-defenses'> ${reignNum} </h5><p> REIGN </p></div>`);
			$numberContainer.append(`<div class='reign-def'><h5 class='num-defenses'> ${numDefenses}${current ? "+" : ""} </h5><p> DEFENSE${numDefenses != 1 ? "S" : ""} </p></div>`);
			$imgContainer.append($numberContainer);
			$imgContainer.append(`<div class='reign-expand'>&#9662;</div>`);
		}

		$container.append($imgContainer);
		$reignList.append($container);

		if (notvacant) {
			const $defensesDiv = $("<div class='defenses' style='display: none'/>");
			let defAr = [...arr[i].defenses].reverse();

			for (let p in defAr) {
				const $defContainer = $("<div class='def-container' />");
				const defNames = defAr[p].replace(/_/g, " ");
				$defContainer.append(`<div> def. ${defNames} </div>`);

				if (!isTag) {
					const $defPeopleImages = $("<div class='def-people' />");
					const ignoreDQ = defAr[p].replace(/\s*-.*/, "");
					for (let name of ignoreDQ.split("&")) {
						$defPeopleImages.append(`<img src='${formatUrl(name)}' />`);
					}
					$defContainer.append($defPeopleImages);
				}

				$defensesDiv.append($defContainer);
			}
			$container.append($defensesDiv);
		}
	}
};

// --- Reign tab click handlers (consolidated) ---
const reignTabs = {
	rawreign: "RAW", sdreign: "SMACKDOWN", usreign: "US", hdreign: "HARDCORE",
	triosreign: "TRIOS", tagreign: "TAG", worldreign: "WORLD-TOP",
	alphareign: "ALPHA-TOP", mtagreign: "MENS-TAG", nxtreign: "NXT", mnxtreign: "MENS-NXT"
};

Object.entries(reignTabs).forEach(([id, titleName]) => {
	$(`#${id}`).click(function() {
		$('.reign-display-page').animate({ scrollTop: 0 }, 'fast');
		$(".selected-reign").removeClass("selected-reign");
		$(this).addClass("selected-reign");
		generateReign(titleName);
		$(".sort").attr("data-sort", titleName);
	});
});

// --- Sort button ---
$(".sort").click(function() {
	$('.reign-display-page').animate({ scrollTop: 0 }, 'fast');
	$reignList.empty();

	const titleName = $(".sort").attr("data-sort");
	const isTag = titleName === "TAG" || titleName === "TRIOS" || titleName === "MENS-TAG";

	const reignCounts = {};
	titleHistory[titleName].forEach(entry => {
		if (entry.name === "VACATED") return;

		if (isTag) {
			for (let part of entry.members.split('&')) {
				const [_, name, count] = part.match(/^([A-Z0-9_]+)\[(\d+)\]$/);
				reignCounts[name] = count == 1 || count > reignCounts[name] ? count : reignCounts[name];
			}
		} else {
			reignCounts[entry.name] = entry.reign == 1 || entry.reign > reignCounts[entry.name] ? entry.reign : reignCounts[entry.name];
		}
	});

	const arr = Object.entries(reignCounts)
		.map(([name, totalReigns]) => ({ name, totalReigns }))
		.sort((a, b) => b.totalReigns !== a.totalReigns ? b.totalReigns - a.totalReigns : a.name.localeCompare(b.name));

	for (let item of arr) {
		const $container = $("<div class='reign-container'/>");
		const $imgContainer = $(`<div class='reign-image-container' />`);

		$imgContainer.append(`<img class='reign-pic' src=${formatUrl(item.name)} onerror="this.src='./public/vacant.png';this.onerror='';"/>`);
		$imgContainer.append(`<div class='reign-name'><h2> ${item.name.replace("_", " <br/> ")} </h2></div>`);
		$imgContainer.append(`<div class='reign-def'><h5 class='num-defenses'> ${item.totalReigns} </h5><p> TIME${item.totalReigns != 1 ? "S" : ""} </p></div>`);

		$container.append($imgContainer);
		$reignList.append($container);
	}
});

// --- Toggle defenses on click ---
$(document).on('click', '.reign-container', function() {
	const $arrow = $(this).find('.reign-expand');
	$arrow.toggleClass('reign-expand-open');
	$(this).find('.defenses').slideToggle(300);
});
