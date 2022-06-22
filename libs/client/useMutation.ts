import { useState } from "react";

interface ImutationState {
	loading: boolean;
	data?: object;
	error?: object;
}
type UseMutationResult = [(data?:any) => void, ImutationState];

export default function useMutation(url:string):UseMutationResult {
	const [state, setState] = useState({
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
		.then( (json) => setState({...state, data: json }) ) // .then( (json) => setData(json))
		.catch( (error) => setState({...state, error } )) // .catch((error) => setError(error))
		.finally( () => setState({...state, loading:false }) );
	}
	return [mutation, state];
}
