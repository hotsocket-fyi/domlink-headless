/*
 * Creates stubs for existing DomLink code to be semi-functional outside a browser environment.
 * This allows familiar code to be used when generating static pages. (see /scripts/pages.ts)
 */

class Element {
	tagName: string;
	classList = new HTMLList();
	href: string = "";
	target: string = "";
	src: string = "";
	// do i need textContent?
	// also: no <input> support.
	constructor(tagName: string) {
		this.tagName = tagName;
	}
	// don't need these to do anything, i think?
	appendChild(_: Element) {}
	removeChild(_: Element) {}
	_cssText = "";
	style = new Proxy({}, {
		get: (_target: {}, pName: string | symbol, _receiver: any) => {
			if (pName == "cssText") {
				return this._cssText;
			} else return "DOMLINK_SERVER.TS";
		},
		set: (
			_target: {},
			pName: string | symbol,
			newValue: any,
			_receiver: any,
		) => {
			if (pName == "cssText") {
				this._cssText = newValue as string;
			}
			return true;
		},
	});
}

/** Replaces DOMTokenList. */
class HTMLList implements Iterable<string> {
	_values: string[] = [];
	[Symbol.iterator] = () => {
		return this._values[Symbol.iterator]();
	};
	add(...tokens: string[]) {
		this._values.push(...tokens);
	}
}

//@ts-ignore 2740
globalThis.document = {
	//@ts-ignore 2322 EMBRACE THE DUCK!
	createElement(tagName: string) {
		return new Element(tagName);
	},
	//@ts-ignore 2740
	head: new Element("head"),
	//@ts-ignore 2740
	body: new Element("body"),
};
