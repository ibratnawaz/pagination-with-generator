export type TResponse = {
	hasNextPage: boolean;
	items: string[];
	itemsPerPage: number;
	message: string;
	nextPage: number;
	status: number;
	totalItems: number;
};

export const usePagination = () => {
	async function fetchData(nextPage: number) {
		const resp = await fetch(`http://localhost:8080/api/list?nextPage=${nextPage}`, {
			method: 'GET',
			headers: {
				'Access-Control-Allow-Headers': '*',
			},
		});
		const response = await resp.json();
		return response as TResponse;
	}

	const asyncGetContent = async function* (arg = 1) {
		while (true) {
			try {
				const response = await fetchData(arg);
				arg = yield response;
			} catch (e) {
				console.warn(`exception during fetch`, e);
				yield { error: e };
			}
		}
	};

	const contentGen = asyncGetContent(1);

	return { contentGen };
};
