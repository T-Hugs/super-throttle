//const { createGlobPatternsForDependencies } = require("@nrwl/react/tailwind");
const { join } = require("path");

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [join(__dirname, "{src,pages,components}/**/*!(*.stories|*.spec).{ts,tsx,html}")],
	theme: {
		extend: {
			colors: {
				flame: {
					base: "rgb(228, 87, 46)",
					10: "rgb(253, 241, 237)",
					20: "rgb(250, 226, 219)",
					30: "rgb(248, 212, 201)",
					40: "rgb(246, 197, 183)",
					50: "rgb(243, 183, 165)",
					100: "rgb(241, 169, 147)",
					150: "rgb(239, 154, 129)",
					200: "rgb(236, 140, 111)",
					250: "rgb(234, 126, 93)",
					300: "rgb(232, 111, 74)",
					350: "rgb(228, 87, 46)", // base
					400: "rgb(227, 82, 38)",
					450: "rgb(217, 72, 28)",
					500: "rgb(199, 66, 26)",
					550: "rgb(181, 60, 23)",
					600: "rgb(162, 54, 21)",
					650: "rgb(144, 48, 19)",
					700: "rgb(126, 42, 16)",
					750: "rgb(108, 36, 14)",
					800: "rgb(90, 30, 12)",
					850: "rgb(72, 24, 9)",
					900: "rgb(54, 18, 7)",
					950: "rgb(36, 12, 5)",
					1000: "rgb(18, 6, 2)",
				},

				gunmetal: {
					base: "rgb(33, 41, 48)",
					10: "rgb(243, 245, 247)",
					20: "rgb(231, 235, 238)",
					30: "rgb(219, 225, 230)",
					40: "rgb(206, 215, 222)",
					50: "rgb(194, 205, 214)",
					100: "rgb(182, 195, 205)",
					150: "rgb(170, 185, 197)",
					200: "rgb(158, 174, 189)",
					250: "rgb(146, 164, 181)",
					300: "rgb(134, 154, 172)",
					350: "rgb(121, 144, 164)",
					400: "rgb(109, 134, 156)",
					450: "rgb(99, 124, 146)",
					500: "rgb(91, 114, 134)",
					550: "rgb(83, 103, 121)",
					600: "rgb(74, 93, 109)",
					650: "rgb(66, 83, 97)",
					700: "rgb(58, 72, 85)",
					750: "rgb(50, 62, 73)",
					800: "rgb(41, 52, 61)",
					850: "rgb(33, 41, 48)", // base
					900: "rgb(25, 31, 36)",
					950: "rgb(17, 21, 24)",
					1000: "rgb(8, 10, 12)",
				},

				marigold: {
					base: "rgb(243, 167, 18)",
					10: "rgb(254, 248, 236)",
					20: "rgb(253, 241, 216)",
					30: "rgb(252, 234, 197)",
					40: "rgb(251, 226, 177)",
					50: "rgb(250, 219, 158)",
					100: "rgb(249, 212, 139)",
					150: "rgb(248, 205, 119)",
					200: "rgb(247, 198, 100)",
					250: "rgb(246, 191, 81)",
					300: "rgb(245, 184, 61)",
					350: "rgb(244, 176, 42)",
					400: "rgb(243, 167, 18)", // base
					450: "rgb(233, 159, 12)",
					500: "rgb(213, 146, 11)",
					550: "rgb(194, 133, 10)",
					600: "rgb(174, 119, 9)",
					650: "rgb(155, 106, 8)",
					700: "rgb(136, 93, 7)",
					750: "rgb(116, 80, 6)",
					800: "rgb(97, 66, 5)",
					850: "rgb(78, 53, 4)",
					900: "rgb(58, 40, 3)",
					950: "rgb(39, 27, 2)",
					1000: "rgb(19, 13, 1)",
				},

				olivine: {
					base: "rgb(168, 198, 134)",
					10: "rgb(245, 248, 241)",
					20: "rgb(235, 242, 227)",
					30: "rgb(225, 235, 213)",
					40: "rgb(215, 229, 200)",
					50: "rgb(205, 222, 186)",
					100: "rgb(195, 216, 172)",
					150: "rgb(185, 209, 158)",
					200: "rgb(168, 198, 134)", // base
					250: "rgb(165, 196, 130)",
					300: "rgb(155, 190, 116)",
					350: "rgb(145, 183, 102)",
					400: "rgb(136, 177, 89)",
					450: "rgb(125, 166, 78)",
					500: "rgb(115, 153, 72)",
					550: "rgb(104, 139, 65)",
					600: "rgb(94, 125, 59)",
					650: "rgb(84, 111, 52)",
					700: "rgb(73, 97, 46)",
					750: "rgb(63, 83, 39)",
					800: "rgb(52, 69, 33)",
					850: "rgb(42, 55, 26)",
					900: "rgb(31, 42, 20)",
					950: "rgb(21, 28, 13)",
					1000: "rgb(10, 14, 7)",
				},

				air: {
					base: "rgb(102, 155, 188)",
					10: "rgb(241, 246, 249)",
					20: "rgb(227, 236, 243)",
					30: "rgb(212, 227, 236)",
					40: "rgb(198, 218, 230)",
					50: "rgb(184, 209, 224)",
					100: "rgb(170, 199, 218)",
					150: "rgb(156, 190, 211)",
					200: "rgb(142, 181, 205)",
					250: "rgb(127, 172, 199)",
					300: "rgb(102, 155, 188)", // base
					350: "rgb(99, 153, 187)",
					400: "rgb(85, 144, 180)",
					450: "rgb(75, 134, 170)",
					500: "rgb(68, 122, 156)",
					550: "rgb(62, 111, 142)",
					600: "rgb(56, 100, 128)",
					650: "rgb(50, 89, 113)",
					700: "rgb(44, 78, 99)",
					750: "rgb(37, 67, 85)",
					800: "rgb(31, 56, 71)",
					850: "rgb(25, 45, 57)",
					900: "rgb(19, 33, 43)",
					950: "rgb(12, 22, 28)",
					1000: "rgb(6, 11, 14)",
				},
			},
		},
	},
	plugins: [],
};
