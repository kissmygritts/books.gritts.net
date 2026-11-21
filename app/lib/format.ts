const nf = new Intl.NumberFormat('en-US')

export function formatNumber(n: number): string {
	return nf.format(n)
}

/** "1 page" / "310 pages". Counts always carry their unit. */
export function plural(n: number, one: string, many = `${one}s`): string {
	return `${formatNumber(n)} ${n === 1 ? one : many}`
}
