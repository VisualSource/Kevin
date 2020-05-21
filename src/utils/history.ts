import {createBrowserHistory} from 'history';
export const history = createBrowserHistory();
export function queryFromURI(input: string = window.location.search): any{
    const queryParams: {[item: string]: any} = {};
    const _apply = (key: string, val: any) =>{
        if(key.indexOf('[]') !== -1){
            key = key.replace("[]",'');
            if(Array.isArray(queryParams[key])){
                queryParams[key].push(val);
            }else{
                queryParams[key] = [val];
            }
        }else{
            queryParams[key] = val;
        }
    }
    let parts;
    if(!input) return;
    parts = input.replace('?','').split('&');

    parts.forEach(part=>{
        let key = decodeURIComponent(part.split('=')[0]),
        val = decodeURIComponent(part.split('=')[1]);

        if(part.indexOf('=') === -1) return;
        _apply(key,val);
    });

    
return queryParams;
}

function serializeQueryParams(queryParams: any){
    let queryString: string[] = [], val;
    for(let key in queryParams){
        if(queryParams.hasOwnProperty(key)){
            val = queryParams[key];
            if(Array.isArray(val)){
                val.forEach(item=>{
                    queryString.push(`${encodeURIComponent(key)}[]=${encodeURIComponent(item)}`);
                });
            }else{
                queryString.push(`${encodeURIComponent(key)}=${encodeURIComponent(val)}`);
            }
        }
    }
    return '?' + queryString.join('&');
}

export function routeTo(path: string, {replace = false, query}:{replace?: boolean, query?: {[name: string]: any}}){
    const location = `${path}${serializeQueryParams(query)}`;
    if(!replace){
        history.push(location);
    }else{
        history.replace(location);
    }
}
