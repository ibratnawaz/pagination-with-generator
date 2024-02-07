const usePagination = () => {
	async function fetchData(nextPage) {
		const resp = await fetch(`http://localhost:8080/api/list?nextPage=${nextPage}`, {
			method: 'GET',
			headers: {
				'Access-Control-Allow-Headers': '*',
			},
		});
		const response = await resp.json();
		return response;
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

const pagination = usePagination();
pagination.contentGen.next();

let res = pagination.contentGen.next(25);
res.then((d) => console.log('>>> page 25', d));

res = pagination.contentGen.next(26);
res.then((d) => console.log('>>> page 26', d));

res = pagination.contentGen.next(1);
res.then((d) => console.log('>>> page 1', d));