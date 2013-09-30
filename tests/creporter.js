(function (){
	/*
	 * This sendMessage function piggy backs off grunt-contrib-qunit's use of the
	 * builtin PhantomJS bridge (alert) to pass messages back to Node.js/Grunt.
	 */
	function sendMessage() {
		var args = [].slice.call(arguments);
		alert(JSON.stringify(args));
	}
	// Simple console reporter
	if (window && window.navigator.userAgent.indexOf("antom") !== -1) {
		blanket.customReporter = function (coverageData) {
			var lines, covered, file, i;

			/*
			 * Process the data to calcuate the three pieces of information we want to distill
			 * for grunt/Jenkins. There is a lot more information here that might be of interest in the future
			 */
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
			/*
			 * The message "channel" must start with "qunit" in order to ensure that it is re-broadcast
			 * by grunt-contrib-qunit
			 */
			sendMessage("qunit.coverage", {
				coverageData: {
					lines : lines,
					covered : covered,
					percentage : (covered/lines)*100
				},
				a11yfyTestUnit : a11yfyTestUnit
			});
		};
	}
})();
