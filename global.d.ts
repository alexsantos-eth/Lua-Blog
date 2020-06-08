interface IColor {
	name: string
	value: string
	darkValue: string
}
// STRINGS
interface Lang {
	en: ILangPackage;
	es: ILangPackage;
}
interface ILangPackage {
	SplashPage: SplashPage
	Layout: ILayoutStrings
	Index: IndexPage
}
interface ILayoutStrings {
	toast: {
		offline: string;
		online: string
	}
	alerts: {
		title: string;
		btn: string;
		body: string;
	}
}
interface Page {
	title: string;
	description: string;
}
interface SplashPage {
	title: string
	text: string
}

interface IndexPage extends Page {
	more: {
		part_1: string
		part_2: string
	}
	newsletter: {
		title: string
		alert: {
			title: string
			body: string
		}
	}
}

interface InputProps {
	label: string;
	type: string;
	name: string;
	helper: string;
	icon: string;
	value: Function;
	defValue?: string | number;
}

interface InputGetProps {
	name: string;
	text: string;
}
