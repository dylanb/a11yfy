(function (){
	function sendMessage() {
		var args = [].slice.call(arguments);
		alert(JSON.stringify(args));
	}
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
			}
			sendMessage("qunit.coverage", {
				coverageData: {
					lines : lines,
					covered : covered,
					percentage : (covered/lines)*100
				},
				a11yfyTestUnit : a11yfyTestUnit
			});
			//console.log(JSON.stringify(coverageData,null,"\t"));
		};
	}
})();
