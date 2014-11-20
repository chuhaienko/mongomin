// Розширення для шаблонізатору
function SwigExt(swig)
{
	this.swig = swig;

	/**
	 * Фільтр dataFormat. Отримує число байт - повертає форматоване число з
	 * відповідною розмірністю (B, KiB, MiB, GiB)
	 */
	this.swig.setFilter('dataFormat', function(num) {
		var KiB = 1024;
		var MiB = 1024 * KiB;
		var GiB = 1024 * MiB;

		num = parseFloat(num);

		var out = 0;
		if(num > GiB) {
			out = (num/GiB).toFixed(2)+' GiB';
		} else if(num > MiB) {
			out = (num/MiB).toFixed(2)+' MiB';
		} else if(num > KiB) {
			out = (num/KiB).toFixed(2)+' KiB';
		} else {
			out = num.toFixed(0)+' B';
		}

		out = out.split('.');
		if (out[0].length > 3) {
			out[0] = out[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, ' ');
		}
		return out.join('.');
	});
}

module.exports = SwigExt;