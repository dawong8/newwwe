const $reignList = $("#reign-list");


const generateReign = (titleName) => {
	$reignList.empty(); 

	const isTag = titleName === "TAG" || titleName === "TRIOS" || titleName === "MENS-TAG"; 
	const isTrios = titleName === "TRIOS"; 
	const arr = [...titleHistory[titleName]].reverse(); 

	for(let i in arr) {
		const current = i == 0; 
		const notvacant = arr[i].name !== "VACATED";

		const $container = $(`<div class='reign-container' />`);

		const evenOrOdd = parseInt(i) % 2 == 0? "-even" : "-odd";

		const $imgContainer = $(`<div class='reign-image-container ${!notvacant ? "vacant" : ""} ${current ? "" : "pastChamps-"+titleName+evenOrOdd}' />`);


		if (isTag && notvacant) {
			const $tagPicsContainer = $("<div class='tagpicsContainer' />"); 

			// Step 1: Split by &
			const parts = arr[i].members.split("&");

			// Step 2: Remove the brackets and numbers
			const names = parts.map(str => str.replace(/\[\d+\]/, ""));

			const $mem1 = $(`<img class='reign-pic' src=${formatUrl(names[0])} onerror="this.src='./public/vacant.png';this.onerror='';"/>`);
			const $mem2 = $(`<img class='reign-pic' src=${formatUrl(names[1])} onerror="this.src='./public/vacant.png';this.onerror='';"/>`);
			


			$tagPicsContainer.append($mem1);
			$tagPicsContainer.append($mem2);
			if (isTrios) {
				const $mem3 = $(`<img class='reign-pic' src=${formatUrl(names[2])} onerror="this.src='./public/vacant.png';this.onerror='';"/>`);
				$tagPicsContainer.append($mem3);
			}
			$imgContainer.append($tagPicsContainer);
		} else if (notvacant) {
			const $img = $(`<img class='reign-pic' src=${formatUrl(arr[i].name)} onerror="this.src='./public/vacant.png';this.onerror='';"/>`);
			$imgContainer.append($img);
		}


		const formattedName = isTag ? arr[i].name.replace(" ", " <br/> ") : arr[i].name.replace("_", " <br/> "); 

		let memberNameDisplay; 

		if (isTag && notvacant) {
			memberNameDisplay = arr[i].members.split("&").map(entry => {
		  		const match = entry.match(/^([A-Z_]+)\[(\d+)\]$/);
			    if (!match) return entry; // fallback

			  const name = match[1].replace(/_/g, " ");
			  const count = parseInt(match[2], 10);

			  return count === 1 ? name : `${name}(${count})`;
			}).join(" & ");
		}


		const $reignName = $(`<div class='reign-name'> <h2 class='${isTag ? "tagName" : ""}'> ${formattedName} <br/> <span> ${isTag && notvacant ? memberNameDisplay : ""} </span>  </h2>   </div>`);
		$imgContainer.append($reignName);

		if (notvacant) {
			const reignNum = arr[i].reign > 1 ? `${arr[i].reign}` : "";

			const $reignNum = $(`<div class='reign-def ${arr[i].reign > 1? "" : "noVis"}'> <h5 class='num-defenses'> ${reignNum} </h5> 
					<p> REIGN </p> </div>`);


			const numDefenses = arr[i].defenses.length - 1; 

			const $def = $(`<div class='reign-def'> <h5 class='num-defenses'> ${numDefenses}${current ? "+" : ""} </h5> 
					<p> DEFENSE${numDefenses != 1 ? "S" : ""} </p> </div>`);

			const $numberContainer = $("<div class='numCon' />");

			$numberContainer.append($reignNum);

			$numberContainer.append($def);

			$imgContainer.append($numberContainer);

		}

		$container.append($imgContainer);

		$reignList.append($container);
	


		if (notvacant) {

			// DEFENSE SECTION - - - - - - - - 
			const $defensesDiv = $("<div class='defenses' style='display: none'/>");
			let defAr = [...arr[i].defenses].reverse();

			for(let p in defAr) {
				const $defContainer = $("<div class='def-container' />");

				const defNames = defAr[p].replace(/_/g, " ");

				const $name = $(`<div> def. ${defNames} </div>`);

				const ignoreDQ = defAr[p].replace(/\s*-.*/, "");

				const $defPeopleImages = $("<div class='def-people' />");
				if (!isTag) {
					let defArr = ignoreDQ.split("&"); 

					for (let q in defArr) {
						const $defImage = $(`<img src='${formatUrl(defArr[q])}' /> `);
						$defPeopleImages.append($defImage);

					}	
				}


				$defContainer.append($name); 
				$defContainer.append($defPeopleImages); 
				$defensesDiv.append($defContainer);
			}




			$container.append($defensesDiv);
		}
	}

}


$("#sdreign").click(function () {
	$('.reign-display-page').animate({ scrollTop: 0 }, 'fast');

	$(".selected-reign").removeClass("selected-reign");
	$(this).addClass("selected-reign");
	generateReign("SMACKDOWN");
	$(".sort").attr("data-sort", "SMACKDOWN");
})

$("#rawreign").click(function () {
		$('.reign-display-page').animate({ scrollTop: 0 }, 'fast');

	$(".selected-reign").removeClass("selected-reign");
	$(this).addClass("selected-reign");
	generateReign("RAW");
	$(".sort").attr("data-sort", "RAW");

})

$("#usreign").click(function () {
		$('.reign-display-page').animate({ scrollTop: 0 }, 'fast');

	$(".selected-reign").removeClass("selected-reign");
	$(this).addClass("selected-reign");
	generateReign("US");
	$(".sort").attr("data-sort", "US");

})

$("#hdreign").click(function () {
		$('.reign-display-page').animate({ scrollTop: 0 }, 'fast');

	$(".selected-reign").removeClass("selected-reign");
	$(this).addClass("selected-reign");
	generateReign("HARDCORE");
	$(".sort").attr("data-sort", "HARDCORE");

})

$("#triosreign").click(function () {
		$('.reign-display-page').animate({ scrollTop: 0 }, 'fast');

	$(".selected-reign").removeClass("selected-reign");
	$(this).addClass("selected-reign");
	generateReign("TRIOS");
	$(".sort").attr("data-sort", "TRIOS");

})

$("#tagreign").click(function () {
		$('.reign-display-page').animate({ scrollTop: 0 }, 'fast');

	$(".selected-reign").removeClass("selected-reign");
	$(this).addClass("selected-reign");
	generateReign("TAG");
	$(".sort").attr("data-sort", "TAG");

})

$("#worldreign").click(function () {
		$('.reign-display-page').animate({ scrollTop: 0 }, 'fast');

	$(".selected-reign").removeClass("selected-reign");
	$(this).addClass("selected-reign");
	generateReign("WORLD-TOP");
	$(".sort").attr("data-sort", "WORLD-TOP");

})

$("#alphareign").click(function () {
		$('.reign-display-page').animate({ scrollTop: 0 }, 'fast');

	$(".selected-reign").removeClass("selected-reign");
	$(this).addClass("selected-reign");
	generateReign("ALPHA-TOP");
	$(".sort").attr("data-sort", "ALPHA-TOP");

})

$("#mtagreign").click(function () {
		$('.reign-display-page').animate({ scrollTop: 0 }, 'fast');

	$(".selected-reign").removeClass("selected-reign");
	$(this).addClass("selected-reign");
	generateReign("MENS-TAG");
	$(".sort").attr("data-sort", "MENS-TAG");

})

$("#tagreign").click(function () {
		$('.reign-display-page').animate({ scrollTop: 0 }, 'fast');

	$(".selected-reign").removeClass("selected-reign");
	$(this).addClass("selected-reign");
	generateReign("TAG");
	$(".sort").attr("data-sort", "TAG");

})

$("#nxtreign").click(function () {
		$('.reign-display-page').animate({ scrollTop: 0 }, 'fast');

	$(".selected-reign").removeClass("selected-reign");
	$(this).addClass("selected-reign");
	generateReign("NXT");
	$(".sort").attr("data-sort", "NXT");

})

$("#mnxtreign").click(function () {
		$('.reign-display-page').animate({ scrollTop: 0 }, 'fast');

	$(".selected-reign").removeClass("selected-reign");
	$(this).addClass("selected-reign");
	generateReign("MENS-NXT");
	$(".sort").attr("data-sort", "MENS-NXT");

})


$(".sort").click(function () {

		$('.reign-display-page').animate({ scrollTop: 0 }, 'fast');

	$reignList.empty(); 
	// determine which title
	const titleName = $(".sort").attr("data-sort");
	const isTag = titleName === "TAG" || titleName === "TRIOS" || titleName === "MENS-TAG"; 

	// Step 1: Tally total reigns per wrestler
	const reignCounts = {};
	titleHistory[titleName].forEach(entry => {
	  if (entry.name === "VACATED") return; // Skip VACATED entries

	  if (isTag) {
	  	let membersTagArr = entry.members.split('&'); 
	  	for (let p in membersTagArr) {
	  		const [_, name, count] = membersTagArr[p].match(/^([A-Z0-9_]+)\[(\d+)\]$/);
			reignCounts[name] =  count == 1 || count > reignCounts[name] ? count : reignCounts[name];
	  	}
	  } else {
	  	reignCounts[entry.name] =  entry.reign == 1 || entry.reign > reignCounts[entry.name] ? entry.reign : reignCounts[entry.name];
	  }
	});

	// Step 2: Convert to array
	const arr = Object.entries(reignCounts).map(([name, totalReigns]) => ({
	  name,
	  totalReigns
	}));

	// Step 3: Sort descending
	arr.sort((a, b) => {
	  if (b.totalReigns !== a.totalReigns) {
	    return b.totalReigns - a.totalReigns;
	  }
	  return a.name.localeCompare(b.name);
	});

	for(let i in arr) {
		const $container = $("<div class='reign-container'/>");

		const $imgContainer = $(`<div class='reign-image-container' />`);
		const $img = $(`<img class='reign-pic' src=${formatUrl(arr[i].name)} onerror="this.src='./public/vacant.png';this.onerror='';"/>`);
		$imgContainer.append($img);

		const formattedName = arr[i].name.replace("_", " <br/> "); 

		const $reignName = $(`<div class='reign-name'> <h2> ${formattedName} </h2>   </div>`);
		$imgContainer.append($reignName);

		const $reignNum = $(`<div class='reign-def'> <h5 class='num-defenses'> ${arr[i].totalReigns} </h5> 
					<p> TIME${arr[i].totalReigns != 1 ? "S" : ""} </p> </div>`);
		$imgContainer.append($reignNum);
		$container.append($imgContainer);
		$reignList.append($container);

	}


})


$(document).on('click', '.reign-container', function() {
	$(this).find('.defenses').slideToggle(300);



});


