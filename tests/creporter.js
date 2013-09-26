(function (){
	// Simple console reporter
	if (window && window.navigator.userAgent.indexOf("antom") !== -1) {
		blanket.customReporter = function (coverageData) {
			var lines, covered, file, i;
			console.log("\n");
			for (file in coverageData.files) {
				lines = 0, covered = 0;
				for (i in coverageData.files[file]) {
					if (coverageData.files[file][i] !== null && i !== "source") {
						lines += 1;
						if (coverageData.files[file][i] > 0) {
							covered += 1;
						}
					}
				}
				console.log("file : " + file + ", lines : " + lines + ", covered : " + covered + ", percentage : " + (covered/lines)*100 + "\n");
			}
			//console.log(JSON.stringify(coverageData,null,"\t"));
		};
	}
})();
