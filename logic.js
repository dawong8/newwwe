const $rosterList = $("#roster-list");


const generateRoster = (brand) => {
	let arr = brand === "ALUMNI" ? alumniArray : rosterArray;

	if (brand === 'ALL') {
		let champs = generateChampPage();
		let champsArray = champs.map(obj => obj.name);
		arr = arr.filter(obj => !champsArray.includes(obj.name));
		console.log("wat", arr)
	} else {
		$rosterList.empty(); 

	}


	for(let i in arr.sort(compareAlpha)) {
		let superstar = arr[i]; 
		if (brand != "NXT" && superstar.gender === "M" && superstar.brand === "NXT") {
			continue;
		}
		if (superstar.brand === brand || brand === "SD" && superstar.gender === "M" || brand === "ALL") {
			let $imageContainer = $(`<div class='superstar-container' data-gender='${superstar.gender}' data-superstar='${superstar.name}' />`);

			let url = formatUrl(superstar.name); 

			let color = superstar.gender === "M" && brand === "SD" ? "SD" : superstar.brand;

			let $bg = $(`<div class='superstar-background ${color}-color' />`);   
			let $superstar = $(`<img class="superstar" src="${url}">`)
			let $filter = $(`<img class="superstar-filter" src="${url}">`);

			let $nameplate = $(`<div class="nameplate"> ${superstar.name.replace("_", " ")} </div>`);



			$imageContainer.append($bg);
			$imageContainer.append($superstar);
			$imageContainer.append($filter); 
			$imageContainer.append($nameplate);

			$rosterList.append($imageContainer);
		}
	}
}

const formatUrl = (name) => {
	let formatName = name.toLowerCase().replace('_', '');
	return `./public/${formatName}.png`;
}

const generateChampPage = () => {
	let rawChamp = titleHistory["RAW"][titleHistory["RAW"].length-1].name; 
	let sdChamp = titleHistory["SMACKDOWN"][titleHistory["SMACKDOWN"].length-1].name; 

	let hdChamp = titleHistory["HARDCORE"][titleHistory["HARDCORE"].length-1].name; 
	let usChamp = titleHistory["US"][titleHistory["US"].length-1].name; 


	let menChamp = titleHistory["WORLD-TOP"][titleHistory["WORLD-TOP"].length-1].name; 
	let alphaChamp = titleHistory["ALPHA-TOP"][titleHistory["ALPHA-TOP"].length-1].name; 


	let tagChampMembers = titleHistory["TAG"][titleHistory["TAG"].length-1].members; 
	let tagChampNames = titleHistory["TAG"][titleHistory["TAG"].length-1].name; 
	let mentagChampMembers = titleHistory["MENS-TAG"][titleHistory["MENS-TAG"].length-1].members; 
	let mentagChampNames = titleHistory["MENS-TAG"][titleHistory["MENS-TAG"].length-1].name; 

	let triosChampMembers = titleHistory["TRIOS"][titleHistory["TRIOS"].length-1].members; 
	let triosChampNames = titleHistory["TRIOS"][titleHistory["TRIOS"].length-1].name; 

//	let menTagChamp = titleHistory["US"][titleHistory["US"].length-1].name; 


	let nxtChamp = titleHistory["NXT"][titleHistory["NXT"].length-1].name; 
	let nxtMenChamp = titleHistory["MENS-NXT"][titleHistory["MENS-NXT"].length-1].name; 



	let tagArray = [
		{
			name: tagChampNames, 
			members: tagChampMembers.match(/\w+(?=\[\d+\])/g),
			titleName: "Womens Tag"
		},
		{
			name: mentagChampNames, 
			members: mentagChampMembers.match(/\w+(?=\[\d+\])/g),
			titleName: "Mens Tag"
		}
	];

	const triosObj = {
			name: triosChampNames, 
			members: triosChampMembers.match(/\w+(?=\[\d+\])/g),
			titleName: "TRIOS"
		};

	let champsArray = [
		{
	  	  name: rawChamp, 
		  brand: "RAW", 
		  gender: "F"
		},
		{
	  	  name: sdChamp, 
		  brand: "SD", 
		  gender: "F"
		},
		{
	  	  name: usChamp, 
		  brand: "US", 
		  gender: "F"
		},
		{
	  	  name: hdChamp, 
		  brand: "HARDCORE", 
		  gender: "F"
		},
		{
	  	  name: menChamp, 
		  brand: "WORLD-TOP", 
		  gender: "M"
		},
		{
	  	  name: alphaChamp, 
		  brand: "ALPHA-TOP", 
		  gender: "M"
		},
		{
	  	  name: nxtChamp, 
		  brand: "NXT", 
		  gender: "F"
		},
		{
	  	  name: nxtMenChamp, 
		  brand: "MENS-NXT", 
		  gender: "M"
		}
	];

	$rosterList.empty(); 
	for(let i in champsArray) {
		let superstar = champsArray[i]; 
		let $imageContainer = $(`<div class='superstar-container' data-gender='${champsArray[i].gender}' data-superstar='${superstar.name}'/>`);

		let picUrl = formatUrl(superstar.name); 

		let color;

		switch(superstar.brand) {
			case "SD":
			case "US":
				color = "SD";
				break;
			case "RAW":
			case "HARDCORE":
				color = "RAW"; 
				break;
			case "NXT":
			case "MENS-NXT": 
				color = "NXT"; 
				break; 
			default: 
				color = "ALUMNI"; 
		}

		let $bg = $(`<div class='superstar-background ${color}-color' />`);   
		let $superstar = $(`<img class="superstar" src="${picUrl}">`)
		let $filter = $(`<img class="superstar-filter" src="${picUrl}">`);

		let $nameplate = $(`<div class="nameplate champs"> 
			<span class='champ-title'> ${superstar.brand} Champion </span> <br/>
			${superstar.name.replace("_", " ")} 
			</div>`);



		$imageContainer.append($bg);
		$imageContainer.append($superstar);
		$imageContainer.append($filter); 
		$imageContainer.append($nameplate);

		$rosterList.append($imageContainer);

	}

	for(let i in tagArray) {
		let $imageContainer = $("<div class='superstar-container nonclickable' />");
		let $bg = $(`<div class='superstar-background ALUMNI-color' />`);   
		let $superstar1 = $(`<img class="superstar left-tag" src="${formatUrl(tagArray[i].members[0])}">`)
		let $filter1 = $(`<img class="superstar-filter left-tag-filter" src="${formatUrl(tagArray[i].members[0])}">`);

		let $superstar2 = $(`<img class="superstar right-tag" src="${formatUrl(tagArray[i].members[1])}">`)
		let $filter2 = $(`<img class="superstar-filter right-tag-filter" src="${formatUrl(tagArray[i].members[1])}">`);


		let $nameplate = $(`<div class="nameplate champs"> 
			<span class='champ-title'> ${tagArray[i].titleName} Champion </span> <br/>
			${tagArray[i].name} 
			</div>`);

		$imageContainer.append($bg);
		$imageContainer.append($superstar1);
		$imageContainer.append($filter1); 
		$imageContainer.append($superstar2);
		$imageContainer.append($filter2); 
		$imageContainer.append($nameplate);

		$rosterList.append($imageContainer);
	}
	let $imageContainer = $("<div class='superstar-container' />");
	let $bg = $(`<div class='superstar-background ALUMNI-color' />`);   
	let $superstar1 = $(`<img class="superstar trios-left-tag" src="${formatUrl(triosObj.members[0])}">`)
	let $filter1 = $(`<img class="superstar-filter trios-left-tag-filter" src="${formatUrl(triosObj.members[0])}">`);

	let $superstar2 = $(`<img class="superstar trios-right-tag" src="${formatUrl(triosObj.members[1])}">`)
	let $filter2 = $(`<img class="superstar-filter trios-right-tag-filter" src="${formatUrl(triosObj.members[1])}">`);

	let $superstar3 = $(`<img class="superstar trios-front" src="${formatUrl(triosObj.members[2])}">`)
	let $filter3 = $(`<img class="superstar-filter trios-front-filter" src="${formatUrl(triosObj.members[2])}">`);


	let $nameplate = $(`<div class="nameplate champs"> 
		<span class='champ-title'> ${triosObj.titleName} Champion </span> <br/>
		${triosObj.name} 
		</div>`);

	$imageContainer.append($bg);
	$imageContainer.append($superstar1);
	$imageContainer.append($filter1); 
	$imageContainer.append($superstar2);
	$imageContainer.append($filter2); 
	$imageContainer.append($superstar3);
	$imageContainer.append($filter3); 
	$imageContainer.append($nameplate);

	$rosterList.append($imageContainer);
	return champsArray;
}


const compareAlpha = (a,b) => {

	if(a.name > b.name) {
	    return 1; 
	} else if (a.name < b.name) {
	    return -1;
	} else {
	    return 0;
	}  
}


$("#home").click(function() {
	$(".selected-page").removeClass("selected-page");
	$(this).addClass("selected-page");
	$(".page").addClass("hide");
})

$("#rosterpg").click(function() {
	$(".selected-page").removeClass("selected-page");
	$(this).addClass("selected-page");
	$(".page").addClass("hide");
	$("#roster").removeClass("hide");
	$("#all").click();
})

$("#titles").click(function() {
	$(".selected-page").removeClass("selected-page");
	$(this).addClass("selected-page");
	$(".page").addClass("hide");
	$("#reigns").removeClass("hide");
	$("#rawreign").click();
})



$("#all").click(function() {
	generateRoster("ALL");
	$(".selected-brand").removeClass("selected-brand"); 
	$(this).addClass("selected-brand");
})

$("#raw").click(function() {
	generateRoster("RAW");
	$(".selected-brand").removeClass("selected-brand"); 
	$(this).addClass("selected-brand");
})

$("#sd").click(function() {
	generateRoster("SD");
	$(".selected-brand").removeClass("selected-brand"); 
	$(this).addClass("selected-brand");
})

$("#nxt").click(function() {
	generateRoster("NXT");
	$(".selected-brand").removeClass("selected-brand"); 
	$(this).addClass("selected-brand");
})

$("#alumni").click(function() {
	generateRoster("ALUMNI");
	$(".selected-brand").removeClass("selected-brand"); 
	$(this).addClass("selected-brand");
})
function figureReignCount(titleArray, name) {


	for(let a = 0; a < titleArray.length; a++) {
		if (name === titleArray[a].name) {
			return titleArray[a].reign; 
		}
	}

	return 0; // if not found; 
}

function figureTagReignCount(titleArray, name) {


	for(let a = 0; a < titleArray.length; a++) {
		if(titleArray[a].name === "VACATED") {
			continue;
		}
		if (titleArray[a].members.includes(name)) {
			let index = titleArray[a].members.indexOf(name); 
			let reign = titleArray[a].members.substring(index+name.length+1, index+name.length+2);
			console.log("what is ", titleArray[a].members, index, reign)

			return reign; 
		}
	}

	return 0; // if not found; 
}

$(document).on("click", ".superstar-container:not(.nonclickable)", function() {
	const name = $(this).attr("data-superstar");
	const gender = $(this).attr("data-gender");
	$(".accolates").empty(); 
	$(".selected-wrestler-image").attr("src", formatUrl(name));
	$(".select-name").text(name.replace("_", " "));
	

	$(".wrestler-modal").removeClass("hide"); 
	if (gender === "F") {
		const possibletitles = ["RAW", "SMACKDOWN", "NXT", "TAG", "TRIOS", "HARDCORE", "US"];

		for(let a = 0; a < possibletitles.length; a++) {

			let desiredTitle = [...titleHistory[possibletitles[a]]];

			let reignCount; 
			if(possibletitles[a] === "TAG" || possibletitles[a] === "TRIOS") {
				reignCount = figureTagReignCount(desiredTitle.reverse(), name); 

			} else {
				reignCount = figureReignCount(desiredTitle.reverse(), name); 

			}

			if (reignCount !== 0) {
				let $titleAccolade = $(`<p class='nav-title'>${reignCount}x ${possibletitles[a]} CHAMPION</p>`);
				$(".accolates").append($titleAccolade);
			}
		}
	} else {
		const possibletitles = ["WORLD-TOP", "DOM-TOP", "ALPHA-TOP", "MENS-TAG", "MENS-NXT"];

		for(let a = 0; a < possibletitles.length; a++) {

			let desiredTitle = [...titleHistory[possibletitles[a]]];

			let reignCount; 
			if(possibletitles[a] === "MENS-TAG") {
				reignCount = figureTagReignCount(desiredTitle.reverse(), name); 

			} else {
				reignCount = figureReignCount(desiredTitle.reverse(), name); 

			}
			console.log("possibletitles", possibletitles[a], name, reignCount)

			if (reignCount !== 0) {
				let $titleAccolade = $(`<p class='nav-title'>${reignCount}x ${possibletitles[a]} CHAMPION</p>`);
				$(".accolates").append($titleAccolade);
			}
		}
	}
	const specialAccolates = ["MITB", "ELIMINATION_CHAMBER", "ROYAL_RUMBLE"];
	for (let t = 0; t < specialAccolates.length; t++ ) {
		if (Object.hasOwn(titleHistory[specialAccolates[t]], name)) {
			let $titleAccolade = $(`<p class='nav-title'>${titleHistory[specialAccolates[t]][name]}x ${specialAccolates[t]} WINNER</p>`);
			$(".accolates").append($titleAccolade);
		}
	}
});

$(".wrestler-modal").click(function() {
	$(this).addClass("hide");
})