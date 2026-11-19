import { t as __exportAll } from "./rolldown-runtime_D8jQpDG7.mjs";
import { t as createAstro } from "./compiler_BvNKiMFZ.mjs";
import { K as AstroError, h as InvalidComponentArgs } from "./errors-data_Bu7LYtXB.mjs";
// node_modules/@astrojs/runtime/dist/internal/server/astro-component.js
function validateArgs(args) {
	if (args.length !== 3) return false;
	if (!args[0] || typeof args[0] !== "object") return false;
	return true;
}
function baseCreateComponent(cb, moduleId, propagation) {
	const name = moduleId?.split("/").pop()?.replace(".astro", "") ?? "";
	const fn = (...args) => {
		if (!validateArgs(args)) throw new AstroError({
			...InvalidComponentArgs,
			message: InvalidComponentArgs.message(name)
		});
		return cb(...args);
	};
	Object.defineProperty(fn, "name", {
		value: name,
		writable: false
	});
	fn.isAstroComponentFactory = true;
	fn.moduleId = moduleId;
	fn.propagation = propagation;
	return fn;
}
function createComponentWithOptions(opts) {
	return baseCreateComponent(opts.factory, opts.moduleId, opts.propagation);
}
function createComponent(arg1, moduleId, propagation) {
	if (typeof arg1 === "function") return baseCreateComponent(arg1, moduleId, propagation);
	else return createComponentWithOptions(arg1);
}
// src/i18n/locale.ts
function parseQuality(params) {
	const param = params.map((p) => p.trim().toLowerCase()).find((p) => p.startsWith("q="));
	if (param === void 0) return 1;
	const value = Number(param.slice(2));
	return Number.isFinite(value) && value >= 0 && value <= 1 ? value : 1;
}
function parseAcceptLanguage(header) {
	return header.split(",").map((part, index) => {
		const [tag = "", ...params] = part.split(";");
		return {
			tag: tag.trim().toLowerCase(),
			q: parseQuality(params),
			index
		};
	}).filter((candidate) => candidate.tag !== "" && candidate.q > 0).sort((a, b) => b.q - a.q || a.index - b.index);
}
function resolveLocale(acceptLanguage) {
	if (!acceptLanguage) return "en";
	const [top] = parseAcceptLanguage(acceptLanguage);
	if (top === void 0) return "en";
	return top.tag.split("-")[0] === "es" ? "es" : "en";
}
function buildLocaleRedirect(acceptLanguage) {
	return {
		location: `/${resolveLocale(acceptLanguage)}/`,
		headers: {
			"Cache-Control": "no-store",
			Vary: "Accept-Language"
		}
	};
}
// src/pages/index.astro
var pages_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	prerender: () => false,
	url: () => ""
});
createAstro("https://portfolio.vercel.app");
var $$Index = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Index;
	const { location, headers } = buildLocaleRedirect(Astro.request.headers.get("accept-language"));
	return new Response(null, {
		status: 302,
		headers: {
			Location: location,
			...headers
		}
	});
}, "C:/Users/valen/Desktop/portfolio/src/pages/index.astro", void 0);
var $$file = "C:/Users/valen/Desktop/portfolio/src/pages/index.astro";
// \0virtual:astro:page:src/pages/index@_@astro
var page = () => pages_exports;
export { page };
