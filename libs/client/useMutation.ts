import { useState } from "react";

interface ImutationState<T> {
	loading: boolean;
	data?: T;
	error?: object;
}
type UseMutationResult<T> = [(data?:any) => void, ImutationState<T>];

export default function useMutation<T = any>(url:string):UseMutationResult<T> {
	const [state, setState] = useState<ImutationState<T>>({
		loading: false,
		data: undefined,
		error: undefined
	});
	function mutation(data:any) {
		setState({...state, loading:true })
		fetch(url, {
			headers: {
				"Content-Type": "application/json"
			},
			method: "POST",
			body: JSON.stringify(data),
		})
		.then( (response) => response.json().catch( () => {} ) )
		.then( (json) => setState( (state) => ({...state, data: json }) ) ) // .then( (json) => setData(json))
		.catch( (error) => setState( (state) => ({...state, error }) )) // .catch((error) => setError(error))
		.finally( () => setState( (state) => ({...state, loading:false }) ) );
	}
	return [mutation, state];
}
